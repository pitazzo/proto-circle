import Command from "../../../shared/application/Command";

class CreateUserCommand extends Command {
  constructor(username: string, email: string) {
    super(
      "circle.gateway.1.command.user.created",
      "command",
      {
        username: username,
        email: email,
      },
      {}
    );
  }
}

export default CreateUserCommand;
