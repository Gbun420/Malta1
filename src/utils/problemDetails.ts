// Helper function for RFC 7807 Problem Details
export const problemDetails = (status: number, type: string, title: string, detail: string, instance: string) => ({
  type,
  title,
  status,
  detail,
  instance,
});