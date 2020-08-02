import Operation from "../../../shared/application/operation";

class GetUserQuery extends Operation {
  constructor(username: string) {
    super(
      "circle.gateway.1.query.user.get",
      "query",
      {
        username: username,
      },
      {}
    );
  }
}

export default GetUserQuery;
