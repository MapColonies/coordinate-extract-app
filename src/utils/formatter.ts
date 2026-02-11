export const formatDate = (dateString: string, locale: string): string => {
  if (locale === 'he') {
    return new Date(dateString).toLocaleString('he-IL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } else {
    return new Date(dateString).toLocaleString();
  }
};
