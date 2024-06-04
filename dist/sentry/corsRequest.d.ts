export declare const isCorsRequest: (event: any) => {
    statusCode: number;
    body: string;
    headers: {
        "Access-Control-Allow-Origin": any;
        "Access-Control-Allow-Headers": string;
        "Access-Control-Allow-Methods": string;
        "Access-Control-Allow-Credentials": boolean;
    };
} | undefined;
export declare let getCorsHeaders: (event: any) => {
    "Access-Control-Allow-Origin": any;
    "Access-Control-Allow-Headers": string;
    "Access-Control-Allow-Methods": string;
    "Access-Control-Allow-Credentials": boolean;
};
