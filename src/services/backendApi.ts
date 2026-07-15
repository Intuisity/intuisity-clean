const localBackendUrl = "http://localhost:4000";

function getBackendUrl() {
  const browserWindow = typeof globalThis !== "undefined" ? (globalThis as any).window : undefined;
  const hostname = browserWindow?.location?.hostname || "";

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return localBackendUrl;
  }

  return "";
}

type BackendAdminReport = {
  totalUsers: number;
  totalVisits: number;
  totalTimeMs: number;
  averageSessionMs: number;
  mostUsedModule: string;
  moduleSummaries: Array<{
    moduleId: string;
    moduleLabel: string;
    visits: number;
    totalMs: number;
    averageMs: number;
  }>;
  feedbackCount: number;
  averageRating: number;
  improvementResponses: Array<{ moduleLabel: string; note: string; rating: number; email: string; savedAt?: string }>;
  userInsights: Array<{
    name: string;
    email: string;
    phone?: string;
    language?: string;
    currentCity?: string;
    currentState?: string;
    currentCountry?: string;
    totalClicks: number;
    totalTimeMs: number;
    mostClickedModule: string;
    mostClickedCount: number;
    mostTimeModule: string;
    mostTimeMs: number;
    daysWithResults?: number;
    averageScorePercent?: number;
    averageRating?: number;
    commentCount?: number;
    savedFriendCount?: number;
    lastActiveAt?: string;
  }>;
};

const adminSecretStorageKey = "intuisity-admin-secret";

export function saveAdminSecret(secret: string) {
  try {
    globalThis.localStorage?.setItem(adminSecretStorageKey, secret.trim());
  } catch {
    // Admin reports can still be opened manually with the secret query string.
  }
}

export function loadAdminSecret() {
  try {
    return globalThis.localStorage?.getItem(adminSecretStorageKey) || "";
  } catch {
    return "";
  }
}

export function backendUserInsightsCsvUrl(adminSecret = loadAdminSecret()) {
  const encodedSecret = encodeURIComponent(adminSecret.trim());
  return `${getBackendUrl()}/api/admin/user-insights.csv${encodedSecret ? `?adminSecret=${encodedSecret}` : ""}`;
}

export function syncProfile(profile: unknown) {
  postToBackend("/api/profiles", { profile });
}

export function syncDailyAnswers(email: string, answers: Record<string, string>) {
  postToBackend("/api/daily-answers", { email, answers, date: getDateKey() });
}

export function syncDailyResult(
  email: string,
  modules: Array<{ label: string; score: number; maximum: number }>,
  total: number,
  maximum: number
) {
  postToBackend("/api/daily-results", { email, modules, total, maximum, date: getDateKey() });
}

export function syncModuleTime(event: {
  email: string;
  moduleId: string;
  moduleLabel: string;
  startedAt: string;
  durationMs: number;
  date: string;
}) {
  postToBackend("/api/analytics/module-time", event);
}

export function syncModuleFeedback(email: string, feedback: unknown) {
  postToBackend("/api/module-feedback", { email, feedback, savedAt: new Date().toISOString() });
}

export function syncFriends(email: string, friends: unknown) {
  postToBackend("/api/friends", { email, friends });
}

export async function sendFriendInviteEmail(invite: {
  friendEmail: string;
  friendName: string;
  senderName: string;
  note?: string;
  challengeUrl?: string;
}) {
  const response = await fetch("/api/send-friend-invite", {
    body: JSON.stringify(invite),
    headers: { "Content-Type": "application/json" },
    method: "POST"
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.message || error?.error || "Invite email could not be sent.");
  }

  return response.json();
}

export async function loadBackendAdminReport(adminSecret = loadAdminSecret()): Promise<BackendAdminReport | null> {
  try {
    const response = await fetch(`${getBackendUrl()}/api/admin/report`, {
      headers: adminSecret.trim() ? { "X-Intuisity-Admin-Secret": adminSecret.trim() } : undefined
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

function postToBackend(path: string, body: unknown) {
  fetch(`${getBackendUrl()}${path}`, {
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
    method: "POST"
  }).catch(() => {
    // The app keeps working with local storage when the backend is not running.
  });
}

function getDateKey() {
  const now = new Date();
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0")
  ].join("-");
}
