import { createApp } from "../artifacts/resume-tools/server/app";

const app = createApp();

export const config = {
  api: { bodyParser: false },
};

export default function handler(req: any, res: any) {
  return app(req, res);
}
