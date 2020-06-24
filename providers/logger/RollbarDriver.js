"use strict";

const Winston = use('winston');
const RollbarTransport = use("./RollbarTransport");

class RollbarDriver {
  setConfig(config) {
    this.config = {
      ...config,
      name: config.name,
      level: config.level,
      rollbarConfig: config.rollbarConfig,
    };

    this.logger = Winston.createLogger({
      transports: [new RollbarTransport(this.config)],
      levels: this.levels,
    });
  }

  /**
   * A list of available log levels.
   *
   * @attribute levels
   *
   * @return {Object}
   */
  get levels() {
    return {
      emerg: 0,
      alert: 1,
      crit: 2,
      error: 3,
      warning: 4,
      notice: 5,
      info: 6,
      debug: 7,
    };
  }

  /**
   * Returns the current level for the driver
   *
   * @attribute level
   *
   * @return {String}
   */
  get level() {
    return this.logger.transports[this.config.name].level;
  }

  /**
   * Update driver log level at runtime
   *
   * @param  {String} level
   *
   * @return {void}
   */
  set level(level) {
    this.logger.transports[this.config.name].level = level;
  }

  /**
   * Log message for a given level
   *
   * @method log
   *
   * @param  {Number}    level
   * @param  {String}    message
   * @param  {...Spread} meta
   *
   * @return {void}
   */
  log(level, message, request = null) {
    // Block logs with levels higher from configured level.
    if (level > this.levels[this.config.level]) return;

    const levelName =
      Object.keys(this.levels).find((value) => this.levels[value] === level) ||
      "info";

    this.logger.log(levelName, message, request);
  }
}

module.exports = RollbarDriver;
