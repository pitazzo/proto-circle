import { UserRepository } from "../../../shared/domain/user-respository";
import { User } from "../../../shared/domain/user";
import { Username } from "../../../shared/domain/valueObjects/username";
import { Email } from "../../../shared/domain/valueObjects/email";
import { Result } from "circle-core/dist/infraestructure/result";

export class UserFinder {
  private repository: UserRepository;

  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  public find(username: Username): Result<User> {
    return this.repository.getUserByUsername(username);
  }
}
