import { fork } from "child_process";
import logger from "testarmada-logger";
import Tunnel from "./local";
import settings from "./settings";
import analytics from "./global_analytics";

let config = settings.config;

let tunnel = null;

export default {
  setupRunner: (mocks = null) => {
    logger.prefix = "Browserstack Executor";
    let ITunnel = Tunnel;

    if (mocks) {
      if (mocks.Tunnel) {
        ITunnel = mocks.Tunnel;
      }
      if (mocks.config) {
        config = mocks.config;
      }
    }

    if (config.useTunnels) {
      // create new tunnel if needed
      tunnel = new ITunnel(config);

      return tunnel
        .initialize()
        .then(() => {
          analytics.push("browserstack-open-tunnels");
          return tunnel.open();
        })
        .then(() => {
          analytics.mark("browserstack-open-tunnels");
          logger.log("Browserstack local tunnel is opened!  Continuing...");
          logger.log(`Assigned local tunnel [${config.localIdentifier}] to all workers`);
        })
        .catch((err) => {
          analytics.mark("browserstack-open-tunnels", "failed");
          return new Promise((resolve, reject) => {
            reject(err);
          });
        });
    } else {
      return new Promise((resolve) => {
        if (config.localIdentifier) {
          const tunnelAnnouncement = config.localIdentifier;
          logger.log(`Connected to browserstack local tunnel [${tunnelAnnouncement}]`);
        } else {
          logger.log("Connected to browserstack local without tunnel");
        }
        return resolve();
      });
    }
  },

  teardownRunner: (mocks = null) => {
    logger.prefix = "Browserstack Executor";
    if (mocks && mocks.config) {
      config = mocks.config;
    }

    // close tunnel if needed
    if (tunnel && config.useTunnels) {
      return tunnel
        .close()
        .then(() => {
          logger.log("Browserstack tunnel is closed!  Continuing...");
        });
    } else {
      return new Promise((resolve) => {
        resolve();
      });
    }
  },

  setupTest: (callback) => {
    callback();
  },

  teardownTest: (info, callback) => {
    callback();
  },

  execute: (testRun, options, mocks = null) => {
    let ifork = fork;

    if (mocks && mocks.fork) {
      ifork = mocks.fork;
    }

    return ifork(testRun.getCommand(), testRun.getArguments(), options);
  },

  summerizeTest: (magellanBuildId, testResult, callback) => {
    logger.prefix = "Browserstack Executor";

    if (!testResult.metadata) {
      logger.warn("No meta data is found."
        + " This is mainly caused by not using https://github.com/TestArmada/nightwatch-extra");
      return callback();
    }

    return callback();
  }
};
