"use strict";

const Logger = use("Logger");

class TestingController {
  async index({ request }) {
    const foo = "bar";

    Logger.error(" request muito doido", {
      ...request,
      user: { id: "123234", username: "foo", email: "foo@example.com" },
    });

    return foo;
  }
}

module.exports = TestingController;
