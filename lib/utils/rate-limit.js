const map = new Map();

export function limit(ip, limit = 5, windowMs = 3_600_000) {
  const now = Date.now();
  const entry = map.get(ip);

  if (!entry || entry.expires < now) {
    map.set(ip, { count: 1, expires: now + windowMs });
    return true;
  }

  if (entry.count >= limit) return false;

  entry.count++;
  return true;
}