import { IChassisContext, AbstractDataStore, IOperation, Vars } from "api-service-core";
import * as PouchDB from 'pouchdb';
import * as _ from "lodash";

export default class LocalDBPlugin extends AbstractDataStore {
  name: string = "localdb";
  title?: string = "LocalDB";
  defaults?: any = {};
  db: any;

  install(context: IChassisContext, options: any): void {
    let all_options = _.extend({database: 'local'}, options);
    let database = Vars.$(all_options.database, all_options);
    // let collection_name = Vars.$(all_options[this.getCollectionField()], crud_options);
    this.db = new PouchDB(database);
}

  healthy(req_options: any, callback: Function): void {
    this.db.info().then(function (info: any) {
      callback(null, info);
    })
  }
  query(operation: IOperation, meta: any, req_options: any, options: any, callback: Function): void {
    throw new Error("Method not implemented.");
  }
  create(operation: IOperation, meta: any, req_options: any, options: any, callback: Function): void {
    throw new Error("Method not implemented.");
  }
  read(operation: IOperation, meta: any, req_options: any, options: any, callback: Function): void {
    let id_field = this.getIDField();
    let id = meta[id_field]
    this.db.get(id).then( (doc: any) => {
      callback(null, doc);
    });
  }
  list(operation: IOperation, meta: any, req_options: any, options: any, callback: Function): void {
    throw new Error("Method not implemented.");
  }
  update(operation: IOperation, meta: any, req_options: any, options: any, callback: Function): void {
    throw new Error("Method not implemented.");
  }
  delete(operation: IOperation, meta: any, req_options: any, options: any, callback: Function): void {
    throw new Error("Method not implemented.");
  }

}
