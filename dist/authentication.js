"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const config_1 = require("./config");
const APPLICATION_ID = process.env.APPLICATION_ID || "";
const TENANT_ID = process.env.TENANT_ID || "";
const DOMAINS = process.env.DOMAINS || "";
function authenticate(request, response) {
    const authToken = request.get('AuthorizationToken');
    if (authToken == undefined
        || authToken == null
        || authToken.length == 0) {
        return (response.status(400)
            .send(config_1.MISSING_AUTH_TOKEN), false);
    }
    try {
        const decoded = JSON.parse(Buffer.from(authToken.split(".")[1], "base64").toString());
        if (decoded['appid'] !== APPLICATION_ID
            || decoded['tid'] !== TENANT_ID
            || !DOMAINS.includes(decoded['unique_name'].split('@')[1])) {
            //console.log(APPLICATION_ID + " " + TENANT_ID + " " + DOMAINS);
            return (response.status(400)
                .send(config_1.UNAUTHORIZED), false);
        }
        if (parseInt(decoded['exp']) <= Math.round(Date.now() / 1e3))
            return (response.status(400)
                .send(config_1.EXPIRED_AUTH_TOKEN), false);
        return (true);
    }
    catch (exception) {
        return (response.status(400)
            .send(config_1.INVALID_AUTH_TOKEN), false);
    }
}
exports.authenticate = authenticate;
