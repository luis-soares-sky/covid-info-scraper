import { CovidNumbers } from "../types/covid";

/**
 * Calculates delta between the provided data numbers.
 * @param latest Latest scraped data.
 * @param previous Previous recorded data.
 */
export function calcCovidDelta(latest: CovidNumbers, previous: CovidNumbers): CovidNumbers {
    return {
        cases: latest.cases - previous.cases,
        deaths: latest.deaths - previous.deaths,
        recoveries: latest.recoveries - previous.recoveries,
        active: latest.active - previous.active
    };
};

/**
 * Calculates percentages between the provided data numbers.
 * @param delta Calculated delta.
 * @param previous Previous recorded data.
 */
export function calcCovidPercentages(delta: CovidNumbers, previous: CovidNumbers): CovidNumbers {
    return {
        cases: delta.cases / previous.cases,
        deaths: delta.deaths / previous.deaths,
        recoveries: delta.recoveries / previous.recoveries,
        active: delta.active / previous.active
    };
};

/**
 * Calculates percentage trends.
 * @param delta Calculated delta between latest and previous day.
 * @param yesterday Previous recorded data of previous day.
 * @param before Previous recorded data of previous 2nd day.
 */
export function calcCovidTrends(delta: CovidNumbers, yesterday: CovidNumbers, before: CovidNumbers): CovidNumbers {
    const todayPercentages = calcCovidPercentages(delta, yesterday);
    const yesterdayPercentages = calcCovidPercentages(calcCovidDelta(yesterday, before), before);
    return calcCovidDelta(todayPercentages, yesterdayPercentages);
};
