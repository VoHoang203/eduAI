import { createRouteHandler } from 'uploadthing/next';
import { ourFileRouter } from './core';

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  // config: {
  //   token: process.env.UPLOADTHING_TOKEN,
  //   callbackUrl: 'https://15c2-42-113-61-25.ngrok-free.app/api/uploadthing',
  // },
  // Apply an (optional) custom config:
  // config: { ... },
});
