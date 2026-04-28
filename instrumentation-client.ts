// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://f13e46e6ab5259f94d23eeb61cfd8dfd@o4511219815546880.ingest.de.sentry.io/4511298530639952",

  // Add optional integrations for additional features
  integrations: [Sentry.replayIntegration()],

  tracesSampleRate: 0.2,
  enableLogs: true,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  sendDefaultPii: false,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
