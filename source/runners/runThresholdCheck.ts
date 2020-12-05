import { filter, some } from "lodash";
import { getDatabase } from "../database";
import { CovidNumbers } from "../types/covid";
import { SourceContext, SourceLoggerMethod, SourceRunner } from "../types/sources";
import { calcCovidDelta } from "../utils/covid";
import { formatYMD } from "../utils/date";
import { formatNumber } from "../utils/number";

/**
 * Generantes text output for a given data point.
 * @param label Name of the data point.
 * @param value Latest value for the data point.
 * @param delta Calculated difference between the latest data point and a previous result.
 */
function outputThresholdStatsLine(label: string, value: number): string {
	return `**${formatNumber(value)}** ${label}`;
}

/**
 * Calculates when the cases reach a certain threshold using the given COVID data and context.
 * @param context Configuration context.
 * @param latest Latest COVID data.
 * @param log Logger method.
 */
export const runThresholdCheck: SourceRunner = async (latest: CovidNumbers, context: SourceContext, log: SourceLoggerMethod) => {
	const skipDeltaCheck = process.env.THRESHOLD_SKIP_DELTA_CHECK == "true";

	const currentDate = new Date();
	const idToday = formatYMD(currentDate);
	const idYesterday = formatYMD(currentDate, -1);

	log(`running THRESHOLD CHECK for new item ${idToday}...`, context);
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

	const todayCases = Math.floor(latest.cases / 1000000);
	const yesterdayCases = Math.floor(itemYesterday.info.cases / 1000000);
	if (yesterdayCases >= todayCases) {
		log(`today's cases (${idToday}, ${todayCases}m) are not higher than yesterday (${idYesterday}, ${yesterdayCases}m), skipping.`, context);
		return null;
	}

	const days = db.connection.get("records")
		.sortBy(["id"])
		.reverse()
		.map((v) => Math.floor(v.info.cases / 1000000))
		.filter((v) => v >= yesterdayCases && v < todayCases)
		.value()
		.length;

	let outputs = [
		latest.cases != 0 ? `:radioactive: ${outputThresholdStatsLine("cases", latest.cases)}` : null,
		latest.deaths != 0 ? `:skull_crossbones: ${outputThresholdStatsLine("deaths", latest.deaths)}` : null,
		latest.recoveries != 0 ? `:house_with_garden: ${outputThresholdStatsLine("recoveries", latest.recoveries)}` : null,
		latest.active != 0 ? `:zombie: ${outputThresholdStatsLine("active", latest.active)}` : null
	];

	if (context.linesBefore && context.linesBefore.length > 0) outputs.unshift(...context.linesBefore, " ");
	if (context.linesAfter && context.linesAfter.length > 0) outputs.push(" ", ...context.linesAfter);
	log(`notifying stats for ${idToday}. ✔`, context);

	return {
		content: context.content,
		embeds: [
			{
				title: context.title,
				description: filter(outputs).join("\n").replace("{days}", `${days} day${days != 1 ? "s" : ""}`)
			}
		]
	};
}
