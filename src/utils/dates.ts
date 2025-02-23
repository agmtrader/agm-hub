
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

function formatDate(date:any) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

export function formatTimestamp(date:any) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes() + 1).padStart(2, '0'); // Months are 0-indexed
    const sec = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}${month}${day}${hour}${min}${sec}`;
}