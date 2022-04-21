const { pool } = require('../database.js');
const util = require('../function.js');
const spawn = require('child_process').spawn; 
var request = require("sync-request");
const {Storage} = require('@google-cloud/storage');
const storage = new Storage({keyFilename: '/home/ubuntu/key/******************.json'});
const bucket = 'gs://epoch-7c08e.appspot.com';
var async = require('async')


//모델 연동
exports.testModel = async function(req, res){
    const {
        userID,
        fileName
    } = req.body

    data = {}

    try{
         function uploadFile() {
             storage.bucket(bucket).upload('/home/ubuntu/image/' + userID + '/result.png', {
               destination: userID + "/result/" + fileName,
               contentType: 'image/png'
             });
             console.log("[testModel] [ " + userID + "] Result Image Uploading." + util.dateMake());
             return res.json(util.returnMake(data, true, 200, 'nst 모델이 완료되었습니다.'));
         }
         uploadFile()
        console.log("[testModel] [ " + userID + " / " + fileName + "] Result Image Uploading." + util.dateMake());
        return res.json(util.returnMake(data, true, 200, 'nst 모델이 완료되었습니다.'));

    } catch (err) {
        console.error("[testModel] 서버 통신이 실패했습니다." + " [ " + util.dateMake());
        return res.status(500).send(`Error: ${err}`);
    }
}

//모델 연동
exports.nstModel = async function(req, res){
    const {
        userID,
        fileName
    } = req.body

    var random = Math.floor(Math.random() * 100000)

    var connection = await pool.getConnection(async (conn) => conn);
    var query =`
            select *
            from workspace
            where workspace_id=?`;
    var params = [userID];
    var [rows] = await connection.query( 
        query,
        params
    );
    connection.release();

    //테스트 해보기 rows[0].image 잘받아지는지 -> sys.argv[1], sys.argv[2]로 받아서 결과값 나오는지 해보기

    const py = spawn('python3', ['/home/ubuntu/python/nst.py', rows[0].workspace_style, rows[0].workspace_content, userID, random]);
    var Rdata = {};

    try{
        py.stdout.on('data', function(data) { 
            console.log("[nstModel] 성공 : " + data.toString() + util.dateMake());
        }); 
        py.stderr.on('data', function(data) {
            console.log("[nstModel] 실패 : " + data.toString() + util.dateMake());
        });
        py.on('exit', function(code){
            function uploadFile() {
                storage.bucket(bucket).upload('/home/ubuntu/image/' + userID + '/result'+ random +'.png', {
                  destination: userID + "/result/" + random,
                  contentType: 'image/png'
                });
                data.content = random
                console.log("[nstModel] [ " + userID + "] Result Image Uploading." + util.dateMake());
                return res.json(util.returnMake(data, true, 200, 'Result Image가 업로드 되었습니다.'));
            }
            uploadFile()
        })
    } catch (err) {
        console.error("[nstModel] 서버 통신이 실패했습니다." + " [ " + util.dateMake());
    }
}

//모델연동
exports.aiArtistModel = async function(req, res){
    const {
        userID,
        fileName,
        aiName
    } = req.body

    var random = Math.floor(Math.random() * 100000)

    var connection = await pool.getConnection(async (conn) => conn);
    var query =`
            select *
            from workspace
            where workspace_id=?`;
    var params = [userID];
    var [rows] = await connection.query( 
        query,
        params
    );
    var query =`
            select *
            from artist
            where artist_name=?`;
    var params = [aiName];
    var [rows_artist] = await connection.query( 
        query,
        params
    );
    connection.release();

    //테스트 해보기 rows[0].image 잘받아지는지 -> sys.argv[1], sys.argv[2]로 받아서 결과값 나오는지 해보기

    const py = spawn('python3', ['/home/ubuntu/python/nst.py', rows_artist[0].artist_url, rows[0].workspace_content, userID, random]);
    var Rdata = {};

    try{
        py.stdout.on('data', function(data) { 
            console.log("[nstModel] 성공 : " + data.toString() + util.dateMake());
        }); 
        py.stderr.on('data', function(data) {
            console.log("[nstModel] 실패 : " + data.toString() + util.dateMake());
        });
        py.on('exit', function(code){
            function uploadFile() {
                storage.bucket(bucket).upload('/home/ubuntu/image/' + userID + '/result'+ random +'.png', {
                  destination: userID + "/result/" + random,
                  contentType: 'image/png'
                });
                data.content = random
                console.log("[nstModel] [ " + userID + "] Result Image Uploading." + util.dateMake());
                return res.json(util.returnMake(data, true, 200, 'Result Image가 업로드 되었습니다.'));
            }
            uploadFile()
        })
    } catch (err) {
        console.error("[nstModel] 서버 통신이 실패했습니다." + " [ " + util.dateMake());
    }
}

//모델 연동
exports.objectModel = async function(req, res){
    const {
        userID,
        fileName
    } = req.body

    var random = Math.floor(Math.random() * 100000)

    var connection = await pool.getConnection(async (conn) => conn);
    var query =`
            select *
            from workspace
            where workspace_id=?`;
    var params = [userID];
    var [rows] = await connection.query( 
        query,
        params
    );
    connection.release();

    //테스트 해보기 rows[0].image 잘받아지는지 -> sys.argv[1], sys.argv[2]로 받아서 결과값 나오는지 해보기

    const py = spawn('python3', ['/home/ubuntu/python/instance.py', rows[0].workspace_style, rows[0].workspace_content, userID, random]);
    var Rdata = {};

    try{
        py.stdout.on('data', function(data) { 
            console.log("[objectModel] 성공 : " + data.toString() + util.dateMake());
        }); 
        py.stderr.on('data', function(data) {
            console.log("[objectModel] 실패 : " + data.toString() + util.dateMake());
        });
        py.on('exit', function(code){
            data.content = random
            console.log("[objectModel] [ " + userID + "] objectModel Image Uploading." + util.dateMake());
            return res.json(util.returnMake(data, true, 200, 'objectModel Image가 업로드 되었습니다.'));
        })
    } catch (err) {
        console.error("[objectModel] 서버 통신이 실패했습니다." + " [ " + util.dateMake());
    }
}

//어울리게 하는 모델 찬희 모델에서 나온 이미지 input으로 주기
//모델 연동
exports.objectResultModel = async function(req, res){
    const {
        userID,
        fileName
    } = req.body

    var random = Math.floor(Math.random() * 100000)

    const py = spawn('python3', ['/home/ubuntu/python/instance.py', userID, random]);
    var Rdata = {};

    try{
        py.stdout.on('data', function(data) { 
            console.log("[objectResultModel] 성공 : " + data.toString() + util.dateMake());
        }); 
        py.stderr.on('data', function(data) {
            console.log("[objectResultModel] 실패 : " + data.toString() + util.dateMake());
        });
        py.on('exit', function(code){
            function uploadFile() {
                storage.bucket(bucket).upload('/home/ubuntu/image/' + userID + '/result'+ random +'.png', {
                  destination: userID + "/result/" + random,
                  contentType: 'image/png'
                });
                data.content = random
                console.log("[objectResultModel] [ " + userID + "] objectResultModel Image Uploading." + util.dateMake());
                return res.json(util.returnMake(data, true, 200, 'objectResultModel Image가 업로드 되었습니다.'));
            }
            uploadFile()
        })
    } catch (err) {
        console.error("[objectResultModel] 서버 통신이 실패했습니다." + " [ " + util.dateMake());
    }
}
