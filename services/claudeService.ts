import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { HealthDashboardSnapshot } from './healthProvider';

export interface ClaudeAnalysis {
  summary: string;
  tags: string[];
}

interface CacheEntry {
  analysis: ClaudeAnalysis;
  snapshotKey: string;
  timestamp: number;
}

const CACHE_TTL_MS = 4 * 60 * 60 * 1000; // 4 hours
const DEVICE_ID_KEY = 'suund_device_id';
const DEFAULT_HEALTH_MCP_URL = 'https://health-mcp-production.up.railway.app';

let _cache: CacheEntry | null = null;
let _cachedDeviceId: string | null = null;

function readEnv(name: string): string | undefined {
  const candidates: Array<string | undefined> = [];

  if (typeof globalThis !== 'undefined') {
    const runtime = globalThis as typeof globalThis & {
      process?: { env?: Record<string, string | undefined> };
      __ENV__?: Record<string, string | undefined>;
    };
    candidates.push(runtime.process?.env?.[name]);
    candidates.push(runtime.__ENV__?.[name]);
  }

  if (typeof process !== 'undefined') {
    candidates.push(process.env?.[name]);
  }

  for (const candidate of candidates) {
    if (candidate?.trim()) return candidate.trim();
  }

  return undefined;
}

// Not cryptographically strong, and doesn't need to be — this only identifies a
// device for per-user rate limiting, not authentication.
function generateUuidV4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const rand = (Math.random() * 16) | 0;
    const value = char === 'x' ? rand : (rand & 0x3) | 0x8;
    return value.toString(16);
  });
}

// expo-secure-store has no native web implementation. Fall back to localStorage there
// so the web preview (used for local dev, see AGENTS.md) keeps working.
async function readPersistedDeviceId(): Promise<string | null> {
  if (Platform.OS === 'web') {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(DEVICE_ID_KEY);
  }
  return SecureStore.getItemAsync(DEVICE_ID_KEY);
}

async function persistDeviceId(id: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(DEVICE_ID_KEY, id);
    return;
  }
  await SecureStore.setItemAsync(DEVICE_ID_KEY, id);
}

async function getOrCreateDeviceId(): Promise<string> {
  if (_cachedDeviceId) return _cachedDeviceId;

  const existing = await readPersistedDeviceId();
  if (existing) {
    _cachedDeviceId = existing;
    return existing;
  }

  const created = generateUuidV4();
  await persistDeviceId(created);
  _cachedDeviceId = created;
  return created;
}

function buildSnapshotKey(snapshot: HealthDashboardSnapshot): string {
  const sleep = snapshot.sleep[0];
  const heart = snapshot.heart[0];
  const activity = snapshot.activity[0];
  return JSON.stringify({
    date: sleep?.date ?? heart?.date ?? activity?.date,
    sleep: sleep?.durationHours?.toFixed(1),
    hrv: heart?.hrvRmssdMs?.toFixed(0),
    rhr: heart?.restingHeartRateBpm?.toFixed(0),
    steps: activity?.steps,
  });
}

// Matches the shape health-mcp's /api/analyze expects (services/claudeProxy.js
// buildHealthContextLine there). The system prompt and Estonian phrasing now live
// server-side — this just forwards today's numbers.
function buildHealthDataPayload(snapshot: HealthDashboardSnapshot) {
  const sleep = snapshot.sleep[0];
  const heart = snapshot.heart[0];
  const activity = snapshot.activity[0];

  return {
    sleep: sleep
      ? {
          durationHours: sleep.durationHours,
          efficiencyPercent: sleep.efficiencyPercent,
          stages: sleep.stages
            ? { deepMinutes: sleep.stages.deepMinutes, remMinutes: sleep.stages.remMinutes }
            : undefined,
        }
      : undefined,
    heart: heart
      ? { hrvRmssdMs: heart.hrvRmssdMs, restingHeartRateBpm: heart.restingHeartRateBpm }
      : undefined,
    activity: activity
      ? { steps: activity.steps, activeMinutes: activity.activeMinutes }
      : undefined,
  };
}

export async function getMorningSummary(snapshot: HealthDashboardSnapshot): Promise<ClaudeAnalysis> {
  const appKey = readEnv('EXPO_PUBLIC_SUUND_APP_KEY');
  if (!appKey) {
    throw new Error('EXPO_PUBLIC_SUUND_APP_KEY on seadistamata.');
  }

  const baseUrl = readEnv('EXPO_PUBLIC_HEALTH_MCP_URL') ?? DEFAULT_HEALTH_MCP_URL;

  const snapshotKey = buildSnapshotKey(snapshot);

  if (
    _cache &&
    _cache.snapshotKey === snapshotKey &&
    Date.now() - _cache.timestamp < CACHE_TTL_MS
  ) {
    return _cache.analysis;
  }

  const deviceId = await getOrCreateDeviceId();
  const healthData = buildHealthDataPayload(snapshot);

  const response = await fetch(`${baseUrl}/api/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Suund-App-Key': appKey,
      'X-Suund-User-Id': deviceId,
    },
    body: JSON.stringify({ healthData }),
  });

  if (response.status === 429) {
    throw new Error('Oled tänase AI-küsimuste limiidi täis.');
  }

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Terviseanalüüsi päring ebaõnnestus (${response.status})${body ? `: ${body}` : ''}`);
  }

  const data = (await response.json()) as ClaudeAnalysis;
  const analysis: ClaudeAnalysis = { summary: data.summary, tags: data.tags ?? [] };

  _cache = { analysis, snapshotKey, timestamp: Date.now() };

  return analysis;
}
