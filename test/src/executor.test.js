import executor from "../../lib/executor";
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

describe("Executor", () => {
  it("setupTest", (done) => {
    executor.setupTest(() => {
      done();
    });
  });

  it("teardownTest", (done) => {
    executor.teardownTest("FAKE_INFO", () => {
      done();
    });
  });

  it("summerizeTest", (done) => {
    executor.summerizeTest("FAKE_ID", {}, () => {
      done();
    });
  });

  it("execute", (done) => {
    const testRun = {
      getCommand() { },
      getArguments() { }
    };

    executor.execute(testRun, {}, { fork: () => done() });
  });

  describe("setupRunner", () => {
    let Tunnel = null;
    let config = null;

    beforeEach(() => {
      Tunnel = class {
        constructor() { }
        open() {
          return new Promise(resolve => resolve());
        }
        initialize() {
          return new Promise(resolve => resolve());
        }
        close() {
          return new Promise(resolve => resolve());
        }
      };

      config = {
        key: "FAKE_KEY",
        user: "FAKE_USER",
        useTunnels: true,
        localIdentifier: "FAKE_TUNNEL_ID"
      };
    });


    it("open new tunnel", () => {
      executor
        .setupRunner({ Tunnel, config })
        .then()
        .catch(err => assert(false, "shouldn't be here"));
    });

    it("open new tunnel fails", () => {
      Tunnel = class {
        constructor() { }
        open() {
          return new Promise((resolve, reject) => reject("FAKE OPEN ERROR"));
        }
        initialize() {
          return new Promise(resolve => resolve());
        }
      };

      executor
        .setupRunner({ Tunnel, config })
        .then(() => assert(false, "shouldn't be here"))
        .catch(err => expect(err).to.equal("FAKE OPEN ERROR"));
    });

    it("assign to existing tunnel", () => {
      config.useTunnels = false;

      executor
        .setupRunner({ Tunnel, config })
        .then()
        .catch(err => assert(false, "shouldn't be here"));
    });

    it("no tunnel", () => {
      config.useTunnels = false;
      config.localIdentifier = null;

      executor
        .setupRunner({ Tunnel, config })
        .then()
        .catch(err => assert(false, "shouldn't be here"));
    });
  });

  describe("teardownRunner", () => {
    let Tunnel = null;
    let config = null;

    beforeEach(() => {
      Tunnel = class {
        constructor() { }
        open() {
          return new Promise(resolve => resolve());
        }
        initialize() {
          return new Promise(resolve => resolve());
        }
        close() {
          return new Promise(resolve => resolve());
        }
      };

      config = {
        key: "FAKE_KEY",
        user: "FAKE_USER",
        useTunnels: true,
        localIdentifier: "FAKE_TUNNEL_ID"
      };
    });

    it("end tunnel", () => {
      return executor
        .setupRunner({ Tunnel, config })
        .then(() => {
          return executor.teardownRunner()
        });
    });

    it("no tunnel", () => {
      config.useTunnels = false;
      config.localIdentifier = null;

      return executor
        .setupRunner({ Tunnel, config })
        .then(() => {
          return executor.teardownRunner({ config })
        });
    });
  });
}); 