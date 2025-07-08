function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function formatDateFromTimestamp(timestamp: string | undefined): string {

  if (!timestamp || typeof timestamp !== 'string' || timestamp.length < 14) {
    return ''
  }

  try {
    const year = timestamp.slice(0, 4)
    const month = timestamp.slice(4, 6)
    const day = timestamp.slice(6, 8)
    const hour = timestamp.slice(8, 10)
    const minute = timestamp.slice(10, 12)

    const date = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour),
      parseInt(minute)
    )

    // If date is invalid, return empty string
    if (isNaN(date.getTime())) return ''

    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date)

  } catch {
    return ''
  }
}

export function getDateObjectFromTimestamp(timestamp: string | undefined): Date {
    if (!timestamp || typeof timestamp !== 'string' || timestamp.length < 14) throw new Error('Invalid timestamp format')

    const year = timestamp.slice(0, 4)
    const month = timestamp.slice(4, 6)
    const day = timestamp.slice(6, 8)
    const hour = timestamp.slice(8, 10)
    const minute = timestamp.slice(10, 12)

    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute))
}

export function formatTimestamp(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes() + 1).padStart(2, '0'); // Months are 0-indexed
    const sec = String(date.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}${hour}${min}${sec}`;
}

export function getLastWorkingDay() {

  let date = new Date();
  date.setDate(date.getDate() - 1);

  // Check if today is January 1st
  if (date.getMonth() === 0 && date.getDate() === 1) {
      date.setDate(date.getDate() - 1); // Go back 1 day to December 31
  }

  // Check if today is Saturday (6) or Sunday (0)
  if (date.getDay() === 6) { // Saturday
      date.setDate(date.getDate() - 1); // Go back 1 day to Friday
  } else if (date.getDay() === 0) { // Sunday
      date.setDate(date.getDate() - 2); // Go back 2 days to Friday
  }

  return formatDate(date);
}