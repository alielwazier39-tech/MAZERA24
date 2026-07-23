var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_url = require("url");
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_meta = {};
var __filename = (0, import_url.fileURLToPath)(import_meta.url);
var __dirname = import_path.default.dirname(__filename);
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", appName: "MAZERA24", time: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app.post("/api/ai-insights", async (req, res) => {
    try {
      const { attendanceSummary, lang = "ar" } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        return res.status(200).json({
          insight: lang === "ar" ? "\u0645\u0644\u0627\u062D\u0638\u0629 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A (\u0648\u0636\u0639 \u0627\u0644\u0645\u062D\u0627\u0643\u0627\u0629): \u0623\u062F\u0627\u0621 \u0627\u0644\u062D\u0636\u0648\u0631 \u0645\u0633\u062A\u0642\u0631 \u0628\u0634\u0643\u0644 \u0639\u0627\u0645 \u0628\u0646\u0633\u0628\u0629 92%. \u064A\u064F\u0646\u0635\u062D \u0628\u0645\u062A\u0627\u0628\u0639\u0629 \u062A\u0646\u0628\u064A\u0647\u0627\u062A \u0627\u0644\u062E\u0631\u0648\u062C \u0645\u0646 \u0627\u0644\u0645\u0648\u0642\u0639 \u0641\u064A \u0641\u0631\u0639 \u0627\u0644\u0639\u0644\u064A\u0627 \u0644\u062A\u0642\u0644\u064A\u0644 \u0627\u0644\u062A\u0623\u062E\u064A\u0631\u0627\u062A." : "AI Insight (Simulated): Overall attendance rate is steady at 92%. Recommended to review geofence exit triggers for the HQ branch."
        });
      }
      const ai = new import_genai.GoogleGenAI({ apiKey });
      const prompt = `System: You are MAZERA24 AI Chief Workforce Analyst.
Language: ${lang === "ar" ? "Arabic" : lang === "es" ? "Spanish" : "English"}
Context Data: ${JSON.stringify(attendanceSummary)}

Instructions:
Provide a concise, professional 3-bullet managerial report summarizing:
1. Overall attendance health & punctuality.
2. Geofence adherence & exit alert patterns.
3. Recommended actionable manager steps for optimize work discipline.
Keep the tone authoritative, modern, and encouraging. Use formatted markdown bullets.`;
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
      });
      res.json({ insight: response.text });
    } catch (err) {
      console.error("Error in AI Insights endpoint:", err);
      res.status(500).json({ error: "Failed to generate AI insights", message: err?.message });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MAZERA24 server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
