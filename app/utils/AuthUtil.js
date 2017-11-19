var settings = require('../../config/settings');
var jwt    = require('jsonwebtoken');
var SchemaServices = rootRequire('app/services/SchemaServices');
var SchemaFactory = rootRequire('app/utils/SchemaFactory');

var apiInit = function(app){
    app.set('superSecret', settings.secret);
    app.use('/api', function(req, res, next) {
        if('OPTIONS' === req.method) { next(); return; } 
        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['authorization'];

        // decode token
        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, app.get('superSecret'), function(err, decoded) {
                if (err) {
                    return res.json({ success: false, message: 'Failed to authenticate token.' });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });

        } else {
            // if there is no token
            // return an error
            return res.status(401).send({
                success: false,
                message: 'No token provided.'
            });
        }
    });

    app.get('/auth/request', function(req, res) {
        const payload = {
            host: "testUser"
        };
        var token = jwt.sign(payload, app.get('superSecret'), {
            expiresIn: "3h"
        });

        // return the information including token as JSON
        res.json({
            success: true,
            token: token
        });
    });

    app.get('/auth/test', function(req, res) {
        res.status(200).send("OK");
    });

    app.post('/login', function(req, res) {
        const user = SchemaFactory.getModel("user");
        let condition = {
            email: req.body.name,
            pwd: req.body.pwd
        }
        SchemaServices.find(user, condition, {currentPage: 1, pageSize: 1})
            .then(function(result){
            if(result.length > 0){
                let loginUser = result[0];
                if(loginUser.isActive){
                    // res.json(loginUser);
                    const payload = {
                        id: loginUser._id
                    };
                    var token = jwt.sign(payload, app.get('superSecret'), {
                        expiresIn: "24h" // expires in 24 hours
                    });

                    res.json({
                        email: loginUser.email,
                        firstName: loginUser.firstName,
                        lastName: loginUser.lastName,
                        type: loginUser.type,
                        _id: loginUser._id,
                        token: token
                    });

                }else{
                    res.status(500).send('用户未激活');
                }
            }else{
                res.status(500).send('用户名或密码错误');
            }
        });
    });

}


module.exports = {
    apiInit: apiInit,

};