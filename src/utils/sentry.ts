import * as Sentry from '@sentry/node';
// import * as Tracing from '@sentry/tracing';   giving some issue

export const initSentry = (): void => {
    Sentry.init({
        dsn: 'your_sentry_dsn_here', // Replace with your Sentry DSN
        tracesSampleRate: 1.0,
    });
};
