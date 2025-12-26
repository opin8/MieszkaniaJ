/**
 * Formatuje datę z formatu ISO (yyyy-mm-dd) na polski (dd-mm-yyyy)
 * Jeśli data jest pusta/null/undefined – zwraca "—"
 */
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "—";
  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`;
};