import { EventEmitter } from "events";
class ProxyEvent extends EventEmitter {
  constructor() {
    super();
  }
  request() {
    return (proxyReq, req, res) => {
      (req.events ?? []).forEach((event) => {
        this.emit(event, { request: req, response: res, type: "request" });
      });

      const modifiedBody = JSON.stringify(req.body);
      //   proxyReq.setHeader("Content-Type", "application/json");
      //   proxyReq.setHeader("Content-Length", Buffer.byteLength(modifiedBody));
      proxyReq.write(modifiedBody);
    };
  }
  response(func) {
    const self = this;
    return (proxyRes, req, res) => {
      var oldWrite = res.write,
        oldEnd = res.end;

      var chunks = [];
      res.write = function (chunk) {
        chunks.push(chunk);
        oldWrite.apply(res, arguments);
      };

      res.end = function (chunk) {
        if (chunk) chunks.push(chunk);

        // request body
        var body = JSON.parse(Buffer.concat(chunks).toString());
        res.body = body;
        (req.events ?? []).forEach((event) => {
          self.emit(event, { request: req, response: res, type: "response" });
        });
        func
          ? func(req, res).then(() => {
              oldEnd.apply(res, arguments);
            })
          : oldEnd.apply(res, arguments);
      };
    };
  }
}
export default new ProxyEvent();
