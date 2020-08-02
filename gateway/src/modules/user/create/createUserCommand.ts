import Operation from "../../../shared/application/operation";

class CreateUserCommand extends Operation {
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
