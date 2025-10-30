const Compliance = require('../model/compliance');
const Ledger = require('../model/ledger');

exports.getAllCompliance = async (req, res) => {
    try{
        const records = await Compliance.findAll({ include: Ledger});
        res.json(records);
    }catch(error){
        res.status(500).json({error: error.message});
    }
};

exports.createCompliance = async (req, res) => {
    try{
        const record = await Compliance.create(req.body);
        await Ledger.create({
            action: `Created ${record.type}: ${record.title}`,
            actor: req.body.actor || 'System',
            ComplianceId: record.id,
        });
        res.json(record);
    }catch(error){
        res.status(500).json({ error: error.message});
    }
};

exports.updateComplianceStatus = async (req, res) => {
    try{
        const {id} = req.params;
        const {status, actor} = req.body;

        const record = await Compliance.findByPk(id);
        if (!record) return res.status(404).json({ message: 'Report not found'});

        record.status = status;
        await record.save();

        await Ledger.create({
            action: `Status changed to ${status}`,
            actor: actor || 'Admin',
            ComplianceId: record.id,
        });

        res.json(record);
    }catch(error){
        res.status(500).json({ error: error.message});
    }
};