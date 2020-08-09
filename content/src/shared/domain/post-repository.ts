import { Post } from "./post";
import { Result, ID } from "circle-core";

export abstract class PostRepository {
  abstract publishPost(newPost: Post): Result<Post>;
  abstract getRecentPosts(maxAmount: number): Result<Post[]>;
  abstract getPostsByAuthor(authorID: ID): Result<Post[]>;
}
