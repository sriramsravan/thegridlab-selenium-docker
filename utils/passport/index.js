import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { User } from "../../models/index.js";

var cookieExtractor = function(req) {
    var token = null;
    if (req && req.cookies) token = req.cookies['jwt'];
    return token;
  };

const jwtOptions = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.JWT_SECRET,
};

const jwtStrategy = new JwtStrategy(
  jwtOptions,
  async (payload, done) => {
    try {
      const user = await User.findOne({ id: payload.id });
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  },
  "jwt"
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(jwtStrategy);

export default passport;
