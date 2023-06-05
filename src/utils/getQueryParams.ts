export default function getQueryParams<T = any>(search?: string) {
  const entries = new URLSearchParams(
    search ?? window.location.search
  ).entries();
  return Array.from(entries).reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {} as any) as T;
}
