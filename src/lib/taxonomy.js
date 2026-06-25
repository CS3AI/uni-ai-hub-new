// Uni AI Hub 内容分类体系
// 这套分类直接对应社团整理的思维导图结构，用于给 Information 信息流打标签、
// 也用于 Courses / Internship 页面的筛选器。以后要调整分类，只改这个文件即可。

export const TECH_TAGS = [
  { id: "compute", label: "算力 Compute/Hardware", group: "硬件：AI基建" },
  { id: "data", label: "数据 Data Infrastructure", group: "硬件：AI基建" },
  { id: "models", label: "模型框架 Models", group: "硬件：AI基建" },
  { id: "networking", label: "能源网络 Networking", group: "硬件：AI基建" },
  { id: "algorithms", label: "算法演进 Algorithms", group: "软件：AI算法" },
  { id: "toolkits", label: "软件开发 AI Toolkits", group: "软件：AI算法" },
  { id: "applications", label: "应用层开发 Application", group: "软件：AI算法" },
];

export const INDUSTRY_TAGS = [
  { id: "healthcare", label: "Healthcare & BioTech" },
  { id: "finance", label: "Finance & FinTech" },
  { id: "entertainment", label: "Entertainment & Creative Arts" },
  { id: "av", label: "Autonomous Vehicles & Robotics" },
  { id: "agriculture", label: "Agriculture & Climate" },
];

export const STARTUP_TAGS = [
  { id: "validation", label: "Idea Validation & Strategy" },
  { id: "branding", label: "Branding & Pitching" },
  { id: "vibecoding", label: "Vibe Coding Product" },
  { id: "growth", label: "Growth & Automation" },
];

export const SOURCE_TYPES = [
  { id: "preprint", label: "Preprint Servers (科学论文)" },
  { id: "gov-research", label: "政府 / 期刊 / 研究机构" },
  { id: "industry-lab", label: "Industry Tech Labs" },
  { id: "dev-community", label: "Developer Communities" },
  { id: "vc-media", label: "Venture Capital & Business Media" },
];

export const ALL_TAGS = [...TECH_TAGS, ...INDUSTRY_TAGS, ...STARTUP_TAGS];

// 关键词启发式打标签：抓回来的真实新闻/论文标题+摘要里包含这些词，就打上对应标签。
// 这是"尽量自动"而不是"完全精准"的方案——人工运营时可以在 lib/feeds.js 里继续扩充关键词。
const KEYWORDS = {
  compute: ["gpu", "chip", "hardware", "compute", "tpu", "nvidia", "semiconductor", "data center", "datacenter"],
  data: ["dataset", "data infrastructure", "data pipeline", "data quality", "annotation"],
  models: ["model", "llm", "transformer", "foundation model", "architecture", "parameter"],
  networking: ["network", "energy", "power grid", "cooling", "interconnect", "bandwidth"],
  algorithms: ["algorithm", "reinforcement learning", "optimization", "training method", "fine-tun"],
  toolkits: ["sdk", "framework", "library", "toolkit", "api release", "open source", "open-source"],
  applications: ["app", "application", "product launch", "copilot", "assistant", "agent"],
  healthcare: ["health", "medical", "biotech", "drug discovery", "diagnosis", "clinical", "genom"],
  finance: ["finance", "fintech", "bank", "trading", "payment", "investment"],
  entertainment: ["game", "gaming", "music", "film", "creative", "art", "entertainment"],
  av: ["autonomous vehicle", "self-driving", "robot", "robotics", "drone"],
  agriculture: ["agricultur", "farm", "climate", "crop", "sustainab", "weather"],
  validation: ["startup idea", "market validation", "pitch", "strategy"],
  branding: ["branding", "marketing", "pitch deck"],
  vibecoding: ["no-code", "vibe coding", "rapid prototyp", "app builder"],
  growth: ["growth hacking", "automation", "scale", "user acquisition"],
};

export function classify(text = "") {
  const lower = text.toLowerCase();
  const tags = [];
  for (const [tagId, words] of Object.entries(KEYWORDS)) {
    if (words.some((w) => lower.includes(w))) tags.push(tagId);
  }
  return tags;
}
