import { UserRepository } from "../domain/user-respository";
import { Result } from "circle-core";
import { User } from "../domain/user";
import { Username } from "../domain/valueObjects/username";
import { Email } from "../domain/valueObjects/email";
import { Picture } from "../domain/valueObjects/picture";

export class MemoryUserRepository implements UserRepository {
  users: User[] = [];

  storeUser(user: User): Result<User> {
    if (
      this.users.some((_user) => {
        return _user.username.value === user.username.value;
      })
    ) {
      return Result.fail<User>("An user with same username already exists");
    }
    this.users.push(user);
    console.log(this.users);
    return Result.ok<User>(user);
  }
  updateUser(
    username: Username,
    newEmail: Email,
    newPicture: Picture
  ): Result<User> {
    const user = this.users.find((element) => {
      return element.username.value === username.value;
    });
    if (!user) {
      return Result.fail<User>("No user found");
    }
    const index = this.users.indexOf(user);
    user.updateEmail(newEmail);
    user.updatePicture(newPicture);
    this.users[index] = user;
    console.log(this.users);
    return Result.ok<User>(user);
  }
  getUserByUsername(username: Username): Result<User> {
    const user = this.users.find(
      (user) => user.username.value === username.value
    );
    if (user === undefined) {
      return Result.fail<User>("No user found");
    }
    return Result.ok<User>(user);
  }
}
