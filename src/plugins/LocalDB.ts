import { IChassisContext, AbstractDataStore, IOperation, Vars } from "api-service-core";
import * as PouchDB from 'pouchdb';
import * as _ from "lodash";

export default class LocalDBPlugin extends AbstractDataStore {
  name: string = "localdb";
  title?: string = "LocalDB";
  defaults?: any = {};
  database: string = '';

  install(context: IChassisContext, options: any): void {
    let all_options = _.extend({database: 'local'}, options);
    this.database = Vars.$(all_options.database, all_options);
    // let collection_name = Vars.$(all_options[this.getCollectionField()], crud_options);
}

  healthy(crud_options: any, callback: Function): void {
    let db = new PouchDB(this.database);
    db.info().then(function (info: any) {
      db.close();
      callback(null, info);
    })
  }
  query(operation: IOperation, meta: any, crud_options: any, options: any, callback: Function): void {
    return this.list(operation, meta, crud_options, options, callback);
  }
  create(operation: IOperation, meta: any, crud_options: any, options: any, callback: Function): void {
    let all_options = _.extend({}, this.options, crud_options, options);
    let database = Vars.$(all_options.database, crud_options);
    let collection_name = Vars.$(all_options[this.getCollectionField()], crud_options);
    let db = new PouchDB(database+"_"+collection_name);

    this.context.log({code: "plugin:crud:localdb:create", database: database, collection: collection_name, options: crud_options, filter: meta } );
    db.post(meta).then( doc => {
      db.close();
      callback(null, doc)
    }).catch( err=> {
      db.close();
      callback(err, null)
    })
  }

  read(operation: IOperation, meta: any, crud_options: any, options: any, callback: Function): void {
    let all_options = _.extend({}, this.options, crud_options, options);
    let database = Vars.$(all_options.database, crud_options);
    let collection_name = Vars.$(all_options[this.getCollectionField()], crud_options);
    let db = new PouchDB(database+"_"+collection_name);

    let id_field = this.getIDField();
    let id = meta[id_field];

    this.context.log({code: "plugin:crud:localdb:create", database: database, collection: collection_name, options: crud_options, filter: meta } );
    db.get(id).then( (doc: any) => {
      db.close();
      callback(null, doc);
    }).catch( err=> {
      db.close();
      callback(err, null)
    })
  }
  list(operation: IOperation, meta: any, crud_options: any, options: any, callback: Function): void {
    let all_options = _.extend({}, this.options, crud_options, options);
    let database = Vars.$(all_options.database, crud_options);
    let collection_name = Vars.$(all_options[this.getCollectionField()], crud_options);
    let db = new PouchDB(database+"_"+collection_name);

    this.context.log({code: "plugin:crud:localdb:list", database: database, collection: collection_name, options: crud_options, filter: meta } );
    db.query(meta).then( (doc: any) => {
      db.close();
      callback(null, doc);
    }).catch( err=> {
      db.close();
      callback(err, null)
    })
  }
  update(operation: IOperation, meta: any, crud_options: any, options: any, callback: Function): void {
    let all_options = _.extend({}, this.options, crud_options, options);
    let database = Vars.$(all_options.database, crud_options);
    let collection_name = Vars.$(all_options[this.getCollectionField()], crud_options);
    let db = new PouchDB(database+"_"+collection_name);

    let id_field = this.getIDField();
    let id = meta[id_field];

    this.context.log({code: "plugin:crud:localdb:update", database: database, collection: collection_name, options: crud_options, filter: meta } );
    db.put(id).then( (doc: any) => {
      db.close();
      callback(null, doc);
    }).catch( err=> {
      db.close();
      callback(err, null)
    })
  }
  delete(operation: IOperation, meta: any, crud_options: any, options: any, callback: Function): void {
    let all_options = _.extend({}, this.options, crud_options, options);
    let database = Vars.$(all_options.database, crud_options);
    let collection_name = Vars.$(all_options[this.getCollectionField()], crud_options);
    let db = new PouchDB(database+"_"+collection_name);

    let id_field = this.getIDField();
    let id = meta[id_field];

    this.context.log({code: "plugin:crud:localdb:delete", database: database, collection: collection_name, options: crud_options, filter: meta } );
    db.get(id).then( doc => {
      db.remove(doc).then( (doc: any) => {
        db.close();
        callback(null, doc);
      }).catch(err=>{
        db.close();
        callback(err, null)
      })
    }).catch( err=> {
      db.close();
      callback(err, null)
    })
  }

}
