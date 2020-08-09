import { QueryHandler, Result, QueryResult } from "circle-core";
import { UserFinder } from "./user-finder";
import { Username } from "../../../shared/domain/valueObjects/username";

export class GetQueryHandler extends QueryHandler {
  private userFinder: UserFinder;

  constructor(userFinder: UserFinder) {
    super("users.user.get", "circle.gateway.1.query.user.get");
    this.userFinder = userFinder;
  }

  async handle(attributes: any): Promise<QueryResult> {
    const username = Username.create(attributes["username"]);

    if (!username.isSuccess) {
      return new QueryResult(false, username.error, null);
    }

    const result = this.userFinder.find(username.getValue());
    if (!result.isSuccess) {
      return new QueryResult(false, result.error, null);
    }
    return new QueryResult(true, null, result.getValue().serialize());
  }
}
