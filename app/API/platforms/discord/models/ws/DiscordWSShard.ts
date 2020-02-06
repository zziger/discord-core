import WebSocket from "ws";
import {Core} from "../../../../../Core";
import {DiscordOpcodes} from "../../constants/DiscordOpcodes";
import {DiscordPresenceObject} from "../../types/DiscordPresenceObject";
import {DiscordWSAction} from "./DiscordWSAction";

export class DiscordWSShard {
    public pings: number[] = [];

    private ws?: WebSocket;
    private connected: boolean = false;
    private heartbeatACK: boolean = true;
    private lastHeartbeatNum: number = 0;
    private lastHeartbeatTime: number = 0;
    private heartbeatInterval?: any;
    private lastQuery: number = -1;
    private readonly token: string;
    private readonly shardID: number;
    private readonly shardCount: number;
    private readonly gatewayUrl: string;
    private readonly presenceObject: DiscordPresenceObject;

    constructor(token: string, shardID: number, shardCount: number = 1, gatewayUrl: string, presenceObject: DiscordPresenceObject) {
        this.token = token;
        this.shardID = shardID;
        this.gatewayUrl = gatewayUrl;
        this.shardCount = shardCount;
        this.presenceObject = presenceObject;
    }

    public connect() {
        this.ws = new WebSocket(this.gatewayUrl);
        this.ws.on("open", () => {
            this.log("Started WS connection");
        });
        this.ws.on("close", console.log);
        this.ws.on("message", async (data: string) => {
            if (!this.ws) {
                return;
            }
            const action = new DiscordWSAction(data);
            if (action.query && action.query > this.lastQuery) {
                this.lastQuery = action.query;
            }
            // console.log(action);
            if (action.opcode === DiscordOpcodes.Hello) {
                await this.ws.send(new DiscordWSAction(
                    {
                        d: {
                            compress: false,
                            presence: this.presenceObject,
                            properties: {
                                $browser: "thebot",
                                $device: "thebot",
                                $os: "linux",
                            },
                            token: this.token,
                        },
                        op: DiscordOpcodes.Identify,
                    }).getRawData());
                // console.log(new DiscordWSAction({
                //     d: this.presenceObject.toString(),
                //     op: DiscordOpcodes.StatusUpdate,
                // }).getRawData());
                this.ws.send(new DiscordWSAction(
                    {
                        d: this.presenceObject.toString(),
                        op: DiscordOpcodes.StatusUpdate,
                    },
                ).getRawData());
                await this.heartbeat();
                this.heartbeatInterval = setInterval(this.heartbeat.bind(this), action.data.heartbeat_interval);
            } else if (action.opcode === DiscordOpcodes.HeartbeatACK) {
                this.acknowledgeHeartbeat();
            } else if (action.opcode === DiscordOpcodes.Dispatch && action.event === "READY") {
                if (Core && Core.discord && Core.discord.ws) {
                    Core.discord.ws.setConnected();
                }
            }
        });
    }

    public destroy(): void {
        if (this.ws) {
            this.ws.close();
        }
        clearInterval(this.heartbeatInterval);
    }

    public setConnected(): void {
        this.connected = true;
        this.log("Connected");
    }

    private log(...params: any) {
        console.log(`[SHARD ${this.shardID}]`, ...params);
    }

    private async heartbeat(): Promise<void> {
        if (!this.ws) {
            return;
        }
        if (!this.heartbeatACK) {
            // Владимир Путин - молодец
            // Политик, лидер и...
            console.error("Пиздец.");
        }
        await this.ws.send(new DiscordWSAction({
            d: ++this.lastHeartbeatNum,
            op: DiscordOpcodes.Heartbeat,
            s: this.lastQuery !== -1 ? this.lastQuery : null,
        }).getRawData());
        this.lastHeartbeatTime = Date.now();
        this.log("Heartbeat sent.");
        this.heartbeatACK = false;
    }

    private acknowledgeHeartbeat(): void {
        if (!this.ws) {
            return;
        }
        if (this.pings.length >= 4) {
            this.pings = this.pings.slice(0, 3);
        }
        const latency = Date.now() - this.lastHeartbeatTime;
        this.pings.unshift(latency);
        this.heartbeatACK = true;
        this.log(`Heartbeat acknowledged. Latency is ${latency}ms`);
        this.log(`Average ping is ${this.ping}ms`);
    }

    get ping() {
        const sum = this.pings.reduce((a, b) => a + b);
        return sum / this.pings.length;
    }
}
