import { ID } from "circle-core";
import { Title } from "./valueObjects/title";
import { Body } from "./valueObjects/body";

export class Post {
  title: Title;
  body: Body;
  publishDate: Date;
  authorID: ID;

  private constructor(title: Title, body: Body, authorID: ID) {
    this.title = title;
    this.body = body;
    this.publishDate = new Date();
    this.authorID = authorID;
  }

  public static create(title: Title, body: Body, authorID: ID): Post {
    //TODO: any further validation?
    return new Post(title, body, authorID);
  }

  public serialize(): Record<string, any> {
    return {
      title: this.title.value,
      body: this.body.value,
      publishDate: this.publishDate,
      authorID: this.authorID.value,
    };
  }
}
