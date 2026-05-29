import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN ?? "https://f13e46e6ab5259f94d23eeb61cfd8dfd@o4511219815546880.ingest.de.sentry.io/4511298530639952",

  tracesSampleRate: 0.2,
  enableLogs: true,
  sendDefaultPii: false,

  denyUrls: [
    // Browser extensions
    /extensions\//i,
    /^chrome:\/\//i,
    /^chrome-extension:\/\//i,
    /^moz-extension:\/\//i,
  ],

  beforeSend(event) {
    // Strip PII from request context
    if (event.request) {
      delete event.request.cookies;
      if (event.request.headers) {
        delete event.request.headers["Authorization"];
        delete event.request.headers["Cookie"];
      }
    }
    // Strip PII from user context
    if (event.user) {
      delete event.user.email;
      delete event.user.username;
    }
    return event;
  },
});
