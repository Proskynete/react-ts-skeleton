import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/api/v2/greetings", () => {
    return HttpResponse.json([
      {
        id: "1",
        message: "Hello World",
        timestamp: new Date().toISOString(),
      },
      {
        id: "2",
        message: "Welcome to the app!",
        timestamp: new Date().toISOString(),
      },
    ]);
  }),

  http.get("/api/v2/greetings/:id", ({ params }) => {
    return HttpResponse.json({
      id: params.id as string,
      message: "Hello World",
      timestamp: new Date().toISOString(),
    });
  }),

  http.post("/api/v2/greetings", async ({ request }) => {
    const body = (await request.json()) as { message: string };
    return HttpResponse.json({
      id: Math.random().toString(),
      message: body.message,
      timestamp: new Date().toISOString(),
    });
  }),
];
