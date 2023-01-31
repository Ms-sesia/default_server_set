import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import { json } from "body-parser";

import schema from "./schema";
import graphqlUploadExpress from "./libs/graphql_fileUpload/graphqlUploadExpress";
// import { upload, uploadController, uploadSet } from "./libs/fileUpload/upload";
import dotenv from "dotenv";
dotenv.config();
import path from "path";
import { isAuthenticated, tokenParse } from "./middleWare";

/* playground modules */
// import expressPlayground from "graphql-playground-middleware-express";
// import helmet from "helmet";
// import csp from "helmet-csp";

/* subscription libs */
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";

const PORT = process.env.SERVER_PORT;

(async () => {
  const app = express();

  const httpServer = http.createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  const serverCleanup = useServer({ schema }, wsServer);

  // const pubsub = new PubSub();

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  app.use(
    "/graphql",
    cors(),
    json(),
    (req, res, next) => tokenParse(req, res, next),
    expressMiddleware(server, {
      // context: async ({ request }) => ({ request, isAuthenticated, pubsub }),
      context: async ({ request }) => ({ request, isAuthenticated }),
    })
  );

  app.use(express.static(path.join(__dirname, "../", "Images")));

  app.use(graphqlUploadExpress());

  // app.get("/", expressPlayground({ endpoint: "/graphql" }));

  // app.use(helmet());
  // app.use(
  //   csp({
  //     useDefaults: true,
  //     directives: {
  //       defaultSrc: ["'self'"],
  //       styleSrc: ["'self'", "'unsafe-inline'"],
  //       styleSrcElem: ["'self'", "fonts.googleapis.com", "cdn.jsdelivr.net", "'unsafe-inline'"],
  //       imgSrc: ["'self'", "cdn.jsdelivr.net"],
  //       scriptSrcElem: ["'self'", "cdn.jsdelivr.net", "'unsafe-inline'"],
  //       fontSrc: ["'self'", "'unsafe-inline'", "fonts.gstatic.com"],
  //     },
  //   })
  // );

  await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
  console.log(`Server ready at http://localhost:${PORT}`);
})();
