import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/api/v2/greetings", () => {
    return HttpResponse.json({
      message: "Hello World",
      timestamp: new Date().toISOString(),
    });
  }),

  http.post("/api/v2/greetings", async ({ request }) => {
    const body = (await request.json()) as { message: string };
    return HttpResponse.json({
      message: body.message,
      timestamp: new Date().toISOString(),
    });
  }),
];
