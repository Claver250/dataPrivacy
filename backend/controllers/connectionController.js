const User = require('../model/user');
const Provider = require('../model/provider');
const Consent = require('../model/consent');
const Connection = require('../model/connection');

exports.createConnection = async (req, res) => {
    try{
        const {name, providerName, app, scope} = req.body;

        const[user] = await User.findOrCreate({ where: {name}});
        if (!user) return res.status(404).json({message: 'Missing required fields'});

        const[provider] = await Provider.findOrCreate({
            where: {provider: providerName},
            defaults: {
                logo: "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg",
                manageUrl: "https://myacount.google.com/permissions"
            }
        });

        const consent = await Consent.findOrCreate({
            where: { userId, consentType: scope},
            defaults: {
                granted: true,
                grantedAt: new Date(),
            },
        });

        const [connection, created] = await Connection.findOrCreate({
            where: { userId, providerId: provider.id, app},
            defaults: {
            granted: true,
            scope,
            grantedAt: new Date(),
            updatedAt: new Date(),
            providerId: provider.id,
            consentId: consent.id
            },
        });

        if(!created) {
            connection.granted = true;
            connection.scope = scope;
            connection.updatedAt = new Date();
            await connection.save();
        }

        await Request.create({
            userId,
            app,
            requestType: 'DATA ACCESS',
            details: `User connected ${app} via ${providerName} with scope: ${scope}`,
            submittedAt: new Date(),
            status: 'completed'
        })

        res.status(201).json({
            message: 'Connection created successfully',
            data: { user, provider, consent, connection},
        })
    }catch(error){
        console.error('Error creating connection', error);
        res.status(500).json({message: 'Server error', error});
    }
};

exports.getConnections = async (req, res) => {
    try{
        const connections = await Connection.findAll({
            include: [
                { model: Provider },
                { model: Consent },
                { model: User },
            ],
        });

        res.status(200).json({
            message: 'Connections fetched successfully',
            count: connections.length,
            connections
        });
    }catch(error){
        console.error('Error fetching connections:', error);
        res.status(500).json({ message: 'Server error'});
    }
};

exports.getUserConnections = async (req, res) => {
    try{
        const { userId } = req.params;

        const connections = await Connection.findAll({
            where: { userId },
            include: [
                { model: Provider },
                { model: Consent },
            ],
        });

        if(connections.length === 0)
            return res.status(404).json({ message: 'No connection found' })

        res.status(200).json({
            message: 'Connections fetched successfully',
            connections
        });
    }catch(error){
        console.error('Error fetching user connections:', error);
        res.status(500).json({ message: 'Server error'});
    }
};

exports.revokeConnections = async (req, res) => {
    try{
        const { userId, app} = req.body;

        if (!userId || !app)
            return res.status(400).json({ message: 'Missing required fields'});

        const connection = await Connection.findOne({ where: { userId, app}});
        if(!connection)
            return res.status(404).json({ message: 'Connection not found'});

        connection.granted = false;
        connection.updatedAt = new Date();
        await connection.save();

        const consent = await Connection.findByPk(connection.consentId);
        if(consent){
            consent.granted = false;
            consent.updatedAt = new Date();
            await consent.save();
        }

        await Request.create({
            userId,
            app,
            requestType: 'DATA DELETION',
            details: `User revoked connection for ${app}`,
            submittedAt: new Date(),
            status: 'pending'
        })

        res.status(201).json({
            message: 'Connection revoked successfully',
            connection
        })
    }catch(err){
        console.error('Error revoking connections:', error);
        res.status(500).json({ message: 'Server error'});
    }
};

exports.deleteConnection = async (req, res) => {
    try{
        const { id } = req.params;
        const connection = await Connection.findByPk(id);

        if(!connection)
            return res.status(404).json({ message: 'Connection not found'});

        await connection.destroy();
        res.status(200).json({ message: 'Connection deleted successfully'})
    }catch(err){
        console.error('Error deleting connections:', error);
        res.status(500).json({ message: 'Server error'});
    }
}