// Passport Configuration
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User");

// Load .env file
const dotenv = require("dotenv");
dotenv.config();

const configurePassport = () => {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID,
        clientSecret: process.env.NEXT_PUBLIC_OAUTH_CLIENT_SECRETS,
        callbackURL: `${process.env.NEXT_PUBLIC_SERVER_PRODUCTION}/auth/github/callback`, // Server URL
        scope: ["user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists
          let user = await User.findOne({  email: profile.emails[0].value });
  
          // If not, create new user
          if (!user) {
            user = await User.create({
              githubId: profile.id,
              email: profile.emails[0].value, 
              nickname: profile.username,
              password: null
            });
          }
          else {
            // If user exists by email but doesn't have a GitHub ID, update the GitHub ID
            user.githubId = profile.id;
            await user.save();
          }

          // Pass the user to the next step
          done(null, user);
        } 
        catch (error) {
          done(error, null);
        }
      }
    )
  );
};

module.exports = configurePassport;