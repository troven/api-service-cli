import {Command, flags} from '@oclif/command'
import Start from "./Start"

export default class About extends Command {
  static description = 'describe installed features'

  static examples = [
    `$ a6s about`,
  ]

  static flags = {
    help: flags.help({char: 'h'})
  }

  static args = [{name: 'file'}]



  async run() {
    const {args, flags} = this.parse(About)
    const chassis = Start.chassis();
    this.log("Global Features:");
    for( let f in chassis.plugins.features) {
      let feature = chassis.plugins.features[f]
      this.log("\t%s", feature.name);
    }
    this.log("\nOperation Features:");
    for( let f in chassis.middleware.features) {
      let feature = chassis.middleware.features[f]
      let name = feature.name;
      if (name.startsWith("api.")) {
        name = name.substring(4);
      }
      this.log("\t%s", name);
    }

  }
}
