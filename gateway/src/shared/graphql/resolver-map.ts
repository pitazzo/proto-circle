import {
  Post,
  User,
  Maybe,
  MutationResult,
  PublishPostInput,
  SignUpUserInput,
  EditUserInput,
} from "../../generated/graphql";
import { IResolvers } from "graphql-tools";
import { CommandResult, QueryResult } from "circle-core";
import OperationBus from "../amqp/operation-bus";
import SignUpUserCommand from "../../modules/user/create/create-user-command";
import PublishPostCommand from "../../modules/post/add/publish-post-command";
import EditUserCommand from "../../modules/user/edit/edit-user-command";
import { ApolloError } from "apollo-server-express";
import { GetUserQuery } from "../../modules/user/get/get-user-query";
import { GetPostsByAuthor } from "../../modules/post/getByAuthor/get-posts-by-author-command";

function handleQueryResult(result: QueryResult): any {
  if (!result.accepted) {
    throw new ApolloError(result.failureReason || "Unknown error");
  }
  return result.dto;
}

const resolverMap: IResolvers = {
  Query: {
    recentPosts: async (_: any, __: void): Promise<Array<Post>> => {
      return [];
    },
    user: async (
      _: any,
      { username }: { username: string }
    ): Promise<Maybe<User>> => {
      const response = await OperationBus.ask(new GetUserQuery(username));
      return handleQueryResult(response);
    },
    postsByAuthor: async (
      _: any,
      { authorID }: { authorID: string }
    ): Promise<Maybe<Array<Post>>> => {
      const response = await OperationBus.ask(new GetPostsByAuthor(authorID));
      return handleQueryResult(response);
    },
  },

  Mutation: {
    publishPost: async (
      _: any,
      { publishPostInput }: { publishPostInput: PublishPostInput }
    ): Promise<MutationResult> => {
      try {
        const myUUID = "f61146da-96f8-44f1-b013-ca3497006390";
        const response = await OperationBus.dispatch(
          new PublishPostCommand(
            publishPostInput.title,
            publishPostInput.body,
            myUUID
          )
        );
        return response;
      } catch (e) {
        return new CommandResult(false, e);
      }
    },
    signUpUser: async (
      _: any,
      { signUpUserInput }: { signUpUserInput: SignUpUserInput }
    ): Promise<MutationResult> => {
      try {
        const response = await OperationBus.dispatch(
          new SignUpUserCommand(signUpUserInput.username, signUpUserInput.email)
        );
        return response;
      } catch (e) {
        return new CommandResult(false, e);
      }
    },
    editUser: async (
      _: any,
      { editUserInput }: { editUserInput: EditUserInput }
    ): Promise<MutationResult> => {
      try {
        const response = await OperationBus.dispatch(
          new EditUserCommand(
            editUserInput.username,
            editUserInput.email,
            editUserInput.picture
          )
        );
        return response;
      } catch (e) {
        return new CommandResult(false, e);
      }
    },
  },
};

export default resolverMap;
