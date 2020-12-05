import { CovidNumbers } from "./covid";
import { DiscordNotification } from "./discord";

export type SourceExtractor = (html: string) => CovidNumbers;

export type SourceRunner = (latest: CovidNumbers, context: SourceContext, log: SourceLoggerMethod) => Promise<DiscordNotification | null>;

export type SourceLoggerMethod = (message: string, context: SourceContext) => void;

export type SourceContext = {
	id: string,
	url: string,
	extractor: SourceExtractor,
	runner: SourceRunner,
	webhook: string,
	title: string,
	content?: string,
	linesBefore?: string[],
	linesAfter?: string[],
	logColor?: string
};
