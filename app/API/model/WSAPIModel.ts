import {IMainAPIModel} from "./IMainAPIModel";

export class WSAPIModel implements IMainAPIModel {
    public static build() {
        return new WSAPIModel();
    }

    public constructor() {
        /** This is needed for {@link WSAPIModel} */
    }

    public request(endpoint: string, parameters?: object): any {
        // todo
    }
}
