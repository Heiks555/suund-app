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

let _cache: CacheEntry | null = null;

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

function buildUserMessage(snapshot: HealthDashboardSnapshot): string {
  const sleep = snapshot.sleep[0];
  const heart = snapshot.heart[0];
  const activity = snapshot.activity[0];

  const parts: string[] = [];

  if (sleep) {
    parts.push(`Uni: ${sleep.durationHours.toFixed(1)}h`);
    if (sleep.efficiencyPercent != null) {
      parts.push(`une efektiivsus: ${sleep.efficiencyPercent}%`);
    }
    if (sleep.stages?.deepMinutes != null) {
      parts.push(`sügav uni: ${sleep.stages.deepMinutes} min`);
    }
    if (sleep.stages?.remMinutes != null) {
      parts.push(`REM: ${sleep.stages.remMinutes} min`);
    }
  } else {
    parts.push('uneandmed puuduvad');
  }

  if (heart?.hrvRmssdMs != null) {
    parts.push(`HRV: ${heart.hrvRmssdMs.toFixed(0)} ms`);
  } else {
    parts.push('HRV andmed puuduvad');
  }

  if (heart?.restingHeartRateBpm != null) {
    parts.push(`pulss puhkeolekus: ${heart.restingHeartRateBpm.toFixed(0)} lööki/min`);
  }

  if (activity?.steps != null) {
    parts.push(`sammud tänaseni: ${activity.steps.toLocaleString()}`);
  }

  if (activity?.activeMinutes != null) {
    parts.push(`aktiivne aeg: ${activity.activeMinutes} min`);
  }

  return parts.join('; ');
}

const SYSTEM_PROMPT = `Sa oled tervisnõustaja. Anna lühike hommikukokkuvõte kasutaja terviseandmete põhjal.

Reeglid:
- Ole otsekohene ja aus – mitte üldjuhul innustav. Kui andmed on halvad, ütle seda selgelt.
- Anna üks konkreetne tegevussoovitus tänaseks (näiteks: treeni kergelt, mine vara magama, joo rohkem vett). Mitte üldine nõuanne.
- Kokku maksimaalselt 3–4 lauset.
- Viimane rida PEAB algama täpselt nii: "Märksõnad:" ja sisaldama 2–3 lühikest märksõna komaga eraldatult (nt "Märksõnad: Unevõlg 1.2h, Treeni kergelt, HRV madal").
- Kui andmeid pole, tunnista seda ausalt – ära leiuta numbreid.
- Vasta AINULT eesti keeles.`;

export async function getMorningSummary(snapshot: HealthDashboardSnapshot): Promise<ClaudeAnalysis> {
  const apiKey = readEnv('EXPO_PUBLIC_ANTHROPIC_API_KEY');
  if (!apiKey) {
    throw new Error('EXPO_PUBLIC_ANTHROPIC_API_KEY on seadistamata.');
  }

  const snapshotKey = buildSnapshotKey(snapshot);

  if (
    _cache &&
    _cache.snapshotKey === snapshotKey &&
    Date.now() - _cache.timestamp < CACHE_TTL_MS
  ) {
    return _cache.analysis;
  }

  const userMessage = buildUserMessage(snapshot);

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 350,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Terviseandmed: ${userMessage}. Anna hommikukokkuvõte.`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Claude API viga ${response.status}${body ? `: ${body}` : ''}`);
  }

  const data = (await response.json()) as {
    content: Array<{ type: string; text: string }>;
  };

  const rawText = data.content.find((b) => b.type === 'text')?.text?.trim() ?? '';

  const lines = rawText.split('\n').filter((l) => l.trim().length > 0);

  let summary = rawText;
  let tags: string[] = [];

  const tagLineIndex = lines.findIndex((l) => l.startsWith('Märksõnad:'));
  if (tagLineIndex !== -1) {
    const tagLine = lines[tagLineIndex].replace('Märksõnad:', '').trim();
    tags = tagLine
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    summary = lines.slice(0, tagLineIndex).join('\n').trim();
  }

  const analysis: ClaudeAnalysis = { summary, tags };
  _cache = { analysis, snapshotKey, timestamp: Date.now() };

  return analysis;
}
