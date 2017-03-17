import configuration from "../../lib/configuration";
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

describe("Configuration", () => {
  it("getConfig", () => {
    const config = configuration.getConfig();

    expect(config.key).to.equal(null);
    expect(config.user).to.equal(null);
    expect(config.useTunnels).to.equal(null);
    expect(config.localIdentifier).to.equal(null);
  });

  describe("validateConfig", () => {
    it("Executor disabled", () => {
      let argvMock = {};

      const config = configuration.validateConfig({}, {}, {});

      expect(config.key).to.equal(undefined);
      expect(config.user).to.equal(undefined);
      expect(config.useTunnels).to.equal(false);
      expect(config.localIdentifier).to.equal(undefined);
    });

    describe("executor enabled", () => {
      let argvMock = {
        bs_browsers: "chrome_56_0_Windows_7",
        bs_browser: "chrome_56_0_Windows_7"
      };

      it("succeed", () => {
        let argvMock = {
          bsbrowsers: "chrome_56_0_Windows_7",
          bs_browser: "chrome_56_0_Windows_7",
          bs_create_tunnel: true
        };
        let envMock = {
          BROWSERSTACK_USER: "FAKE_USERNAME",
          BROWSERSTACK_ACCESS_KEY: "FAKE_ACCESSKEY"
        };

        const config = configuration.validateConfig({}, argvMock, envMock);

        expect(config.key).to.equal("FAKE_ACCESSKEY");
        expect(config.user).to.equal("FAKE_USERNAME");
        expect(config.useTunnels).to.equal(true);
        expect(config.localIdentifier).to.be.a("string");
      });

      it("missing BROWSERSTACK_USER", () => {
        let envMock = {
          // BROWSERSTACK_USER: "FAKE_USERNAME",
          BROWSERSTACK_ACCESS_KEY: "FAKE_ACCESSKEY"
        };

        try {
          configuration.validateConfig({}, argvMock, envMock);
          assert(false, "tunnel config shouldn't pass verification.");
        } catch (e) {
          expect(e.message).to.equal("Missing configuration for Browserstack local tunnel.");
        }
      });

      it("missing BROWSERSTACK_ACCESS_KEY", () => {
        let envMock = {
          BROWSERSTACK_USER: "FAKE_USERNAME",
          // BROWSERSTACK_ACCESS_KEY: "FAKE_ACCESSKEY"
        };

        try {
          configuration.validateConfig({}, argvMock, envMock);
          assert(false, "tunnel config shouldn't pass verification.");
        } catch (e) {
          expect(e.message).to.equal("Missing configuration for Browserstack local tunnel.");
        }
      });

      it("co-existence of bs_create_tunnel and bs_tunnel_id", () => {
        let argvMock = {
          bsbrowsers: "chrome_56_0_Windows_7",
          bs_browser: "chrome_56_0_Windows_7",
          bs_create_tunnel: true,
          bs_tunnel_id: "FAKE_TUNNEL_ID"
        };

        let envMock = {
          BROWSERSTACK_USER: "FAKE_USERNAME",
          BROWSERSTACK_ACCESS_KEY: "FAKE_ACCESSKEY"
        };

        try {
          configuration.validateConfig({}, argvMock, envMock);
        } catch (e) {
          expect(e.message).to.match(/^Only one Browserstack local tunnel arg is allowed/);
        }
      });
    });
  });
});