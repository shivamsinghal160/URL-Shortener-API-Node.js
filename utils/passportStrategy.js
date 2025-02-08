const initPassport = async (passport) => {
  const runQuery = require("./queryHandler");
  const GoogleStrategy = require("passport-google-oauth20").Strategy;
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          //   let user = await runQuery("SELECT * FROM users WHERE googleId = ?", [
          //     profile.id,
          //   ]);

          //   if (user.length > 0) {
          //     return done(null, user[0]);
          //   }

          //   let insertUser = await runQuery(
          //     "INSERT INTO users (googleId, username, email, avatar) VALUES (?, ?, ?, ?)",
          //     [
          //       profile.id,
          //       profile.displayName,
          //       profile.emails[0].value,
          //       profile.photos[0].value,
          //     ]
          //   );

          //   if (insertUser.affectedRows > 0) {
          //     user = await runQuery("SELECT * FROM users WHERE googleId = ?", [
          //       profile.id,
          //     ]);
          //     return done(null, user[0]);
          //   }

          return done(null, profile);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      //   const user = await runQuery("SELECT * FROM users WHERE id = ?", [id]);
      //   done(null, user[0]);
      done(null, id);
    } catch (error) {
      done(error, null);
    }
  });
};
module.exports = initPassport;
