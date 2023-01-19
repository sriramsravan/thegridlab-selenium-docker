const fetchTheTitle = {
  conditions: {
    all: [
      {
        fact: "request-method",
        operator: "equal",
        value: "GET",
      },
      {
        fact: "request-url",
        operator: "url-match",
        value: "/wd/hub/session/:id/title",
      },
    ],
  },
  event: {
    type: "message",
    params: {
      message: "The title has been fetched",
    },
  },
};

export default fetchTheTitle;
