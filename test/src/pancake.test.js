import pancake from "../../lib/pancake";
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

describe("Pancake", function () {
  this.timeout(60000);

  describe("initialize", () => {
    it("force no cache", () => {
      return pancake
        .initialize(true)
        .then(browsers => {
          expect(_.keys(browsers).length).to.greaterThan(0);
        });
    });

    it("configuration validation error", () => {
      let envMock = {
        BROWSERSTACK_USER: "FAKE_USERNAME",
        BROWSERSTACK_ACCESS_KEY: "FAKE_ACCESSKEY"
      };

      let argvMock = {
        bsbrowsers: "chrome_56_0_Windows_7",
        bs_browser: "chrome_56_0_Windows_7",
        bs_create_tunnel: true,
        bs_tunnel_id: "FAKE_TUNNEL_ID"
      };

      return pancake
        .initialize(true, argvMock, envMock)
        .then(browsers => {
          assert(false, "shouldn't be here");
        })
        .catch(err => {
          expect(err.message).to.match(/^Only one Browserstack local tunnel arg is allowed/);
        });
    });
  });

  it("get", () => {
    return pancake
      .initialize()
      .then(() => {
        expect(pancake.get("FAKE_BROWSER")).to.equal(undefined);
      });
  });
});