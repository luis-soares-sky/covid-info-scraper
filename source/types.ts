export type CovidNumbers = {
	cases: number,
	deaths: number,
	recoveries: number,
	active: number
};

export type DatabaseRecord = {
	id: string,
	info: CovidNumbers,
	timestampAdd: number
	timestampUpdate: number
};

export type DatabaseStruct = {
	records: DatabaseRecord[],
	count: number
};

export type SourceExtractor = (html: string) => CovidNumbers;
export type SourceRunner = (context: SourceContext, latest: CovidNumbers, log: LoggerMethod) => Promise<DiscordNotification | null>;

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

export type DiscordField = {
	name: string,
	value: string,
	inline?: boolean
};

export type DiscordNotification = {
	content?: string,
	embeds?: [{
		url?: string,
		title?: string,
		description?: string,
		timestamp?: string,
		color?: number,
		fields?: DiscordField[]
	}]
};

export type LoggerMethod = (message: string, context: SourceContext) => void;
