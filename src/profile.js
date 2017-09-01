import _ from "lodash";
import { argv } from "yargs";
import logger from "testarmada-logger";
import Pancake from "./pancake";

export default {
  getNightwatchConfig: (profile, browserstackSettings) => {
    logger.prefix = "Browserstack Executor";
    const capabilities = _.assign({}, profile.desiredCapabilities);

    capabilities["browserstack.user"] = browserstackSettings.user;
    capabilities["browserstack.key"] = browserstackSettings.key;

    if (browserstackSettings.useTunnels) {
      capabilities["browserstack.local"] = true;
      capabilities["browserstack.localIdentifier"] = browserstackSettings.localIdentifier;
    }


    if (browserstackSettings.moreLogs) {
      capabilities["browserstack.debug"] = true;
      capabilities["browserstack.networkLogs"] = true;
    }

    if (browserstackSettings.realDevice) {
      // hardcode for now
      capabilities.realMobile = true;
    }

    if (browserstackSettings.app) {
      capabilities.app = browserstackSettings.app;
    }

    const config = {
      desiredCapabilities: capabilities
    };

    logger.debug(`executor config: ${JSON.stringify(config)}`);
    return config;
  },

  getProfiles: (opts, argvMock = null) => {
    logger.prefix = "Browserstack Executor";
    let runArgv = argv;

    if (argvMock) {
      runArgv = argvMock;
    }

    return Pancake
      .initialize()
      .then(() => {
        return new Promise((resolve) => {
          if (runArgv.bs_browser) {
            const p = {
              desiredCapabilities: Pancake.get(runArgv.bs_browser),
              executor: "browserstack",
              nightwatchEnv: "browserstack",
              id: runArgv.bs_browser
            };

            logger.debug(`detected profile: ${JSON.stringify(p)}`);

            resolve(p);
          } else if (runArgv.bs_browsers) {
            const tempBrowsers = runArgv.bs_browsers.split(",");
            const returnBrowsers = [];

            _.forEach(tempBrowsers, (browser) => {
              const b = browser.trim();
              const p = {
                desiredCapabilities: Pancake.get(b),
                executor: "browserstack",
                nightwatchEnv: "browserstack",
                // id is for magellan reporter
                id: b
              };

              returnBrowsers.push(p);
            });

            logger.debug(`detected profiles: ${JSON.stringify(returnBrowsers)}`);

            resolve(returnBrowsers);
          } else {
            resolve();
          }
        });
      });
  },

  /*eslint-disable no-unused-vars*/
  getCapabilities: (profile, opts) => {
    logger.prefix = "Browserstack Executor";
    // profile key mapping
    // browser => id
    // resolution => resolution
    // orientation => deviceOrientation

    const id = profile.browser;

    return Pancake
      .initialize()
      .then(() => {
        return new Promise((resolve, reject) => {
          try {
            const desiredCapabilities = Pancake.get(id);
            // add executor info back to capabilities

            if (profile.resolution) {
              desiredCapabilities.resolution = profile.resolution;
            }

            if (profile.orientation) {
              desiredCapabilities.deviceOrientation = profile.orientation;
            }
            const p = {
              desiredCapabilities,
              executor: profile.executor,
              nightwatchEnv: profile.executor,
              id
            };

            resolve(p);
          } catch (e) {
            reject(`Executor browserstack cannot resolve profile 
            ${JSON.stringify(profile)}`);
          }
        });
      });
  },

  listBrowsers: (opts, callback) => {
    logger.prefix = "Browserstack Executor";
    Pancake
      .initialize()
      .then((browsers) => {
        const table = Pancake.cliList();
        logger.loghelp(table.toString());
        callback(null, browsers);
      })
      .catch((err) => {
        logger.err(`Couldn't fetch browserstack browsers. Error: ${err}`);
        logger.err(err.stack);
        callback(err);
      });
  }
};
