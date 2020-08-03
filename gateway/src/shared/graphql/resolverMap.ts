import {
  AddPostInput,
  Post,
  User,
  Maybe,
  UserSignUpInput,
  MutationResult,
} from "./../../generated/graphql";
import { IResolvers } from "graphql-tools";
import CommandBus from "../amqp/CommandBus";
import CreateUserCommand from "../../modules/user/create/CreateUserCommand";
import CommandResult from "../application/CommandResult";
import AddPostCommand from "../../modules/post/add/AddPostCommand";

const resolverMap: IResolvers = {
  Query: {
    recentPosts: async (_: any, __: void): Promise<Array<Post>> => {
      return [];
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
    ): Promise<MutationResult> => {
      const bus: CommandBus = await CommandBus.getInstance();
      try {
        const response = await bus.dispatch(
          new AddPostCommand(addPostInput.title, addPostInput.body)
        );
        return response;
      } catch (e) {
        return new CommandResult(false, e);
      }
    },
    signUp: async (
      _: any,
      { userSignUpInput }: { userSignUpInput: UserSignUpInput }
    ): Promise<MutationResult> => {
      const bus: CommandBus = await CommandBus.getInstance();
      try {
        const response = await bus.dispatch(
          new CreateUserCommand(userSignUpInput.username, userSignUpInput.email)
        );
        return response;
      } catch (e) {
        return new CommandResult(false, e);
      }
    },
  },
};

export default resolverMap;
