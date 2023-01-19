const getUrlInSession = {
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
        value: "/wd/hub/session/:id/url",
      },
    ],
  },
  event: {
    type: "message",
    params: {
      message: "Sent command to load the URL",
    },
  },
};

export default getUrlInSession;
