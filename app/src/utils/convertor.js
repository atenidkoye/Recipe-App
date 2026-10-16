export const minutesToHoursAndMinutes = (minutes) => {
    let hours = Math.floor(minutes / 60);
    let remainingMinutes = minutes - (60 * Math.floor(minutes / 60));
    return `${hours < 10 ? "0" : ""}${hours}:${remainingMinutes < 10 ? "0" : ""}${remainingMinutes}`
}