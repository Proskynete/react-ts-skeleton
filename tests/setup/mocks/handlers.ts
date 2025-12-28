/**
 * MSW Test Handlers
 *
 * Define test-specific mock responses here.
 * These handlers are used by the MSW server during testing (vitest).
 *
 * For development mocks, use src/mocks/handlers/index.ts instead.
 *
 * @example
 * import { http, HttpResponse } from 'msw';
 *
 * export const handlers = [
 *   http.get('/api/example', () => {
 *     return HttpResponse.json({
 *       id: 1,
 *       name: 'Test Example',
 *     });
 *   }),
 * ];
 */

import { http, HttpResponse } from "msw";

export const handlers = [
  // Example: Mock a GET request
  http.get("/api/example", () => {
    return HttpResponse.json({
      id: 1,
      message: "This is an example response",
      timestamp: new Date().toISOString(),
    });
  }),

  // Example: Mock a POST request
  http.post("/api/example", async ({ request }) => {
    const body = (await request.json()) as any;
    return HttpResponse.json(
      {
        ...body,
        id: Math.random().toString(36).slice(2),
        createdAt: new Date().toISOString(),
      },
      { status: 201 }
    );
  }),
];
