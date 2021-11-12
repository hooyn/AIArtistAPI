const { pool } = require('../database.js');
const util = require('../function.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const spawn = require('child_process').spawn; 


//1. 회원가입
exports.join = async function(req, res){
    const {
        userID,
        userPW,
        userEMAIL,
    } = req.body

    var data = {};

    if(!userID){
        console.log("[join] 아이디를 입력하세요." + + util.dateMake());
        return res.json(util.returnMake(data, false, 301, '아이디를 입력하세요.'));
    }
    if(!userPW){
        console.log("[join] 비밀번호를 입력하세요." + + util.dateMake());
        return res.json(util.returnMake(data, false, 302, '비밀번호를 입력하세요.'));
    }
    if(!userEMAIL){
        console.log("[join] 이메일을 입력하세요." + + util.dateMake());
        return res.json(util.returnMake(data, false, 303, '이메일을 입력하세요.'));
    }
        
    try{
        var connection = await pool.getConnection(async (conn) => conn);
        var query =`
                select *
                from user
                where user_id = ?`;
        var params = [userID];
        var [rows_id] = await connection.query( // 아이디 중복 체크
            query,
            params
        );
        var query =`
                select *
                from user
                where user_email = ?`;
        var params = [userEMAIL];
        var [rows_email] = await connection.query( // 이메일 중복 체크
            query,
            params
        );
        connection.release();

        if(rows_id[0]){
            console.log("[join] [ " + userID + "] 이미 존재하는 아이디 입니다." + util.dateMake());
            return res.json(util.returnMake(data, false, 304, '이미 존재하는 아이디입니다.'));
        }
        else if(rows_email[0]){
            console.log("[join] [ " + userEMAIL + "] 이미 존재하는 이메일 입니다." + util.dateMake());
            return res.json(util.returnMake(data, false, 305, '이미 존재하는 이메일입니다.'));
        }
        else{
            //password 암호화
            var encryptedPW = bcrypt.hashSync(userPW, 10)
            var connection = await pool.getConnection(async (conn) => conn);
            var query =`
                    insert into
                    user(user_id, user_pw, user_email)
                    values(?, ?, ?)`;
            var params = [userID, encryptedPW, userEMAIL];
            var [rows] = await connection.query( // 회원 정보 DB에 저장
                query,
                params
            );
            var query =`
                    insert into
                    workspace(workspace_id)
                    values(?)`;
            var params = [userID];
            var [rows_workspace] = await connection.query( // 회원 workspace 생성
                query,
                params
            );
            connection.release();

            const same = bcrypt.compareSync(userPW, encryptedPW)
            data.content = {'ID':userID, 'PW':encryptedPW, 'E-Mail':userEMAIL }
            console.log("[join] [ " + userID + "] 회원가입이 완료되었습니다.." + util.dateMake());
            return res.json(util.returnMake(data, true, 200, '회원가입이 완료되었습니다.'));
        }
    } catch (err) {
        console.error("[join] 서버 통신이 실패했습니다." + " [ " + util.dateMake());
        return res.status(500).send(`Error: ${err}`);
    }
}

//2. 로그인
exports.login = async function(req, res){
    const {
        userID,
        userPW
    } = req.body

    var data = {};

    if(!userID){
        console.log("[login] 아이디를 입력하세요." + + util.dateMake());
        return res.json(util.returnMake(data, false, 301, '아이디를 입력하세요.'));
    }
    if(!userPW){
        console.log("[login] 비밀번호를 입력하세요." + + util.dateMake());
        return res.json(util.returnMake(data, false, 302, '비밀번호를 입력하세요.'));
    }
        
    try{
        var connection = await pool.getConnection(async (conn) => conn);
        var query =`
                select *
                from user
                where user_id = ?`;
        var params = [userID];
        var [rows] = await connection.query(
            query,
            params
        );
        connection.release();

        if(rows[0]){
            if(rows[0])
                var same = bcrypt.compareSync(userPW, rows[0].user_pw)
                if(same){
                    console.log("[login] [ " + userID + "] 로그인 되었습니다." + util.dateMake());
                    return res.json(util.returnMake(data, true, 200, '로그인 되었습니다.'));
                }
                else{
                    console.log("[login] [ " + userID + "] 아이디 또는 비밀번호를 확인해주세요." + util.dateMake());
            return res.json(util.returnMake(data, false, 303, '아이디 또는 비밀번호를 확인해주세요.'));
                }
        }
        else{
            console.log("[login] [ " + userID + "] 아이디 또는 비밀번호를 확인해주세요." + util.dateMake());
            return res.json(util.returnMake(data, false, 303, '아이디 또는 비밀번호를 확인해주세요.'));
        }
    } catch (err) {
        console.error("[join] 서버 통신이 실패했습니다." + " [ " + util.dateMake());
        return res.status(500).send(`Error: ${err}`);
    }
}