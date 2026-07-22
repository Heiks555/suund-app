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
- **App structure (revised 2026-07-22, see 2.3):** four tabs — Data · Training · Habits ·
  Analysis (settings = gear icon). Landing = Analysis: the cached daily "why" is the hero,
  differentiator up front. Data = pure vitals, the fastest place to see HRV. Missing data
  shows as "—" (textEmpty), NEVER a fake 0 — honesty about gaps is a core principle.
- **Security:** Claude API key is server-side (health-mcp proxy), never in the app bundle.
  Rate limits + tiers enforced on the SERVER, not the client.

### 2.1 APPLE DEVELOPER ACCOUNT + LEGAL ENTITY (decided 2026-07-21)

- **Individual enrollment was REJECTED.** Apple Developer Support (case 102940609523) gave
  no reason — "for one or more reasons, your enrollment couldn't be completed." Attempted on
  the founder's personal Apple ID. This remains UNRESOLVED; the path below routes around it
  rather than fixing it.
- **Path taken: Organization enrollment via 1Eritood OÜ** — an existing company belonging to
  Jost Sisask. No new company needed now, which avoids a ~4-week D-U-N-S wait.
- **D-U-N-S: 536399495.** Already existed — the long pole disappeared. Legal name as held by
  D&B is **"1Eritood OU"** — ASCII, no diacritics, "OU" not "OÜ". Must be entered EXACTLY
  this way; do not "correct" it, it has to match the D&B record.
- **Account Holder = Jost** (Apple verifies legal authority to bind the entity; he is the
  registered representative). **Heigo = Admin.** Apple ID for the account holder:
  `dev@suund.app`, created under Jost's identity, 2FA on, Jost's trusted phone number.
- **Consequence to plan around:** only the Account Holder can accept Apple agreements
  (Paid Applications Agreement and every update Apple pushes), manage banking/tax, and apply
  to the 15% small-business program. Releases can stall waiting on Jost. Day-to-day work
  (builds, TestFlight, App Store Connect, versions) runs fine from the Admin seat.
- **Company website for enrollment:** 1eritood.ee. Apple often phones the entity's public
  number to verify — an unanswered call delays review by weeks.
- **Ownership:** app and revenue legally sit with 1Eritood OÜ. Arrangement with Jost is
  settled between them; he is on paper, Heigo does all the work.
- **Future: Suund OÜ.** When money starts moving, register it (OÜ, not UÜ). A second entity
  CANNOT be added to the existing Apple account — it needs its **own D-U-N-S (start that
  4-week clock the day the company is registered), its own $99 enrollment, then an app
  transfer** from 1Eritood. Transfer requires at least one released version and the receiving
  account to have accepted the agreements.

### 2.2 DOMAIN, EMAIL, HOSTING (decided 2026-07-21)

- **Domain + email at Namecheap. Website hosted elsewhere.** Deliberate split.
- **Email: Namecheap Private Email**, mailbox `dev@suund.app`, IMAP into Outlook (Mac +
  phone). ~$12–24/yr vs €100/yr at Zone. SPF and DKIM pass; DMARC `p=none` added.
  Note: this mailbox is the identity anchor for the Apple developer account — whoever holds
  it can reset the account. Namecheap account 2FA is enabled.
- **Website: Lovable → GitHub → Cloudflare Pages**, pointed by CNAME. **DNS stays at
  Namecheap**, so MX/SPF/DKIM/DMARC are untouched and email can't break. Free, auto-deploys
  on push, no commercial-use restriction.
- **Rejected:** Vercel Hobby (prohibits commercial use — a paid app violates it on day one);
  Lovable's own custom domain (requires Pro, $25/mo ≈ $300/yr); Namecheap shared hosting
  (works, but every change is a manual export + FTP upload, plus .htaccess SPA rewrites).
- **Trap to remember:** if DNS ever moves to Cloudflare, MX/SPF/DKIM/DMARC must move with it
  or email dies the moment the site goes live.
- **Later:** bulk/marketing email (the lead-magnet list) must NOT be sent from the main
  domain or this mailbox — separate subdomain + a real sending service, or the domain's
  reputation takes normal mail down with it.

### 2.3 PRODUCT ARCHITECTURE + HABITS DESIGN (decided 2026-07-22)

**Input/output backbone — the whole app is one loop:**
inputs (what you DO — training, habits) → outputs (how the body RESPONDS — measured HRV/RHR/
sleep + subjective mood/energy) → Claude reasons whether they match → recommendation → you
adjust inputs. The loop closed in one app IS the moat sentence made literal.
- INPUT = things you do / that happen to you. Must be loggable (event/quantity). Subjective,
  unmeasurable things are NOT valid inputs.
- OUTPUT = the body's response. MAY be subjective (mood, energy) — output is the target you
  move, not a driver.

**Tabs: Data · Training · Habits · Analysis** (settings = a gear icon, not a tab). Replaces the
old 5-tab Home/Trends/Training/Habits/Profile.
- **Landing = Analysis.** Open the app, immediately get the "why" — differentiator up front
  (rivals lead with data = commodity). The morning verdict is computed ONCE after the overnight
  sync and CACHED, so every open that day shows it instantly, zero extra API call/latency. (The
  3/day free limit is for interactive questions, not this daily summary.)
- **Data = pure vitals** (HRV, RHR, sleep, steps + macros from Health). Fastest place to see
  HRV — you open Suund, not Apple Health. NO mini Claude summary here (kept pure and instant).
- Old "Trends" tab folds into Analysis + per-block archives.

**Two summary levels:**
- Block summary (PULL) = your data archive per block, filterable (time, count, period). Base
  view = calendar heatmap (Oura/GitHub style, shade = amount); rings/timeline secondary. Streaks
  MAY show but are NOT the core — diary, not scoreboard, no streak-shaming.
- Global verdict (PUSH) = Analysis tab: the cached daily "why" + recommendation, thorough.

**Usability north-star (the anti-WP law):** self-evident, zero manual. A 15-year-old opens the
app and instantly knows what to do. Every screen must pass "can a novice tell what to do here in
3 seconds?" WP failed exactly here.

**HABITS — full design:**
- **Curated predefined library; user activates only their subset.** NOT a free-text "add any
  habit" box (breaks Claude's reasoning — it can correlate alcohol→HRV because it knows what
  alcohol is; it can't reason about "violin practice"). Free-text custom = v2. Library may be
  broad (breadth is cheap: filter = "affects output + Claude-legible", NOT popularity) as long
  as every item passes the filter; the user's screen stays lean. Onboarding shows the common
  few, "more" reveals the rest (avoid choice overload).
- **Progressive precision:** the FACT is required (tap = it happened), DEPTH is optional
  (quantity, dose, bucket, note). Lazy user taps; aware user adds detail. Same app, user picks
  depth. Base fact-correlations are always solid; depth-correlations are as good as the user's
  detail — Claude works with what's there, shows "—" for gaps.
- **Enter-once-becomes-default:** anything stable (dose, typical quantity, bucket, stack
  membership) is set ONCE and auto-applied — daily logging is one tap. Separates CONFIG (rare,
  detailed) from LOG (daily, instant). Aware user front-loads detail at setup → logs as fast as
  the lazy user. Quantity is never daily friction.
- **Two-tier interaction:** tap = log the default/fact; long-press/expand = adjust quantity/
  time/deselect. One tap for the common case, expand for the exception.
- **Time = 4 coarse buckets** (morning / noon / evening / late-night), NOT minute timestamps.
  Default bucket = current time. Late-night exists because it's the highest-impact window for
  sleep (alcohol at 23:00 ≠ 19:00).
- **Habit TYPES (the config skeleton — each library item declares its type; the logging method
  comes free from the type):**
  - Event + quantity + bucket: alcohol, sex, sauna, cold plunge, late/heavy meal, meditation.
  - Load (daily dose + "last use" bucket): nicotine, caffeine. Timing signal = when the LAST one
    was (near bedtime?), auto-derived from the last log time or one pick. No per-event tap.
  - Category event: recreational drugs by class — stimulants / depressants-sedatives /
    psychedelics / cannabis. Logged as used + class + when (+ optional intensity), not a count.
  - Stack (bundle, one-tap, editable membership, time-bucketed): supplements + medications. User
    builds named stacks (Morning/Evening/Meds); one tap logs all active items; dose lives in the
    item definition (set once); toggle an item inactive when it runs out; expand to skip one tonight.
  - Context flag: illness — Claude must know so it doesn't misread an HRV drop.
- **v1 habit list:** alcohol, nicotine, caffeine, sex, meditation, sauna, cold plunge, late/heavy
  meal, illness, medications+supplements (stacks), recreational drugs (by class).
- **Mood + energy = subjective OUTPUTS, not habits** — a quick "how do you feel" check-in on the
  output side, correlated against measured outputs; divergence (HRV says recovered but you feel
  drained) is its own insight.
- **Dropped:** stress (subjective + ambiguous — both driver and response), hydration (weak/noisy).
- Sensitive data (drugs) must stay private — NEVER in community/sharing features; keep framing
  clinically neutral for App Store review.

**EATING — no logger; macros ride in via Apple Health (decided 2026-07-22).**
- Suund does NOT build a food logger and does NOT integrate MFP's API (private, approval-gated,
  paid — a third gatekeeper after Terra + Apple; avoid). Instead READ nutrition from Apple Health,
  which MFP or any food app writes to.
- The Health sync is lossy (no meal timestamps, no caffeine, one-directional) — but the losses
  don't bite: timing + caffeine come from Habits; Health gives daily macro totals, exactly what's
  needed.
- Macros' job = "are you eating ENOUGH for your training load?" (under-eating vs load → poor
  recovery), NOT calorie obsession. Needs a one-time profile (weight/height/age/goal) to compute
  the target; load comes from workouts.
- Only works if the user logs food elsewhere; else "—" (honest gap). A bonus layer for
  food-trackers, not universal. Appears in Data (a vital) + Analysis (adequacy verdict). NOT a tab.

**BLOODWORK — v2.** Infrequent, point-in-time, many markers = a slow measured OUTPUT, not a daily
input. Input via photo/PDF of the lab report → Claude extracts markers (NOT manual entry of 40
values; Apple Health labs unreliable in EE/EU). Lives as a section under Data (latest panel +
trend), Analysis references it for depth. Periodic depth + trend across tests, NOT daily
correlation (too sparse/slow). Needs "informational, not medical advice" framing (liability +
Apple review). Not core to the daily loop — v2 if/when needed.

**TRAINING — read-only LOAD from Apple Health (revised 2026-07-22).**
- Do NOT build a workout logger and do NOT build the plan/generator (same lesson as Eating/MFP:
  Strong & Hevy are entrenched; a logger = double-logging = the friction users reject). Web
  plan-generator dropped from v1 (maybe a marketing lead-magnet later).
- Apple Health carries training LOAD only (workout type, duration, calories, HR) — NOT set/rep/
  weight (HealthKit has no schema for it; Strong/Hevy sync summary only). That's fine: the thesis
  needs LOAD (affects recovery + eating adequacy), not set-level progression (Strong/Hevy's job).
- Suund out-REASONS Strong/Hevy (load × HRV × sleep × habits × nutrition), doesn't out-log them.
- Training tab STAYS but is light/read-only: load + trend from Health. No logging, no plan.

**LACTATE — v1, manual measured marker (decided 2026-07-22).**
- A manually-entered measured marker (like HRV/bloodwork), NOT a behavioral input — no wearable
  measures blood lactate; you enter the mmol/L value. Technically trivial (a number field).
- 3-point protocol, all optional (log whichever you took): (1) right after a KEY session =
  session metabolic load; (2) after recovery time = clearance (fitness/recovery); (3) morning =
  resting baseline / readiness. Measure around ONE key session/day (not every workout).
- Each value carries context or it's meaningless (5 mmol after an easy jog ≠ after intervals):
  slot tag; post-training auto-links to that session's intensity (from Health); post-recovery
  carries time-since-effort (default); morning must be consistent (fasted/rest).
- Lives: Data (values + trend per slot) → Analysis interprets (morning trend = recovery; clearance
  = fitness; post-training = session response). v1 BUILD-scope; still Pro-tier-gated (build ≠ tier).

---

## 3. FUNCTIONALITY BY SCREEN

**Guiding principle:** one screen answers one question — "what do I do here?" If there's more than
one answer, split it. Self-evident, zero manual (see 2.3 north-star). WP's mistake: every screen
doing five things at once.

Tabs (revised 2026-07-22, detail in 2.3): **Data · Training · Habits · Analysis** + settings gear.

### Data (rebuild — was "Home")
- Pure vitals, synced: HRV, RHR, sleep, steps, calories + macros (from Health).
- Manual measured markers live here too: lactate (v1, 3-point) + bloodwork (v2). Values + trends.
- Fastest place to see HRV — sync is a button, "sync + show me now" instant. No Claude summary here.

### Analysis (LANDING page, designing next after Training)
- The cached daily "why" + recommendation — the hero. Global verdict tying inputs → outputs
  (measured + subjective), incl. training-load and eating-adequacy assessment.
- Deep archives / correlation views live here too. Detail TBD.

### Training (revised 2026-07-22 — read-only load, see 2.3)
- Light, read-only: training LOAD from Apple Health (workout type, duration, calories, HR) + trend.
- NO workout logger, NO plan/generator (don't double-log vs Strong/Hevy; Suund out-reasons them).
- Feeds Analysis: load → recovery, and eating-adequacy vs load.

### Habits (DESIGNED 2026-07-22 — full spec in 2.3)
- Curated library, progressive precision, enter-once-default, two-tier tap, 4 time buckets, habit
  types (event / load / category / stack / flag), v1 list. Mood/energy moved to output.

### Settings (gear icon, not a tab)
- Connected devices, language, subscription, profile (weight/height/age/goal for eating target).
  Not designed in detail.

---

## 4. BUILD ORDER (what blocks what)

Done: Etapp 0 (setup, both machines) · Etapp 1 (OW + MCP + Claude, real data) ·
Backend proxy (key server-side, rate limits) · Domain/email infrastructure (2026-07-21).

NEXT:
1. Product design per block: Habits · Training · Lactate ✓ (2026-07-22) → Analysis → Data + onboarding.
2. Structure: design system (theme/tokens.ts, locked dark palette) + i18n — BEFORE building more
   screens. Build ON the design system from day one (don't style throwaway, then redo).
3. Habits + Training log — build EARLY: they generate the data Analysis later needs.
   Each day without them = data lost forever. Must be best-in-class per layer.
4. Analysis (cached daily verdict) + per-block archives/heatmaps. Correlations later (real data).
5. Apple Health sync — vitals + macros (founder's Apple Watch; only works on real device, not
   browser). NOT blocked by the Apple account: Xcode free provisioning installs to your own
   device (cert refreshes every 7 days), enough to test Health sync.
6. TestFlight — waiting on Organization enrollment review (days to ~2 weeks). A viable path is
   in motion.
7. Visual polish pass ("visu") — micro-layout, animation, refinement AFTER functional build,
   ON the design system (not a rebuild).

APP STORE (not TestFlight) prerequisites, plan ahead:
- User accounts (app currently reads OW's "first user" = founder's own).
- Payments: RevenueCat, server knows the tier.
These block App Store, NOT TestFlight.

Why order matters: log-layers early (irreplaceable data), correlations late (need that data).
**Items 1–5 are not blocked by Apple.** Don't idle waiting on the enrollment review.

---

## 5. OPEN QUESTIONS

- RESOLVED (2026-07-22): habit logging = two-tier tap + 4 buckets + enter-once defaults (see 2.3);
  custom free-text habits = v2. Training = read-only load from Health, no logger (speed-vs-context
  moot — we don't build a logger). Lactate = v1 manual, 3-point protocol.
- **Pricing tiers (Free/Plus/Pro) need RE-DERIVATION** — the redesign (Eating-logger out, Training
  read-only, lactate v1, 4 tabs) changed what sits in each layer. Separate session, with community.
- Analysis + Data + onboarding screen detail — not designed yet (next design sessions before build).
- Eating adequacy UX — how "eating enough vs load" is shown; profile capture for the target.
- Bloodwork v2 — photo/PDF → Claude parse → Data section. Deferred.
- Community — NEXT PLANNING SESSION'S TOPIC. Involving people, comparing data between users,
  leaderboards, sharing counters/streaks. This is the moat, needs its own strategy discussion.
  Privacy model for shared data (Apple is strict). Public vs private.
- Web training-plan generator on suund.app as free lead magnet -> email capture -> app.
- Onboarding flow — first impression, not designed.
- B2B angle (sports clubs, corporate wellness, trainers) — interesting, better revenue/client
  than B2C, not current focus.
- **When to form Suund OÜ and transfer the app.** Trigger is "money starts moving," but the
  D-U-N-S clock is ~4 weeks and app transfer needs a released version — so the decision has
  to be made earlier than the trigger suggests.
- **Founder's own Apple identity.** The Individual rejection is unresolved. If the brand is
  the moat and the brand is Heigo, the account eventually needs to sit under his own entity.

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
- **2026-07-21** — Apple Individual enrollment rejected; pivoted to Organization enrollment
  via 1Eritood OÜ. D-U-N-S 536399495 found (existing, no 4-week wait). Namecheap Private
  Email set up: dev@suund.app live, IMAP on Mac + phone, SPF/DKIM pass, DMARC p=none, account
  2FA on. Hosting decided: Cloudflare Pages via Lovable→GitHub, DNS stays at Namecheap.
  Vercel and Lovable-hosting rejected on cost/terms.
- **2026-07-22** — v1 product design session (planning). Locked the input/output backbone +
  daily loop; 4 tabs (Data · Training · Habits · Analysis, settings = gear icon); landing =
  Analysis (cached daily verdict). Full Habits design: curated library, progressive precision,
  enter-once defaults, two-tier tap, 4 time buckets, habit types (event/load/category/stack/
  flag), v1 list; mood/energy reclassified as OUTPUTS; stress + hydration dropped. Eating =
  no logger, macros read via Apple Health (MFP-populated), job = adequacy vs training load.
  Bloodwork deferred to v2 (photo/PDF → Claude parse). Full spec in §2.3. Apple: founder to do
  Organization enrollment at home with Jost (checklist prepared).
  Training designed: read-only LOAD from Apple Health, NO workout logger, NO plan/generator (don't
  double-log vs Strong/Hevy — Suund out-reasons, doesn't out-log). Lactate promoted to v1 (manual
  measured marker, 3-point protocol: post-key-session / post-recovery / morning). Pricing tiers
  flagged for re-derivation. Build estimate: ~4–8 focused weeks to TestFlight-ready v1 (long poles:
  Habits, Apple Health native). NEXT: design Analysis + onboarding, then build (design system first).

---

## HOW THIS FILE STAYS ALIVE

- Lives in the **suund-app repo root**, synced to the claude.ai project from GitHub.
- Planning sessions (chat): decisions land here (Claude updates this file in the repo).
- Build sessions (Claude Code): /orient at start, /wrap at end maintain AGENTS.md (technical).
  /wrap's git commit sweeps up PROJECT.md changes too — no separate command needed.
- Two brains, clear split: PROJECT.md = what & why, AGENTS.md = how. Nothing lost if both current.
