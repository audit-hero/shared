export const isCorsRequest = (event) => {
    if (event?.httpMethod === "OPTIONS") {
        return {
            statusCode: 200,
            body: JSON.stringify(""),
            headers: corsHeaders,
        };
    }
};
export const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    "Access-Control-Allow-Credentials": true,
};
//# sourceMappingURL=corsRequest.js.map