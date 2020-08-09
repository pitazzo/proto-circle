import { PostRepository } from "../domain/post-repository";
import { Post } from "../domain/post";
import { Result, ID } from "circle-core";

export class MemoryPostRepository implements PostRepository {
  private posts: Post[] = [];

  publishPost(newPost: Post): Result<Post> {
    this.posts.push(newPost);
    console.log(this.posts);
    return Result.ok<Post>(newPost);
  }
  getRecentPosts(maxAmount: number): Result<Post[]> {
    return Result.ok<Post[]>(
      this.posts
        .sort((a, b) =>
          a.publishDate.getTime() > b.publishDate.getTime() ? -1 : 1
        )
        .slice(-maxAmount)
    );
  }
  getPostsByAuthor(authorID: ID): Result<Post[]> {
    return Result.ok<Post[]>(
      this.posts.filter((element) => element.authorID.value === authorID.value)
    );
  }
}
