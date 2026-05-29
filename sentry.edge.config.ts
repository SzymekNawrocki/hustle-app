import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN ?? "https://f13e46e6ab5259f94d23eeb61cfd8dfd@o4511219815546880.ingest.de.sentry.io/4511298530639952",

  tracesSampleRate: 0.2,
  enableLogs: true,
  sendDefaultPii: false,

  beforeSend(event) {
    if (event.request) {
      delete event.request.cookies;
      if (event.request.headers) {
        delete event.request.headers["Authorization"];
        delete event.request.headers["Cookie"];
      }
    }
    return event;
  },
});
