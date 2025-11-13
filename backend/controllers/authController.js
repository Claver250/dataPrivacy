const { User, Provider, Connection, Consent} = require('../model');
const {hashPassword, comparePassword} = require('../utils/bcrypt');
const {userSchema, loginSchema} = require('../validators/userValidate');
const { generateToken } = require('../utils/token');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.register = async (req, res) => {
    try {
        const {error, value} = userSchema.validate(req.body);
        if (error) return res.status(400).json({error : error.message});
        const {name, email, password, role } = value;

        const existingUser = await User.findOne({ where: {email} });
        if (existingUser) return res.status(400).json({ error: 'Email already exist'});

        const hashedPassword = await hashPassword(password);

        const newUser = await User.create({ name,
            email,
            phoneNumber,
            password: hashedPassword, 
            role
        });

        const[provider] = await Provider.findOrCreate({
            where: {provider: providerName},
            defaults: {
                logo: "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg",
                manageUrl: "https://myacount.google.com/permissions"
            }
        });

        const sampleConnections = [
            { app: 'Spotify', scope: 'Email, Profile', granted: true},
            { app: 'Coursera', scope: 'Email', granted: false},
        ];

        for (const item of sampleConnections) {
            const consent = await Consent.create({
                userId: newUser.id,
                consentType: item.scope,
                granted: item.granted,
                userId: user.id

        });

            await Connection.create({
                app: item.app,
                granted: item.granted,
                scope: item.scope,
                grantedAt: new Date(),
                updatedAt: new Date(),
                providerId: provider.id,
                consentId: consent.id
        });
        }


        res.status(201).json({
            message: 'User registered successfully',
            user: {id: newUser.userID, name: newUser.name, email: newUser.email}
        });
    }catch(err){
        res.status(500).json({ error : err.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const {error, value} = loginSchema.validate(req.body);
        if(error) return res.status(400).json({ error: error.message});

        const {email, password} = value;

        const user = await User.findOne({ where: {email} });
        if(!user) return res.status(400).json({ error: 'User not found'});

        const isMatch = await comparePassword(password, user.password);
        if(!isMatch) return res.status(400).json({ error: 'Invalid details'});

        const token = generateToken(user);
        res.status(200).json({
            message: 'Login successful',
            token,
        });
    } catch(err){
        res.status(500).json({error: err.message});      
    }
};

exports.googleLogin = async (req, res) => {
    try{
        const { token } = req.body;

        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payLoad = ticket.getPayload();
        const { email, name, sub: googleId } = payLoad

        let user = await User.findOne({ where: { email }});
        // If user exists but was registered manually, link Google
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

        const jwtToken = generateToken(user);

        res.status(200).json({
            message: 'Google login successful',
            token: jwtToken,
            user: { id: user.id, 
                name: user.name, 
                email: user.email, 
                authProvider: user.authProvider,
            },
        });
    }catch(err){
        res.status(500).json({ error: err.message });
    }
};