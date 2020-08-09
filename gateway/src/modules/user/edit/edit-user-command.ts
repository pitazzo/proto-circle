import { Command } from "circle-core";

class EditUserCommand extends Command {
  constructor(username: string, email: string, picture: string) {
    super(
      "circle.gateway.1.command.user.edited",
      {
        username: username,
        email: email,
        picture: picture,
      },
      {}
    );
  }
}

export default EditUserCommand;
