import _ from "lodash";
import request from "request";
import Table from "cli-table";
import clc from "cli-color";
// import settings from "./settings";
import logger from "./logger";
import configuration from "./configuration";

// const config = settings.config;
const BROWSERSTACK_API_URL = "https://www.browserstack.com/automate/browsers.json";
let browserCache = {};

export default {
  initialize(ignoreCache = false, argvMock = null, envMock = null) {
    const self = this;
    let config = null;

    return new Promise((resolve, reject) => {
      if (!ignoreCache
        && _.keys(browserCache).length > 0) {
        resolve(browserCache);
      } else {
        try {
          config = configuration.validateConfig({}, argvMock, envMock);
        } catch (e) {
          reject(e);
        }
        const options = {
          "auth": {
            "user": config.user,
            "pass": config.key,
            "sendImmediately": false
          }
        };

        request.get(BROWSERSTACK_API_URL, options, (err, response, body) => {
          if (err) {
            reject(err);
          }

          self._buildBrowserCache(JSON.parse(body));
          resolve(browserCache);
        });
      }
    });
  },

  get(id) {
    if (_.keys(browserCache).length > 0) {
      return browserCache[id];
    }

    return null;
  },

  cliList() {
    const self = this;

    if (_.keys(browserCache).length > 0) {
      logger.loghelp("Available Browserstack Browsers:");

      const families = _.groupBy(browserCache, (capabilities) => capabilities.browser);
      const table = new Table({
        head: ["Family", "Alias", "Browser/Env", "Version", "OS", "OS Version", "Device"]
      });

      let count = 1;

      Object.keys(families).sort().forEach((family) => {
        table.push([clc.red(_.capitalize(family))]);
        const currentFamily = families[family];

        _.forEach(currentFamily, (capabilities) => {
          const key = self._generateKey(capabilities);
          table.push([
            clc.blackBright(`${count}.`),
            key,
            _.capitalize(capabilities.browser),
            capabilities.browser_version ? capabilities.browser_version : "N/A",
            _.capitalize(capabilities.os),
            capabilities.os_version,
            capabilities.device ? capabilities.device : "N/A"
          ]);
          count++;
        });
      });

      return table;
    }

    return null;
  },

  _generateKey(capabilities) {
    const values = [];

    values.push(capabilities.browser);

    if (capabilities.browser_version) {
      values.push(capabilities.browser_version);
    }

    values.push(capabilities.os);
    values.push(capabilities.os_version);

    if (capabilities.device) {
      values.push(capabilities.device);
    }

    const key = values.join("_").replace(/(\.|\s)/g, "_");
    return key;
  },

  _buildBrowserCache(browserstackResponse) {
    const self = this;
    browserCache = {};

    _.forEach(browserstackResponse, (capabilities) => {
      const key = self._generateKey(capabilities);
      browserCache[key] = capabilities;
    });

  }
};
