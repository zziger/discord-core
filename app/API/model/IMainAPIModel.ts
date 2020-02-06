export interface IMainAPIModel {
    /**
     * Request method.
     * @param {string} endpoint
     * @param {Object} parameters
     * @return any
     */
    request?(endpoint: string, parameters?: object): any;
}
