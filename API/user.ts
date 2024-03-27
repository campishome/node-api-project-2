import express from "express";
import { conn, queryAsync } from "../dbconnect";
import mysql from "mysql";
import { userReq } from "../Model/insertModel";
export const router = express.Router();

router.get("/", (req, res) => {
  conn.query('select * from User', (err, result, fields)=>{
    res.json(result);
  });
});

router.post("/insert", (req, res) => {
  const user: userReq = req.body;
  let sql =
      "INSERT INTO `User` (`username`,`Email`,`Password`,`picture`,`type`) VALUES (?,?,?,?,?)";
  sql = mysql.format(sql,[
      user.username,
      user.Email,
      user.Password,
      user.picture,
      user.type
  ]);
  conn.query(sql, (err, result) => {
      if (err) throw err;
      res.status(201).json({
          affected_row: result.affectedRows,
          last_idx: result.insertId
      });
  });
});

router.post("/check", (req, res) => {
  const user = req.body;

  // สร้างคำสั่ง SQL ด้วยการใช้พารามิเตอร์
  const sql = "SELECT Password, type,user_id FROM `User` WHERE Email = ?";

  conn.query(sql, [user.Email], (err, result) => {
    if (err) {
      console.error("Error checking user:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const storedPassword = result[0].Password;
    const userType = result[0].type;
    const userId = result[0].user_id;

    // ส่งข้อมูลผู้ใช้กลับไปถ้ารหัสผ่านถูกต้อง
    res.json({ 
      userType: userType,
      userId : userId,
      hashPassword:storedPassword
    });
  });
});

//upload รูป
import { imagereq } from "../Model/insertModel";

router.post("/imageup", (req, res) => {
  const imageUrl:imagereq = req.body; 
  console.log(imageUrl);
  let sql = "INSERT INTO Image (image_url,user_id,current_score) VALUES (?,?,?)";
  sql = mysql.format(sql, [
      imageUrl.image_url,
      imageUrl.user_id,
      imageUrl.current_score
  ]); 
  conn.query(sql, (err, result) => {
      if (err) throw err;
      res.status(201).json({
          affected_row: result.affectedRows,
          last_idx: result.insertId
      });
  });
});


//แสดงข้อมูลผู้ใช้
router.get("/select/:id", (req, res) => {
  const id =req.params.id;
  // const user:userreq = req.body; 
  // console.log(user);
  const sql =
  "SELECT username,picture FROM User where user_id = ?"
  conn.query(sql,[id],(err,result, fields)=>{
      if (err) throw err;
      res.json(result);
  });
});

router.get("/selectimage/:id", (req, res) => {

  const id =req.params.id;
  // const user:userreq = req.body; 
  // console.log(user);
  const sql ="select * from Image where user_id =?"
  conn.query(sql,[id],(err,result, fields)=>{
      if (err) throw err;
      res.json(result);

  });
});

//find image_id
import { imageId } from "../Model/insertModel";

router.post("/image_id", (req, res) => {
  const user: imageId = req.body;
  let sql =
      "SELECT image_id FROM Image WHERE user_id = ? AND image_url = ? ";
  sql = mysql.format(sql,[
      user.user_id,
      user.image_url
  ]);
  conn.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});
// api นับจำนวนรูปภาพ  **เอาไปใช้งาน เช็ค หากรูปไม่เกิน อัพโหลดได้


//update username picture
router.put("/:id", async (req, res) => {
  let id = +req.params.id;
  let user: userReq = req.body;
  let userOriginal: userReq | undefined;

  let sql = mysql.format("select * from User where user_id= ?", [id]);

  let result = await queryAsync(sql);
  const rawData = JSON.parse(JSON.stringify(result));
  console.log(rawData);
  userOriginal = rawData[0] as userReq;
  console.log( userOriginal);

  let updateuser = {... userOriginal, ...user};
  console.log(user);
  console.log(updateuser);

    sql =
    "update  `User` set `username`=?, `Email`=?, `Password`=?,`picture`=?,`type`=? where `user_id`=?";
    sql = mysql.format(sql, [
      updateuser.username,
      updateuser.Email,
      updateuser.Password,
      updateuser.picture,
      updateuser.type,
        id,
    ]);
    conn.query(sql, (err, result) => {
      if (err) throw err;
      res.status(201).json({ affected_row: result.affectedRows });
    });
});
