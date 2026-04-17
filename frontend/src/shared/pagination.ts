export function getVisiblePages(currentPage: number, totalPages: number) {
  if (totalPages <= 0) {
    return [];
  }

  const start = Math.max(1, currentPage - 1);
  const end = Math.min(totalPages, currentPage + 1);
  const pages = new Set<number>([1, totalPages]);

  for (let page = start; page <= end; page += 1) {
    pages.add(page);
  }

  return [...pages].sort((left, right) => left - right);
}
