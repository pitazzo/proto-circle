import Command from "../../../shared/application/Command";

class AddPostCommand extends Command {
  constructor(title: string, body: string) {
    super(
      "circle.gateway.1.command.post.added",
      "command",
      {
        title: title,
        body: body,
      },
      {}
    );
  }
}

export default AddPostCommand;
