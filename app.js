
var express = require('express');
var service = require('./modules/service');
var config = require('./config');

var app = express();
var bodyParser = require('body-parser');
var ip = require('ip');

app.use( function(req, res, next) {
    var invalidIp = false;
    console.log('middleware');
    var blackList = split(config.BLACKLIST);
    
    //Revisar grupo de IPS de  BLACKLIST
    for (var i = 0, len = blackList.length; i < len; i++) {
        console.log('ip--- ', blackList[i]);
        if (blackList[i].toString() == ip.address()) {
            invalidIp = true;
        }
    }
    //Mensaje en el LOG si la IP no es válida
    if (invalidIp) {
        console.log(`IP address ${ip.address()} has tried to access the service`);
        res.send('Error de IP');
    }

    next();
});
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({
  verify: function(req, res, buf, encoding) {
      // get rawBody        
      req.rawBody = buf.toString();
      //console.log("rawBody", req.rawBody);
  }
}));

app.post('/ips', service.prueba);

app.listen(config.PORT, function(){
    console.log('PORT: ', config.PORT);
    console.log('IP: ' , ip.address());
});