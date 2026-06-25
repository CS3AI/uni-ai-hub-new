// Information 板块的真实数据源清单。
// 全部是免费、不需要 API Key 的公开 RSS/Atom 源。
// 想增加/替换来源：在这个数组里加一行即可，不用改其他代码。
export const FEEDS = [
  { url: "https://rss.arxiv.org/rss/cs.AI", name: "arXiv cs.AI", sourceType: "preprint" },
  { url: "https://rss.arxiv.org/rss/cs.LG", name: "arXiv cs.LG", sourceType: "preprint" },
  { url: "https://rss.arxiv.org/rss/cs.CL", name: "arXiv cs.CL", sourceType: "preprint" },
  { url: "https://news.mit.edu/rss/topic/artificial-intelligence2", name: "MIT News · AI", sourceType: "gov-research" },
  { url: "https://blogs.nvidia.com/feed/", name: "NVIDIA Blog", sourceType: "industry-lab" },
  { url: "https://www.microsoft.com/en-us/research/feed/", name: "Microsoft Research", sourceType: "industry-lab" },
  { url: "https://openai.com/blog/rss.xml", name: "OpenAI Blog", sourceType: "industry-lab" },
  { url: "https://huggingface.co/blog/feed.xml", name: "Hugging Face Blog", sourceType: "dev-community" },
  { url: "https://hnrss.org/newest?q=AI&points=50", name: "Hacker News (AI, 50+ points)", sourceType: "dev-community" },
  { url: "https://techcrunch.com/category/artificial-intelligence/feed/", name: "TechCrunch · AI", sourceType: "vc-media" },
  { url: "https://venturebeat.com/category/ai/feed/", name: "VentureBeat · AI", sourceType: "vc-media" },
];

// 实习/内推板块：社区持续维护、每天自动更新的开源实习清单（GitHub raw JSON，免 key）。
// 这是真实的、自动刷新的数据源，不是示例。
export const INTERNSHIP_SOURCES = [
  {
    url: "https://raw.githubusercontent.com/SimplifyJobs/Summer2026-Internships/dev/.github/scripts/listings.json",
    label: "SimplifyJobs / Summer2026-Internships",
  },
  {
    url: "https://raw.githubusercontent.com/vanshb03/Summer2027-Internships/dev/.github/scripts/listings.json",
    label: "vanshb03 / Summer2027-Internships",
  },
];

export const AI_KEYWORDS = [
  "ai", "machine learning", "ml ", " ml", "deep learning", "data scien", "research",
  "nlp", "computer vision", "llm", "artificial intelligence",
];
