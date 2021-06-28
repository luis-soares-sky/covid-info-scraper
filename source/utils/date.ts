/**
 * Attempts to format a given date.
 * @param date Date to format.
 * @param locale Locale/region to use for formatting options.
 * @param parts Parts for the final formatted date.
 * @param separator Separator to append between the given parts.
 */
export function formatDateIntl(date: Date, locale: string, parts: Intl.DateTimeFormatOptions[], separator: string): string {
    return parts
        .map((part) => new Intl.DateTimeFormat(locale, part).format(date))
        .join(separator);
};

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

    return formatDateIntl(dateObj, "default", [
        { year: "numeric" },
        { month: "2-digit" },
        { day: "2-digit" }
    ], "-");
};
