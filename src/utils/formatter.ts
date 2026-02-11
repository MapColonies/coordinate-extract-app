export const formatDate = (dateString: string, locale: string, isTextual: boolean = false): string => {
  if (locale === 'he') {
    return new Date(dateString).toLocaleString('he-IL', {
      day: '2-digit',
      month: isTextual ? 'short' : '2-digit',
      year: 'numeric'
    });
  } else {
    return new Date(dateString).toLocaleDateString();
  }
};
