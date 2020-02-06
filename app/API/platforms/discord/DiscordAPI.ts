import {DiscordRESTAPIModel} from "./models/DiscordRESTAPIModel";
import {DiscordWSAPIModel} from "./models/DiscordWSAPIModel";

export class DiscordAPI {
    public ws!: DiscordWSAPIModel;
    public rest!: DiscordRESTAPIModel;
    private readonly shardCount: number | "auto";
    private readonly token: string;

    constructor(token: string, shardCount: number | "auto" = "auto") {
        this.token = token;
        this.shardCount = shardCount;
    }

    public async connect() {
        this.rest = new DiscordRESTAPIModel(this.token);
        const gatewayData = await this.rest.getGateway();
        this.ws = new DiscordWSAPIModel(this.token, gatewayData, this.shardCount);
        await this.ws.connect();
    }
}
