declare namespace App {
  type CurrentUser = import("./domain/user/schema").User;

  interface Locals {
    title: string;
    /** Locale of the request: from the URL on public pages, from `resolveLocale` on private ones. */
    locale: import("./domain/shared/locale").Locale;
    user: CurrentUser | undefined;
    /** Request-scoped services, provided by the middleware. */
    services: import("./server/services").Services;
  }
}

// Cloudflare Worker Bindings
declare interface Bindings {
  EMAIL?: {
    send(message: { from: string; to: string; raw: Uint8Array }): Promise<void>;
  };
}

// Cloudflare Email module declaration
declare module "cloudflare:email" {
  export class EmailMessage {
    constructor(from: string, to: string, raw: Uint8Array);
    setReplyTo(addr: string): void;
    from: string;
    to: string;
    raw: Uint8Array;
  }
}
