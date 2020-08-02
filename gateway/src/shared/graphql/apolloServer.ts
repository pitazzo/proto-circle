import { ApolloServer } from "apollo-server-express";
import depthLimit from "graphql-depth-limit";
import schema from "./schema";

const apolloServer = new ApolloServer({
  schema,
  validationRules: [depthLimit(7)],
});

export default apolloServer;
