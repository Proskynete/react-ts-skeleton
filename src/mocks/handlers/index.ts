/**
 * MSW Request Handlers
 *
 * Define your API mocks here using MSW handlers.
 * These handlers will be used by both browser.ts (development) and server.ts (testing).
 *
 * @example
 * import { http, HttpResponse } from 'msw';
 *
 * export const handlers = [
 *   http.get('/api/users', () => {
 *     return HttpResponse.json([
 *       { id: 1, name: 'John Doe' },
 *       { id: 2, name: 'Jane Smith' },
 *     ]);
 *   }),
 *
 *   http.post('/api/users', async ({ request }) => {
 *     const newUser = await request.json();
 *     return HttpResponse.json(newUser, { status: 201 });
 *   }),
 * ];
 */

export const handlers: any[] = [
  // Add your API mocks here
];
