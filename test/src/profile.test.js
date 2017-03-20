import profile from "../../lib/profile";
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

describe("Profile", function () {
  this.timeout(60000);
  describe("getProfiles", () => {
    it("with bs_browser with browser", () => {
      let argvMock = {
        bs_browser: "chrome_56_0_Windows_7"
      };

      return profile
        .getProfiles({}, argvMock)
        .then((profile) => {
          expect(profile.desiredCapabilities.browser).to.equal("chrome");
          expect(profile.desiredCapabilities.browser_version).to.equal("56.0");
          expect(profile.desiredCapabilities.os).to.equal("Windows");
          expect(profile.desiredCapabilities.os_version).to.equal("7");
          expect(profile.desiredCapabilities.device).to.equal(null);
          expect(profile.executor).to.equal("browserstack");
          expect(profile.nightwatchEnv).to.equal("browserstack");
          expect(profile.id).to.equal("chrome_56_0_Windows_7");
        });
    });

    it("with bs_browser with device", () => {
      let argvMock = {
        bs_browser: "ipad_ios_9_1_iPad_Pro"
      };

      return profile
        .getProfiles({}, argvMock)
        .then((profile) => {
          expect(profile.desiredCapabilities.browser).to.equal("ipad");
          expect(profile.desiredCapabilities.browser_version).to.equal(null);
          expect(profile.desiredCapabilities.os).to.equal("ios");
          expect(profile.desiredCapabilities.os_version).to.equal("9.1");
          expect(profile.desiredCapabilities.device).to.equal("iPad Pro");
          expect(profile.executor).to.equal("browserstack");
          expect(profile.nightwatchEnv).to.equal("browserstack");
          expect(profile.id).to.equal("ipad_ios_9_1_iPad_Pro");
        });
    });

    it("with bs_browsers", () => {
      let argvMock = {
        bs_browsers: "ipad_ios_9_1_iPad_Pro, chrome_56_0_Windows_7"
      };

      return profile
        .getProfiles({}, argvMock)
        .then((profiles) => {
          expect(profiles.length).to.equal(2);
          expect(profiles[0].desiredCapabilities.browser).to.equal("ipad");
          expect(profiles[0].desiredCapabilities.browser_version).to.equal(null);
          expect(profiles[0].desiredCapabilities.os).to.equal("ios");
          expect(profiles[0].desiredCapabilities.os_version).to.equal("9.1");
          expect(profiles[0].desiredCapabilities.device).to.equal("iPad Pro");
          expect(profiles[0].executor).to.equal("browserstack");
          expect(profiles[0].nightwatchEnv).to.equal("browserstack");
          expect(profiles[0].id).to.equal("ipad_ios_9_1_iPad_Pro");
          expect(profiles[1].desiredCapabilities.browser).to.equal("chrome");
          expect(profiles[1].desiredCapabilities.browser_version).to.equal("56.0");
          expect(profiles[1].desiredCapabilities.os).to.equal("Windows");
          expect(profiles[1].desiredCapabilities.os_version).to.equal("7");
          expect(profiles[1].desiredCapabilities.device).to.equal(null);
          expect(profiles[1].executor).to.equal("browserstack");
          expect(profiles[1].nightwatchEnv).to.equal("browserstack");
          expect(profiles[1].id).to.equal("chrome_56_0_Windows_7");
        });
    });

    it("without param", () => {
      let argvMock = {};

      return profile
        .getProfiles({}, argvMock)
        .then((thing) => {
          expect(thing).to.equal(undefined);
        });
    });
  });

  describe("getCapabilities", () => {
    it("desktop web", () => {
      let p = {
        "browser": "chrome_56_0_Windows_7",
        "resolution": "1280x1024",
        "executor": "browserstack"
      };

      return profile
        .getCapabilities(p)
        .then((profile) => {
          expect(profile.desiredCapabilities.browser).to.equal("chrome");
          expect(profile.desiredCapabilities.browser_version).to.equal("56.0");
          expect(profile.desiredCapabilities.os).to.equal("Windows");
          expect(profile.desiredCapabilities.os_version).to.equal("7");
          expect(profile.desiredCapabilities.device).to.equal(null);
          expect(profile.executor).to.equal("browserstack");
          expect(profile.nightwatchEnv).to.equal("browserstack");
          expect(profile.id).to.equal("chrome_56_0_Windows_7");
        });
    });

    it("mobile device", () => {
      let p = {
        "browser": "ipad_ios_9_1_iPad_Pro",
        "executor": "browserstack",
        "orientation": "portrait"
      };

      return profile
        .getCapabilities(p)
        .then((profile) => {
          expect(profile.desiredCapabilities.browser).to.equal("ipad");
          expect(profile.desiredCapabilities.browser_version).to.equal(null);
          expect(profile.desiredCapabilities.os).to.equal("ios");
          expect(profile.desiredCapabilities.os_version).to.equal("9.1");
          expect(profile.desiredCapabilities.device).to.equal("iPad Pro");
          expect(profile.executor).to.equal("browserstack");
          expect(profile.nightwatchEnv).to.equal("browserstack");
          expect(profile.id).to.equal("ipad_ios_9_1_iPad_Pro");
        });
    });

    it("cannot solve", () => {
      let p = {
        "browser": "ipad_ios_9_1_iPad_Pro_2",
        "executor": "browserstack",
        "orientation": "portrait"
      };

      return profile
        .getCapabilities(p)
        .then((profile) => {
          assert(false, "shoudn't be here");
        })
        .catch(err => {
          expect(err).to.match(/^Executor browserstack cannot resolve profile/);
        });
    });
  });

  describe("listBrowsers", () => {
    it("from browserstack", (done) => {
      return profile
        .listBrowsers({}, (err, browserTable) => {
          expect(err).to.equal(null);
          done();
        });
    });
  });

  describe("getNightwatchConfig", () => {
    it("without tunnel", () => {
      const config = profile.getNightwatchConfig({
        desiredCapabilities: {
          "os": "ios",
          "os_version": "9.1",
          "browser": "ipad",
          "device": "iPad Pro",
          "browser_version": null,
        }
      },
        {
          user: "FAKE_USER",
          key: "FAKE_KEY",
          useTunnels: false,
          localIdentifier: "FAKE_TUNNEl_ID"
        });

      expect(config.desiredCapabilities.browser).to.equal("ipad");
      expect(config.desiredCapabilities["browserstack.user"]).to.equal("FAKE_USER");
      expect(config.desiredCapabilities["browserstack.key"]).to.equal("FAKE_KEY");
    });

    it("with tunnel", () => {
      const config = profile.getNightwatchConfig({
        desiredCapabilities: {
          "os": "ios",
          "os_version": "9.1",
          "browser": "ipad",
          "device": "iPad Pro",
          "browser_version": null,
        }
      },
        {
          user: "FAKE_USER",
          key: "FAKE_KEY",
          useTunnels: true,
          localIdentifier: "FAKE_TUNNEl_ID"
        });

      expect(config.desiredCapabilities.browser).to.equal("ipad");
      expect(config.desiredCapabilities["browserstack.user"]).to.equal("FAKE_USER");
      expect(config.desiredCapabilities["browserstack.key"]).to.equal("FAKE_KEY");
      expect(config.desiredCapabilities["browserstack.local"]).to.equal(true);
      expect(config.desiredCapabilities["browserstack.localIdentifier"]).to.equal("FAKE_TUNNEl_ID");
    });
  });
});