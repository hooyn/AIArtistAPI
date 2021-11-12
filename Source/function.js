const { pool } = require('./database.js');
var dateFormat = require('dateformat');


exports.returnMake = function(data, isSuccess, code, message){ //return Make
    data.isSuccess = isSuccess;
    data.code = code;
    data.message = message;

    return data;
}

exports.dateMake = function(){ //날짜 시간 로그 작업
    var date = dateFormat(Date(), "[ yyyy-mm-dd, h:MM:ss TT") + " ] "
    return date;
}
