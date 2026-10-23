/**
 * Converts total time in minutes to hours and minutes in the format hh:mm
 * 
 * @param {number} minutes Total time in minutes
 * @returns {string} Total time in the format hh:mm
 */
export const minutesToHoursAndMinutes = (minutes) => {
    let hours = Math.floor(minutes / 60); // Calculate hours
    let remainingMinutes = minutes - (60 * Math.floor(minutes / 60)); // Calculate remaining minutes
    return `${hours < 10 ? "0" : ""}${hours}:${remainingMinutes < 10 ? "0" : ""}${remainingMinutes}`
}