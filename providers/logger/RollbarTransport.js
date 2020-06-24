const Transport = require("winston-transport");
const util = require("util");

const Rollbar = use("rollbar");

module.exports = class RollbarTransport extends Transport {
  constructor(options) {
    super(options);

    if (!options.rollbarConfig.accessToken) {
      throw Error(
        "You need to set ROLLBAR_ACCESS_TOKEN enviroment variable to use rollbar as logger."
      );
    }

    const rollbar = new Rollbar(options.rollbarConfig);

    this.name = options.name;
    this.level = options.level;
    this.rollbar = rollbar;
  }

  log(info, callback) {
    const rollbarErrors = {
      emerg: "critical",
      alert: "critical",
      crit: "critical",
      error: "error",
      warning: "warning",
      info: "info",
      notice: "info",
      debug: "debug",
    };

    setImmediate(() => {
      const request = info.request ? {
        headers: info.request.headers,
        protocol: info.request.protocol,
        url: info.request.url,
        method: info.request.method,
        body: info.request.body,
        user: info.user,
      } : null;


      this.rollbar[rollbarErrors[info.level]](info.message, request, { user: info.user });

      // this.rollbar.error('TESTANDO REQUEST', {
      //   headers: {
      //     host: '0.0.0.0:3333',
      //     connection: 'keep-alive',
      //     'cache-control': 'max-age=0',
      //     'upgrade-insecure-requests': '1',
      //     'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36',
      //     accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      //     'accept-encoding': 'gzip, deflate',
      //     'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      //     cookie: '_ga=GA1.1.1087337459.1560188807'
      //   },
      //   protocol: 'http',
      //   url: '/',
      //   method: 'GET',
      //   body: {},
      //   user: { id: '123', username: 'teste' }
      // }, { foo: 'bar' })

      // this.rollbar.log(info.message, { something: "else" }, { level: info.level })
    });

    // Perform the writing to the remote service
    callback();
  }
};
