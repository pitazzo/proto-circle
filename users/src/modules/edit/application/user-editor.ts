import { UserRepository } from "../../../shared/domain/user-respository";
import { User } from "../../../shared/domain/user";
import { Username } from "../../../shared/domain/valueObjects/username";
import { Email } from "../../../shared/domain/valueObjects/email";
import { Picture } from "../../../shared/domain/valueObjects/picture";

export class UserEditor {
  private repository: UserRepository;

  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  public handleEdit(username: Username, newEmail: Email, newPicture: Picture) {
    this.repository.updateUser(username, newEmail, newPicture);
  }
}
