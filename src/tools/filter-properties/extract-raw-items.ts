export function extractRawItems(data: any): any[] {
  return Array.isArray(data) ? data :
    data?.items ?? data?.data?.items ?? data?.results ??
    data?.properties ?? data?.listings ?? data?.records ?? [];
}
