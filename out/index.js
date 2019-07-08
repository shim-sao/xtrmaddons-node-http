"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import external modules
require("module-alias/register");
var express_bearer_token_1 = __importDefault(require("express-bearer-token"));
var bodyParser = __importStar(require("body-parser"));
var cors_1 = __importDefault(require("cors"));
var express_1 = __importDefault(require("express"));
var helmet_1 = __importDefault(require("helmet"));
// Import internal modules
var xtrmaddons_soft_suite_conf_1 = __importDefault(require("xtrmaddons-soft-suite-conf"));
// const Config = require("xtrmaddons-soft-suite-conf");
var Logger = require("xtrmaddons-soft-suite-logger");
/**
 * Class to quickly manage Http server.
 */
var Http = /** @class */ (function () {
    /**
     * Method class constructor.
     *
     * @param {string | undefined}   instanceName An instance name for the server.
     * @param {function | undefined} callback     A callback executed at the end of the constructor with this as parameter.
     */
    function Http(instanceName, options, callback) {
        this.instanceName = instanceName;
        // Initialize server instance name.
        this.instanceName = this.instanceName || "http";
        Logger.lib.trace("Initializing " + this.instanceName + " instance. Please wait...");
        // Initialize the ExpressJs server.
        this.xprss = express_1.default();
        // Protect header with helmet
        this.xprss.use(helmet_1.default());
        Logger.lib.trace("Protect header with helmet.");
        // Support parsing of application/json type post data
        this.xprss.use(bodyParser.json());
        Logger.lib.trace("Support parsing of application/json type post data.");
        // Support parsing of application/x-www-form-urlencoded post data
        this.xprss.use(bodyParser.urlencoded({ extended: true }));
        Logger.lib.trace("Support parsing of application/x-www-form-urlencoded post data.");
        // Bearer token middleware for express.
        // @see https://www.npmjs.com/package/express-bearer-token
        if (options && options.bearerToken) {
            this.xprss.use(options.bearerToken);
            Logger.lib.trace("Bearer token: " + options.bearerToken);
        }
        else {
            this.xprss.use(express_bearer_token_1.default(xtrmaddons_soft_suite_conf_1.default.get("bearer:token")));
            Logger.lib.trace("Bearer token: " + xtrmaddons_soft_suite_conf_1.default.get("bearer:token"));
        }
        //
        this.xprss.use(cors_1.default());
        Logger.lib.trace("Cors.");
        // Final callback
        if (typeof callback === "function")
            callback(this);
    }
    return Http;
}());
exports.default = Http;
