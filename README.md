# magellan-browserstack-executor

[![Build Status](https://travis-ci.org/TestArmada/magellan-browserstack-executor.svg?branch=master)](https://travis-ci.org/TestArmada/magellan-browserstack-executor)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![codecov](https://codecov.io/gh/TestArmada/magellan-saucelabs-executor/branch/master/graph/badge.svg)](https://codecov.io/gh/TestArmada/magellan-browserstack-executor)

Executor for [Magellan](https://github.com/TestArmada/magellan) to run [Nightwatchjs](http://nightwatchjs.org/) tests in [Browserstack](https://www.browserstack.com) environment.

**PLEASE NOTE: Executor is only supported by magellan version 10.0.0 or higher**.

## What does this executor do
 1. It manages [Browserstack Local](https://www.browserstack.com/local-testing) if you test needs it
 2. It talks [Pancake]() so that the desiredCapabilities shrinks down to a string, which makes your browser selection an easy work
 3. It runs nightwatch test by forking it as magellan child process

## How To Use
Please follow the steps

 1. `npm install testarmada-magellan-browserstack-executor --save`
 2. Add following env variables to your bash system
 ```console
 export BROWSERSTACK_ACCESS_KEY=${YOUR_BROWSERSTACK_ACCESSKEY}
 export BROWSERSTACK_USER=${YOUR_BROWSERSTACK_USERNAME}
 ```
 3. Add following block to your `magellan.json` (if there isn't a `magellan.json` please create one under your folder root)
 ```javascript
 "executors": [
    "testarmada-magellan-browserstack-executor"
 ]
 ```

 4. `./node_modules/.bin/magellan --help` to see if you can see the following content printed out
 ```
  Executor-specific (testarmada-magellan-browserstack-executor)
   --bs_browser=browsername             Run tests in chrome, firefox, etc (default: phantomjs).
   --bs_browsers=b1,b2,..               Run multiple browsers in parallel.
   --bs_list_browsers                   List the available browsers configured (Something else integrated).
   --bs_create_tunnel                   Create secure tunnel in browserstack local mode.
   --bs_tunnel_id=testtunnel123123      Use an existing secure tunnel (exclusive with --bs_create_tunnel).
   --bs_enable_more_logs                Enable visual and network logs.
   --bs_app=bs://<hashed app-id>        App id generated by browserstack when app has been uploaded to browserstack.
 ```

Congratulations, you're all set. 

## License
Documentation in this project is licensed under Creative Commons Attribution 4.0 International License. Full details available at https://creativecommons.org/licenses/by/4.0
