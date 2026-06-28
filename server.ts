import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini Client
let genAIInstance: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI {
  if (!genAIInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not defined. Please configure it in your Secrets/Settings panel.");
    }
    genAIInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAIInstance;
}

// ==========================================
// API ENDPOINTS
// ==========================================

// Endpoint for Crop Diagnostics using Gemini Structured Output
app.post("/api/diagnose", async (req, res) => {
  try {
    const { cropName, symptoms, diseaseImageBase64, diseaseImageMime, aiModel } = req.body;
    if (!cropName) {
      return res.status(400).json({ error: "cropName is required" });
    }

    const ai = getGenAI();
    const activeModel = aiModel || "ResNet-50 Disease Classifier";
    
    let textPrompt = `You are an elite plant pathologist, computer vision expert, and AgriTech scientist.
Analyze the provided crop diagnostics input:
- Crop Class: ${cropName}
- Reported Symptoms: ${symptoms || "Not specified (Assess from image if uploaded)"}
- Active Detector Pipeline: ${activeModel} (simulate CNN, YOLO v8, ResNet-50, or TensorFlow MobileNet classification confidence)

Using your knowledge of 95+ critical agricultural diseases, generate a precision diagnostic output.

Your response must be a strict structured JSON matching the requested schema:
1. "diseaseName": Highly likely disease or nutrient deficiency name.
2. "severityLevel": "Mild", "Moderate", or "Severe".
3. "confidenceScore": Match confidence percentage from 0 to 100.
4. "treatments":
   - "chemicalPesticide": Practical chemical controls and active ingredients (e.g. Chlorothalonil).
   - "organicTreatment": Organic remedies or home-brews (e.g. copper octanoate, neem oil spray).
5. "prevention":
   - "cultural": Cultural prevention practices (e.g. drip irrigation, row spacing).
   - "biological": Biological control measures (e.g. Bacillus subtilis, predatory mites).
6. "spreadPrediction":
   - "estimatedInfectedArea": Calculated area or percentage of crop currently affected.
   - "velocity": Speed of dissemination (e.g. "High: Spreads via air currents within 48h to adjacent rows").
7. "quarantineRecommendations": Urgent protocols to isolate infected quadrants or incinerate severely diseased tissues.
8. "nearbyFarmsAlert": Alerts or logs of nearby simulated infected farms matching this pathology (within 10km radius).
9. "multilingualSymptoms": High-quality localized symptoms explanation in:
   - "english"
   - "spanish"
   - "hindi"
   - "swahili"
10. "treatmentCostEstimator": Cost estimation range of remediation materials and labor per acre.`;

    let contents: any[] = [];
    if (diseaseImageBase64 && diseaseImageMime) {
      contents.push({
        inlineData: {
          mimeType: diseaseImageMime,
          data: diseaseImageBase64
        }
      });
    }
    contents.push({ text: textPrompt });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            diseaseName: { type: Type.STRING },
            severityLevel: { type: Type.STRING, enum: ["Mild", "Moderate", "Severe"] },
            confidenceScore: { type: Type.NUMBER },
            treatments: {
              type: Type.OBJECT,
              properties: {
                chemicalPesticide: { type: Type.STRING },
                organicTreatment: { type: Type.STRING }
              },
              required: ["chemicalPesticide", "organicTreatment"]
            },
            prevention: {
              type: Type.OBJECT,
              properties: {
                cultural: { type: Type.STRING },
                biological: { type: Type.STRING }
              },
              required: ["cultural", "biological"]
            },
            spreadPrediction: {
              type: Type.OBJECT,
              properties: {
                estimatedInfectedArea: { type: Type.STRING },
                velocity: { type: Type.STRING }
              },
              required: ["estimatedInfectedArea", "velocity"]
            },
            quarantineRecommendations: { type: Type.STRING },
            nearbyFarmsAlert: { type: Type.STRING },
            multilingualSymptoms: {
              type: Type.OBJECT,
              properties: {
                english: { type: Type.STRING },
                spanish: { type: Type.STRING },
                hindi: { type: Type.STRING },
                swahili: { type: Type.STRING }
              },
              required: ["english", "spanish", "hindi", "swahili"]
            },
            treatmentCostEstimator: { type: Type.STRING }
          },
          required: [
            "diseaseName",
            "severityLevel",
            "confidenceScore",
            "treatments",
            "prevention",
            "spreadPrediction",
            "quarantineRecommendations",
            "nearbyFarmsAlert",
            "multilingualSymptoms",
            "treatmentCostEstimator"
          ]
        }
      }
    });

    const jsonStr = response.text || "{}";
    const result = JSON.parse(jsonStr.trim());
    res.json(result);
  } catch (error: any) {
    console.error("AI Diagnostic Error:", error);
    res.status(500).json({
      error: "AI Diagnosis temporary offline or API key missing",
      message: error.message || String(error)
    });
  }
});

// Endpoint for Crop Recommendations & Planning using Gemini Structured Output
app.post("/api/crop-plan", async (req, res) => {
  try {
    const { 
      soilType, 
      temperature, 
      rainfall, 
      soilPh, 
      waterAvailability, 
      season, 
      historicalData,
      soilMoisture, 
      nitrogen, 
      phosphorus, 
      potassium, 
      region 
    } = req.body;

    const ai = getGenAI();
    
    const prompt = `You are an elite AI Precision Agronomist and Agricultural Market Strategist. 
Recommend the top 5 most optimal crops to plant based on these detailed farm parameters:
- Soil Type: ${soilType || "Loamy Soil"}
- Soil pH: ${soilPh || 6.5}
- Temperature: ${temperature || "28"}°C
- Annual/Seasonal Rainfall: ${rainfall || "800"} mm
- Water Availability/Source: ${waterAvailability || "Canal Irrigation & Rainfed"}
- Season: ${season || "Kharif"}
- Soil Nutrient Status (if available): Nitrogen=${nitrogen || 45} mg/kg, Phosphorus=${phosphorus || 35} mg/kg, Potassium=${potassium || 60} mg/kg
- Soil Moisture Status: ${soilMoisture || 40}%
- Location/Climate Region: ${region || "Tropical Monsoon Zone"}
- Historical Farming Logs & Soil History: ${historicalData || "No prior crop diseases recorded; previously sowed legumes."}

For each of the top 5 crop recommendations, provide:
1. Probability score of success (suitabilityScore, 0-100)
2. Expected yield in tons per acre (expectedYield, e.g. 8.5)
3. Estimated profit in INR (₹) per acre (estimatedProfit, e.g. 45000)
4. A customized Fertilizer NPK Schedule
5. An Irrigation Plan (daily/weekly frequency and details)
6. A Pest Prevention Calendar structured in chronological crop stages
7. A Market Demand Prediction (High/Medium/Low) with price trend insights
8. A Competitive Advantage Analysis outlining why this choice provides a unique market edge.
9. Agronomic alignment reasons.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedCrops: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Common and scientific name of the crop" },
                  suitabilityScore: { type: Type.NUMBER, description: "Suitability percentage or probability score (0-100)" },
                  expectedYield: { type: Type.NUMBER, description: "Expected yield in tons per acre" },
                  estimatedProfit: { type: Type.NUMBER, description: "Estimated profit in INR (₹) per acre" },
                  fertilizerSchedule: {
                    type: Type.OBJECT,
                    properties: {
                      npkRatio: { type: Type.STRING, description: "Recommended NPK ratio (e.g. '120:60:40')" },
                      schedule: { type: Type.STRING, description: "Detailed fertilizer application guidelines across growth stages" }
                    },
                    required: ["npkRatio", "schedule"]
                  },
                  irrigationPlan: {
                    type: Type.OBJECT,
                    properties: {
                      frequency: { type: Type.STRING, description: "Watering frequency (e.g. 'Daily', 'Weekly', '2 times a week')" },
                      planDetails: { type: Type.STRING, description: "Irrigation method, critical watering stages and instructions" }
                    },
                    required: ["frequency", "planDetails"]
                  },
                  pestPreventionCalendar: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        period: { type: Type.STRING, description: "Growth stage or duration (e.g. 'Sowing/Establishment', 'Vegetative Stage', 'Flowering', 'Maturity')" },
                        keyPests: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Major pests, insects, or fungal threats during this stage" },
                        preventiveAction: { type: Type.STRING, description: "Practical biological, chemical, or mechanical preventive actions" }
                      },
                      required: ["period", "keyPests", "preventiveAction"]
                    },
                    description: "Chronological schedule of crop protection and pest prevention"
                  },
                  marketDemand: {
                    type: Type.OBJECT,
                    properties: {
                      prediction: { type: Type.STRING, description: "Demand tier (High, Medium, Low)" },
                      priceTrend: { type: Type.STRING, description: "Wholesale/retail pricing trends and market entry window recommendations" }
                    },
                    required: ["prediction", "priceTrend"]
                  },
                  competitiveAdvantage: {
                    type: Type.STRING,
                    description: "Detailed analysis of the competitive advantage the farmer gets by planting this crop"
                  },
                  reasons: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Key reasons why this crop is selected matching the provided soil & climate profile"
                  }
                },
                required: [
                  "name", 
                  "suitabilityScore", 
                  "expectedYield", 
                  "estimatedProfit", 
                  "fertilizerSchedule", 
                  "irrigationPlan", 
                  "pestPreventionCalendar", 
                  "marketDemand", 
                  "competitiveAdvantage",
                  "reasons"
                ]
              }
            }
          },
          required: ["recommendedCrops"]
        }
      }
    });

    const jsonStr = response.text || "{}";
    const result = JSON.parse(jsonStr.trim());
    res.json(result);
  } catch (error: any) {
    console.error("AI Crop Plan Error:", error);
    res.status(500).json({
      error: "AI Crop Planning temporary offline or API key missing",
      message: error.message || String(error)
    });
  }
});

// Endpoint for AI Soil Analysis with PDF/image support using Gemini
app.post("/api/analyze-soil", async (req, res) => {
  try {
    const { soilReportBase64, soilReportMime, soilImageBase64, soilImageMime, soilTypeManual, phManual, location } = req.body;
    
    const ai = getGenAI();
    let contents: any[] = [];
    
    let textPrompt = `You are an elite, world-class Precision Soil Scientist and Agronomist. 
Analyze the provided soil data. This may be from an uploaded PDF test report, a photo of the soil itself, or manually entered indicators.

Manual/Contextual Inputs:
- Manual Soil Class/Type: ${soilTypeManual || "Not specified (Determine from image or report if available)"}
- Manual pH Level: ${phManual || "Not specified"}
- Farm Location/Climate Context: ${location || "Not specified"}

Perform a comprehensive chemical, physical, and biological assessment of this soil profile (simulating advanced ensemble machine learning predictions like Random Forest, XGBoost, and Neural Networks for soil classification and fertility indices):

1. **Soil Fertility Index**: Provide an overall health score (0-100).
2. **Nutrient Levels**: Detect concentration status (Optimal, Deficient, Excess) and approximate values (mg/kg or ppm) for Nitrogen (N), Phosphorus (P), Potassium (K), Zinc (Zn), and Iron (Fe).
3. **pH Level & Adjustment**: Determine the pH level (from 4.0 to 10.0) and specific biochemical amendment recommendations (e.g. lime for acidic, sulfur for alkaline).
4. **Organic Matter & Water Capacity**: Estimate the Organic Matter Percentage (%) and Water Holding Capacity (%).
5. **Soil Texture**: Classify the texture (e.g., Sandy Loam, Clay, Silty Clay, etc.).
6. **Remediation Action Plan**: Detail chronological phases of rehabilitation actions (Phase 1, Phase 2, etc.) to optimize health.
7. **Suitable Crops**: Provide 4 suitable crops with calculated probability scores of agricultural success.
8. **3D Soil Horizons**: Describe the estimated status of 4 main layers (O-Horizon Organic, A-Horizon Topsoil, B-Horizon Subsoil, C-Horizon Substratum) for visual rendering.`;

    let parts: any[] = [{ text: textPrompt }];
    
    if (soilReportBase64) {
      parts.push({
        inlineData: {
          mimeType: soilReportMime || "application/pdf",
          data: soilReportBase64
        }
      });
    }
    
    if (soilImageBase64) {
      parts.push({
        inlineData: {
          mimeType: soilImageMime || "image/jpeg",
          data: soilImageBase64
        }
      });
    }
    
    contents.push({ role: "user", parts });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fertilityIndex: { type: Type.NUMBER, description: "Overall soil fertility index from 0 to 100" },
            soilPh: { type: Type.NUMBER, description: "Estimated or measured pH of the soil" },
            phRecommendations: { type: Type.STRING, description: "Detailed guide on how to adjust or amend the pH level if needed" },
            organicMatter: { type: Type.NUMBER, description: "Organic matter percentage (e.g. 2.5)" },
            waterHoldingCapacity: { type: Type.NUMBER, description: "Water holding capacity percentage (e.g. 52)" },
            soilTexture: { type: Type.STRING, description: "Classification of soil texture" },
            nutrients: {
              type: Type.OBJECT,
              properties: {
                nitrogenStatus: { type: Type.STRING, description: "Optimal, Deficient, or Excess" },
                nitrogenVal: { type: Type.NUMBER, description: "Nitrogen level in mg/kg" },
                phosphorusStatus: { type: Type.STRING, description: "Optimal, Deficient, or Excess" },
                phosphorusVal: { type: Type.NUMBER, description: "Phosphorus level in mg/kg" },
                potassiumStatus: { type: Type.STRING, description: "Optimal, Deficient, or Excess" },
                potassiumVal: { type: Type.NUMBER, description: "Potassium level in mg/kg" },
                zincStatus: { type: Type.STRING, description: "Optimal, Deficient, or Excess" },
                zincVal: { type: Type.NUMBER, description: "Zinc level in ppm" },
                ironStatus: { type: Type.STRING, description: "Optimal, Deficient, or Excess" },
                ironVal: { type: Type.NUMBER, description: "Iron level in ppm" }
              },
              required: [
                "nitrogenStatus", "nitrogenVal", 
                "phosphorusStatus", "phosphorusVal", 
                "potassiumStatus", "potassiumVal", 
                "zincStatus", "zincVal", 
                "ironStatus", "ironVal"
              ]
            },
            remediationPlan: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phaseName: { type: Type.STRING, description: "Name of the remediation phase (e.g. 'Phase 1: pH Correction')" },
                  actions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Step-by-step actions for this phase" }
                },
                required: ["phaseName", "actions"]
              }
            },
            suitableCrops: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  cropName: { type: Type.STRING },
                  successProbability: { type: Type.NUMBER, description: "Success score from 0 to 100" }
                },
                required: ["cropName", "successProbability"]
              }
            },
            horizons: {
              type: Type.OBJECT,
              properties: {
                horizonO: { type: Type.STRING, description: "Organic layer status description" },
                horizonA: { type: Type.STRING, description: "Topsoil description" },
                horizonB: { type: Type.STRING, description: "Subsoil clay accumulation description" },
                horizonC: { type: Type.STRING, description: "Substratum weathered parent rock description" }
              },
              required: ["horizonO", "horizonA", "horizonB", "horizonC"]
            }
          },
          required: [
            "fertilityIndex", "soilPh", "phRecommendations", 
            "organicMatter", "waterHoldingCapacity", "soilTexture", 
            "nutrients", "remediationPlan", "suitableCrops", "horizons"
          ]
        }
      }
    });

    const jsonStr = response.text || "{}";
    const result = JSON.parse(jsonStr.trim());
    res.json(result);
  } catch (error: any) {
    console.error("AI Soil Analysis Error:", error);
    res.status(500).json({
      error: "AI Soil Analyzer offline or failed to parse. Please check inputs.",
      message: error.message || String(error)
    });
  }
});

// Endpoint for Interactive Chat Assistant supporting distinct roles, languages and regional dialects
const AGRICULTURAL_RAG_DATABASE = [
  {
    key: "PM-KISAN eligibility",
    keywords: ["eligible", "pm-kisan", "pm kisan", "scheme", "subsidy", "installment", "eligibility", "kisan"],
    content: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi) is a central sector scheme providing ₹6,000 per year in three equal installments to all landholding farmer families. Eligible: Families with cultivable land in their names. Excluded: Institutional landholders, tax payers, retired pensioners receiving >₹10,000, professionals (doctors, engineers, lawyers)."
  },
  {
    key: "KCC loan application",
    keywords: ["kcc", "loan", "apply", "kisan credit", "credit card", "finance", "scoring", "credit", "interest", "repayment"],
    content: "KCC (Kisan Credit Card) loan allows farmers to meet short-term credit requirements for crops, post-harvest, and consumption. Interest rate is 7% (reduced to 4% on timely repayment up to ₹3 Lakhs). To apply: Visit nearest bank branch with land records, crop cultivation details, identity proofs, and fill out the KCC form."
  },
  {
    key: "Crop Recommendation",
    keywords: ["crop", "grow", "plant", "season", "moisture", "loamy", "soil", "wheat", "rice", "sow", "kharif", "rabi"],
    content: "For current loamy soil with 42% moisture, NPK (45:35:60), pH 6.5, and warm conditions (28°C): Basmati Rice, Millets (Bajra/Ragi), and Maize are highly recommended. Legumes (mung bean) can be rotated to improve nitrogen fixing."
  },
  {
    key: "Wheat Fertilizer Guidelines",
    keywords: ["fertilizer", "wheat", "npk", "dose", "nitrogen", "phosphorus", "potassium"],
    content: "For Wheat, the recommended standard NPK ratio is 120:60:40 kg/hectare. Apply 50% Nitrogen and full P & K at sowing time. Apply remaining Nitrogen in two split doses at first irrigation (CRI stage) and late vegetative stage."
  },
  {
    key: "Tomato Brown Spots (Early Blight)",
    keywords: ["tomato", "leaf", "leaves", "brown", "spot", "spots", "blight", "yellow"],
    content: "Tomato leaves with brown spots with concentric rings (target boards) are indicative of Early Blight (Alternaria solani). Treatment: Organic copper octanoate or neem oil spray. Avoid overhead watering, prune lower leaves, and maintain 30cm row spacing."
  },
  {
    key: "Organic Pesticide for Aphids",
    keywords: ["organic", "pesticide", "aphid", "aphids", "neem", "insect", "bug", "pest", "aphid"],
    content: "Organic pesticide for Aphids: Mix 15ml neem oil with 5ml liquid organic soap in 1 Litre warm water. Spray early morning or evening. Alternatively, use insecticidal soaps or release predatory ladybugs."
  },
  {
    key: "Best Time to Sell Rice",
    keywords: ["sell", "price", "rice", "basmati", "mandi", "profit", "peak", "market", "month", "when to sell"],
    content: "Basmati Rice prices peak in post-monsoon winter months (Nov-Jan) due to export demand. Storing rice in hermetic bags (moisture <13%) and waiting for late December usually yields 15-20% higher profits."
  },
  {
    key: "Profit Calculator",
    keywords: ["profit", "calculate", "money", "cost", "revenue", "income", "acre", "yield", "rate", "earn"],
    content: "Basmati Rice profit: Avg yield is 2.5 tons/acre. Selling at ₹42,000/ton = ₹1,05,000 revenue. Input cost is ₹35,000. Net Profit is approx ₹70,000 per acre. Tomatoes: Avg profit is ₹1,20,000/acre under drip irrigation."
  },
  {
    key: "Subsidies & Solar Co-Op PM-KUSUM",
    keywords: ["subsidy", "highest", "solar", "drone", "kusum", "pm-kusum", "funding", "co-op", "subsidies"],
    content: "The highest subsidy is the PM-KUSUM scheme for Solar Water Pumps, providing 60% subsidy (30% Central, 30% State) and 30% bank loans, so farmers pay only 10%. Drone subsidy provides up to 100% (max ₹10 Lakhs) for agricultural institutions, and 50% (max ₹5 Lakhs) for cooperative societies and individual SC/ST/Women/Small farmers."
  }
];

app.post("/api/chat", async (req, res) => {
  try {
    const { messages, activeRole, language, dialect, farmData } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages array is required" });
    }

    const ai = getGenAI();

    // Map system instruction by user role to provide targeted expertise
    const systemInstructions: Record<string, string> = {
      Farmer: "You are the AgriConnect AI Co-Pilot for Farmers. Provide clear, direct, and practical advice on crop health, soil preparation, pest management, and maximizing yield. Keep your replies concise, supportive, and focused on practical field action.",
      Buyer: "You are the AgriConnect Market Strategist. Provide sharp analysis on commodity prices, arbitrage, quality standards, shipping logistics, and contract negotiations. Focus on high ROI and contract efficiency.",
      "Government Officer": "You are the AgriConnect Policy and Subsidy Consultant. Give guidance on state farming rules, welfare distribution, carbon offset certificates, disaster funds, and environmental regulations.",
      Supplier: "You are the Supply Chain Optimizer. Advise on input forecasting (seeds, agrochemicals, drone fleets), inventory management, storage safety, and regional demand planning.",
      "Agriculture Expert": "You are the Senior Scientific Agronomist. Deliver deep biological insights, precision technology applications, genetic modification reviews, and chemical/biological agent formulations.",
      "Logistics Provider": "You are the Cold Chain & Route Dispatcher. Advise on route optimization, shelf-life models, thermal insulation, fleet operations, and cargo risk reduction.",
      "Warehouse Operator": "You are the Grain Storage & Preservation Expert. Give safety guidelines on grain aerations, fumigation, silo telemetry systems, moisture control, and micro-climate management.",
      "Insurance Agent": "You are the Agro-Risk Actuary. Help analyze systemic drought risks, weather indexes, premium structures, claim assessment pipelines, and satellite imagery monitoring.",
      "Bank Officer": "You are the Agro-Finance Underwriter. Analyze micro-finance credits, crop-collateralization rates, repayment likelihoods, credit histories, and macro-agricultural macroeconomics.",
      Researcher: "You are the Agro-Data Analyst. Help analyze statistical crop research databases, yield curve algorithms, soil health trend matrices, and biodiversity logs.",
      "Extension Officer": "You are the Rural Educator and Support Specialist. Provide simple, easy-to-teach farming lessons, guidebooks, train-the-trainer workshops, and sustainable community strategies.",
      Admin: "You are the AgriConnect Platform Controller. Address platform uptime, scam detection, actor audits, user validation processes, and global marketplace transaction safety."
    };

    let instruction = systemInstructions[activeRole] || "You are AgriConnect AI, a sophisticated, versatile agricultural technology assistant. Help the user achieve sustainable agricultural success.";
    
    if (language) {
      instruction += ` The user has selected their preferred language as ${language}. Please write your responses in ${language}.`;
    }
    if (dialect) {
      instruction += ` Please adapt your responses to the ${dialect} regional dialect. Use local terminology, phrases, and tone that resonates naturally with smallholders from that specific region.`;
    }

    // Format chat contents for the SDK
    const lastMessage = messages[messages.length - 1];
    const previousHistory = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    // Inject RAG Lookup if matched
    const query = (lastMessage?.content || "").toLowerCase();
    const retrievedSources: any[] = [];
    let matchedContents = "";

    for (const entry of AGRICULTURAL_RAG_DATABASE) {
      const match = entry.keywords.some((kw) => query.includes(kw));
      if (match) {
        retrievedSources.push({ key: entry.key, content: entry.content });
        matchedContents += `\n[Retrieved Verified Fact: ${entry.key}]\n${entry.content}\n`;
      }
    }

    if (matchedContents) {
      instruction += `\n\n[RETRIEVED KNOWLEDGE BASE CONTEXT (RAG)]:
You have retrieved the following verified facts from the AgriConnect agricultural database. You MUST integrate and prioritize these facts when answering the user's question, citing or mentioning them if appropriate:
${matchedContents}`;
    }

    // Inject Real-time telemetry context
    if (farmData) {
      instruction += `\n\n[REAL-TIME LIVE FARM SENSOR DATA & INFORMATION]:
Currently, the farmer's live sensor ecosystem reports:
- Soil Moisture: ${farmData.soilMoisture || "42%"}
- Soil Nutrient Status (NPK): ${farmData.soilNpk || "N=45, P=35, K=60"}
- Soil pH Level: ${farmData.soilPh || "6.5"}
- Live Weather: ${farmData.weather || "28°C, humidity 80%, sunny"}
- Active Cultivation Log: ${farmData.activeCrops || "Basmati Rice and Tomatoes"}
- Subsidy/Credit Status: ${farmData.subsidyStatus || "PM-KISAN installment active, KCC loan active"}

Please reference this live data dynamically in your advice to personalize the response (e.g. "Given your live soil moisture of 42%..." or "Since you are rotating Basmati Rice...").`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        ...previousHistory,
        { role: "user", parts: [{ text: lastMessage.content }] }
      ],
      config: {
        systemInstruction: instruction,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text, sources: retrievedSources });
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    res.status(500).json({
      error: "Chat Assistant is having trouble reaching the AI services.",
      message: error.message || String(error)
    });
  }
});

// Endpoint for AI Translation of arbitrary content
app.post("/api/translate", async (req, res) => {
  try {
    const { text, targetLanguage, dialect } = req.body;
    if (!text) {
      return res.status(400).json({ error: "text is required" });
    }
    const ai = getGenAI();
    const prompt = `You are an elite, professional agricultural and community translator. 
Translate the following text into ${targetLanguage || "Hindi"} (regional dialect preference: ${dialect || "Standard"}).
Ensure the translation is natural, simple, respectful, and uses appropriate local farming terminology where applicable.
Return a strict JSON object with a single key "translatedText" containing the localized translation. Do not include any other commentary or markdown wrapping.

Text to translate:
"${text}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            translatedText: { type: Type.STRING }
          },
          required: ["translatedText"]
        }
      }
    });

    const jsonStr = response.text || "{}";
    const result = JSON.parse(jsonStr.trim());
    res.json(result);
  } catch (error: any) {
    console.error("AI Translation Error:", error);
    res.status(500).json({
      error: "Translation service offline or failed.",
      message: error.message || String(error)
    });
  }
});

// Endpoint for Multi-Language OCR Document Upload
app.post("/api/ocr", async (req, res) => {
  try {
    const { documentBase64, documentMime, targetLanguage } = req.body;
    if (!documentBase64) {
      return res.status(400).json({ error: "documentBase64 is required" });
    }

    const ai = getGenAI();
    const prompt = `You are an elite AI Document Processor and Agricultural Auditor. 
Analyze the provided document (which could be a land record, crop sales invoice, pesticide bill, bank receipt, or seed certification in English or any Indian regional language like Hindi, Telugu, Tamil, Kannada, Marathi, Gujarati, Bengali, Punjabi, Malayalam).
Extract all relevant agricultural metadata:
1. Document Type (e.g., Land Title Deed, Agrochemical Receipt, Pesticide Invoice, Mandi Trade Receipt, Fertilizer Record, Bank Loan Statement)
2. Primary Language detected
3. Owner / Farmer / Seller / Issuer names
4. Key transactions or specifications (e.g., land parcel size, survey numbers, chemical names, quantity in tons/bags, price in INR, bank transaction reference)
5. Structured Summary translated into ${targetLanguage || "English"}.
6. Confidence level of extraction.

Return a strict JSON object matching the requested schema:
- "docType": string
- "detectedLanguage": string
- "parties": array of strings
- "keyDetails": array of strings
- "extractedSummary": string
- "confidenceScore": number (0-100)`;

    let contents: any[] = [
      {
        inlineData: {
          mimeType: documentMime || "image/jpeg",
          data: documentBase64
        }
      },
      { text: prompt }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            docType: { type: Type.STRING },
            detectedLanguage: { type: Type.STRING },
            parties: { type: Type.ARRAY, items: { type: Type.STRING } },
            keyDetails: { type: Type.ARRAY, items: { type: Type.STRING } },
            extractedSummary: { type: Type.STRING },
            confidenceScore: { type: Type.NUMBER }
          },
          required: ["docType", "detectedLanguage", "parties", "keyDetails", "extractedSummary", "confidenceScore"]
        }
      }
    });

    const jsonStr = response.text || "{}";
    const result = JSON.parse(jsonStr.trim());
    res.json(result);
  } catch (error: any) {
    console.error("AI OCR Error:", error);
    res.status(500).json({
      error: "OCR document processor offline or failed.",
      message: error.message || String(error)
    });
  }
});

// Endpoint for AI Research Assistant Operations
app.post("/api/research", async (req, res) => {
  try {
    const { task, payload } = req.body;
    if (!task) {
      return res.status(400).json({ error: "task parameter is required" });
    }

    const ai = getGenAI();
    let prompt = "";

    switch (task) {
      case "generate-paper":
        prompt = `You are an elite Agronomist and Academic Editor. 
Analyze the following farm data and crop parameters:
${JSON.stringify(payload || {})}

Generate a comprehensive, publication-ready academic draft of a research paper. 
The response MUST be written in highly formal scientific language and divided into these clear sections using Markdown:
# Title: [A concise, impactful academic title]
## Abstract
[A complete 250-word structured abstract outlining Background, Methods, Results, and Practical Implications]
## 1. Introduction
[Theoretical background, literature gap, and study objectives]
## 2. Materials and Methods
[Detailed experimental setup, soil types, crop varieties, irrigation systems, sensor calibrations, and statistical software tools used]
## 3. Results & Discussion
[Deep analysis of the data, treatment comparison, soil chemical responses, and comparison with other global studies]
## 4. Conclusions & Field Recommendations
[Core takeaways for scientists and field extension workers]
## 5. References
[At least 3 realistic citations of relevant literature in APA format]`;
        break;

      case "summarize":
        prompt = `You are an elite Scientific Reviewer in Agriculture.
Analyze and summarize the following agricultural research text:
"${payload.text || ""}"

Structure your summary using Markdown with the following clear headers:
# Article Summary
## Core Objective
## Methodology & Experimental Design
## Key Discoveries & Data Takeaways
## Agronomic Applications
## Limitations & Future Research Directions`;
        break;

      case "experiment":
        prompt = `You are a Principal Investigator of Agricultural Research.
Create a highly rigorous, scientifically valid experimental design based on this goal:
"${payload.goal || "Optimizing NPK delivery via sub-surface drip irrigation"}"

The response MUST include:
# Experimental Design Proposal
## 1. Hypothesis & Study Objective
## 2. Experimental Layout
[Specify design like Randomized Complete Block Design (RCBD), Split-Plot, etc.]
## 3. Treatment Structure & Control
[Detailed list of treatments, concentrations, or irrigation rates with active control]
## 4. Replications and Field Plot Setup
[Number of replicates, plot size, buffer zones, plant-to-plant spacing]
## 5. Key Variables to Measure
- Primary agronomic parameters (e.g., chlorophyll content, leaf area index, root depth)
- Secondary physical/chemical parameters (e.g., soil moisture tension, nitrate leaching)
## 6. Statistical Analysis Plan
[Specify ANOVA model, post-hoc test (e.g., Tukey's HSD), and significance thresholds]`;
        break;

      case "citation":
        const { title, author, year, journal, volume, pages } = payload || {};
        prompt = `You are an Academic Citation specialist. 
Generate formatted citation references for the following research publication metadata:
- Title: ${title || "Dynamic Soil Moisture Sensing in Organic Farming"}
- Author(s): ${author || "Dr. Amit Sharma, Prof. Jane Doe"}
- Year: ${year || "2025"}
- Journal: ${journal || "Indian Journal of Agronomy"}
- Volume/Issue: ${volume || "Vol 70, No 2"}
- Pages: ${pages || "114-128"}

Format this paper exactly into the following reference citation styles inside a clear Markdown container:
# Scientific Citations

### APA (7th Edition)
\`\`\`text
[Generate APA 7th style citation]
\`\`\`

### MLA (9th Edition)
\`\`\`text
[Generate MLA 9th style citation]
\`\`\`

### Chicago (17th Edition, Author-Date)
\`\`\`text
[Generate Chicago style citation]
\`\`\`

### Harvard Style
\`\`\`text
[Generate Harvard style citation]
\`\`\`

### BibTeX Format
\`\`\`bibtex
[Generate BibTeX citation record code block]
\`\`\``;
        break;

      case "universities":
        prompt = `You are an Academic Collaboration Coordinator. 
Based on this research field or interest: "${payload.domain || "Precision Irrigation & Soil Sensors"}"

1. List 4 real, prestigious agricultural universities or national institutes (e.g., PAU, IARI, TNAU, G.B. Pant, or international equivalents like UC Davis, Wageningen) that actively specialize in this field.
2. For each, describe the specific department/lab to contact and their current research focus.
3. Generate a highly professional, copy-pasteable email collaboration inquiry template that a field researcher can send to these universities.

Structure using beautiful Markdown:
# University Collaboration Finder
## 1. Target Institutions
[Detailed breakdown of the 4 universities]
## 2. Collaborative Opportunity Pitch
## 3. Professional Email Collaboration Template
[Copy-pasteable text block with brackets like [Your Name], [Your Institution], etc.]`;
        break;

      case "peer-review":
        prompt = `You are the Editor-in-Chief of "Global Agronomy & Soils".
Perform a detailed, simulated double-blind peer-review of the following research paper topic and abstract:
- Title: "${payload.title || "Yield optimization via precision drone fertilizer spraying"}"
- Abstract: "${payload.abstract || "A field study showing improved efficiency of liquid urea delivery via commercial hexacopter spraying."}"

Simulate three diverse, rigorous peer reviewers:
# Simulated Peer Review Report

## Reviewer 1: [Pragmatic Agronomist]
- **Rating**: Major/Minor Revisions
- **Critique & Methodology Review**:
- **Actionable Suggestions**:

## Reviewer 2: [Rigorist Biostatistician]
- **Rating**: Reconsider after Major Revisions
- **Statistical & Data Integrity Review**:
- **Actionable Suggestions**:

## Reviewer 3: [Industry Innovation Expert]
- **Rating**: Accept with minor revisions
- **Novelty & Field Usability Review**:
- **Actionable Suggestions**:

## Editor's Decision & Synthesis Letter
[Formal feedback and score card: Novelty (1-10), Rigor (1-10), Presentation (1-10)]`;
        break;

      case "grant":
        prompt = `You are a professional Academic Grant Writer.
Create a detailed, compelling Grant Proposal proposal based on this research idea and funding source:
- Idea: "${payload.researchIdea || "Solar-powered smart automated micro-drip networks for high-stress crops"}"
- Target Funding Agency: "${payload.fundingAgency || "Indian Council of Agricultural Research (ICAR) / DBT / NABARD"}"

Generate the draft including:
# Grant Proposal Proposal
## 1. Project Title & Abstract
## 2. Alignment with Agency Goals
## 3. Work Package & Objectives
## 4. Detailed Budget Breakdown (Itemized table in Markdown: Equipment, Personnel, Travel, Consumables, Overheads)
## 5. Technical Timeline (Gantt Chart Representation in Markdown or text)
## 6. Socio-Economic & Climate Impact Statement`;
        break;

      case "patent":
        prompt = `You are an elite Patent Attorney specializing in AgTech innovations.
Analyze this technological invention draft:
- Title/Invention Name: "${payload.inventionName || "IoT Bio-electrochemical soil pH stabilizer"}"
- Invention Details: "${payload.inventionDetails || "A self-powered probe that uses microbial fuel cell voltage to drive local counter-ions and balance high alkaline soil patches."}"

Generate detailed patent suggestions in Markdown:
# Patent Filing Guidelines & Claims Draft
## 1. Field of Invention & Prior Art Assessment
## 2. Proposed Patent Title
## 3. Suggested International Patent Classification (IPC) Codes
## 4. Draft Patent Claims
- **Claim 1 (Independent Claim)**: [Draft a broad, legally defensible independent claim detailing the essential components and novel connection]
- **Claim 2 (Dependent Claim - Sensor interface)**:
- **Claim 3 (Dependent Claim - Self-powering feature)**:
## 5. Description of Novelty & Non-Obviousness Statement`;
        break;

      default:
        return res.status(400).json({ error: "Unsupported research task" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("AI Research Error:", error);
    res.status(500).json({
      error: "Research assistant service failed.",
      message: error.message || String(error)
    });
  }
});

// ==========================================
// VITE MIDDLEWARE & STATIC SERVING
// ==========================================

async function start() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite Dev Server Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving static files from /dist...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AgriConnect AI Full-Stack Server listening on http://0.0.0.0:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
});
