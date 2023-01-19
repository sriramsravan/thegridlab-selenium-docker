import fetchTheTitle from "./fetchTheTitle.js";
import getUrlInSession from "./getUrlInSession.js";
import sessionCreated from "./sessionCreated.js";
import sessionDeleted from "./sessionDeleted.js";

const rules = [];
rules.push(sessionCreated);
rules.push(getUrlInSession)
rules.push(fetchTheTitle)
rules.push(sessionDeleted)
export default rules;
