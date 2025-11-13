const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const User = require('../model/user');
const { generateToken } = require('../utils/token');
const { access } = require('fs');
const { where } = require('sequelize');

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try{
                const { id: googleId, displayName: name, emails} = profile;
                const email = emails?.[0]?.value;

                const expiresIn = URLSearchParams.expires_in ? new Date(Date.now() + params.expires_in * 1000) : null;

                let user = await User.findOne({ where: {email}});

                if (user && !user.googleId) {
                    user.googleId = googleId;
                    user.authProvider = 'google';
                    await user.save();
                }
                
                if (!user) {
                    user = await User.create({
                        name,
                        email,
                        googleId,
                        password: null,
                        role: 'user',
                        authProvider: 'google'
                    });
                }

                user.googleAccessToken = accessToken;
                user.googleRefreshToken = refreshToken;
                user.tokenExpiry = expiresIn;
                await user.save();

                const jwtToken = generateToken(user);
                    return done(null, { user, token: jwtToken });
            }catch(err){
                console.err('Google OAuth Error:', err);
                return done(err, null);
            }
        }
    )
);

passport.serializeUser((data, done) => done(null, data));
passport.deserializeUser((data, done) => done(null, data));

module.exports = passport;