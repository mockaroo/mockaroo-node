const axios = require("axios");
const nock = require("nock");
const Mockaroo = require("mockaroo");
import("chai").then((chai) => {
  chai.should();
});

axios.defaults.adatper = "axios/lib/adapters/http";

describe("Client", function () {
  describe("constructor", function () {
    it("should require an api key", function () {
      try {
        // eslint-disable-next-line no-new
        new Mockaroo.Client({});
      } catch (error) {
        error.message.should.equal("apiKey is required");
      }
    });
  });

  describe("convertError", function () {
    const client = new Mockaroo.Client({
      apiKey: "xxx"
    });
    describe("convertError", function () {
      it("should convert Invalid API Key to InvalidApiKeyError", function () {
        client.convertError({ data: { error: "Invalid API Key" } }).should.be.a.instanceOf(Mockaroo.errors.InvalidApiKeyError);
      });

      it("should convert errors containing \"limited\" to UsageLimitExceededError", function () {
        client.convertError({ data: { error: "Silver plans are limited to 1,000,000 records per day." } }).should.be.a.instanceOf(Mockaroo.errors.UsageLimitExceededError);
      });
    });

    it("should convert errors containing \"limited\" to UsageLimitExceededError", function () {
      client
        .convertError({
          data: {
            error: "Silver plans are limited to 1,000,000 records per day."
          }
        })
        .should.be.a.instanceOf(Mockaroo.errors.UsageLimitExceededError);
    });
  });

  describe("getUrl", function () {
    it("should default to https://api.mockaroo.com", function () {
      const client = new Mockaroo.Client({
        apiKey: "xxx"
      });

      client
        .getUrl()
        .should.equal(
          "https://api.mockaroo.com/api/generate.json?client=node&key=xxx&count=1"
        );
    });

    it("should allow you to change the port", function () {
      const client = new Mockaroo.Client({
        apiKey: "xxx",
        secure: false,
        port: 3000
      });

      client
        .getUrl()
        .should.equal(
          "http://api.mockaroo.com:3000/api/generate.json?client=node&key=xxx&count=1"
        );
    });

    it("should use http when secure:false", function () {
      const client = new Mockaroo.Client({
        apiKey: "xxx",
        secure: false
      });

      client
        .getUrl()
        .should.equal(
          "http://api.mockaroo.com/api/generate.json?client=node&key=xxx&count=1"
        );
    });

    it("should allow you to set a count > 1", function () {
      const client = new Mockaroo.Client({
        apiKey: "xxx"
      });

      client
        .getUrl({ count: 10 })
        .should.equal(
          "https://api.mockaroo.com/api/generate.json?client=node&key=xxx&count=10"
        );
    });

    it("should allow you to customize the host", function () {
      const client = new Mockaroo.Client({
        apiKey: "xxx",
        host: "foo"
      });

      client
        .getUrl()
        .should.equal(
          "https://foo/api/generate.json?client=node&key=xxx&count=1"
        );
    });

    it("should include schema", function () {
      const client = new Mockaroo.Client({
        apiKey: "xxx"
      });

      client
        .getUrl({ schema: "MySchema" })
        .should.equal(
          "https://api.mockaroo.com/api/generate.json?client=node&key=xxx&count=1&schema=MySchema"
        );
    });

    it("should allow you to generate csv", function () {
      const client = new Mockaroo.Client({
        apiKey: "xxx"
      });

      client
        .getUrl({ format: "csv" })
        .should.equal(
          "https://api.mockaroo.com/api/generate.csv?client=node&key=xxx&count=1"
        );
    });

    it("should allow you to remove the header from csv", function () {
      const client = new Mockaroo.Client({
        apiKey: "xxx"
      });

      client
        .getUrl({ format: "csv", header: false })
        .should.equal(
          "https://api.mockaroo.com/api/generate.csv?client=node&key=xxx&count=1&header=false"
        );
    });
  });

  describe("generate", function () {
    const client = new Mockaroo.Client({
      apiKey: "xxx"
    });

    beforeEach((done) => {
      done();
      if (!nock.isActive()) nock.activate();
    });

    it("should require fields or schema", function () {
      (function () {
        client.generate();
      }).should.throw("Either fields or schema option must be specified");
    });

    describe("when successful", function () {
      nock("http://api.mockaroo.com")
        .post(/\/api\/generate\.json.*successResponse.*/)
        .reply(200, JSON.stringify([{ foo: "bar" }]));

      const client = new Mockaroo.Client({
        apiKey: "successResponse",
        secure: false
      });
      it("should resolve", async () => {
        const response = await client
          .generate({
            fields: [
              {
                name: "foo",
                type: "Custom List",
                values: ["bar"]
              }
            ]
          });

        response.should.eql([{ foo: "bar" }]);
      });
    });

    describe("when unsuccessful", function () {
      nock("http://api.mockaroo.com")
        .post(/\/api\/generate\.json.*rejectedResponse*/)
        .replyWithError({ status: 500, data: { error: "Internal Server Error" } });

      const client = new Mockaroo.Client({
        secure: false,
        apiKey: "rejectedResponse"
      });
      it("should handle errors", async () => {
        try {
          await client.generate({
            count: 3,
            fields: [
              {
                name: "foo",
                type: "Custom List",
                values: ["bar"]
              }
            ]
          });
        } catch (error) {
          error.should.be.a.instanceOf(Mockaroo.errors.ApiError);
        }
      });
    });

    it("should required fields to be an array", function () {
      (function () {
        client.generate({ fields: "foo" });
      }).should.throw("fields must be an array");
    });

    it("should required a name for each field", function () {
      (function () {
        client.generate({ fields: [{ type: "Row Number" }] });
      }).should.throw("each field must have a name");
    });

    it("should required a type for each field", function () {
      (function () {
        client.generate({ fields: [{ name: "ID" }] });
      }).should.throw("each field must have a type");
    });
  });
});
