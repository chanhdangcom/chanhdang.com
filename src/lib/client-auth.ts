export function buildUserAuthHeaders(
  userId?: string,
  extraHeaders?: Record<string, string>
) {
  return {
    ...(extraHeaders ?? {}),
    ...(userId ? { Authorization: `Bearer ${userId}` } : {}),
  };
}
