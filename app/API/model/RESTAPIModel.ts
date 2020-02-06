import request = require("request");
import {IMainAPIModel} from "./IMainAPIModel";
import {RESTMethods} from "./REST/RESTMethods";

export class RESTAPIModel implements IMainAPIModel {
    public static build() {
        return new RESTAPIModel();
    }

    protected headers: object = {};

    public constructor() {
        /** This is needed for {@link WSAPIModel} */
    }

    public async request(endpoint: string, parameters?: object, method: RESTMethods = RESTMethods.GET): Promise<{ response: object, data: any }> {
        return new Promise((resolve, reject) => {
            let rawMethod: string;
            switch (method) {
                case RESTMethods.POST:
                    rawMethod = "POST";
                    break;

                case RESTMethods.PUT:
                    rawMethod = "PUT";
                    break;

                case RESTMethods.DELETE:
                    rawMethod = "DELETE";
                    break;

                case RESTMethods.GET:
                default:
                    rawMethod = "GET";
            }
            request(
                endpoint,
                {
                    headers: this.headers,
                    method: rawMethod,
                    ...parameters,
                },
                (err, response, data) => {
                    if (err) {
                        reject(err);
                    }
                    resolve({response, data});
                },
            );
        });
    }
}
