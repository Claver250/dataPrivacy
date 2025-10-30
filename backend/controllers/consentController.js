const Consent = require('../model/consent');
const Connection = require('../model/connection');
const Request = require('../model/request');

exports.grantConsent = async (req, res) => {
    try{
        const {userId, consentType, app} = req.body;

        if (!userId || !consentType || !app) {
            return res.status(400).json({ error: 'Missing field required'})
        };

        const [consent, created] = await Consent.findOrCreate({
            where:{ userId, consentType },
            defaults: {
                granted: true,
                grantedAt: new Date(),
                updatedAt: new Date(),
            }
        });

        if (!created) {
            consent.granted = true;
            consent.updatedAt = new Date();
            await Connection.save();
        }

        const connection = await Connection.findOne({
            where:{consentId: consent.id, app }
        });

        if (connection) {
            connection.granted = true;
            connection.updatedAt = new Date();
            await connection.save();
        }

        await Request.create({
            userId,
            app: app,
            requestType: 'access',
            details: `User granted consent to share ${consentType} data with ${app}`,
            submittedAt: new Date(),
            status: 'completed'
        });

        console.log(`[ACCESS REQUEST CREATED] ${app} - ${consentType}`);

        res.json({
            success: true,
            message: 'Consent granted, connection updated, and access request created',
            consent,
            connection
        });
    }catch(err){
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }   
};

exports.revokeConsent = async (req, res) => {
    try{
        const {userId, consentType, app} = req.body;

        if (!userId || !consentType || !app) {
            return res.status(400).json({ error: 'Missing field required'})
        };

        const consent = await Consent.findOne({
            where: { userId, consentType }
        });

        if (!consent) return res.status(404).json({
            message: 'Consent not found'
        });

        consent.granted = false,
        consent.updatedAt = new Date(),
        await connection.save();

        await Request.create({
            userId,
            app: app,
            requestType: 'deletion',
            details: `User revoked consent for ${consentType} data sharing with ${app}.`,
            submittedAt: new Date(),
            status: 'pending'
        });

        console.log(`[DELETION REQUEST CREATED] ${app} - ${consentType}`);

        res.json({
            success: true,
            message: 'Consent revoked, connection disabled, and deletion request created',
            consent,
            connection
        });
    }catch(error){
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

exports.getConsent = async (req, res) => {
    const { userId } = req.params;
    const consents = await Consent.findAll({
        where: { userId },
        include: [
            {model: Connection, as: 'connections' },
            {model: Request, as: 'requests' }
        ]
    });
    res.json({
        success: true, consents
    })
}