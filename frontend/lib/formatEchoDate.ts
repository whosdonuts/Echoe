const fullDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

export function formatEchoFullDate(value: string | number | Date) {
  return fullDateFormatter.format(new Date(value));
}
