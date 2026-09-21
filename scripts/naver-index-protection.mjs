/** Pure helpers shared by the Naver index baseline updater and deploy gate. */
export function compareProtectedIndex(protectedUrls, currentUrls) {
  const current = new Set(currentUrls);
  const missing = [...new Set(protectedUrls)]
    .filter((url) => !current.has(url))
    .sort();

  return {
    ok: missing.length === 0,
    protectedCount: new Set(protectedUrls).size,
    currentCount: current.size,
    missing,
  };
}

export function mergeProtectedIndex(protectedUrls, currentUrls) {
  return [...new Set([...protectedUrls, ...currentUrls])].sort();
}
