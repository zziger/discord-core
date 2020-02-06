import {DiscordActivityStatuses} from "../constants/DiscordActivityStatuses";

export class DiscordActivityObject {
    private readonly name: string;
    private readonly type: DiscordActivityStatuses;
    private readonly url?: string;

    constructor(name: string, type: DiscordActivityStatuses, url?: string) {
        this.name = name;
        this.type = type;
        if (url) { this.url = url; }
    }

    public toString() {
        return JSON.stringify(this);
    }
}
