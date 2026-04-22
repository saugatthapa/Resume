import { createApp } from "./app";

const port = Number(process.env.SERVER_PORT ?? 5174);
const app = createApp();
app.listen(port, () => {
  console.log(`[api] listening on http://localhost:${port}`);
});
