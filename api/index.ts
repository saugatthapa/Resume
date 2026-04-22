import { createApp } from "../server/app";

const app = createApp();

export const config = {
  api: { bodyParser: false },
};

export default app;
