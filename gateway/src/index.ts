import express from "express";
import { createServer } from "http";
import compression from "compression";
import cors from "cors";

import apolloServer from "./shared/graphql/apollo-server";
import OperationBus from "./shared/amqp/operation-bus";

const app = express();

app.use("*", cors());
app.use(compression());

apolloServer.applyMiddleware({ app, path: "/graphql" });

const httpServer = createServer(app);
httpServer.listen({ port: 3000 }, (): void =>
  console.log(`\n🚀  GraphQL is now running on http://localhost:3000/graphql\n`)
);
