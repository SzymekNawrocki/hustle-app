// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://f13e46e6ab5259f94d23eeb61cfd8dfd@o4511219815546880.ingest.de.sentry.io/4511298530639952",

  tracesSampleRate: 0.2,
  enableLogs: true,
  sendDefaultPii: false,
});
