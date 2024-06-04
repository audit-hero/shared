import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
export declare const isCorsRequest: (event: APIGatewayProxyEventV2) => {
    statusCode: number;
    body: string;
    headers: {
        "Access-Control-Allow-Origin": any;
        "Access-Control-Allow-Headers": string;
        "Access-Control-Allow-Methods": string;
        "Access-Control-Allow-Credentials": boolean;
    };
} | undefined;
export declare let addCorsHeaders: (event: APIGatewayProxyEventV2) => (response: APIGatewayProxyResultV2) => APIGatewayProxyResultV2;
export declare let getCorsHeaders: (event: any) => {
    "Access-Control-Allow-Origin": any;
    "Access-Control-Allow-Headers": string;
    "Access-Control-Allow-Methods": string;
    "Access-Control-Allow-Credentials": boolean;
};
