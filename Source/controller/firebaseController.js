const { pool } = require('../database.js');
const util = require('../function.js');
const {Storage} = require('@google-cloud/storage');
var request = require("sync-request");
var download = require('download-file');
const { data } = require('@tensorflow/tfjs');

const storage = new Storage({keyFilename: '/home/ubuntu/key/epoch-7c08e-firebase-adminsdk-898gp-b72e4cbd9a.json'});
const bucket = 'gs://epoch-7c08e.appspot.com';

// 편집할 이미지 firebase storage 업로드 //사용자 id
exports.styleUpload = async function(req, res){
    const{
        userID,
        fileName
    } = req.body

    var url = 'https://firebasestorage.googleapis.com/v0/b/epoch-7c08e.appspot.com/o/' + userID + '%2FstyleImage%2F' + fileName

    let downloadurl

    try{
        var _response = request('GET', url)
        var result = _response.getBody().toString();
        downloadurl = url + '?alt=media&token=' + result.split('"')[59];
        var connection = await pool.getConnection(async (conn) => conn);
        var query =`
                update workspace
                set workspace_style=?
                where workspace_id=?`;
        var params = [downloadurl, userID];
        var [rows] = await connection.query(
            query,
            params
        );
        connection.release();
        data.content = downloadurl
        console.log("[styleUpload] [ " + userID + "] Style Image Uploading." + util.dateMake());
        return res.json(util.returnMake(data, true, 200, 'Style Image가 업로드 되었습니다.'));
    } catch (err) {
        console.error("[styleUpload] 서버 통신이 실패했습니다." + " [ " + util.dateMake());
        return res.status(500).send(`Error: ${err}`);
    }
    
}

// 편집할 이미지 firebase storage 업로드 //사용자 id
exports.contentUpload = async function(req, res){
    const{
        userID,
        fileName
    } = req.body

    var url = 'https://firebasestorage.googleapis.com/v0/b/epoch-7c08e.appspot.com/o/' + userID + '%2FcontentImage%2F' + fileName

    let downloadurl

    try{
        var _response = request('GET', url)
        var result = _response.getBody().toString();
        downloadurl = url + '?alt=media&token=' + result.split('"')[59];
        var connection = await pool.getConnection(async (conn) => conn);
        var query =`
                update workspace
                set workspace_content=?
                where workspace_id=?`;
        var params = [downloadurl, userID];
        var [rows] = await connection.query(
            query,
            params
        );
        connection.release();
        console.log("[contentUpload] [ " + userID + "] Content Image Uploading." + util.dateMake());
        return res.json(util.returnMake(data, true, 200, 'Content Image가 업로드 되었습니다.'));
    } catch (err) {
        console.error("[contentUpload] 서버 통신이 실패했습니다." + " [ " + util.dateMake());
        return res.status(500).send(`Error: ${err}`);
    }
    
}

exports.resultUpload = async function(req, res){
    const{
        userID,
        fileName
    } = req.body

    var url = 'https://firebasestorage.googleapis.com/v0/b/epoch-7c08e.appspot.com/o/' + userID + '%2Fresult%2F' + fileName

    let downloadurl

    try{
        var _response = request('GET', url)
        var result = _response.getBody().toString();
        downloadurl = url + '?alt=media&token=' + result.split('"')[55];
        console.log(downloadurl)
        var connection = await pool.getConnection(async (conn) => conn);
        var query =`
                insert into
                art(art_id, art_filename, art_url)
                values(?, ?, ?)`;
        var params = [userID, fileName, downloadurl];
        var [rows] = await connection.query(
            query,
            params
        );
        connection.release();
        console.log("[resultUpload] [ " + userID + "] Result Image Uploading." + util.dateMake());
        return res.json(util.returnMake(data, true, 200, 'Result Image가 업로드 되었습니다.'));
    } catch (err) {
        console.error("[resultUpload] 서버 통신이 실패했습니다." + " [ " + util.dateMake());
        return res.status(500).send(`Error: ${err}`);
    }
    
}