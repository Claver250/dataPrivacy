const User = require('../model/user');
const Provider = require('../model/provider');
const Consent = require('../model/consent');
const Connection = require('../model/connection');

exports.createConnection = async (req, res) => {
    try{
        const {name, providerName, app, scope} = req.body;

        const[user] = await User.findOrCreate({ where: {name}});

        const[provider] = await Provider.findOrCreate({
            where: {provider: providerName},
            defaults: {
                logo: "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg",
                manageUrl: "https://myacount.google.com/permissions"
            }
        });

        const consent = await Consent.create({
            consentType: scope,
            granted: true,
            userId: user.id
        });

        const connection = await Connection.create({
            app,
            granted: true,
            scope,
            grantedAt: new Date(),
            updatedAt: new Date(),
            providerId: provider.id,
            consentId: consent.id
        });

        res.status(201).json({
            message: 'Connection created successfully',
            data: { user, provider, consent, connection},
        })
    }catch(error){
        console.error('Error creating connection', error);
        res.status(500).json({message: 'Server error', error});
    }
}