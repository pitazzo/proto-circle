import { PostRepository } from "../../shared/domain/post-repository";
import { ID, Result } from "circle-core";
import { Post } from "../../shared/domain/post";

export class ByAuthorFinder {
  private repository: PostRepository;

  constructor(postRepository: PostRepository) {
    this.repository = postRepository;
  }

  getPostsByAuthor(authorID: ID): Result<Post[]> {
    return this.repository.getPostsByAuthor(authorID);
  }
}
