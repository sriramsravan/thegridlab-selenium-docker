const sessionCreated = {
  conditions: {
    all: [
      {
        fact: "request-method",
        operator: "equal",
        value: "POST",
      },
      {
        fact: "request-url",
        operator: "url-match",
        value: "/wd/hub/session",
      },
    ],
  },
  event: {
    type: "message",
    params: {
      message: "Session Created.!",
    },
  },
};

export default sessionCreated;
