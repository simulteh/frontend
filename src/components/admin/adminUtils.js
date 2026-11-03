// Общие подписи и форматирование для админ-панели

export const STATUS_LABELS = {
  PENDING: 'На рассмотрении',
  APPROVED: 'Одобрена',
  REJECTED: 'Отклонена'
};

export const STATUS_FILTERS = [
  { value: 'PENDING', label: 'На рассмотрении' },
  { value: 'APPROVED', label: 'Одобренные' },
  { value: 'REJECTED', label: 'Отклонённые' },
  { value: '', label: 'Все' }
];

export const REQUEST_TYPE_LABELS = {
  STUDENT: 'Студент',
  TEACHER: 'Преподаватель'
};

export const formatDate = (iso) => {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Скачать текст файлом (например, ключи лицензий)
export const downloadText = (filename, text) => {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};
