const express = require('express');
const router = require('./router/router');
const helmet = require('helmet');


var util = require('./function.js')
var dateFormat = require('dateformat');
var app = express();


app.use(helmet()); //보안setting
app.use(router);
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.set('port', process.env.PORT || 3030);

app.listen(app.get('port'), function(){
    console.log('Express Server 3030 Running' + util.dateMake() );
});