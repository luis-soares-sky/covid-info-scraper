import { filter, some } from "lodash";
import { getDatabase } from "../database";
import { CovidNumbers } from "../types/covid";
import { DiscordNotification } from "../types/discord";
import { SourceContext, SourceLoggerMethod, SourceRunner } from "../types/sources";
import { calcCovidDelta } from "../utils/covid";
import { formatYMD } from "../utils/date";
import { formatNumber } from "../utils/number";

/**
 * Calculates when the cases reach a certain threshold using the given COVID data and context.
 */
export default class DailyThresholdRunner extends SourceRunner {
	public skipDeltaCheck: boolean = false;

	/**
	 * Constructor.
	 */
	public constructor(init?: Partial<DailyThresholdRunner>) {
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

		log(`running DAILY THRESHOLD for new item ${idToday}...`, context);
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
			this.outputThresholdStatsLine("radioactive", "cases", latest.cases),
			this.outputThresholdStatsLine("skull_crossbones", "deaths", latest.deaths),
			this.outputThresholdStatsLine("house_with_garden", "recoveries", latest.recoveries),
			this.outputThresholdStatsLine("zombie", "active", latest.active)
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

	/**
	 * Generantes text output for a given data point.
	 * @param label Name of the data point.
	 * @param total Latest total for the data point.
	 */
	private outputThresholdStatsLine(icon: string, label: string, total: number): string | null {
		if (total == 0) return null;

		return `:${icon}: **${formatNumber(total)}** ${label}`;
	}
}
