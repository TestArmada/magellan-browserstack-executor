import Connect from "../../lib/local";
import settings from "../../lib/settings";
import chai from "chai";
import chaiAsPromise from "chai-as-promised";
import _ from "lodash";

import logger from "../../lib/logger";

// eat console logs
// logger.output = {
//   log() { },
//   error() { },
//   debug() { },
//   warn() { }
// };

chai.use(chaiAsPromise);

const expect = chai.expect;
const assert = chai.assert;

describe("Connect", () => {
  let tunnel;

  let options = {
    key: "FAKE_KEY",
    user: "FAKE_USER",
    localIdentifier: "FAKE_IDENTIFIER",
    verbose: true
  };

  let BrowserstackMock = {
    start(opts, callback) {
      callback();
    },

    stop(callback) {
      callback();
    }
  };

  beforeEach(() => {
    tunnel = new Connect(options, BrowserstackMock);
  });

  describe("initialize", () => {
    it("successful", () => {
      return tunnel
        .initialize()
        .catch(err => assert(false, "browserstack local connect isn't initialized correctly." + err));
    });

    it("missing key", () => {
      tunnel = new Connect({ user: "FAKE_USER" }, BrowserstackMock);

      return tunnel
        .initialize()
        .then(() => assert(false, "browserstack local connect key isn't processed correctly"))
        .catch(err =>
          expect(Promise.resolve(err))
            .to.eventually
            .equal("Browserstack local tunnel support is missing configuration: Browserstack key."));
    });

    it("missing user", () => {
      tunnel = new Connect({ key: "FAKE_KEY" }, BrowserstackMock);

      return tunnel
        .initialize()
        .then(() => assert(false, "browserstack local connect key isn't processed correctly"))
        .catch(err =>
          expect(Promise.resolve(err))
            .to.eventually
            .equal("Browserstack local tunnel support is missing configuration: Browserstack user."));
    });
  });

  describe("open", function () {
    this.timeout(60000);

    afterEach(() => {
      BrowserstackMock.start = (opts, callback) => callback();
      settings.BAILED = false;
    });

    it("straight succeed", () => {
      return tunnel
        .open()
        .then()
        .catch(err => assert(false, "browserstack local connect isn't open correctly." + err));
    });

    it("straight fail", () => {
      BrowserstackMock.start = (opts, callback) => callback("FAKE_ERROR");

      return tunnel
        .open()
        .then(() => assert(false, "browserstack local connect open isn't failed correctly."))
        .catch(err => expect(err.message).to.equal("Failed to create a secure browserstack local connect after 10 attempts."));
    });

    it("bail fail", () => {
      settings.BAILED = true;
      BrowserstackMock.start = (opts, callback) => callback("FAKE_ERROR");

      return tunnel
        .open()
        .then(() => assert(false, "browserstack local connect open isn't failed correctly."))
        .catch(err => expect(err.message).to.equal("Bailed due to maximum number of browsetstack connect retries."));
    });
  });

  describe("close", function () {
    this.timeout(60000);

    it("connect isn't closed", () => {
      return tunnel
        .close()
        .then()
        .catch(err => assert(false, "browserstack local connect isn't close correctly." + err));
    });
  });
});
