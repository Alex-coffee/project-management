//fs ====================================
var fs = require('fs');
var settings = require('./settings');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Disposition');
    next();
}

module.exports = function(app) {
    app.use(allowCrossDomain);

    app.post('/api/saveJSON', function(req, res){
        fs.open(settings.dataPath + req.body.fileUrl, "w",function(err, fd){
            var points = JSON.stringify(req.body.content);
            var buf = new Buffer(points);
            fs.writeSync(fd,buf,0,buf.length,0);
            res.status(200).send({"message" : "数据已保存"});
        })
    })

};