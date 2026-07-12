export type HealthProviderSource = 'openwearables' | 'healthkit' | 'mock';

export interface SleepData {
  date: string;
  durationHours: number;
  efficiencyPercent?: number;
  stages?: {
    awakeMinutes?: number;
    lightMinutes?: number;
    deepMinutes?: number;
    remMinutes?: number;
  };
  avgHeartRateBpm?: number;
  avgHrvRmssdMs?: number;
}

export interface ActivityData {
  date: string;
  steps: number;
  calories: number;
  activeMinutes: number;
  distanceMeters?: number;
}

export interface HeartData {
  date: string;
  hrvRmssdMs?: number;
  restingHeartRateBpm?: number;
  avgHeartRateBpm?: number;
}

export interface NutritionData {
  date: string;
  calories: number;
  proteinG?: number;
  carbsG?: number;
  fatG?: number;
}

export interface WorkoutData {
  id: string;
  date: string;
  name: string;
  durationMinutes: number;
  caloriesKcal?: number;
  notes?: string;
  exercise?: string;
  sets?: number;
  reps?: number;
  weightKg?: number;
  rpe?: number;
}

export interface HealthDashboardSnapshot {
  source: HealthProviderSource;
  isFallback: boolean;
  error?: string;
  sleep: SleepData[];
  activity: ActivityData[];
  heart: HeartData[];
  nutrition: NutritionData[];
  workouts: WorkoutData[];
}

export interface HealthProviderService {
  getDashboardData(days: number): Promise<HealthDashboardSnapshot>;
  getSleepData(days: number): Promise<SleepData[]>;
  getActivityData(days: number): Promise<ActivityData[]>;
  getHeartData(days: number): Promise<HeartData[]>;
  getNutritionData(days: number): Promise<NutritionData[]>;
  getWorkouts(days: number): Promise<WorkoutData[]>;
}

export interface HealthProviderConfig {
  source: HealthProviderSource;
  baseUrl?: string;
  apiKey?: string;
  userId?: string;
}

export const DEFAULT_PROVIDER_SOURCE: HealthProviderSource =
  (readEnv('EXPO_PUBLIC_HEALTH_PROVIDER') as HealthProviderSource | undefined) ?? 'openwearables';

function getHealthProviderConfig(): HealthProviderConfig {
  const baseUrl = readEnv('EXPO_PUBLIC_OPEN_WEARABLES_BASE_URL') ?? 'https://backend-production-21d7.up.railway.app';
  const isWeb = typeof window !== 'undefined' && typeof window.location !== 'undefined';
  const proxyBaseUrl = isWeb ? 'http://localhost:3001' : baseUrl;

  return {
    source: DEFAULT_PROVIDER_SOURCE,
    baseUrl: proxyBaseUrl,
    apiKey: readEnv('EXPO_PUBLIC_OPEN_WEARABLES_API_KEY'),
    userId: readEnv('EXPO_PUBLIC_OPEN_WEARABLES_USER_ID'),
  };
}

export function createHealthProvider(source: HealthProviderSource = DEFAULT_PROVIDER_SOURCE): HealthProviderService {
  if (source === 'healthkit') {
    return createHealthKitProvider();
  }

  if (source === 'mock') {
    return createMockProvider();
  }

  return createOpenWearablesProvider();
}

function createOpenWearablesProvider(): HealthProviderService {
  return {
    getDashboardData: async (days) => {
      const config = getHealthProviderConfig();
      if (!config.apiKey) {
        return createMockSnapshot(days, true, 'Open Wearables API key not configured.');
      }

      try {
        const resolvedUserId = config.userId ?? (await resolveOpenWearablesUserId(config));
        if (!resolvedUserId) {
          return createMockSnapshot(days, true, 'No Open Wearables user found for this API key.');
        }

        const [sleep, activity, heart, workouts] = await Promise.all([
          fetchOpenWearablesSleep(days, resolvedUserId, config),
          fetchOpenWearablesActivity(days, resolvedUserId, config),
          fetchOpenWearablesHeart(days, resolvedUserId, config),
          fetchOpenWearablesWorkouts(days, resolvedUserId, config),
        ]);

        return {
          source: 'openwearables',
          isFallback: false,
          sleep,
          activity,
          heart,
          nutrition: [],
          workouts,
        };
      } catch (error) {
        console.warn('Open Wearables fetch failed, falling back to mock data.', error);
        return createMockSnapshot(days, true, error instanceof Error ? error.message : 'Unable to reach Open Wearables.');
      }
    },
    getSleepData: async (days) => {
      const snapshot = await createOpenWearablesProvider().getDashboardData(days);
      return snapshot.sleep;
    },
    getActivityData: async (days) => {
      const snapshot = await createOpenWearablesProvider().getDashboardData(days);
      return snapshot.activity;
    },
    getHeartData: async (days) => {
      const snapshot = await createOpenWearablesProvider().getDashboardData(days);
      return snapshot.heart;
    },
    getNutritionData: async (days) => {
      const snapshot = await createOpenWearablesProvider().getDashboardData(days);
      return snapshot.nutrition;
    },
    getWorkouts: async (days) => {
      const snapshot = await createOpenWearablesProvider().getDashboardData(days);
      return snapshot.workouts;
    },
  };
}

function createHealthKitProvider(): HealthProviderService {
  return {
    getDashboardData: async (days) => createMockSnapshot(days, true, 'Apple Health sync is not wired yet. Showing mock data.'),
    getSleepData: async (days) => createMockSnapshot(days, true).sleep,
    getActivityData: async (days) => createMockSnapshot(days, true).activity,
    getHeartData: async (days) => createMockSnapshot(days, true).heart,
    getNutritionData: async (days) => createMockSnapshot(days, true).nutrition,
    getWorkouts: async (days) => createMockSnapshot(days, true).workouts,
  };
}

function createMockProvider(): HealthProviderService {
  return {
    getDashboardData: async (days) => createMockSnapshot(days, true, 'Using mock data for local development.'),
    getSleepData: async (days) => createMockSnapshot(days, true).sleep,
    getActivityData: async (days) => createMockSnapshot(days, true).activity,
    getHeartData: async (days) => createMockSnapshot(days, true).heart,
    getNutritionData: async (days) => createMockSnapshot(days, true).nutrition,
    getWorkouts: async (days) => createMockSnapshot(days, true).workouts,
  };
}

async function fetchOpenWearablesSleep(days: number, userId?: string, config: HealthProviderConfig = getHealthProviderConfig()): Promise<SleepData[]> {
  const range = createDateRange(days);
  const resolvedUserId = userId ?? config.userId;
  if (!resolvedUserId) {
    return [];
  }

  const url = `${config.baseUrl}/api/v1/users/${resolvedUserId}/summaries/sleep?start_date=${range.start}&end_date=${range.end}&limit=100`;
  const payload = await fetchJson<OpenWearablesPaginatedResponse<OpenWearablesSleepSummary>>(url, config);
  return (payload.data ?? []).map((entry) => ({
    date: getDateString(entry.date),
    durationHours: (asNumber(entry.total_duration_minutes) ?? asNumber(entry.duration_minutes) ?? 0) / 60,
    efficiencyPercent: asNumber(entry.efficiency_percent),
    stages: {
      awakeMinutes: asNumber(entry.stages?.awake_minutes),
      lightMinutes: asNumber(entry.stages?.light_minutes),
      deepMinutes: asNumber(entry.stages?.deep_minutes),
      remMinutes: asNumber(entry.stages?.rem_minutes),
    },
    avgHeartRateBpm: asNumber(entry.avg_heart_rate_bpm),
    avgHrvRmssdMs: asNumber(entry.avg_hrv_rmssd_ms),
  }));
}

async function fetchOpenWearablesActivity(days: number, userId?: string, config: HealthProviderConfig = getHealthProviderConfig()): Promise<ActivityData[]> {
  const range = createDateRange(days);
  const resolvedUserId = userId ?? config.userId;
  if (!resolvedUserId) {
    return [];
  }

  const url = `${config.baseUrl}/api/v1/users/${resolvedUserId}/summaries/activity?start_date=${range.start}&end_date=${range.end}&limit=100&sort_order=asc`;
  const payload = await fetchJson<OpenWearablesPaginatedResponse<OpenWearablesActivitySummary>>(url, config);
  return (payload.data ?? []).map((entry) => ({
    date: getDateString(entry.date),
    steps: asNumber(entry.steps) ?? 0,
    calories: asNumber(entry.total_calories_kcal) ?? asNumber(entry.active_calories_kcal) ?? 0,
    activeMinutes: asNumber(entry.active_minutes) ?? 0,
    distanceMeters: asNumber(entry.distance_meters),
  }));
}

async function fetchOpenWearablesHeart(days: number, userId?: string, config: HealthProviderConfig = getHealthProviderConfig()): Promise<HeartData[]> {
  const [sleep, activity] = await Promise.all([fetchOpenWearablesSleep(days, userId, config), fetchOpenWearablesActivity(days, userId, config)]);
  return sleep.map((entry) => ({
    date: entry.date,
    hrvRmssdMs: entry.avgHrvRmssdMs,
    restingHeartRateBpm: entry.avgHeartRateBpm,
    avgHeartRateBpm: activity.find((item) => item.date === entry.date)?.steps ? undefined : undefined,
  }));
}

async function fetchOpenWearablesWorkouts(days: number, userId?: string, config: HealthProviderConfig = getHealthProviderConfig()): Promise<WorkoutData[]> {
  const range = createDateRange(days);
  const resolvedUserId = userId ?? config.userId;
  if (!resolvedUserId) {
    return [];
  }

  const url = `${config.baseUrl}/api/v1/users/${resolvedUserId}/events/workouts?start_date=${range.start}&end_date=${range.end}&limit=100`;
  const payload = await fetchJson<OpenWearablesPaginatedResponse<OpenWearablesWorkout>>(url, config);
  return (payload.data ?? []).map((entry, index) => ({
    id: entry.id ?? `workout-${index}`,
    date: getDateString(entry.start_time),
    name: entry.name ?? entry.type ?? 'Workout',
    durationMinutes: Math.max(1, Math.round((asNumber(entry.duration_seconds) ?? 0) / 60)),
    caloriesKcal: asNumber(entry.calories_kcal),
    notes: entry.notes,
  }));
}

function createMockSnapshot(days: number, isFallback: boolean, error?: string): HealthDashboardSnapshot {
  const items = Array.from({ length: Math.max(days, 7) }, (_, index) => {
    const dateOffset = days - index - 1;
    const date = new Date();
    date.setDate(date.getDate() - dateOffset);
    return formatDate(date);
  });

  return {
    source: 'mock',
    isFallback,
    error,
    sleep: items.map((date, index) => ({
      date,
      durationHours: 7.1 + (index % 3) * 0.2,
      efficiencyPercent: 91 + (index % 4),
      stages: {
        awakeMinutes: 25,
        lightMinutes: 420,
        deepMinutes: 60,
        remMinutes: 90,
      },
      avgHeartRateBpm: 62,
      avgHrvRmssdMs: 63 + index,
    })),
    activity: items.map((date, index) => ({
      date,
      steps: 8500 + index * 250,
      calories: 2100 + index * 40,
      activeMinutes: 35 + index,
      distanceMeters: 6200 + index * 180,
    })),
    heart: items.map((date, index) => ({
      date,
      hrvRmssdMs: 65 + index,
      restingHeartRateBpm: 61 + (index % 2),
      avgHeartRateBpm: 74 + index,
    })),
    nutrition: items.map((date) => ({
      date,
      calories: 1950,
      proteinG: 100,
      carbsG: 220,
      fatG: 70,
    })),
    workouts: [
      {
        id: 'sample-workout',
        date: items[items.length - 1],
        name: 'Tempo Run',
        durationMinutes: 35,
        caloriesKcal: 420,
        rpe: 7,
        sets: 1,
        reps: 1,
        weightKg: 0,
      },
    ],
  };
}

function createDateRange(days: number) {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - Math.max(days - 1, 6));
  return {
    start: formatDate(start),
    end: formatDate(end),
  };
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getDateString(value: string | undefined) {
  return value?.slice(0, 10) ?? formatDate(new Date());
}

async function fetchJson<T>(url: string, config: HealthProviderConfig = getHealthProviderConfig(), init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: 'application/json',
      'X-Open-Wearables-API-Key': config.apiKey ?? '',
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Request to ${url} failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

async function resolveOpenWearablesUserId(config: HealthProviderConfig = getHealthProviderConfig()): Promise<string | undefined> {
  const url = `${config.baseUrl}/api/v1/users?limit=5`;
  const payload = await fetchJson<OpenWearablesUsersResponse>(url, config);
  return payload.items?.[0]?.id;
}

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
    if (candidate?.trim()) {
      return candidate.trim();
    }
  }

  return undefined;
}

function asNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return undefined;
}

interface OpenWearablesPaginatedResponse<T> {
  data?: T[];
}

interface OpenWearablesUsersResponse {
  items?: Array<{
    id?: string;
  }>;
}

interface OpenWearablesSleepSummary {
  date?: string;
  total_duration_minutes?: number;
  duration_minutes?: number;
  efficiency_percent?: number;
  stages?: {
    awake_minutes?: number;
    light_minutes?: number;
    deep_minutes?: number;
    rem_minutes?: number;
  };
  avg_heart_rate_bpm?: number;
  avg_hrv_rmssd_ms?: number;
}

interface OpenWearablesActivitySummary {
  date?: string;
  steps?: number;
  distance_meters?: number;
  active_calories_kcal?: number;
  total_calories_kcal?: number;
  active_minutes?: number;
}

interface OpenWearablesWorkout {
  id?: string;
  name?: string;
  type?: string;
  notes?: string;
  start_time?: string;
  duration_seconds?: number;
  calories_kcal?: number;
}
