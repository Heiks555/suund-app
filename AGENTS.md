# Suund — Expo app

Health AI app. Aggregates wearable + nutrition + training + habit data,
uses Claude as the reasoning layer to surface correlations and recommendations.

## Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

## Architecture

Open Wearables (self-hosted, Railway) is the data source. Two repos consume it:
- suund-app (this repo) — Expo/React Native, iOS first
- health-mcp (github.com/Heiks555/health-mcp) — MCP server for claude.ai

OW backend: https://backend-production-21d7.up.railway.app
OW replaces Terra ($5/mo self-hosted vs $499/mo SaaS).

## Layout

app/(tabs)/   Home, Trends, Training, Habits, Profile (expo-router)
services/     healthProvider.ts — ALL data access goes through here
contexts/     HealthDataContext — the only global state
components/   MetricCard, SimpleLineChart

## Non-negotiable rules

1. Provider abstraction stays swappable: 'openwearables' | 'healthkit' | 'mock'.
   Screens NEVER fetch directly. OW is early-stage; we must be able to swap it.
2. Habits are config-driven (array), never new screens. The list will grow.
3. Never hardcode secrets. Expo client env vars REQUIRE the EXPO_PUBLIC_ prefix
   or they are silently undefined.
4. Keep data types accurate — Claude's analysis quality depends on clean shapes.

## Known gotchas (do not rediscover)

- CORS on web preview: OW backend blocks localhost:8081 by default. Fix on the OW
  side: Railway → backend → Variables → CORS_ORIGINS must be a JSON array including
  the origin. Do NOT build a local proxy to work around it — one was found hardcoded
  in healthProvider.ts (web requests silently rewritten to http://localhost:3001,
  nothing listening there) and removed. It caused a connection failure that was
  swallowed and silently replaced with mock data — "Load failed" on screen was this,
  not a real OW error. If OW data ever looks like mock again, check for a proxy
  rewrite before assuming CORS_ORIGINS is wrong.
- Anthropic Messages API blocks direct browser fetches unless the request includes
  `anthropic-dangerous-direct-browser-access: true` (alongside x-api-key and
  anthropic-version). Missing it fails the CORS preflight with 400 "Disallowed CORS
  origin" — surfaces in-app as a generic "Load failed"/"Failed to fetch" with no
  HTTP status, not a normal API error response. Already fixed in claudeService.ts.
- To diagnose "Load failed" / CORS issues fast: replicate the exact request with
  curl (same Origin header, same API key, same path) against the real endpoint
  rather than guessing — an OPTIONS preflight instantly shows if origin/headers are
  disallowed, no browser needed.
- The `onPressIn` console warning from react-native-svg is web-only and cosmetic.
  Ignore it.
- Apple Health cannot be fetched server-side. HealthKit data lives on-device and
  reaches OW only via the app. Apple constraint, not a bug.

## Owner context

Solo founder, operations background, does not write code by hand. Claude Code writes;
the owner directs, tests, decides. Prefers large prompts that complete a whole chunk.
Explain what changed and why, not line-by-line diffs.

## Workflow

git pull before starting, git push when a chunk works. Two machines share this repo.
