export function normalizePhone(phone) {
  const cleaned = phone.trim().replace(/\s/g, '').replace(/-/g, '');

  if (cleaned.startsWith('+')) return cleaned;
  if (cleaned.startsWith('00')) return '+' + cleaned.slice(2);
  if (/^01\d{9}$/.test(cleaned)) return '+2' + cleaned;
  if (/^1\d{9}$/.test(cleaned)) return '+20' + cleaned;
  if (/^20\d{10}$/.test(cleaned)) return '+' + cleaned;

  return cleaned;
}

export function isValidPhone(phone) {
  const normalized = normalizePhone(phone);
  return /^\+\d{7,20}$/.test(normalized);
}