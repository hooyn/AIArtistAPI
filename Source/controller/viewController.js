const { pool } = require('../database.js');
const util = require('../function.js');

exports.addArtist = async function(req, res){
    const {
        artistName,
        artistUrl
    } = req.body

    var data = {};
        
    try{
        var connection = await pool.getConnection(async (conn) => conn);
        var query =`
                insert into
                artist(artist_name, artist_url)
                values(?, ?)`;
        var params = [artistName, artistUrl];
        var [rows] = await connection.query(
            query,
            params
        );
        connection.release();
        console.log("[addArtist] Artist AI 추가되었습니다." + util.dateMake());
        return res.json(util.returnMake(data, true, 200, 'Artist AI 추가되었습니다.'));

    } catch (err) {
        console.error("[addArtist] 서버 통신이 실패했습니다." + " [ " + util.dateMake());
        return res.status(500).send(`Error: ${err}`);
    }
}

//1. artist list
exports.artistList = async function(req, res){

    var data = {};
        
    try{
        var connection = await pool.getConnection(async (conn) => conn);
        var query =`
                select *
                from artist`;
        var params = [];
        var [rows] = await connection.query(
            query,
            params
        );
        connection.release();

        data.content = rows
        console.log("[artistList] 화가 목록이 조회되었습니다." + util.dateMake());
        return res.json(util.returnMake(data, true, 200, '화가 목록이 조회되었습니다.'));

    } catch (err) {
        console.error("[artistList] 서버 통신이 실패했습니다." + " [ " + util.dateMake());
        return res.status(500).send(`Error: ${err}`);
    }
}

//1. artist list
exports.artList = async function(req, res){
    const {
        userID
    } = req.body

    var data = {};
        
    try{
        var connection = await pool.getConnection(async (conn) => conn);
        var query =`
                select *
                from art
                where art_id = ?
                order by art_no desc`;
        var params = [userID];
        var [rows] = await connection.query(
            query,
            params
        );
        connection.release();

        data.content = rows
        console.log("[artlist] ["+ userID +"] 작품 목록이 조회되었습니다." + util.dateMake());
        return res.json(util.returnMake(data, true, 200, '작품 목록이 조회되었습니다.'));

    } catch (err) {
        console.error("[artlist] 서버 통신이 실패했습니다." + " [ " + util.dateMake());
        return res.status(500).send(`Error: ${err}`);
    }
}

//1. artist list
exports.artDelete = async function(req, res){
    const {
        artNo
    } = req.body

    var data = {};
        
    try{
        var connection = await pool.getConnection(async (conn) => conn);
        var query =`
                delete from art
                where art_no = ?`;
        var params = [artNo];
        var [rows] = await connection.query(
            query,
            params
        );
        connection.release();

        console.log("[artDelete] ["+ artNo +"] 작품이 삭제되었습니다." + util.dateMake());
        return res.json(util.returnMake(data, true, 200, '작품이 삭제되었습니다.'));

    } catch (err) {
        console.error("[artDelete] 서버 통신이 실패했습니다." + " [ " + util.dateMake());
        return res.status(500).send(`Error: ${err}`);
    }
}