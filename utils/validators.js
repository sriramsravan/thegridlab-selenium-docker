import Joi from "joi";
// const cap = {
//   desiredCapabilities: {
//     "gl:project": "The Grid Lab",
//     "gl:application": "The Grid Lab",
//     browserName: "chrome",
//   },
//   capabilities: {
//     alwaysMatch: {
//       "gl:project": "The Grid Lab",
//       "gl:application": "The Grid Lab",
//       browserName: "chrome",
//     },
//   },
// };

const capabilitiesSchema = Joi.object({
  desiredCapabilities: Joi.object({
    "gl:project": Joi.string().required().label("gl:project in capabilities"),
    "gl:application": Joi.string().required().label("gl:application in capabilities"),
    browserName: Joi.string().required().label("browserName in capabilities"),
  }).unknown(),
  capabilities: Joi.object().allow(null),
});

const capabilities = (req, _, next) => {
  const body = req.body;
  const { error } = capabilitiesSchema.validate(body);
  if (error) {
    return next(new Error(error.details[0].message));
  }
  next();
};
export { capabilities };
