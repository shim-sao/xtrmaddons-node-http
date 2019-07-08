// Import external modules
require("module-alias/register");

import expressBearerToken from "express-bearer-token";
import * as bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";

// Import internal modules
import Config from "xtrmaddons-soft-suite-conf";
// const Config = require("xtrmaddons-soft-suite-conf");
const Logger = require("xtrmaddons-soft-suite-logger");

/**
 * Class to quickly manage Http server.
 */
export default class Http {
  /**
   * ExpressJs Http Server instance.
   *
   * @protected
   * @type {express}
   * @memberof Http
   */
  protected xprss: express.Express;

  /**
   * Method class constructor.
   *
   * @param {string | undefined}   instanceName An instance name for the server.
   * @param {function | undefined} callback     A callback executed at the end of the constructor with this as parameter.
   */
  constructor(
    protected readonly instanceName?: string,
    options?: any,
    callback?: (that: any) => {}
  ) {
    // Initialize server instance name.
    this.instanceName = this.instanceName || "http";
    Logger.lib.trace(
      `Initializing ${this.instanceName} instance. Please wait...`
    );

    // Initialize the ExpressJs server.
    this.xprss = express();

    // Protect header with helmet
    this.xprss.use(helmet());
    Logger.lib.trace("Protect header with helmet.");

    // Support parsing of application/json type post data
    this.xprss.use(bodyParser.json());
    Logger.lib.trace("Support parsing of application/json type post data.");

    // Support parsing of application/x-www-form-urlencoded post data
    this.xprss.use(bodyParser.urlencoded({ extended: true }));
    Logger.lib.trace(
      "Support parsing of application/x-www-form-urlencoded post data."
    );

    // Bearer token middleware for express.
    // @see https://www.npmjs.com/package/express-bearer-token
    if (options && options.bearerToken) {
      this.xprss.use(options.bearerToken);
      Logger.lib.trace("Bearer token: " + options.bearerToken);
    } else {
      this.xprss.use(expressBearerToken(Config.get("bearer:token")));
      Logger.lib.trace("Bearer token: " + Config.get("bearer:token"));
    }

    //
    this.xprss.use(cors());
    Logger.lib.trace("Cors.");

    // Final callback
    if (typeof callback === "function") callback(this);
  }
}
