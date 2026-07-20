# SUUND — Project Source of Truth

> This file holds the **product and plan** (what & why).
> The technical "how" lives in each repo's AGENTS.md.
> Update this at the end of every planning session. Keep it current, prune the obsolete.

---

## 1. VISION (the why)

Suund is a **health diary, not a report.** Competitors (WHOOP, Oura, Vora, Wellness Project)
are reports — you open them once in the morning, read, close. Suund is opened *every time
something happens*: you take a velo, drink a beer, finish a workout, or just want to see your
HRV right now. It is a companion to the day, not a morning newsletter.

**The one-line pitch:** "WHOOP tells you what happened. Suund tells you why, and what to do."

**Core differentiator — it's not the data, and it's not Claude alone:**
Every rival can aggregate wearables. Wellness Project already uses Claude. The moat is:
- **All layers live in one place.** Input (training, nutrition, habits) + output (wearables)
  together. Apple Health doesn't have your alcohol. MyFitnessPal doesn't have your HRV.
  WHOOP doesn't have your sexual activity. Suund has all of it — so Claude can say
  "sex improves your sleep" or "3 days no alcohol, HRV +12%." That sentence is impossible
  on any other app because they're missing pieces.
- **Simplicity as the weapon.** The founder tried Wellness Project and found it confusing.
  A free, feature-stuffed app that's hard to use loses to a clear one you pay for.
  Simplicity isn't a feature you add — it's things you leave out. Rivals won't do it.
- **Claude reasoning quality** beats proprietary AI. Honest, not a cheerleader.

**What Suund means to the founder:** self-actualization — proving he can build a value-
creating product with AI. A piece of a future personal brand. Not a get-rich-overnight play;
market demand = proof the product is needed. Community (friends + small followers) is part
of the contribution, not an afterthought.

### THE MOAT (this shapes strategy — launch matters more than features)

The tech is NOT the moat. Open Wearables is open-source, Claude API is public, the screens
and MCP pattern are all reproducible in ~a week. Suund was built in 2 weeks with no coding
background — the next person can do the same. Expect a wave of similar apps. WP is even
easier to copy (bigger, more visible).

**What CANNOT be copied:**
1. **Simplicity.** Hardest thing to copy — because a copier sees the app and thinks "same +
   more features," then adds. Human nature adds; simplicity requires leaving out. The
   founder's restraint is a defense most can't imitate because "simple" feels "unfinished."
2. **The founder.** The story, the face, the cornflower, the reason. Build-in-public makes
   him a brand — a brand isn't forked from GitHub. People buy from people.
3. **Community + data over time.** The real compounding moat. 500 people who've kept a diary
   6 months, who know each other, on whose data Claude has learned patterns — a copier starts
   from zero with an empty app. First-mover who RETAINS builds an edge a later entrant can't buy back.

**Strategic consequence:** don't waste energy hiding code — the moat isn't there. The moat is
SPEED, BRAND, RETENTION. Launch and first users matter more than any feature. Every week on
market before a copier is an edge; every retained user is one they must win back. This is why
"community is part of my contribution" is commercially right, not just nice — community is the
only thing that can't be forked.

---

## 2. LOCKED DECISIONS

- **Data layer:** self-hosted Open Wearables on Railway (~$5–20/mo), NOT Terra ($499/mo).
  Terra rejected us from their startup program; OW does the same job on our infra.
  Provider abstraction means we can still swap to Terra/Junction without a rewrite.
- **Language:** English by default (primary market US/Europe). Estonian automatically for
  Estonian-locale devices. Requires i18n structure + a language param in Claude's system
  prompt. The app is NOT an Estonian product — App Store page, landing, marketing all in English.
- **Pricing:** Free ($0 — dashboard + 7 days data + 3 AI queries/day) /
  Plus ($4.99/mo — unlimited AI + 30 days + notifications) /
  Pro ($14.99/mo — everything + lactate + training plan + 90-day trends).
  Note: Apple takes 15% (small-business program, must apply). Break-even ~35–40 paying users.
- **Layered product:** each layer stands alone and must be best-in-class alone.
  Habit tracker alone / training log alone / wearable+sync alone — any one worth using.
  Claude is the glue that makes the user want the next layer ("connect your watch and I'll
  see if your sleep improves"). Low entry barrier, each layer its own marketing angle.
- **Name:** Suund. Domain: suund.app (bought). Logo: blue 3D cornflower (rukkilill) — the
  one thing in the black/blue/white palette no competitor can own. Palette: near-black
  background, cornflower blue accent (#6495ED) used ONLY where it carries meaning, white text.
- **Home screen design:** dashboard with hierarchy. Claude's analysis is the hero (verdict
  first, detail below, tappable chips). Metrics below as quiet evidence. Missing data shows
  as "—" (textEmpty), NEVER a fake 0 — honesty about gaps is a core principle.
- **Security:** Claude API key is server-side (health-mcp proxy), never in the app bundle.
  Rate limits + tiers enforced on the SERVER, not the client.

---

## 3. FUNCTIONALITY BY SCREEN

**Guiding principle:** one screen answers one question — "what do I do here?"
If there's more than one answer, split the screen. Every screen is a diary: easy to log
input, easy to get an overview. WP's mistake wasn't too many features — it was every screen
trying to do five things at once.

### Home (built)
- Claude's morning analysis (hero) + metrics (sleep, HRV, RHR, steps, calories, workout)
- Tappable chips open a conversation about that specific flag (NOT an empty chat box —
  the summary itself generates the questions). (chat not built yet)
- Sync is a button, not just morning. Suund must be a FASTER place to check HRV than
  Apple Health itself. "Sync + show me now" must be instant. (not built yet)

### Training (designing)
- Two separate jobs, different times, must NOT be on the same view at once:
  before/during workout ("what's on today" + log sets) vs other times ("how's my training going").
- v1: show plan (from suund.app generator or import) · log today (exercise, set, rep, weight, RPE)
  · previous result shown next to each ("last: 90kg x 8") — heart of the diary, stolen from Strong.
- Later: training-recovery correlation (needs data first).
- Plan is a DATA STRUCTURE (Supabase), one schema, three surfaces: web generator, app, Excel
  import. Founder's 12-week Excel plan uses the same shape. Build schema once.
- Open question: log speed (Strong-style tap-and-go) vs context (show previous, Claude hint)?

### Habits (designing)
- Config-driven (array), new habits added without new screens.
- Tracks: alcohol, nicotine, mood, energy, sexual activity (+ more later).
- Must capture QUANTITY (2 beers, not just "drank") and EVENT-AT-A-TIME (sex at 22:00) —
  the gap NO existing habit tracker fills (Streaks etc. are binary). This is the niche.
- Counters ("12 days no nicotine", "3 days sober") — visible, motivating, shareable.
- Near-zero friction — steal EasyHabits' Home Screen / Lock Screen widget idea.
  Open question: how many taps is acceptable to log a beer at a bar?

### Trends (designing)
- Charts over time (sleep/HRV/steps 7/30/90d) — visualization, build NOW with seed data.
- Correlations ("alcohol -> HRV -18%") — a CONCLUSION, needs REAL noisy data, build LATER.
  Mock data lies here (it only shows correlations that were coded in).

### Profile (designing)
- Connected devices, settings, language, subscription. Not designed in detail yet.

### Bottom nav: Home · Trends · Training · Habits · Profile

---

## 4. BUILD ORDER (what blocks what)

Done: Etapp 0 (setup, both machines) · Etapp 1 (OW + MCP + Claude, real data) ·
Backend proxy (key server-side, rate limits).

NEXT:
1. Product design conversations per screen (Training -> Habits -> Trends -> Profile).
2. Structure: design system (theme/tokens.ts) + i18n — BEFORE building more screens.
3. Habits + Training log — build EARLY: they generate the data Trends later analyzes.
   Each day without them = data lost forever. Must be best-in-class per layer.
4. Trends charts (seed data, now) — correlations later (real data).
5. Apple Health sync (founder's Apple Watch — only works on real device, not browser).
6. TestFlight — BLOCKED ONLY by Apple Developer account (enrollment failed, contacted support).

APP STORE (not TestFlight) prerequisites, plan ahead:
- User accounts (app currently reads OW's "first user" = founder's own).
- Payments: RevenueCat, server knows the tier.
These block App Store, NOT TestFlight.

Why order matters: log-layers early (irreplaceable data), correlations late (need that data).

---

## 5. OPEN QUESTIONS

- Habit logging: exact tap count / widget approach for zero-friction logging.
- Training log: speed-first (Strong) vs context-first (show previous + Claude hint)?
- User-added custom habits ("cold shower") — Claude needs to know what to do with a new
  arbitrary metric. v2, harder than config-array habits.
- Community — NEXT PLANNING SESSION'S TOPIC. Involving people, comparing data between users,
  leaderboards, sharing counters/streaks. This is the moat, needs its own strategy discussion.
  Privacy model for shared data (Apple is strict). Public vs private.
- Web training-plan generator on suund.app as free lead magnet -> email capture -> app.
- Onboarding flow — first impression, not designed.
- B2B angle (sports clubs, corporate wellness, trainers) — interesting, better revenue/client
  than B2C, not current focus.

---

## 6. WORK LOG

- Etapp 0 — tools + accounts, both machines.
- Etapp 1 — health-mcp built, deployed, connected to claude.ai; 5 tools; wired to real OW data.
- Expo app scaffolded: 5 screens, navigation, reads real OW data.
- Claude analysis live in-app (Estonian, honest, acknowledges missing data).
- Backend proxy: /api/analyze + /api/chat, key server-side, rate limiting, app-key + user-id auth.
  EXPO_PUBLIC_ANTHROPIC_API_KEY removed from app entirely.
- AGENTS.md + /orient + /wrap skills in both repos.
- Name/domain/pricing/positioning locked. Competitor analysis done.

---

## HOW THIS FILE STAYS ALIVE

- Planning sessions (chat): decisions land here (Claude updates this file).
- Build sessions (Claude Code): /orient at start, /wrap at end maintain AGENTS.md (technical).
  This file (PROJECT.md) is updated by Claude in planning chats.
- Two brains, clear split: PROJECT.md = what & why, AGENTS.md = how. Nothing lost if both current.
