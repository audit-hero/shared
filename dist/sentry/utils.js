import { isInAWS } from "../lambda-stream/index.js";
export let getAwslambda = () => {
    let lambda;
    if (isInAWS()) {
        //@ts-ignore
        lambda = awslambda;
    }
    else {
        // local
        lambda = {
            HttpResponseStream: {
                from: (stream, response) => ({
                    write: (data) => {
                        stream.write(data);
                    },
                    end: () => {
                        stream.end();
                    },
                }),
            },
        };
    }
    return lambda;
};
//# sourceMappingURL=utils.js.map