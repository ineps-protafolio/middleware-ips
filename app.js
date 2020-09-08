
var express = require('express');
var service = require('./modules/service');
var config = require('./config');
var bodyParser = require('body-parser');
var ip = require('ip');
var ipRangeCheck = require("ip-range-check");

var app = express();


app.use( function(req, res, next) {
    var invalidIp = false;
    console.log('middleware');
    var ipReq = ip.address();
    var blackList =  config.BLACKLIST.split(",");

    console.log('MyIP: ', ip.address());
    //Revisar grupo de IPS de  BLACKLIST
    for (var i = 0, len = blackList.length; i < len; i++) {
        console.log('ip--- ', blackList[i]);
        if (ipRangeCheck(blackList[i],  ip.address())) {
            console.log(`IP address blacklist ${ip.address()} has tried to access the service`);
            
        }else {
            next();
        }
    }
    
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