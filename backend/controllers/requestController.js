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
        status: 'pending',
        correctionData: correctionData || null,
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

exports.getAllRequests = async (req, res) => {
    try{
        const requests = await Request.findAll({
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

        if (status === 'approved') {
            const user = await User.findByPk(request.userId);

            switch (request.requestType) {
                case 'DATA ACCESS':
                    return res.status(200).json({ success: true, message: 'Request approved', data: user});
                case 'DATA DELETION':
                    await user.destroy();
                    return res.status(200).json({ success: true, message: 'User data deleted successfully'});
                case 'DATA CORRECTION':
                    if (!request.correctionData) {
                        return res.status(400).json({success: false, message: 'No correction data provided'});
                    }

                    await user.update(request.correctionData);
                    return res.status(200).json({
                        success: true,
                        message: 'User data corrected successfully',
                        data: user
                    });
            }
        }

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

exports.deleteRequest = async (req, res) => {
    try{
        const {id} = req.params;
        const request = await Request.findByPk(id);

        if(!request) return res.status(404).json({success: false, message: 'Request not found'});

        await request.destroy();
        res.status(200).json({ success: false, message: 'Request deleted successfully' })
    }
    catch(error){
        console.error(error);
        res.status(500).json({success: false, message: 'Server Error'})
    }
};