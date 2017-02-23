import Connect from "../../lib/local";
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
    key: "3PCHzsGgb9yGMapTRsJq",
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
      tunnel = new Connect({}, BrowserstackMock);

      return tunnel
        .initialize()
        .then(() => assert(false, "browserstack local connect key isn't processed correctly"))
        .catch(err =>
          expect(Promise.resolve(err))
            .to.eventually
            .equal("Browserstack local support is missing configuration: Browserstack key."));
    });
  });

  describe("open", function () {
    this.timeout(60000);

    afterEach(() => {
      BrowserstackMock.start = (opts, callback) => callback();
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
        .then(() => assert(false, "browserstack local connect open isn't failed correctly." + err))
        .catch(err => expect(err.message).to.equal("Failed to create a secure browserstack local connect after 10 attempts."));
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
