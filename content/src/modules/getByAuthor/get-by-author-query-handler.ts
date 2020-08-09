import { QueryHandler, QueryResult, ID } from "circle-core";
import { ByAuthorFinder } from "./by-author-finder";

export class GetByAuthorQueryHandler extends QueryHandler {
  private byAuthorFinder: ByAuthorFinder;

  constructor(byAuthorFinder: ByAuthorFinder) {
    super(
      "content.posts.get_by_author",
      "circle.gateway.1.query.post.get_by_author"
    );
    this.byAuthorFinder = byAuthorFinder;
  }

  async handle(dto: string): Promise<QueryResult> {
    const authorID = ID.create(dto["authorID"]);
    if (!authorID.isSuccess) {
      return new QueryResult(false, authorID.error, null);
    }

    const result = this.byAuthorFinder.getPostsByAuthor(authorID.getValue());
    if (!result.isSuccess) {
      return new QueryResult(false, result.error, null);
    }
    return new QueryResult(
      true,
      null,
      result.getValue().map((post) => post.serialize())
    );
  }
}
