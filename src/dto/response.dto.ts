import { IResponse } from "src/interface/reponse.interface";

export class ResponseError implements IResponse {
    success: boolean;
    message: string;
    data: any[];
    error: any;
    constructor(message: string, data?: any) {
        this.success = false;
        this.message = message;
        this.data = [];
        this.error = data;
        console.warn(new Date().toString() + ' - [Response]: ' + message + (data ? ' - ' + JSON.stringify(data): ''));
    }
}

export class ResponseSuccess implements IResponse {
    constructor(message: string, data?: any, notLog?: boolean) {
        this.success = true;
        this.message = message;
        this.data = data ? data : [];
        if (!notLog) {
            try {
                let offuscateRequest = JSON.parse(JSON.stringify(data));
                if(offuscateRequest && offuscateRequest.token) offuscateRequest = "*********";
                console.log(new Date().toString() + ' - [Response =============|> ]:  ' + JSON.stringify(offuscateRequest));
            } catch (error) {}

        }
    }
    success: boolean;
    message: string;
    data: any[];
    error: any;
}