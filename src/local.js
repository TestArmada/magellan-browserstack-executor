import path from "path";
import { Local as Browserstack } from "browserstack-local";
import _ from "lodash";

import settings from "./settings";
import logger from "./logger";

export default class Local {
  constructor(options, BrowserstackMock = null) {
    this.options = _.assign({}, options);
    this.browserstack = new Browserstack();

    if (BrowserstackMock) {
      this.browserstack = BrowserstackMock;
    }
  }

  initialize() {
    return new Promise((resolve, reject) => {
      if (!this.options.key) {
        return reject("Browserstack local tunnel support is "
          + "missing configuration: Browserstack key.");
      }

      if (!this.options.user) {
        return reject("Browserstack local tunnel support is "
          + "missing configuration: Browserstack user.");
      }

      return resolve();
    });
  }

  open() {
    const localIdentifier = this.options.localIdentifier;
    const localKey = this.options.key;
    let connectFailures = 0;

    logger.log(`Opening browserstack local connect [${localIdentifier}]`);

    const connect = () => {
      return new Promise((resolve, reject) => {
        const logFilePath = `${path.resolve(settings.tempDir)}/build-${
          localIdentifier}_browserstacklocal.log`;
        const localOptions = {
          key: localKey,
          localIdentifier,

          verbose: settings.debug,
          logFile: logFilePath,
          forceLocal: true
        };

        logger.debug(`calling browserstack local.start() w/ ${JSON.stringify(localOptions)}`);

        this.browserstack.start(localOptions, (err) => {
          if (err) {
            logger.debug("Error from browserstack local.start():");
            logger.debug(err.message);

            if (settings.BAILED) {
              connectFailures++;

              return reject(new Error("Bailed due to maximum number of "
                + "browsetstack connect retries."));
            } else {
              connectFailures++;

              if (connectFailures >= settings.MAX_CONNECT_RETRIES) {
                settings.BAILED = true;
                return reject(new Error("Failed to create a secure browserstack local "
                  + `connect after ${connectFailures} attempts.`));
              } else {
                // Otherwise, keep retrying, and hope this is merely a blip and not an outage.
                logger.err(`>>> Browserstack Local Connect Failed!  Retrying ${connectFailures}`
                  + ` of ${settings.MAX_CONNECT_RETRIES} attempts...`);

                return connect()
                  .then(resolve)
                  .catch(reject);
              }

            }
          } else {
            return resolve();
          }
        });
      });
    };

    return connect();
  }

  close() {
    return new Promise((resolve) => {
      logger.log(`Closing browserstack local connect [${this.options.localIdentifier}]`);
      this.browserstack.stop(() => {
        resolve();
      });
    });
  }
}
