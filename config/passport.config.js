import passport from 'passport';
import { Strategy as  GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/userModel.js';
import dotenv from 'dotenv';
dotenv.config();


passport.use(
    new GoogleStrategy (
    {
        clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
        clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
        callbackURL: 'http://localhost:6001/api/auth/google/callback',
        scope:['email','profile']
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            console.log('Google profile data:', profile);
            const email = profile.emails[0].value;
            const user = await User.findOne({ email });

            if(user && !user.googleId){
                return done(null,false,{message:'User already registered with this email'})
            }

            if (user) {
                return done(null, user);
            }

            const newUser = new User({
                googleId: profile.id,
                email: email,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                verified:true,
            });

            await newUser.save();
            done(null, newUser);
        } catch (error) {
            done(error, null);
        }
    }
)
);

passport.serializeUser((user,done) => {
    done(null,user._id)
})

passport.deserializeUser(async(id,done) => {
    const user = await User.findById(id);
    done(null,user);
})