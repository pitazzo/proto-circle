import { AMQPController } from "circle-core";
import { SignUpCommandHandler } from "./modules/signup/application/signup-command-handler";
import { UserRegister } from "./modules/signup/application/user-register";
import { MemoryUserRepository } from "./shared/infraestructure/memory-user-repository";
import { EditUserCommandHandler } from "./modules/edit/application/edit-user-command-handler";
import { UserEditor } from "./modules/edit/application/user-editor";
import { UserRepository } from "./shared/domain/user-respository";
import { GetQueryHandler } from "./modules/get/application/get-query-handler";
import { UserFinder } from "./modules/get/application/user-finder";

const amqpController = new AMQPController("amqp://localhost", "gateway");
const repository: UserRepository = new MemoryUserRepository();

amqpController.initController().then(() => {
  amqpController.registerHandler(
    new SignUpCommandHandler(new UserRegister(repository))
  );
  amqpController.registerHandler(
    new EditUserCommandHandler(new UserEditor(repository))
  );

  amqpController.registerHandler(
    new GetQueryHandler(new UserFinder(repository))
  );
});
