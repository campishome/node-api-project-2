import express from "express";
import { conn, queryAsync } from "../dbconnect";
import mysql from "mysql";
export const router = express.Router();
import{imageReq, imagereq, scorereq}from "../Model/insertModel";

//vote
router.get("/", (req, res) => {
    const sql="SELECT User.username, Image.image_url, Image.image_id, User.user_id , Image.current_score,User.picture FROM User INNER JOIN Image ON Image.user_id = User.user_id ";
    conn.query(sql, (err, result, fields)=>{
        res.status(200);
        res.json(result);
    });
  });
  router.get("/all_vote", (req, res) => {
    const sql="SELECT * FROM vote ";
    conn.query(sql, (err, result, fields)=>{
        res.status(200);
        res.json(result);
    });
  });
//api get score
router.get("/score/:id", (req, res) => {
    let id = +req.params.id;
    const sql = "SELECT current_score FROM Image WHERE image_id = ?";
    conn.query(sql, [id], (err, result, fields) => {
        if (err) {
            console.error("Error querying database:", err);
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }
        // ถ้าพบข้อมูล ส่งค่า score กลับไปในรูปแบบ JSON
        res.status(200).json(result[0]);
    });
});
//api insert score
router.post("/scoreup", (req, res) => {
    const score:scorereq = req.body; 
    console.log(score);
    let sql = "INSERT INTO vote (score,image_id,vote_date) VALUES (?,?,?)";
    sql = mysql.format(sql, [
        score.score,
        score.image_id,
        score.vote_date
    ]); 
    conn.query(sql, (err, result) => {
        if (err) throw err;
        res.status(201).json({
            affected_row: result.affectedRows,
            last_idx: result.insertId
        });
    });
  });
  
  //update
  router.put("/:id", async (req, res) => {
    let id = +req.params.id;
    let user: scorereq = req.body;
    let userOriginal: scorereq | undefined;
    //-----
    let sql = mysql.format("select * from vote where image_id = ?", [id]);
  
    let result = await queryAsync(sql);
    const rawData = JSON.parse(JSON.stringify(result));
    console.log(rawData);
    userOriginal = rawData[0] as scorereq;
    console.log( userOriginal);
  
    let updatevote = {... userOriginal, ...user};
    console.log(user);
    console.log(updatevote);
  
      sql =
      "update  `vote` set `score`=?, `image_id`=?, `vote_date`=? where `image_id`=? AND `vote_date`=?";
      sql = mysql.format(sql, [
        updatevote.score,
        updatevote.image_id,
        user.vote_date,
        id,
        user.vote_date
      ]);
      conn.query(sql, (err, result) => {
        if (err) throw err;
        res.status(201).json({ affected_row: result.affectedRows });
      });
  });
  //insert then update current_score 
  router.post("/insertvote/:id", (req, res) => {
    const imageUrl:imageReq = req.body; 
    console.log(imageUrl);
    let sql = "INSERT INTO vote (score,vote_date,image_id) VALUES (?,?,?)";
    sql = mysql.format(sql, [
        imageUrl.score,
        imageUrl.vote_date,
        imageUrl.image_id,
    ]); 
    conn.query(sql, (err, result) => {
        if (err) throw err;
        res.status(201).json({
            affected_row: result.affectedRows,
            last_idx: result.insertId
        });
    });
    
  });

  //indsert image
router.post("/imagevote", (req, res) => {
    const imageUrl:imageReq = req.body; 
    console.log(imageUrl);
    let sql = "INSERT INTO vote (score,vote_date,image_id) VALUES (?,?,?)";
    sql = mysql.format(sql, [
        imageUrl.score,
        imageUrl.vote_date,
        imageUrl.image_id
    ]); 
    conn.query(sql, (err, result) => {
        if (err) throw err;
        res.status(201).json({
            affected_row: result.affectedRows,
            last_idx: result.insertId
        });
    });
  });


//   SELECT * FROM vote WHERE vote_date = '14/3/2024' ORDER BY score DESC LIMIT 10