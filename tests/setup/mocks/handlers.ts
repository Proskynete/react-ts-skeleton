import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/api/v1/greetings", () => {
    return HttpResponse.json({
      id: "1",
      message: "Hello World",
      timestamp: new Date().toISOString(),
    });
  }),

  http.post("/api/v1/greetings", async ({ request }) => {
    const body = (await request.json()) as { message: string };
    return HttpResponse.json({
      id: Math.random().toString(),
      message: body.message,
      timestamp: new Date().toISOString(),
    });
  }),
];
