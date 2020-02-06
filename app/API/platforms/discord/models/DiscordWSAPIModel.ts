import {WSAPIModel} from "../../../model/WSAPIModel";
import {DiscordPresenceStatuses} from "../constants/DiscordPresenceStatuses";
import {DiscordPresenceObject} from "../types/DiscordPresenceObject";
import {DiscordWSShard} from "./ws/DiscordWSShard";

export class DiscordWSAPIModel extends WSAPIModel {
    public static apiUrl: string = "https://discordapp.com/api/v6/";
    public shards: DiscordWSShard[] = [];

    private readonly token: string;
    private readonly wsInfo: { url: string, shards: number, session_start_limit: { total: number, remain: number, reset_after: number } };
    private readonly shardCount: number;
    private presence: DiscordPresenceObject;

    constructor(token: string, wsInfo: { url: string, shards: number, session_start_limit: { total: number, remain: number, reset_after: number } }, shardCount: number | "auto" = "auto") {
        super();
        this.token = token;
        this.wsInfo = wsInfo;
        this.shardCount = shardCount === "auto" ? this.wsInfo.shards : shardCount;
        this.presence = new DiscordPresenceObject(DiscordPresenceStatuses.ONLINE, false);
    }

    public async connect(): Promise<void> {
        for (let i = 0; i < this.shardCount; i++) {
            this.shards[i] = new DiscordWSShard(this.token, i, this.shardCount, this.wsInfo.url, this.presence);
            this.shards[i].connect();
        }
    }

    public setConnected(): void {
        this.shards.forEach((shard) => {
            shard.setConnected();
        });
    }
}
