import {
  AddPostInput,
  Post,
  User,
  Maybe,
  UserSignUpInput,
} from "./../../generated/graphql";
import { IResolvers } from "graphql-tools";
import OperationBus from "../amqp/operationBus";
import CreateUserCommand from "../../modules/user/create/createUserCommand";

const resolverMap: IResolvers = {
  Query: {
    recentPosts: async (_: any, __: void): Promise<Array<Post>> => {
      const bus: OperationBus = await OperationBus.getInstance();
      const response = await bus.dispatch(new CreateUserCommand("pitazzo", "hola@pedromalo.dev"));
      console.log(response);
      return [

      ];
    },
    user: async (
      _: any,
      { username }: { username: String }
    ): Promise<Maybe<User>> => {
      return null;
    },
  },

  Mutation: {
    addPost: async (
      _: any,
      { addPostInput }: { addPostInput: AddPostInput }
    ): Promise<Post> => {
      return {
        title: "",
        body: "",
        publicationDate: "",
        author: {
          username: "",
          email: "",
          enrollmentDate: "",
          posts: 0,
        },
      };
    },
    signUp: async (
      _: any,
      { userSignUpInput }: { userSignUpInput: UserSignUpInput }
    ): Promise<Maybe<User>> => {
      return null;
    },
  },
};

export default resolverMap;
