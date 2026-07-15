const { supabaseRequest } = require("./_supabase");

async function buildAdminReport() {
  const [profiles, analyticsEvents, dailyResults, moduleFeedback, friends] = await Promise.all([
    selectAll("profiles"),
    selectAll("analytics_events"),
    selectAll("daily_results"),
    selectAll("module_feedback"),
    selectAll("friends")
  ]);

  const moduleTotals = new Map();
  analyticsEvents.forEach((event) => {
    const label = event.module_label || "Unknown area";
    const current = moduleTotals.get(label) || {
      moduleId: event.module_id || "",
      moduleLabel: label,
      visits: 0,
      totalMs: 0,
      averageMs: 0
    };
    current.visits += 1;
    current.totalMs += Number(event.duration_ms || 0);
    current.averageMs = Math.round(current.totalMs / current.visits);
    moduleTotals.set(label, current);
  });

  const moduleSummaries = [...moduleTotals.values()].sort((a, b) => b.totalMs - a.totalMs);
  const totalTimeMs = analyticsEvents.reduce((total, event) => total + Number(event.duration_ms || 0), 0);
  const ratings = moduleFeedback.filter((entry) => Number(entry.rating || 0));
  const ratingTotal = ratings.reduce((total, entry) => total + Number(entry.rating || 0), 0);
  const userInsights = buildUserInsights({ analyticsEvents, dailyResults, friends, moduleFeedback, profiles });

  return {
    totalUsers: profiles.length,
    totalVisits: analyticsEvents.length,
    totalTimeMs,
    averageSessionMs: analyticsEvents.length ? Math.round(totalTimeMs / analyticsEvents.length) : 0,
    mostUsedModule: moduleSummaries[0]?.moduleLabel || "No module activity yet",
    moduleSummaries,
    feedbackCount: ratings.length,
    averageRating: ratings.length ? Math.round((ratingTotal / ratings.length) * 10) / 10 : 0,
    improvementResponses: moduleFeedback
      .filter((entry) => entry.improvement)
      .sort((a, b) => new Date(b.saved_at || 0).getTime() - new Date(a.saved_at || 0).getTime())
      .slice(0, 50)
      .map((entry) => ({
        moduleLabel: entry.module_label,
        note: entry.improvement,
        rating: entry.rating,
        email: entry.email,
        savedAt: entry.saved_at
      })),
    userInsights
  };
}

async function buildUserInsightsCsv() {
  const report = await buildAdminReport();
  const headers = [
    "Name",
    "Email",
    "Phone",
    "Language",
    "Current City",
    "Current State",
    "Current Country",
    "Most Clicked Module",
    "Most Clicked Count",
    "Most Time Module",
    "Most Time",
    "Total Clicks",
    "Total Time",
    "Days With Results",
    "Average Score Percent",
    "Average Rating",
    "Comment Count",
    "Saved Friend Count",
    "Last Active"
  ];

  const lines = [
    headers,
    ...report.userInsights.map((row) => [
      row.name,
      row.email,
      row.phone,
      row.language,
      row.currentCity,
      row.currentState,
      row.currentCountry,
      row.mostClickedModule,
      row.mostClickedCount,
      row.mostTimeModule,
      formatDuration(row.mostTimeMs),
      row.totalClicks,
      formatDuration(row.totalTimeMs),
      row.daysWithResults,
      row.averageScorePercent,
      row.averageRating,
      row.commentCount,
      row.savedFriendCount,
      row.lastActiveAt || ""
    ])
  ];

  return lines.map((line) => line.map(escapeCsvValue).join(",")).join("\n");
}

function buildUserInsights({ analyticsEvents, dailyResults, friends, moduleFeedback, profiles }) {
  return profiles.map((profile) => {
    const email = profile.email;
    const events = analyticsEvents.filter((event) => event.email === email);
    const results = dailyResults.filter((entry) => entry.email === email);
    const feedback = moduleFeedback.filter((entry) => entry.email === email);
    const savedFriends = friends.find((entry) => entry.email === email);
    const moduleStats = new Map();

    events.forEach((event) => {
      const label = event.module_label || "Unknown area";
      const current = moduleStats.get(label) || { moduleLabel: label, clicks: 0, totalMs: 0 };
      current.clicks += 1;
      current.totalMs += Number(event.duration_ms || 0);
      moduleStats.set(label, current);
    });

    const sortedByClicks = [...moduleStats.values()].sort((a, b) => b.clicks - a.clicks || b.totalMs - a.totalMs);
    const sortedByTime = [...moduleStats.values()].sort((a, b) => b.totalMs - a.totalMs || b.clicks - a.clicks);
    const ratings = feedback.filter((entry) => Number(entry.rating || 0) > 0);
    const totalScore = results.reduce((sum, entry) => sum + Number(entry.total || 0), 0);
    const totalPossible = results.reduce((sum, entry) => sum + Number(entry.maximum || 0), 0);

    return {
      name: profile.name || "",
      email,
      phone: profile.phone || "",
      language: profile.language || "",
      currentCity: profile.current_city || "",
      currentState: profile.current_state || "",
      currentCountry: profile.current_country || "",
      totalClicks: events.length,
      totalTimeMs: events.reduce((sum, event) => sum + Number(event.duration_ms || 0), 0),
      mostClickedModule: sortedByClicks[0]?.moduleLabel || "No clicks yet",
      mostClickedCount: sortedByClicks[0]?.clicks || 0,
      mostTimeModule: sortedByTime[0]?.moduleLabel || "No time yet",
      mostTimeMs: sortedByTime[0]?.totalMs || 0,
      daysWithResults: results.length,
      averageScorePercent: totalPossible ? Math.round((totalScore / totalPossible) * 100) : 0,
      averageRating: ratings.length
        ? Math.round((ratings.reduce((sum, entry) => sum + Number(entry.rating || 0), 0) / ratings.length) * 10) / 10
        : 0,
      commentCount: feedback.filter((entry) => String(entry.improvement || "").trim()).length,
      savedFriendCount: Array.isArray(savedFriends?.friends) ? savedFriends.friends.length : 0,
      lastActiveAt: events.length
        ? events.map((event) => event.recorded_at || event.started_at).sort().at(-1)
        : profile.updated_at
    };
  }).sort((a, b) => new Date(b.lastActiveAt || 0).getTime() - new Date(a.lastActiveAt || 0).getTime());
}

function selectAll(table) {
  return supabaseRequest(`/${table}?select=*`);
}

function escapeCsvValue(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function formatDuration(milliseconds) {
  if (!milliseconds) return "0s";
  const totalSeconds = Math.max(1, Math.round(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes ? `${minutes}m ${seconds}s` : `${seconds}s`;
}

module.exports = {
  buildAdminReport,
  buildUserInsightsCsv
};
