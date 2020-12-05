import axios from "axios";
import { SourceContext, SourceLoggerMethod } from "./types/sources";
import * as colors from "./utils/colors";

/**
 * Attempts to fetch HTML from the given URL.
 * @param url URL to fetch.
 */
export async function fetchHtml(url: string): Promise<string> {
	url = url.replace(/^(https?:)?\/\//, "https://");

	return await axios
		.get(url)
		.then(response => response.data)
		.catch(error => {
			error.status = (error.response && error.response.status) || 500;
			throw error;
		});
};

/**
 * Runs a given configuration by scraping the given URL, extracting the data, and executing the runner.
 * @param context Configuration context needed to run the scraping process.
 */
export async function runConfig(context: SourceContext, log: SourceLoggerMethod): Promise<any> {
	const html = await fetchHtml(context.url);
	const latest = context.extractor(html);
	const notification = await context.runner(latest, context, log);

	if (notification) {
		return axios.post(context.webhook, notification); // post to discord
	}
	return null;
}

/**
 * Runs each configuration context in the given array.
 * @param configs Array of configuration contexts to run.
 */
export async function runAllConfigs(...configs: SourceContext[]) {
	for (const config of configs) {
		await runConfig(config, log);
		console.log();
	}
	console.log("All done.");
}

/**
 * Logs a message to the app's console.
 * @param message Message to log.
 * @param context Configuration context.
 */
function log(message: string, context: SourceContext): void {
	console.log(`${context.logColor ?? colors.Reset}"${context.id}":${colors.Reset} ${message}`);
}
