import { CommandHandler, CommandResult, Result } from "circle-core";
import { Username } from "../../../shared/domain/valueObjects/username";
import { Email } from "../../../shared/domain/valueObjects/email";
import { UserEditor } from "./user-editor";
import { Picture } from "../../../shared/domain/valueObjects/picture";

export class EditUserCommandHandler extends CommandHandler {
  private userEditor: UserEditor;

  constructor(userRegister: UserEditor) {
    super(
      "users.user.update_user_on_edit",
      "circle.gateway.1.command.user.edited"
    );
    this.userEditor = userRegister;
  }

  async handle(attributes: any): Promise<CommandResult> {
    const username = Username.create(attributes["username"]);
    const email = Email.create(attributes["email"]);
    const picture = Picture.create(attributes["picture"]);
    const props = Result.combine([username, email, picture]);

    if (!props.isSuccess) {
      return new CommandResult(false, props.error);
    }
    this.userEditor.handleEdit(
      username.getValue(),
      email.getValue(),
      picture.getValue()
    );
    return new CommandResult(true, null);
  }
}
