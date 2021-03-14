export type DiscordField = {
    name: string;
    value: string;
    inline?: boolean;
};

export type DiscordMessage = {
    content?: string;
    embeds?: [{
        url?: string;
        title?: string;
        description?: string;
        timestamp?: string;
        color?: number;
        fields?: DiscordField[];
    }]
};
