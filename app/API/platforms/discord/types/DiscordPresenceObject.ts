import {DiscordPresenceStatuses} from "../constants/DiscordPresenceStatuses";
import {DiscordActivityObject} from "./DiscordActivityObject";

export class DiscordPresenceObject {
    private status: DiscordPresenceStatuses;
    private afk: boolean = false;
    private game?: DiscordActivityObject | null;
    private since?: number;

    constructor(status: DiscordPresenceStatuses, afk: boolean = false, game: DiscordActivityObject | null = null, since: number = Date.now()) {
        this.status = status;
        this.afk = afk;
        this.game = game;
        this.since = since;
    }

    public toString() {
        return JSON.stringify(this);
    }
}
