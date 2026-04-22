import { createApp } from "../artifacts/resume-tools/server/app";

const app = createApp();

export const config = {
  api: { bodyParser: false },
};

export default app;
