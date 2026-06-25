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

// 关键词启发式打标签 — 大幅扩充覆盖范围，确保每个 topic 都有足够内容。
const KEYWORDS = {
  compute: [
    "gpu", "chip", "hardware", "compute", "tpu", "nvidia", "semiconductor",
    "data center", "datacenter", "accelerator", "fpga", "asic", "processor",
    "h100", "a100", "amd", "intel", "memory bandwidth", "training cluster",
    "inference chip", "wafer", "fab", "foundry", "power consumption",
  ],
  data: [
    "dataset", "data infrastructure", "data pipeline", "data quality",
    "annotation", "labeling", "benchmark", "evaluation dataset",
    "training data", "synthetic data", "data collection", "data curation",
    "knowledge graph", "vector database", "embedding",
  ],
  models: [
    "model", "llm", "transformer", "foundation model", "architecture",
    "parameter", "gpt", "claude", "gemini", "llama", "mistral",
    "language model", "multimodal", "vision model", "diffusion model",
    "pre-trained", "pretrained", "weight", "checkpoint", "finetuned",
    "small language model", "slm", "reasoning model",
  ],
  networking: [
    "network infrastructure", "energy consumption", "power grid", "cooling",
    "interconnect", "bandwidth", "data center energy", "carbon footprint",
    "electricity", "renewable", "thermal", "cooling system",
  ],
  algorithms: [
    "algorithm", "reinforcement learning", "optimization", "training method",
    "fine-tun", "gradient", "attention mechanism", "diffusion", "generative",
    "sampling", "inference", "rlhf", "dpo", "reasoning", "chain of thought",
    "prompt engineering", "in-context learning", "few-shot", "zero-shot",
    "mixture of experts", "moe", "retrieval augmented", "rag",
  ],
  toolkits: [
    "sdk", "framework", "library", "toolkit", "api release", "open source",
    "open-source", "pytorch", "tensorflow", "jax", "hugging face", "langchain",
    "github", "plugin", "extension", "integration", "developer tool",
    "code generation", "coding assistant", "cursor", "copilot for",
    "vscode", "cli", "package", "repository",
  ],
  applications: [
    "app", "application", "product launch", "assistant", "agent",
    "chatbot", "automation tool", "ai tool", "deploy", "deployment",
    "enterprise ai", "ai adoption", "workflow", "productivity",
    "customer service", "search", "recommendation", "personalization",
  ],
  healthcare: [
    "health", "medical", "biotech", "drug discovery", "diagnosis",
    "clinical", "genom", "medicine", "patient", "hospital", "cancer",
    "biology", "protein", "pharma", "therapy", "genetic", "brain",
    "neuroscience", "public health", "pandemic", "disease", "treatment",
    "imaging", "radiology", "pathology", "biomedical", "life science",
    "drug", "fda", "clinical trial", "molecular", "cell", "tissue",
    "mental health", "biomarker", "epidemic", "vaccine",
  ],
  finance: [
    "finance", "fintech", "bank", "trading", "payment", "investment",
    "stock", "market", "economy", "venture capital", "funding", "crypto",
    "blockchain", "hedge fund", "wall street", "asset management", "risk",
    "fraud detection", "credit", "insurance", "regulatory", "sec", "fed",
    "interest rate", "inflation", "portfolio", "defi", "revenue",
    "earnings", "valuation", "ipo", "acquisition", "merger",
  ],
  entertainment: [
    "game", "gaming", "music", "film", "creative", "art", "entertainment",
    "text-to-image", "text-to-video", "image generation", "video generation",
    "stable diffusion", "midjourney", "sora", "media", "content creation",
    "animation", "3d generation", "avatar", "vr", "ar", "metaverse",
    "streaming", "studio", "generative art", "nft", "udio", "suno",
  ],
  av: [
    "autonomous vehicle", "self-driving", "robot", "robotics", "drone",
    "tesla", "waymo", "embodied", "manipulation", "industrial robot",
    "lidar", "navigation", "humanoid", "mobility", "autopilot",
    "end-to-end driving", "simulation", "motion planning", "perception",
    "boston dynamics", "figure", "1x", "spot", "quadruped",
  ],
  agriculture: [
    "agricultur", "farm", "climate", "crop", "sustainab", "weather",
    "food security", "irrigation", "soil", "harvest", "precision farming",
    "carbon emission", "environmental", "food", "deforestation",
    "biodiversity", "species", "ecology", "remote sensing",
  ],
  validation: [
    "startup idea", "market validation", "pitch", "strategy",
    "product market fit", "go-to-market", "business model", "mvp",
  ],
  branding: [
    "branding", "marketing", "pitch deck", "fundraising", "investor",
    "series a", "series b", "seed round", "angel",
  ],
  vibecoding: [
    "no-code", "vibe coding", "rapid prototyp", "app builder",
    "low-code", "cursor", "replit", "bolt", "lovable", "v0",
  ],
  growth: [
    "growth hacking", "automation", "scale", "user acquisition",
    "retention", "conversion", "saas", "viral", "monetization",
  ],
};

export function classify(text = "") {
  const lower = text.toLowerCase();
  const tags = [];
  for (const [tagId, words] of Object.entries(KEYWORDS)) {
    if (words.some((w) => lower.includes(w))) tags.push(tagId);
  }
  return tags;
}
