import { filter, isNumber, some } from "lodash";
import { getDatabase } from "../database";
import { CovidNumbers } from "../types/covid";
import { DiscordNotification } from "../types/discord";
import { SourceContext, SourceLoggerMethod, SourceRunner } from "../types/sources";
import { calcCovidDelta, calcCovidTrends } from "../utils/covid";
import { formatYMD } from "../utils/date";
import { formatNumber } from "../utils/number";

/**
 * Calculates daily stats using the given COVID data and context.
 */
export default class DailyStatsRunner extends SourceRunner {
    public skipDeltaCheck: boolean = false;

    /**
     * Constructor.
     */
    public constructor(init?: Partial<DailyStatsRunner>) {
        super();
        Object.assign(this, init);
    }

    /**
     * Runs numbers and returns a notification object.
     * @param latest Latest extracted COVID numbers.
     * @param context Configuration context.
     * @param log Logger method.
     */
    public async execute(latest: CovidNumbers, context: SourceContext, log: SourceLoggerMethod): Promise<DiscordNotification | null> {
        const currentDate = new Date();
        const idToday = formatYMD(currentDate);
        const idYesterday = formatYMD(currentDate, -1);
        const idBeforeYesterday = formatYMD(currentDate, -2);

        log(`running DAILY STATS for new item ${idToday}...`, context);
        const db = getDatabase(context.id);
        const itemToday = db.find(idToday);
        if (itemToday) {
            if (!some(calcCovidDelta(latest, itemToday.info)) && !this.skipDeltaCheck) {
                log(`item ${idToday} has not changed, skipping.`, context);
                return null;
            }
            else {
                log(`item ${idToday} already exists in db and is out of date, updating.`, context);
                db.update(idToday, latest);
            }
        }
        else {
            log(`item ${idToday} does not exist in db, adding.`, context);
            db.add(idToday, latest);
        }

        const itemYesterday = db.find(idYesterday);
        if (!itemYesterday) {
            log(`item ${idYesterday} does not exist in db, cannot calc stats, skipping.`, context);
            return null;
        }

        const delta = calcCovidDelta(latest, itemYesterday.info);
        if (!some(delta)) {
            log(`items ${idToday} and ${idYesterday} are equal, skipping.`, context);
            return null;
        }

        let trends: CovidNumbers | undefined = undefined;
        const itemBeforeYesterday = db.find(idBeforeYesterday);
        if (itemBeforeYesterday) {
            trends = calcCovidTrends(delta, itemYesterday.info, itemBeforeYesterday.info);
        }

        let outputs = [
            this.outputDailyStatsLine("radioactive", "cases", latest.cases, delta.cases, trends?.cases),
            this.outputDailyStatsLine("skull_crossbones", "deaths", latest.deaths, delta.deaths, trends?.deaths),
            this.outputDailyStatsLine("house_with_garden", "recoveries", latest.recoveries, delta.recoveries, trends?.recoveries),
            this.outputDailyStatsLine("zombie", "active", latest.active, delta.active, trends?.active)
        ];

        if (context.linesBefore && context.linesBefore.length > 0) outputs.unshift(...context.linesBefore, " ");
        if (context.linesAfter && context.linesAfter.length > 0) outputs.push(" ", ...context.linesAfter);
        log(`notifying stats for ${idToday}. ✔`, context);

        return {
            content: context.content,
            embeds: [
                {
                    title: context.title,
                    description: filter(outputs).join("\n")
                }
            ]
        };
    }

    /**
     * Generantes text output for a given data point.
     * @param icon Name of the icon to output.
     * @param label Name of the data point to output.
     * @param total Latest total value for the data point.
     * @param delta Calculated difference between the latest data point and a previous result.
     * @param trend Calculated history percentage delta.
     */
    private outputDailyStatsLine(icon: string, label: string, total: number, delta?: number, trend?: number): string | null {
        if (total == 0) return null;

        let result = `:${icon}: ${formatNumber(total)} ${label}`;
        if (isNumber(delta)) result += `, **${delta < 0 ? "-" : "+"}${formatNumber(Math.abs(delta))}**`;
        if (isNumber(trend)) {
            if (trend == 0) result += "  :red_circle:";
            if (trend < 0) result += " :small_red_triangle_down:";
            if (trend > 0) result += " :small_red_triangle:";
        }
        return result;
    }
}
