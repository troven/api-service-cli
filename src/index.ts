"use strict";

/*************************************************************************
 *
 * Troven CONFIDENTIAL
 * __________________
 *
 *  (c) 2017-2019 Troven Pty Ltd
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Troven Pty Ltd and its licensors,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Troven Pty Ltd
 * and its suppliers and may be covered by International and Regional Patents,
 * patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Troven Pty Ltd.
 */

import * as common from "api-service-common";
import * as core  from "api-service-core";

export * from "api-service-common";
export * from "api-service-core";


/*
        Register all our default plugins
        These can are installed before the server starts listening
 */
let default_plugins = function() {
    this.registerPlugin( new common.amqp );
    this.registerPlugin( new common.after );
    this.registerPlugin( new common.before );
    this.registerPlugin( new common.cors );
    this.registerPlugin( new common.harden );
    this.registerPlugin( new common.json_body );
    this.registerPlugin( new common.prometheus );
    this.registerPlugin( new common.ua );
    this.registerPlugin( new common.views );
    this.registerPlugin( new common.render );
    this.registerPlugin( new common.webhooks );
    this.registerPlugin( new core.openapi );
}

/*
        Register all our middleware plugins
        These can be attached as chassis:operations to Open API specs
 */
let default_middleware = function() {
    this.registerFn( new common.apidocs);
    this.registerFn( new common.authenticate_jwt );
    this.registerFn( new common.authorize_jwt );
    this.registerFn( new common.bower_components );
    this.registerFn( new core.debug );
    this.registerFn( new common.decrypt );
    this.registerFn( new common.encrypt );
    this.registerFn( new core.gregarious );
    this.registerFn( new core.heartbeat );
    this.registerFn( new core.not_found );
    this.registerFn( new core.openapi_security );
    this.registerFn( new core.proxy );
    this.registerFn( new common.redact );
    this.registerFn( new core.request_uuid );
    this.registerFn( new common.static_assets );
}

export function default_features() {
    default_plugins.apply(this);
    default_middleware.apply(this);
}
    