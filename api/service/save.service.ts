import { APILogger } from '../logger/api.logger';
import * as mysql from '../util/MySQL.util';

export class SaveService {
    public logger: APILogger;

    constructor() {
        this.logger = new APILogger();
    }
}
