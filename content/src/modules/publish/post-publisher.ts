import { PostRepository } from "../../shared/domain/post-repository";
import { Post } from "../../shared/domain/post";
import { Title } from "../../shared/domain/valueObjects/title";
import { Body } from "../../shared/domain/valueObjects/body";
import { ID } from "circle-core";

export class PostPublisher {
  private postRepository: PostRepository;

  constructor(postRepository: PostRepository) {
    this.postRepository = postRepository;
  }

  public publish(title: Title, body: Body, authorID: ID) {
    const post = Post.create(title, body, authorID);
    this.postRepository.publishPost(post);
  }
}
