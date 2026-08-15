<div align="center">

# 🤖 Uni AI Hub

**A free intelligence hub for students exploring AI**

[![Live Site](https://img.shields.io/badge/Live-uni--ai--hub--new.vercel.app-blue?style=flat-square)](https://uni-ai-hub-new.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com)
[![8 Languages](https://img.shields.io/badge/Languages-8-green?style=flat-square)](#internationalization)

Built by the **AI For Good @Uni Club** at University High School (Irvine, CA) — no login required.

</div>

---

Uni AI Hub aggregates real-time industry news, curated learning resources, live internship listings, and global opportunity navigation in one place — built specifically for high school and college students.

## Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Design System](#design-system)
- [Project Structure](#project-structure)
- [Local Development](#local-development)
- [Contributing](#contributing)
- [Development Log](#development-log)

---

## Features

### 📰 Information — AI Industry News

Auto-aggregated from **52 RSS/Atom sources** including arXiv (cs.AI, cs.LG, cs.CL, cs.CV, cs.NE, stat.ML), Anthropic, Google DeepMind, OpenAI, Hugging Face, MIT CSAIL, IEEE, TechCrunch, WIRED, MIT Technology Review, Papers with Code, and more. Refreshes every **12 hours** via ISR.

- Up to **600 articles** with dynamic source and topic filters (empty categories are hidden automatically)
- **Keyword search** — search across title, summary, and source; results are highlighted and paginated
- **Featured Picks** rotates every 48 h using a deterministic epoch-based seed — consistent recommendations, no database needed
- Paginated 10 per page

---

### 📚 Courses — Learning, Research & Programs

Seven sections accessible via a **sticky horizontal tab bar** with active scroll tracking:

| Section | Contents |
|---|---|
| **Universities** | Open courses from Stanford, MIT, UC Berkeley, UCLA, UCSD, Harvard, UCI, UW, Johns Hopkins |
| **Companies** | Self-paced programs from Google, Microsoft, NVIDIA, DeepLearning.AI, and more |
| **Online Lectures** | 3Blue1Brown, Andrej Karpathy, Andrew Ng, MIT CSAIL, Google DeepMind, Stanford HAI |
| **Conferences & Events** | ICML, TED AI Conference, NVIDIA GTC, Stanford AI Safety Workshop |
| **Volunteer Opportunities** | NeurIPS, GDSC, MLH, Code.org, AI for Good, FIRST Robotics |
| **Summer Schools** | Stanford HAI/AIMI, UC Berkeley AI4ALL, MIT PRIMES, CMU SAMS, NVIDIA DLI, Google CSRMP |
| **Research Programs** | Spirit AI, RSI (MIT), PRIMES-USA, Regeneron STS, Simons Summer Research, UCSB RMP |

All entries include difficulty level, format tags, and direct links. Content is **auto-updated weekly** every Monday.

---

### 💼 Internship — Referrals & Career Prep

**Live Listings** — ~80 AI/ML positions synced every 6 hours from community-maintained databases. Searchable by company or role, paginated 15 per page. Skill tags (Python, Computer Vision, NLP/LLM, Reinforcement Learning, Data Science) are automatically inferred from job titles via keyword matching.

**Referral Opportunities** — insider tips and timing windows for 8 companies:
Google · Microsoft · Meta · Tesla · Waymo · OpenAI · Blizzard Entertainment · Rivian

**University Career Fairs** — 68 fairs across 4 recruitment seasons covering the top 50 US universities:

| Season | Color | Coverage |
|---|---|---|
| Fall | Amber | Major fall recruiting season (Aug–Oct) |
| Spring | Green | Spring recruiting cycle (Jan–Mar) |
| Summer | Blue | Summer internship fairs (Apr–Jun) |
| Winter | Purple | Winter/holiday recruiting (Nov–Dec) |

Each fair shows dates, format (in-person/virtual/hybrid), expected size, featured AI companies, and insider tips. Includes a career fair prep checklist.

**Section A — Resume & Outreach Templates**
AI/CS resume structure, professor cold-email frameworks, and industry referral request scripts.

**Section B — Application Timeline**
Month-by-month milestones (Sep–Aug) for planning internship cycles a year in advance.

**Section C — Tech Interview & Portfolio Tips**
GitHub portfolio management, the Think Out Loud coding interview method, and the STAR behavioral framework with worked examples.

**Peer Interview Debriefs** — anonymous community feed for sharing interview experiences.

---

### 🌍 Opportunity — Global Navigation

Five tabs covering the full opportunity spectrum:

**Global Challenges** — 8 competitions with inline difficulty/type/requirement tags:
WAICY · IOAI · APEX AI Championship · Google Solution Challenge · Technovation Girls · The Earth Prize · Regeneron ISEF (AI) · ITU AI for Good Youth Summit

**Open Source & Projects** — 7 beginner-friendly AI projects (Mozilla Common Voice, Agenta, Ollama, and more)

**Local Action (California)** — 5 California-specific AI programs for community-level impact

**Talks & Events** — 9 conferences with attendance guidance:
TED AI · NeurIPS · Google I/O · Stanford HAI Salon · SXSW EDU · CES · NVIDIA GTC · Fortune Brainstorm AI · AI Summit

**Startup Funding** — 18 curated funding sources for high school and college student founders, organized in four sections:

| Section | Highlights |
|---|---|
| Student Accelerators & Funds | Y Combinator ($500K), Dorm Room Fund (0% equity), Contrary Capital, 1517 Fund, Pear VC |
| Pitch Competitions | Diamond Challenge (HS), Conrad Challenge, MassChallenge, TechCrunch Battlefield ($100K) |
| Government Grants | NSF I-Corps ($50K, 0% equity), SBIR Phase I ($275K), DOE programs |
| University Incubators | Berkeley SkyDeck, Stanford StartX (0% equity), MIT delta v, Harvard iLab |

Each entry shows funding amount, equity taken, eligibility, and a direct application link. Includes a Founder Tips panel for student entrepreneurs.

---

### 🏠 Homepage Features

**AI Opportunity Match** — 4-selector recommendation engine scoring 26 resources across 8 types:
- Grade · Tech Area · Industry Area · Coding Level
- Returns up to 6 ranked recommendations with colored type badges

**YCM Weekly Intel Digest** — hand-curated weekly briefing in four categories (Top News, Research Papers, Internships, Courses). Each item has a 50–100 word editorial note. Auto-translated in non-English modes via Google Translate API. **Updated automatically every Monday.**

**Peer Profiles** — coming soon section for UHS students who landed top internships, summer programs, or competition wins.

**User Feedback Wall** — emoji reactions (👍 🔥 🚀 💡) with globally shared counts backed by **Supabase** — all visitors see the same total in real time. Anonymous comment form with instant display and community moderation via soft delete.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Internationalization | next-intl v3 · 8 locales: `en` `zh` `fr` `es` `de` `ja` `ru` `ko` |
| Styling | Tailwind CSS v3 |
| Hosting | Vercel (auto-deploy from `main`) |
| Database | Supabase (shared comments + reaction counts) |
| Data freshness | ISR — 12 h (news) · 6 h (internships) · 10 min (courses) |
| View counters | counterapi.dev (page views, unique visitors, school count) |
| Auto-translation | Google Translate free API (non-English static content) |

---

## Design System

Each section has a dedicated color identity applied consistently across homepage cards, sub-page background tints, filter chip active states, and navbar highlights:

| Section | Color | Navbar highlight | Active chip |
|---|---|---|---|
| Information | Blue | `border-blue-400 bg-blue-50` | `bg-blue-600` |
| Courses | Red | `border-red-400 bg-red-50` | `bg-red-500` |
| Internship | Green | `border-green-400 bg-green-50` | `bg-green-600` |
| Opportunity | Yellow | `border-yellow-400 bg-yellow-50` | `bg-amber-500` |

Active nav highlighting is handled by `NavLinks.js` (client component reading `usePathname()`) — keeping the server-side `Navbar.js` free of client-only hooks.

---

## Project Structure

```
src/
├── app/[locale]/
│   ├── page.js              # Homepage
│   ├── information/page.js  # News feed (12 h ISR)
│   ├── courses/page.js      # 7-section learning hub
│   ├── internship/page.js   # Live jobs + career prep + career fairs
│   └── opportunity/page.js  # Challenges, open source, events, startup funding
├── components/
│   ├── InformationFeed.js   # Filter chips + keyword search + pagination
│   ├── InternshipList.js    # Search, pagination, skill tag inference
│   ├── CareerFairs.js       # 4-season career fair accordion (68 fairs, top 50 universities)
│   ├── OpportunityMatch.js  # 4-selector recommender
│   ├── CourseTabs.js        # Sticky tab nav with IntersectionObserver
│   ├── WeeklyDigest.js      # Curated weekly briefing
│   ├── FeedbackWall.js      # Shared emoji reactions + anonymous comments (Supabase)
│   ├── PeerDebriefs.js      # Anonymous interview experience feed
│   ├── NavLinks.js          # Active nav highlighting (client component)
│   └── ViewCounter.js       # Live visitor / school stats
├── data/
│   ├── activities.json      # Opportunities, open source, events, global challenges
│   ├── courses.json         # All courses, lectures, conferences, programs
│   ├── careerFairs.json     # 68 career fairs across 4 seasons, top 50 US universities
│   └── digest.json          # Weekly digest content (auto-updated every Monday)
├── lib/
│   ├── feeds.js             # 52 RSS/Atom feed sources
│   └── internships.js       # Internship data fetcher
├── messages/                # 8 locale JSON files
└── public/logos/            # 24+ organization logos (universities, companies, orgs)
```

---

## Local Development

```bash
git clone https://github.com/CS3AI/uni-ai-hub-new.git
cd uni-ai-hub-new
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The site works fully without any environment variables.

> **Optional** — page view tracking requires a `COUNTERAPI_KEY`. Without it, the stats bar shows zero but everything else works normally.

---

## Contributing

Maintained by the **AI For Good @Uni Club**. All contributions welcome:

| What | How |
|---|---|
| Add a course or resource | Edit `src/data/courses.json` or `src/data/activities.json` and open a PR |
| Add an internship source | Update `src/lib/feeds.js` |
| Add a career fair | Edit `src/data/careerFairs.json` |
| Add a language | Copy `messages/en.json`, translate, add the locale to `next-intl` config |
| Bug reports / feature ideas | Open a [GitHub Issue](https://github.com/CS3AI/uni-ai-hub-new/issues) |

---

## Development Log

| Date | Milestone |
|---|---|
| Jun 22 | Initial framework setup |
| Jun 23 | 8-language internationalization; language support optimization |
| Jun 24 | Information feed expanded; university courses added; logo placed; view counter added |
| Jun 25 | YCM Weekly Intel Digest launched (Top 5 News, Top 3 Papers, Top 3 Internships, Top Courses with 50–100 word editorial notes); AI Opportunity Match added |
| Jun 27 | Opportunity board launched |
| Jun 28 | Topic filter chips and pagination; online lecture section; layout and color polish |
| Jun 29 | Interview prep sections (resume, portfolio, STAR); Peer Profiles; Peer Interview Debriefs; Feedback Wall; research summer schools; prerequisite tags on internships |
| Jun 30 | UI refinements; ISR tuning; expanded university and volunteer content |
| Jul 1 | Courses horizontal tab nav; OpportunityMatch dual-interest selectors |
| Jul 9–10 | Logo overhaul — 24 high-quality local logos; Feedback Wall emoji counts migrated to Supabase (globally shared real-time counts) |
| Aug 2 | Courses and Weekly Digest auto-updated to current week; Information keyword search added; University Career Fairs module launched on Internship board |
| Aug 3 | Information articles expanded to 600 (52 RSS sources); Career Fairs expanded to 4 seasons (summer + winter added), 68 fairs covering top 50 US universities |
| Aug 14 | Startup Funding tab added to Opportunity board (18 programs: accelerators, pitch competitions, government grants, university incubators) |

---

<div align="center">

*Built with Next.js · Deployed on Vercel · Made at University High School, Irvine CA*

</div>
