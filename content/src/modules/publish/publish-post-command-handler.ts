import { CommandHandler, CommandResult, ID, Result } from "circle-core";
import { PostPublisher } from "./post-publisher";
import { Title } from "../../shared/domain/valueObjects/title";
import { Body } from "../../shared/domain/valueObjects/body";

export class PublishCommandHandler extends CommandHandler {
  private postPublisher: PostPublisher;

  constructor(postPublisher: PostPublisher) {
    super(
      "content.posts.store_post_on_publish",
      "circle.gateway.1.command.post.published"
    );
    this.postPublisher = postPublisher;
  }

  async handle(dto: string): Promise<CommandResult> {
    const title = Title.create(dto["title"]);
    const body = Body.create(dto["body"]);
    const authorID = ID.create(dto["authorID"]);

    const result = Result.combine([title, body, authorID]);
    if (!result.isSuccess) {
      return new CommandResult(false, result.error);
    }

    this.postPublisher.publish(
      title.getValue(),
      body.getValue(),
      authorID.getValue()
    );

    return new CommandResult(true, null);
  }
}
