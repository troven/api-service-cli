
import { default_features } from "./index";
import { Chassis  } from "api-service-core";
let config = require("config");
console.log("config: %j", config);
    
let chassis = new Chassis(config, default_features );
chassis.start();
