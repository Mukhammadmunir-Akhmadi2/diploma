
export const formatDateOfBirth = (date: string | null): string | null => {
  if (!date || date.trim() === "") {
    return null; 
  }
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    console.error("Invalid date format. Expected format: YYYY-MM-DD");
    return null;
  }
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    console.error("Invalid date value.");
    return null;
  }
  return date;
};
