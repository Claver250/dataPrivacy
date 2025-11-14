const Provider = require('../model/provider');
const User = require('../model/user');

exports.getProviders = async (req, res) => {
    try{
        const providers = await Provider.findAll({
            where: {userId: req.user.id},
        });
        res.status(200).json({ success: true, count: providers.length, providers})
    }catch(error){
        console.error('Error fetching providers:', error);
        res.status(500).json({message: 'Unable to fetch provider'});
    }
};

exports.getProvider = async (req, res) => {
    try{
        const {id} = req.params;

        const provider = await Provider.findOne({
            where: {userId: req.user.id},
        });

        if(!provider) {
            return res.status(404).json({message: 'Provider not found'});
        }

        res.status(200).json({ success: true, provider})
    }catch(error){
        console.error('Error fetching provider:', error);
        res.status(500).json({message: 'Unable to fetch provider'});
    }
};

exports.grantAccess = async (req, res) => {
    try{
        const {providerName, providerId, accessToken, refreshToken} = req.body;

        if(!providerName || !providerId) {
            return res.status(400).json({message: 'Provider name and ID are required'});
        }

        const [provider, created] = await Provider.findOrCreate({
            where: { userId: req.user.id, providerName},
            defaults: { providerId, accessToken, refreshToken, isActive: true},
        });

        if (!created) {
            await provider.update({ providerId, accessToken, refreshToken, isActive: true});
        }

        res.status(200).json({ success: true, provider});
    }catch(error){
        console.error('Error granting access:', error);
        res.status(500).json({ message: 'Unable to grant access'});
    }
};

exports.revokeAccess = async (req, res) => {
    try{
        const {id} = req.params;

        const provider = await Provider.findOne({
            where: {id, userId: req.user.id,},
        });

        if(!provider) {
            return res.status(404).json({message: 'Provider not found'});
        }

        await provider.update({ isActive: false, accessToken: null, refreshToken: null});

        res.status(200).json({ success: true, message: 'Provider Access revoked'});
    }catch(error){
        console.error('Error revoking access:', error);
        res.status(500).json({ message: 'Unable to revoke access'});
    }
};

exports.updateProvider = async (req, res) => {
    try{
        const {id} = req.params;

        const provider = await Provider.findOne({
            where: {id, userId: req.user.id,},
        });

        if(!provider) {
            return res.status(404).json({message: 'Provider not found'});
        }

        const{accessToken, refreshToken, manageUrl, logo} = req.body;

        await provider.update({
            accessToken: accessToken,
            refreshToken: refreshToken,
            manageUrl: manageUrl,
            logo: logo,
        })

        res.status(200).json({ success: true, provider});
    }catch(error){
        console.error('Error updating provider:', error);
        res.status(500).json({ message: 'Unable to update provider'});
    }
}