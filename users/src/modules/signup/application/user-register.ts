import { UserRepository } from "../../../shared/domain/user-respository";
import { User } from "../../../shared/domain/user";
import { Username } from "../../../shared/domain/valueObjects/username";
import { Email } from "../../../shared/domain/valueObjects/email";

export class UserRegister {
  private repository: UserRepository;

  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  public handleRegister(username: Username, email: Email) {
    const newUser = User.create(username, email);
    if (newUser.isSuccess) {
      this.repository.storeUser(newUser.getValue());
    }
  }
}
