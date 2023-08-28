// requires 
// process.env.SENTRY_DSN and process.env.SENTRY_URL
let projectName = "sentry projecttt";
export let setProjectName = (name) => {
    projectName = name;
};
let lastSendTime = 0;
let interval = 15000;
export let sentryMessage = async (message, level = "info") => {
    let event = {
        dsn: process.env.SENTRY_DSN,
        event: {
            message: message,
            level: level,
            tags: {
                module: projectName
            },
        }
    };
    await sendRequest(event);
};
export let sentryError = async (payload, message = payload.message, sentryInterval = undefined) => {
    if (sentryInterval == "daily" && new Date().getHours() != 0) {
        console.log(message, payload);
        console.log("skipping sentry error, only sending daily");
        return;
    }
    let event = {
        dsn: process.env.SENTRY_DSN,
        event: {
            message: message,
            level: "error",
            tags: {
                module: projectName
            },
            errors: [payload]
        }
    };
    await sendRequest(event);
};
let sendRequest = async (event) => {
    // map the errors to name and stack only
    if (event.event.errors) {
        event.event.errors = event.event.errors.map(it => {
            return {
                type: it.name,
                path: it.stack,
                message: it.message
            };
        });
    }
    console.log(`sending message to sentry`);
    if (event.event.errors && event.event.errors.length > 0) {
        if (event.event.errors[0].path) {
            console.log(`${event.event.errors[0].path}`);
        }
    }
    else {
        console.log(`${JSON.stringify(event.event, null, 2)}`);
    }
    if (!process.env.SENTRY_DSN) {
        console.log("no sentry dsn, skipping");
        return;
    }
    let json = JSON.stringify(event);
    if (new Date().getTime() - lastSendTime < interval) {
        console.log(`skipping sending sentry message, last sent ${new Date().getTime() - lastSendTime}ms ago`);
        return;
    }
    lastSendTime = new Date().getTime();
    let response = await fetch(process.env.SENTRY_URL ?? "", {
        method: "POST",
        body: json
    });
    if (!response.ok) {
        console.log(`failed to send message to sentry ${response.status} ${response.statusText} ${JSON.stringify(response.body)}}`);
    }
};
export let withSentry = async (block) => {
    try {
        let result = await block();
        return result;
    }
    catch (e) {
        await sentryError(e);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: e.message }),
        };
    }
};
//# sourceMappingURL=sentry-lambda.js.map