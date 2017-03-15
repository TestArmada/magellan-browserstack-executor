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
 2. add following block to your `magellan.json` (if there isn't a `magellan.json` please create one under your folder root)
 ```javascript
 "executors": [
    "testarmada-magellan-browserstack-executor"
 ]
 ```

 3. `./node_modules/.bin/magellan --help` to see if you can see the following content printed out
 ```
  Executor-specific (testarmada-magellan-browserstack-executor)
   --bs_browser=browsername             Run tests in chrome, firefox.
   --bs_browsers=b1,b2,..               Run multiple browsers in parallel.
   --bs_list_browsers                   List the available browsers configured (Something else integrated).
   --bs_create_tunnel                   undefined
   --bs_tunnel_id=testtunnel123123      Use an existing secure tunnel (exclusive with --bs_create_tunnel)
 ```

Congratulations, you're all set. 