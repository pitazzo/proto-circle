import "graphql-import-node";
import { GraphQLSchema } from "graphql";
import { makeExecutableSchema } from "graphql-tools";

import * as typeDefs from "./schema.graphql";
import resolvers from "./resolverMap";

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default schema;
