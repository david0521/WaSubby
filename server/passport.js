const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./schemas/users");
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const secret = process.env.JWT_SECRET || "TESTING";

passport.use(
    "signup",
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        async (email, password, done) => {
            try {
                const user = await User.create({ email, password });

                return done(null, user);
            } catch (error) {
                done(error);
            }
        },
    ),
);

// ...

passport.use(
    "login",
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ email });

                if (!user) {
                    return done(null, false, { message: "User not found" });
                }

                const validate = await user.isValidPassword(password);

                if (!validate) {
                    return done(null, false, { message: "Wrong Password" });
                }

                return done(null, user, { message: "Logged in Successfully" });
            } catch (error) {
                return done(error);
            }
        },
    ),
);

passport.use(
    new JWTstrategy(
        {
            secretOrKey: secret,
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        },
        async (token, done) => {
            try {
                return done(null, token.user);
            } catch (error) {
                done(error);
            }
        },
    ),
);
