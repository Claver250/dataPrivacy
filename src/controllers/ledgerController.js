const Compliance = require('../model/compliance');
const Ledger = require('../model/ledger');

exports.getLedger = async (req, res) => {
    try{
        const logs = await Ledger.findAll({
            include: Compliance,
            order: [['date', 'DESC']],
        });
        res.json(logs);
    }catch(error){
        res.status(500).json({ error: error.message});
    }
};