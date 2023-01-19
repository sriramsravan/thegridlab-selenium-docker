import { Engine } from "json-rules-engine";
import rules from "./rules/index.js";
import pathToRegex from "path-to-regex";
const engine = new Engine(rules);

engine.addFact("request-url", async function (params, almanac) {
  const request = await almanac.factValue("request");
  return request.url;
});

engine.addFact("request-method",async function (params, almanac) {
    const request = await almanac.factValue("request");
    return request.method;
});

engine.addOperator("url-match", (factValue, jsonValue) => {
  if (!factValue.length) return false;
  const parser = new pathToRegex(jsonValue);
  const result = parser.match(factValue);
  return !!result;
});

export default engine;
