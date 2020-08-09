import { Result } from "circle-core";
import { User } from "./user";
import { Username } from "./valueObjects/username";
import { Email } from "./valueObjects/email";
import { Picture } from "./valueObjects/picture";

export abstract class UserRepository {
  abstract storeUser(user: User): Result<User>;
  abstract updateUser(
    username: Username,
    newEmail: Email,
    newPicture: Picture
  ): Result<User>;
  abstract getUserByUsername(username: Username): Result<User>;
}
