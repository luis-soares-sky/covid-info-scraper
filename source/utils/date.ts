import { padStart } from "lodash";

/**
 * Formats a date to "YYYY-MM-DD".
 * @param date Date object to format.
 * @param offset If provided, offsets the provided date by n days.
 */
export function formatYMD(baseDate: Date, offsetInDays: number = 0): string {
    let dateObj = baseDate;

    if (offsetInDays != 0) {
        const timeNow = dateObj.getTime();
        const timeOffset = timeNow + (offsetInDays * 24 * 60 * 60 * 1000);
        dateObj = new Date(timeOffset);
    }

    return [
        dateObj.getFullYear(),
        padStart(`${dateObj.getMonth() + 1}`, 2, "0"),
        padStart(`${dateObj.getDate()}`, 2, "0")
    ].join('-');
};
