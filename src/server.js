import "./config";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import { json } from "body-parser";
import schema from "./schema";
import graphqlUploadExpress from "./libs/graphql_fileUpload/graphqlUploadExpress";
// import { upload, uploadController, uploadSet } from "./libs/fileUpload/upload";
import dotenv from "dotenv";
dotenv.config();
import path from "path";
import { isAuthenticated } from "./libs/middleWare";

/* subscription(redis) libs */
import webSocket from "./libs/webSocket/webSocket";

const PORT = process.env.SERVER_PORT;

(async () => {
  const app = express();

  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  // app.use(authenticateJwt); // 유저 토큰 인증 - 프로젝트 진행시 사용

  // 이미지 혹은 파일들 경로 접속 허용
  app.use(express.static(path.join(__dirname, "../", "images")));
  app.use(graphqlUploadExpress()); // graphql 파일업로드

  app.use(
    "/graphql",
    cors(),
    helmet({ contentSecurityPolicy: false }), // 배포시 true
    json(),
    expressMiddleware(server, { context: async ({ req }) => ({ request: req, isAuthenticated }) })
  );

  webSocket(httpServer);

  await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
  console.log(`Server ready at http://localhost:${PORT}`);
})();
