const sessionDeleted = {
  conditions: {
    all: [
      {
        fact: "request-method",
        operator: "equal",
        value: "DELETE",
      },
      {
        fact: "request-url",
        operator: "url-match",
        value: "/wd/hub/session/:id",
      },
    ],
  },
  event: {
    type: "message",
    params: {
      message: "Session Deleted.!",
    },
  },
};

export default sessionDeleted;
