'use strict';

const { ServiceProvider } = use('@adonisjs/fold')
const RollbarDriver = use('./RollbarDriver');

class RollbarProvider extends ServiceProvider {
  register () {
    // register bindings
    this.app.extend('Adonis/Src/Logger', 'rollbar', () => {
      return new RollbarDriver();
    });
  }

  boot () {
    // optionally do some initial setup
  }
}

module.exports = RollbarProvider
