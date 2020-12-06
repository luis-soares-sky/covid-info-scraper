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
