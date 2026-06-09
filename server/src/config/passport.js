import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/User.js';

const configurePassport = () => {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: 'http://localhost:5000/api/auth/github/callback',
        scope: ['user:email'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists
          let user = await User.findOne({ githubId: profile.id });

          if (user) {
            // Update last login
            user.lastLogin = new Date();
            await user.save();
            return done(null, user);
          }

          // Get primary email from GitHub profile
          const email =
            profile.emails?.[0]?.value ||
            `${profile.username}@github.com`;

          // Create new user
          user = await User.create({
            githubId: profile.id,
            username: profile.username,
            email,
            avatar: profile.photos?.[0]?.value || '',
            displayName: profile.displayName || profile.username,
          });

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};

export default configurePassport;