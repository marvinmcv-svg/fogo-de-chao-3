import { mockApi } from "./demo";

/** In the static demo build there is no server, so API calls are answered by in-browser mocks. */
export const IS_DEMO = process.env.NEXT_PUBLIC_DEMO === "1";

export function apiFetch(path: string, init: RequestInit): Promise<Response> {
  return IS_DEMO ? mockApi(path, init) : fetch(path, init);
}
