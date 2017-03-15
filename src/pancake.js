import _ from "lodash";
import request from "request";
import Table from "cli-table";
import clc from "cli-color";
import settings from "./settings";
import logger from "./logger";

const config = settings.config;
const BROWSERSTACK_API_URL = "https://www.browserstack.com/automate/browsers.json";
let browserCache = {};

export default {
  initialize() {
    const self = this;

    return new Promise((resolve, reject) => {
      if (_.keys(browserCache).length > 0) {
        resolve(browserCache);
      } else {
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
            capabilities.browser,
            capabilities.browser_version ? capabilities.browser_version : "N/A",
            capabilities.os,
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
    const values = [
      capabilities["os"],
      capabilities["os_version"],
      capabilities["browser"]
    ];

    if (capabilities["device"]) {
      values.push(capabilities["device"]);
    }

    if (capabilities["browser_version"]) {
      values.push(capabilities["browser_version"]);
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
