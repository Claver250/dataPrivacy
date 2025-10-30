const User = require('../model/user');
const Request = require('../model/request');

exports.createRequest = async (req, res) => {
    try{
        const {userId, email, app, requestType, details} = req.body;

    if (!userId || !email || !app || !requestType) {
        return res.status(400).json({message: 'Missing required fields.'})
    }

    const newRequest = await Request.create({
        userId,
        email,
        app,
        requestType,
        details,
        submittedAt: new Date(),
        status: 'pending'
    });

    console.log(`[Request Created]  ${requestType.toUpperCase()} request for ${app}`);

    res.status(201).json({
        success: true,
        message: 'Privacy request created successfully',
        request: newRequest,
    });
    }catch(error){
        console.error('Error creating request', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
};

exports.getUserRequests = async (req, res) => {
    try{
        const {userId} = req.params;
        const requests = await Request.findAll({
            where: { userId },
            include: [{ 
                model: User, as: 'user', 
                attributes: ['name', 'email']}],
            order: [['submittedAt', 'DESC']],
        });

        res.json({success: true, requests})
    }catch(error){
        console.error(error);
        res.status(500).json({
            success: false, 
            message: 'Internal server error'});
    }
};

exports.updateRequestStatus = async (req, res) => {
    try{
        const {id}= req.params;
        const {status} = req.body;

        const request = await Request.findByPk(id);
        if(!request) return res.status(404).json({
            message: 'Request not found'
        });

        request.status = status;
        await request.save();

        console.log(`[Request Updated] ID: ${id}, Status: ${status.toUpperCase()}`);

        res.json({
            success: true,
            message: 'Request status updated', request
        });
    }catch(error){
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
};