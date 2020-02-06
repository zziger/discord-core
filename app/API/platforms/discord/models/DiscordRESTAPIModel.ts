import {RESTMethods} from "../../../model/REST/RESTMethods";
import {RESTAPIModel} from "../../../model/RESTAPIModel";

export class DiscordRESTAPIModel extends RESTAPIModel {
    public static apiUrl: string = "https://discordapp.com/api/";
    public static apiVersion: number = 6;

    public static getEndpointUrl(endpoint: string) {
        return `${DiscordRESTAPIModel.apiUrl}v${DiscordRESTAPIModel.apiVersion}/${endpoint.replace(/^\//, "")}`;
    }

    private readonly token: string;

    constructor(token: string) {
        super();
        this.token = token;
        this.headers = {
            Authorization: `Bot ${this.token}`,
        };
    }

    public async sendMessage(channel: string, content: string, parameters: any) {
        // todo
        const {data, response} = await this.request("channels/548572245430239252/messages", {
            formData: {
                ...("file" in parameters ? {
                    file: {
                        options: {filename: parameters.file.name, contentType: parameters.file.type},
                        value: parameters.file.content,
                    },
                } : {}),
                payload_json: JSON.stringify({
                    content,
                    ...parameters,
                }),
            },
        }, RESTMethods.POST);
        console.log(data, response);
    }

    public async removeMessage(channel: string, message: string) {
        this.request(`channels/${channel}/messages/${message}`, {}, RESTMethods.DELETE);
    }

    public async addReaction(channel: string, message: string, reaction: string) {
        return this.request(`channels/${channel}/messages/${message}/reactions/${encodeURIComponent(reaction)}/@me`, {}, RESTMethods.PUT);
    }

    public async getGateway(): Promise<{ url: string, shards: number, session_start_limit: { total: number, remain: number, reset_after: number } }> {
        const {data} = await this.request("gateway/bot");
        return data;
    }

    public async request(endpoint: string, parameters: object = {}, method: RESTMethods = RESTMethods.GET): Promise<{ response: object, data: any }> {
        endpoint = DiscordRESTAPIModel.getEndpointUrl(endpoint);
        const data: { response: object, data: any } = await super.request(endpoint, parameters, method);
        try {
            data.data = JSON.parse(data.data);
        } catch (e) {
            /////
        }
        return data;
    }
}
