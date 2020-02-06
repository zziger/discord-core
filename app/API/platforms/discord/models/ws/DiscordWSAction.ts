/* tslint:disable:unified-signatures */
import {DiscordOpcodes} from "../../constants/DiscordOpcodes";

export class DiscordWSAction {
    public readonly opcode: DiscordOpcodes;
    public readonly opcodeRaw: string;
    public readonly data: any;
    public readonly query?: number;
    public readonly event?: string;

    constructor(data: string);
    constructor(data: { op: DiscordOpcodes, d?: any });
    constructor(data: { op: DiscordOpcodes.Heartbeat, d?: number, s: number | null});
    constructor(data: { op: DiscordOpcodes.Dispatch, d?: any, s: number, t: string });
    constructor(data: any) {
        if (typeof data === "string") {
            data = JSON.parse(data);
        }

        this.opcode = data.op;
        try {
            if (typeof data.d === "string") {
                this.data = JSON.parse(data.d);
            } else {
                this.data = data.d;
            }
        } catch (e) {
            throw Error(`Cannot decode JSON.`);
        }

        if ([DiscordOpcodes.Dispatch, DiscordOpcodes.Heartbeat].includes(data.op)) {
            this.query = data.s;
            this.event = data.t;
        }

        switch (data.op) {
            case DiscordOpcodes.Dispatch:
                this.opcodeRaw = "Dispatch";
                break;

            case DiscordOpcodes.Heartbeat:
                this.opcodeRaw = "Heartbeat";
                break;

            case DiscordOpcodes.Identify:
                this.opcodeRaw = "Identify";
                break;

            case DiscordOpcodes.StatusUpdate:
                this.opcodeRaw = "StatusUpdate";
                break;

            case DiscordOpcodes.VoiceStateUpdate:
                this.opcodeRaw = "VoiceStateUpdate";
                break;

            case DiscordOpcodes.Resume:
                this.opcodeRaw = "Resume";
                break;

            case DiscordOpcodes.Reconnect:
                this.opcodeRaw = "Reconnect";
                break;

            case DiscordOpcodes.RequestGuildMembers:
                this.opcodeRaw = "RequestGuildMembers";
                break;

            case DiscordOpcodes.InvalidSession:
                this.opcodeRaw = "InvalidSession";
                break;

            case DiscordOpcodes.Hello:
                this.opcodeRaw = "Hello";
                break;

            case DiscordOpcodes.HeartbeatACK:
                this.opcodeRaw = "HeartbeatACK";
                break;

            default:
                throw Error(`Unknown opcode ${data.op}.`);
        }
    }

    public getRawData(): string {
        return JSON.stringify({ op: this.opcode, d: this.data, s: this.query || null, t: this.event || null });
    }
}
