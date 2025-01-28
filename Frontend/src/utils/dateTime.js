// Function to format a given date into a human-readable string
export const formatDate = (date) => {
  // Use the toLocaleDateString method to format the date according to the 'en-US' locale
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',   // Display the full month name
    day: 'numeric',  // Display the day of the month as a number
    year: 'numeric', // Display the full year
  });
}

// Function to format both the date and time of a given date string
export const formatDateTime = (dateString) => {  
  // Convert the input date string into a Date object
  const date = new Date(dateString);
  // Format the date portion using the formatDate function
  const formattedDate = formatDate(dateString);
  // Extract the hour from the Date object
  const hour = date.getHours();
  // Extract the minutes from the Date object
  const minutes = date.getMinutes();
  // Determine if the time is AM or PM
  const period = hour >= 12 ? 'PM' : 'AM';
  // Format the time portion, converting to 12-hour format and padding minutes with leading zeros if necessary
  const formattedTime = `${hour % 12}:${minutes
    .toString()
    .padStart(2, '0')} ${period}`;

  // Return the formatted date and time as a single string
  return `${formattedDate} | ${formattedTime}`;
}
