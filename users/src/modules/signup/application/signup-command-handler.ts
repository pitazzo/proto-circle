import { CommandHandler, CommandResult, Result } from "circle-core";
import { UserRegister } from "./user-register";
import { Username } from "../../../shared/domain/valueObjects/username";
import { Email } from "../../../shared/domain/valueObjects/email";

export class SignUpCommandHandler extends CommandHandler {
  private userRegister: UserRegister;

  constructor(userRegister: UserRegister) {
    super(
      "users.user.store_user_on_signup",
      "circle.gateway.1.command.user.signedup"
    );
    this.userRegister = userRegister;
  }

  async handle(attributes: any): Promise<CommandResult> {
    const username = Username.create(attributes["username"]);
    const email = Email.create(attributes["email"]);

    const props = Result.combine([username, email]);

    if (!props.isSuccess) {
      return new CommandResult(false, props.error);
    }

    this.userRegister.handleRegister(username.getValue(), email.getValue());
    return new CommandResult(true, null);
  }
}
