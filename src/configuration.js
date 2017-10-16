import { argv } from "yargs";
import _ from "lodash";
import logger from "testarmada-logger";
import settings from "./settings";
import guid from "./util/guid";

export default {
  getConfig: () => {
    logger.prefix = "Browserstack Executor";
    logger.debug(`executor config: ${JSON.stringify(settings.config)}`);
    return settings.config;
  },

  /*eslint-disable complexity*/
  validateConfig: (opts, argvMock = null, envMock = null) => {
    logger.prefix = "Browserstack Executor";
    let runArgv = argv;
    let env = process.env;

    if (argvMock) {
      runArgv = argvMock;
    }

    if (envMock) {
      env = envMock;
    }

    // required:
    settings.config.key = env.BROWSERSTACK_ACCESS_KEY;
    settings.config.user = env.BROWSERSTACK_USER;
    // optional:
    settings.config.localIdentifier = runArgv.bs_tunnel_id;
    settings.config.useTunnels = !!runArgv.bs_create_tunnel;
    settings.config.moreLogs = !!runArgv.bs_enable_more_logs;
    settings.config.realDevice = !!runArgv.bs_real_device;
    settings.config.app = runArgv.bs_app;

    const parameterWarnings = {
      key: {
        required: true,
        envKey: "BROWSERSTACK_ACCESS_KEY"
      },
      user: {
        required: true,
        envKey: "BROWSERSTACK_USER"
      }
    };

    // Validate configuration if we have --sauce
    if (runArgv.bs_browser
      || runArgv.bs_browsers
      || opts.isEnabled) {
      let valid = true;

      _.forEach(parameterWarnings, (v, k) => {
        if (!settings.config[k]) {
          if (v.required) {
            logger.err(`Error! Browserstack local tunnel requires ${k} to be set. `
              + ` Check if the environment variable $${v.envKey} is defined.`);
            valid = false;
          }
        }
      });

      if (!valid) {
        throw new Error("Missing configuration for Browserstack local tunnel.");
      }

      if (runArgv.bs_create_tunnel && runArgv.bs_tunnel_id) {
        throw new Error("Only one Browserstack local tunnel arg is allowed " +
          ", --bs_tunnel_idor --bs_create_tunnel.");
      }

      // after verification we want to add sauce_tunnel_id if it's null till now
      if (!settings.config.localIdentifier && settings.config.useTunnels) {
        // auto generate tunnel id
        settings.config.localIdentifier = guid();
      }

      logger.debug("Browserstack local tunnel configuration: ");
      logger.debug(JSON.stringify(settings.config));

      logger.log("Browserstack local tunnel configuration is OK");

    }

    return settings.config;
  }
};
