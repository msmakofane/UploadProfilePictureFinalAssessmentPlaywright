import { Page } from '@playwright/test';

export interface ApiCall {
  method: string;
  url: string;
  status: number;
}

/** Attaches a response listener and records every call made to the Ndosi API while it is active. */
export class ApiTracker {
  readonly calls: ApiCall[] = [];
  private readonly apiOrigin: string;
  private readonly apiPath: string;

  constructor(private readonly page: Page, private readonly apiBaseUrl: string) {
    const base = new URL(this.apiBaseUrl);
    this.apiOrigin = base.origin;
    this.apiPath = base.pathname;

    this.page.on('response', (response) => {
      const request = response.request();
      // skip CORS preflights and non-XHR/fetch responses (static assets, navigations, etc.)
      if (request.method() === 'OPTIONS' || !['xhr', 'fetch'].includes(request.resourceType())) {
        return;
      }

      let target: URL;
      try {
        target = new URL(response.url());
      } catch {
        // ignore responses with unparsable URLs (e.g. data:/blob: URIs)
        return;
      }

      // restrict recorded calls to this project's own API origin + path, not any other host
      const isProjectApiCall = target.origin === this.apiOrigin && target.pathname.startsWith(this.apiPath);
      if (isProjectApiCall) {
        this.calls.push({ method: request.method(), url: response.url(), status: response.status() });
      }
    });
  }

  // Returns recorded calls whose URL contains `pathIncludes`, optionally narrowed by HTTP method.
  findCalls(pathIncludes: string, method?: string): ApiCall[] {
    return this.calls.filter(
      (call) => call.url.includes(pathIncludes) && (!method || call.method === method),
    );
  }
}
