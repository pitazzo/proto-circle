import { Username } from "./valueObjects/username";
import { Email } from "./valueObjects/email";
import { Picture } from "./valueObjects/picture";
import { Result } from "circle-core";

export class User {
  username: Username;
  email: Email;
  picture: Picture;
  enrollmentDate: Date;
  posts: number;

  private constructor(username: Username, email: Email) {
    this.username = username;
    this.email = email;
    this.picture = Picture.create(" ").getValue();
    this.enrollmentDate = new Date();
    this.posts = 0;
  }

  public static create(username: Username, email: Email): Result<User> {
    //TODO: more validation?
    return Result.ok<User>(new User(username, email));
  }

  public updateEmail(email: Email): void {
    this.email = email;
  }

  public updatePicture(picture: Picture): void {
    this.picture = picture;
  }

  public serialize(): Record<string, any> {
    return {
      username: this.username.value,
      email: this.email.value,
      picture: this.picture.value,
      enrollmentDate: this.enrollmentDate,
      posts: this.posts,
    };
  }
}
