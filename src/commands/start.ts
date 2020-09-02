import {Command, flags} from '@oclif/command'
import { Chassis } from "api-service-core";
import { default_features  } from "api-service-common";
import { MongoStore  } from "api-service-mongo";
import { ControllerPlugin, ConfigsPlugin } from "api-service-controller";
import { existsSync } from 'fs'

export default class Start extends Command {
  static description = 'start the API services defined in the ./config/ file'

  static examples = [
    `$ a6s start`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    config: flags.string({char: 'c', description: 'specify a config file'}),
  }

  static args = [{name: 'file'}]

  static chassis() {
    const config = require("config");
    // configure a new chassis
    let chassis = new Chassis(config, default_features);

    // register our custom plugin
    chassis.registerPlugin( new ControllerPlugin() );
    chassis.registerPlugin( new ConfigsPlugin() );
    chassis.registerPlugin( new MongoStore() );
    return chassis;
  }

  async run() {
    const {args, flags} = this.parse(Start)

    if ( !existsSync("config") ) {
      this.log("ERROR: a6s is not configured. Please run `a6s init` to initialize");
      process.exit(1);
    }


    this.log(`starting ...`)

    const chassis = Start.chassis();
    // start the Chassis ...
    chassis.start();

  }
}
