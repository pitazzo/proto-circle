import { AMQPController } from "circle-core";
import { PostRepository } from "./shared/domain/post-repository";
import { MemoryPostRepository } from "./shared/infraestructure/memory-post-repository";
import { PublishCommandHandler } from "./modules/publish/publish-post-command-handler";
import { PostPublisher } from "./modules/publish/post-publisher";
import { ByAuthorFinder } from "./modules/getByAuthor/by-author-finder";
import { GetByAuthorQueryHandler } from "./modules/getByAuthor/get-by-author-query-handler";

const amqpController = new AMQPController("amqp://localhost", "gateway");
const repository: PostRepository = new MemoryPostRepository();

amqpController.initController().then(() => {
  amqpController.registerHandler(
    new PublishCommandHandler(new PostPublisher(repository))
  );
  amqpController.registerHandler(
    new GetByAuthorQueryHandler(new ByAuthorFinder(repository))
  );
});
