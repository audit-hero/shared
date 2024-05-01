export declare let setSentryProjectName: (name: string) => void;
export declare let getSentryProjectName: () => string;
export type SentryLevel = "error" | "warning" | "info" | "debug" | "fatal";
export type SentryInterval = "daily" | "hourly";
export declare let sentryMessage: (message: string, level?: SentryLevel) => Promise<void>;
export declare let sentryError: (message: string, payload?: any, sentryInterval?: SentryInterval) => Promise<void>;
export * from "./sentry-lambda.js";
export * from "./sentry-lambda-either.js";
export * from "./corsRequest.js";
