import {Command, flags} from '@oclif/command'
import { exec }  from 'child_process';
import { writeFileSync } from 'fs'
import default_config from "../init/default_config"
import default_openapi from "../init/default_openapi"
import * as Yaml from 'yamljs'

export default class Init extends Command {
  static description = 'initialize working directory with ./config/ and ../oasv3/ folders'

  static examples = [
    `$ a6s init`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    force: flags.boolean({char: 'f'}),
  }

  static args = [{name: 'file'}]

  handle_error(err: any, stdout: any, stderr: any) {
    if (err) {
      console.error("%o",err)
      process.exit(1)
    } else {
      // console.log("done: %s", stdout)
    }
  }

  async run() {
    const {args, flags} = this.parse(Init)

    this.log("initializing ...");
    exec('mkdir config', this.handle_error);
    exec('mkdir oasv3', this.handle_error);
    this.log("copying ...");
    writeFileSync("config/default.yaml", Yaml.stringify(default_config(),8));
    writeFileSync("oasv3/default.yaml", Yaml.stringify(default_openapi(),8));

  }
}
