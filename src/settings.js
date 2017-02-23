import argvs from "yargs";
import path from "path";

const debug = !!argvs.argv.debug;
const TEMP_DIR = path.resolve(argvs.temp_dir || "./temp");

/*eslint-disable no-magic-numbers*/
const config = {
  // required:
  key: null,

  // optional:
  localIdentifier: null
  // locksServerLocation: null,
  // locksOutageTimeout: 1000 * 60 * 5,
  // locksPollingInterval: 2500,
  // locksRequestTimeout: 2500
};

export default {
  debug,
  tempDir: TEMP_DIR,
  config,

  MAX_CONNECT_RETRIES: process.env.BROWSERSTACK_CONNECT_NUM_RETRIES || 10,
  BASE_SELENIUM_PORT_OFFSET: 56000,
  BAILED: false
};
