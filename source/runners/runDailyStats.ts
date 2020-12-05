import { filter, isNumber, some } from "lodash";
import { getDatabase } from "../database";
import { CovidNumbers } from "../types/covid";
import { SourceContext, SourceLoggerMethod, SourceRunner } from "../types/sources";
import { calcCovidDelta, calcCovidTrends } from "../utils/covid";
import { formatYMD } from "../utils/date";
import { formatNumber } from "../utils/number";

/**
 * Generantes text output for a given data point.
 * @param label Name of the data point.
 * @param value Latest value for the data point.
 * @param delta Calculated difference between the latest data point and a previous result.
 */
function outputDailyStatsLine(label: string, value: number, delta?: number, trend?: number): string {
	let result = `${formatNumber(value)} ${label}`;
	if (isNumber(delta)) result += `, **${delta < 0 ? "-" : "+"}${formatNumber(Math.abs(delta))}**`;
	if (isNumber(trend)) {
		if (trend == 0) result += "  :red_circle:";
		if (trend < 0) result += " :small_red_triangle_down:";
		if (trend > 0) result += " :small_red_triangle:";
	}
	return result;
}

/**
 * Calculates daily stats using the given COVID data and context.
 * @param context Configuration context.
 * @param latest Latest COVID data.
 * @param log Logger method.
 */
export const runDailyStats: SourceRunner = async (latest: CovidNumbers, context: SourceContext, log: SourceLoggerMethod) => {
	const skipDeltaCheck = process.env.DAILY_SKIP_DELTA_CHECK == "true";

	const currentDate = new Date();
	const idToday = formatYMD(currentDate);
	const idYesterday = formatYMD(currentDate, -1);
	const idBeforeYesterday = formatYMD(currentDate, -2);

	log(`running DAILY STATS for new item ${idToday}...`, context);
	const db = getDatabase(context.id);
	const itemToday = db.find(idToday);
	if (itemToday) {
		if (!some(calcCovidDelta(latest, itemToday.info)) && !skipDeltaCheck) {
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
		latest.cases != 0 ? `:radioactive: ${outputDailyStatsLine("cases", latest.cases, delta.cases, trends?.cases)}` : null,
		latest.deaths != 0 ? `:skull_crossbones: ${outputDailyStatsLine("deaths", latest.deaths, delta.deaths, trends?.deaths)}` : null,
		latest.recoveries != 0 ? `:house_with_garden: ${outputDailyStatsLine("recoveries", latest.recoveries, delta.recoveries, trends?.recoveries)}` : null,
		latest.active != 0 ? `:zombie: ${outputDailyStatsLine("active", latest.active, delta.active, trends?.active)}` : null
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
