import { filter, isNumber, some } from "lodash";
import { getDatabase } from "../db";
import { CovidNumbers, DiscordNotification, LoggerMethod, SourceContext } from "../types";
import { calcCovidDelta, calcCovidTrends } from "../utils/covid";
import { formatYMD } from "../utils/date";
import { formatNumber } from "../utils/number";

/**
 * Calculates daily stats using the given COVID data and context.
 * @param context Configuration context.
 * @param latest Latest COVID data.
 * @param log Logger method.
 */
export async function runDailyStats(context: SourceContext, latest: CovidNumbers, log: LoggerMethod): Promise<DiscordNotification | null> {
	const currentDate = new Date();
	const idToday = formatYMD(currentDate);
	const idYesterday = formatYMD(currentDate, -1);
	const idBeforeYesterday = formatYMD(currentDate, -2);

	log(`running daily stats for new item ${idToday}...`, context);
	const db = getDatabase(context.id);

	const itemToday = db.find(idToday);
	if (itemToday) {
		log(`item ${idToday} already exists in db, updating.`, context);
		db.update(idToday, latest);

		if (!some(calcCovidDelta(latest, itemToday.info))) {
			log(`item ${idToday} has not changed, skipping.`, context);
			return null;
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
		latest.cases != 0 ? `:radioactive: ${outputCovidLine("cases", latest.cases, delta.cases, trends?.cases)}` : null,
		latest.deaths != 0 ? `:skull_crossbones: ${outputCovidLine("deaths", latest.deaths, delta.deaths, trends?.deaths)}` : null,
		latest.recoveries != 0 ? `:house_with_garden: ${outputCovidLine("recoveries", latest.recoveries, delta.recoveries, trends?.recoveries)}` : null,
		latest.active != 0 ? `:zombie: ${outputCovidLine("active", latest.active, delta.active, trends?.active)}` : null
	];

	if (context.linesBefore && context.linesBefore.length > 0) outputs.unshift(...context.linesBefore, " ");
	if (context.linesAfter && context.linesAfter.length > 0) outputs.push(" ", ...context.linesAfter);

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
 * @param label Name of the data point.
 * @param value Latest value for the data point.
 * @param delta Calculated difference between the latest data point and a previous result.
 */
function outputCovidLine(label: string, value: number, delta?: number, trend?: number): string {
	let result = `${formatNumber(value)} ${label}`;
	if (isNumber(delta)) result += `, **${delta < 0 ? "-" : "+"}${formatNumber(Math.abs(delta))}**`;
	if (isNumber(trend)) {
		if (trend == 0) result += "  :red_circle:";
		if (trend < 0) result += " :small_red_triangle_down:";
		if (trend > 0) result += " :small_red_triangle:";
	}
	return result;
}
