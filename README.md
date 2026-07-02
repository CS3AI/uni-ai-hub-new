# Uni AI Hub

> **Live:** [uni-ai-hub-new.vercel.app](https://uni-ai-hub-new.vercel.app) &nbsp;·&nbsp; Built by the AI Club at University High School (Irvine, CA)

A free, open-access intelligence hub for high school and college students exploring AI — aggregating real-time industry news, curated learning resources, live internship listings, and global opportunity navigation in one place. No login required. Supports 8 languages.

---

## Contents

- [Features](#features)
  - [Information — AI Industry News](#information--ai-industry-news)
  - [Courses — Learning, Research & Programs](#courses--learning-research--programs)
  - [Internship — Referrals & Career Prep](#internship--referrals--career-prep)
  - [Opportunity — Global Navigation](#opportunity--global-navigation)
  - [Homepage Features](#homepage-features)
- [Tech Stack](#tech-stack)
- [Design System](#design-system)
- [Project Structure](#project-structure)
- [Local Development](#local-development)
- [Contributing](#contributing)

---

## Features

### Information — AI Industry News

Auto-aggregated from arXiv, Anthropic, Google DeepMind, OpenAI, Hugging Face, MIT CSAIL, IEEE, TechCrunch, VentureBeat, and 20+ other sources. Refreshes every **12 hours** via ISR.

- Up to 200 articles displayed with dynamic source and topic filters (only categories with actual content appear — no empty results)
- **Featured Picks** rotates every 48 hours using a deterministic epoch-based seed for consistent recommendations without a database
- Paginated 10 articles per page with navigation controls

---

### Courses — Learning, Research & Programs

Seven organized sections accessible via a **sticky horizontal tab bar** that tracks scroll position:

| Section | Contents |
|---|---|
| **Universities** | Open courses from Stanford, MIT, UC Berkeley, UCLA, UCSD, Harvard, UCI, UW, Johns Hopkins |
| **Companies** | Self-paced programs from Google, Microsoft, NVIDIA, DeepLearning.AI |
| **Online Lectures** | Curated recorded content: 3Blue1Brown, Andrej Karpathy, Andrew Ng, MIT CSAIL, Google DeepMind, Stanford HAI |
| **Conferences & Events** | ICML, TED AI Conference, NVIDIA GTC, Stanford AI Safety Workshop |
| **Volunteer Opportunities** | NeurIPS Student Volunteer, GDSC, MLH, Code.org, AI for Good, FIRST Robotics |
| **Summer Schools** | Stanford HAI/AIMI, UC Berkeley AI4ALL, MIT PRIMES, CMU SAMS, NVIDIA DLI, Google CSRMP |
| **Research Programs** | Spirit AI, RSI (MIT), PRIMES-USA, Regeneron STS, Simons Summer Research, UCSB RMP |

All entries include difficulty level, format tags, and direct links.

---

### Internship — Referrals & Career Prep

**Live Listings** — ~80 AI/ML positions synced every 6 hours from community-maintained databases. Searchable by company or role, paginated 15 per page. Each listing automatically infers skill tags (Python, Computer Vision, NLP/LLM, Reinforcement Learning, Data Science) from the job title using keyword matching, displayed as colored micro-badges.

**Referral Opportunities** — 8 companies with insider application tips and timing windows:
Google · Microsoft · Meta · Tesla · Waymo · OpenAI · Blizzard Entertainment · Rivian

**Section A — Resume & Outreach Templates**
AI/CS resume structure, professor cold-email frameworks, and industry referral request scripts.

**Section B — Application Timeline**
Month-by-month milestones (Sep–Aug) for planning internship cycles a year in advance.

**Section C — Tech Interview & Portfolio Tips**
Three cards covering GitHub portfolio management (how to hook a recruiter in 30 seconds), the Think Out Loud coding interview method, and the STAR behavioral framework with worked examples.

**Peer Interview Debriefs** — anonymous community feed for sharing interview experiences and gotchas. Data stored in `localStorage` — zero server cost, instant submission, fully private.

---

### Opportunity — Global Navigation

Four tabs covering the full opportunity spectrum:

**Global Challenges** — 8 competitions with inline tags (difficulty · type · requirement) visible without expanding:
WAICY · IOAI · APEX AI Championship · Google Solution Challenge · Technovation Girls · The Earth Prize · Regeneron ISEF (AI) · ITU AI for Good Youth Summit

**Open Source & Projects** — 7 beginner-friendly AI projects to contribute to (Mozilla Common Voice, Agenta, Ollama, and more)

**Local Action (California)** — 5 California-specific AI programs for community-level impact

**Talks & Events** — 9 conferences with attendance guidance:
TED AI · NeurIPS · Google I/O · Stanford HAI Salon · SXSW EDU · CES · NVIDIA GTC · Fortune Brainstorm AI · AI Summit

---

### Homepage Features

**AI Opportunity Match** — a 4-selector recommendation engine:
- Grade (9th–College)
- Tech Area: NLP/LLM, Computer Vision, Robotics, Data Science, AI Ethics, MLOps, Reinforcement Learning, Generative AI
- Industry Area: Healthcare, Biology, Finance, Climate, Law, Art, Education, Business, General Tech
- Coding Level: Beginner / Some Python / ML Project Experience

Scores 26 resources across 8 types (course, competition, internship, research, volunteer, lecture, conference, opportunity) and returns up to 6 ranked recommendations with colored type badges.

**YCM Weekly Intel Digest** — hand-curated weekly AI briefing in four categories (Top News, Research Papers, Internships, Courses). Each item includes a 50–100 word editorial note. Auto-translated in non-English modes via Google Translate API.

**Peer Profiles** — coming soon section showcasing UHS students who landed top internships, summer programs, or competition wins. Placeholder cards currently hold the section's position in the layout.

**User Feedback Wall** — emoji reactions (👍 🔥 🚀 💡) persisted via `localStorage` with background sync to counterapi.dev for cross-device aggregation. Anonymous comment form with instant local display.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Internationalization | next-intl v3 · 8 locales: en / zh / fr / es / de / ja / ru / ko |
| Styling | Tailwind CSS v3 |
| Hosting | Vercel (auto-deploy from `main`) |
| Data freshness | ISR — 12 h (news) · 6 h (internships) · 10 min (courses) |
| View counters | counterapi.dev (page views, unique visitors, school count, reaction totals) |
| User content | `localStorage` (comments, interview debriefs, reaction votes) |
| Auto-translation | Google Translate free API (non-English static content) |

---

## Design System

Each section has a dedicated color identity applied consistently across the homepage card, sub-page background tint, filter chip active state, and navbar active border:

| Section | Color | Navbar highlight | Active chip |
|---|---|---|---|
| Information | Blue | `border-blue-400 bg-blue-50` | `bg-blue-600` |
| Courses | Red | `border-red-400 bg-red-50` | `bg-red-500` |
| Internship | Green | `border-green-400 bg-green-50` | `bg-green-600` |
| Opportunity | Yellow | `border-yellow-400 bg-yellow-50` | `bg-amber-500` |

The active navbar link is rendered by `NavLinks.js`, a client component that reads `usePathname()` and applies the matching color border — keeping the server-side `Navbar.js` free of client-only hooks.

---

## Project Structure

```
src/
├── app/[locale]/
│   ├── page.js              # Homepage (Opportunity Match, Digest, Peer Profiles, Feedback Wall)
│   ├── information/page.js  # News feed — 12 h ISR
│   ├── courses/page.js      # 7-section learning hub with scroll-to tab nav
│   ├── internship/page.js   # Live jobs + career prep sections
│   └── opportunity/page.js  # Global challenges, open source, local, events
├── components/
│   ├── InformationFeed.js   # Filter chips + pagination
│   ├── InternshipList.js    # Search, pagination, skill tag inference
│   ├── OpportunityMatch.js  # 4-selector recommender (26 resources, 8 types)
│   ├── CourseTabs.js        # Sticky horizontal tabs with IntersectionObserver
│   ├── WeeklyDigest.js      # Curated weekly briefing
│   ├── FeedbackWall.js      # Emoji reactions + anonymous comments
│   ├── PeerDebriefs.js      # Anonymous interview experience feed
│   ├── NavLinks.js          # Active nav highlighting (client component)
│   └── ViewCounter.js       # Live visitor / school stats bar
├── data/
│   ├── activities.json      # Opportunities, open source, events, global challenges
│   ├── courses.json         # All courses, lectures, conferences, programs
│   └── digest.json          # Weekly digest content
├── lib/
│   ├── feeds.js             # RSS/API feed source list
│   └── internships.js       # Internship data fetcher
└── messages/                # 8 locale JSON files (en, zh, fr, es, de, ja, ru, ko)
```

---

## Local Development

```bash
git clone https://github.com/CS3AI/uni-ai-hub-new.git
cd uni-ai-hub-new
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Environment variables (optional — site works without them, but counters won't track):

```
COUNTERAPI_KEY=your_key_here
```

---

## Contributing

Maintained by the UHS AI Club. Contributions welcome:

- **Add resources** — edit `src/data/courses.json` or `src/data/activities.json` and open a PR
- **Add internship sources** — update `src/lib/feeds.js`
- **Add a locale** — copy `messages/en.json`, translate, and add the locale code to `next-intl` config
- **Bug reports / feature requests** — open a GitHub Issue

---

## Development Log

| Date | Milestone |
|---|---|
| Jun 22 | Initial framework setup |
| Jun 23 | 8-language internationalization |
| Jun 24 | Information feed, university courses, logo, view counter |
| Jun 25 | YCM Weekly Intel Digest, AI Opportunity Match |
| Jun 27 | Opportunity board launched |
| Jun 28 | Topic filters, pagination, lecture section, layout polish |
| Jun 29 | Interview prep cards, Peer Profiles, Peer Debriefs, Feedback Wall, summer schools & research programs, skill tags |
| Jun 30 | UI refinements, ISR tuning, expanded university & volunteer content |
| Jul 1 | Courses horizontal tab nav, OpportunityMatch dual-interest selectors |

---

*Built with Next.js · Deployed on Vercel · Made at University High School, Irvine CA*
