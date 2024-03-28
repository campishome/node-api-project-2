import express from "express";
import { conn, queryAsync } from "../dbconnect";
import mysql from "mysql";
export const router = express.Router();
import{imageId, imageReq, imagereq, scorereq, votereq}from "../Model/insertModel";

router.get("/countimg/:id", (req, res) => {
    let id = +req.params.id;
    const sql = "SELECT count(*)AS image_number  FROM Image WHERE user_id = ?";
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

router.get("/countimage", (req, res) => {
    
    const sql = "SELECT count(*)AS image  FROM Image ";
    conn.query(sql, (err, result, fields) => {
        if (err) {
            console.error("Error querying database:", err);
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }
        // ถ้าพบข้อมูล ส่งค่า score กลับไปในรูปแบบ JSON
        res.status(200).json(result[0]);
    });
});
//update
router.put("/:id", async (req, res) => {
    let id = +req.params.id;
    let image: imagereq = req.body;
    let imageOriginal: imagereq | undefined;
  
    let sql = mysql.format("select * from Image where image_id = ?", [id]);
  
    let result = await queryAsync(sql);
    const rawData = JSON.parse(JSON.stringify(result));
    console.log(rawData);
    imageOriginal = rawData[0] as imagereq;
    console.log( imageOriginal);
  
    let updateimage = {... imageOriginal, ...image};
    console.log(image);
    console.log(updateimage);
  
      sql =
      "update  `Image` set `image_url`=?, `user_id`=?, `current_score`=? where `image_id`=?";
      sql = mysql.format(sql, [
        updateimage.image_url,
        updateimage.user_id,
        updateimage.current_score,
        id,
      ]);
      conn.query(sql, (err, result) => {
        if (err) throw err;
        res.status(201).json({ affected_row: result.affectedRows });
      });
  });

  //
  router.get("/search_topscore_10", (req, res) => {
    const sql = "SELECT current_score,image_id FROM Image ORDER BY current_score DESC LIMIT 10";
    conn.query(sql, (err, result, fields) => {
        if (err) {
            console.error("Error querying database:", err);
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }
        // Send the entire result array back as JSON
        res.status(200).json(result);
    });
});



router.post("/vote_check", (req, res) => {
    const vote : imageReq = req.body;
    // สร้างคำสั่ง SQL ด้วยการใช้พารามิเตอร์
    const sql = "SELECT image_id, vote_date FROM `vote` WHERE image_id = ? AND vote_date = ?";
  
    conn.query(sql, [vote.image_id,vote.vote_date], (err, result) => {
      if (err) {
        console.error("Error checking user:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
    //   if (result.length === 0) {
    //     return res.status(404).json({ error: "vote not found" });
    //   }
      res.status(200).json(result);
    });
  });

  router.post("/top_10", (req, res) => {
    // let date = +req.params.date;
    const search_date: votereq = req.body;
    let sql =
        "SELECT *  FROM vote   INNER JOIN Image ON vote.image_id = Image.image_id   WHERE vote_date = ?  ORDER BY score DESC   LIMIT 10 ";
    sql = mysql.format(sql,[
      search_date.vote_date,
      search_date.image_url
    ]);
    conn.query(sql, (err, result,fields) => {
      if (err) throw err;
      res.json(result);
    });
  });

  //select vote_date 7 day
  router.get("/select_vote_date7/:imageid", (req, res) => {
    let id = +req.params.imageid;
    const sql="SELECT * FROM `vote` WHERE `image_id`=? ORDER BY `vote_date` DESC LIMIT 8";
    conn.query(sql,[id], (err, result, fields)=>{
        res.status(200);
        res.json(result);
    });
  });

  //select vote_date 7 day
  router.get("/select_Image/:imageid", (req, res) => {
    let id = +req.params.imageid;
    const sql="SELECT * FROM `Image` WHERE `image_id`=?";
    conn.query(sql,[id], (err, result, fields)=>{
        res.status(200);
        res.json(result);
    });
  });

  //delete
  router.delete("/delete_img/:id", (req, res) => {
    let id = +req.params.id;
    conn.query("delete  from vote where image_id = ?", [id], (err, result) => {
       if (err) throw err;
       res
         .status(200)
         .json({ affected_row: result.affectedRows });
    });
  });

  //delete 2table
  router.delete("/delete_image/:id", async (req, res) => {
    const id = +req.params.id;

    let sqlDeleteStar = "DELETE FROM vote WHERE image_id = ?";
    conn.query(sqlDeleteStar, [id], (err, resultDeleteStar) => {
        if (err) throw err;

        // เมื่อลบข้อมูลในตาราง "vote" เสร็จสิ้น จึงทำการลบข้อมูลในตาราง "Image"
        let sqlDeletePerson = "DELETE FROM Image WHERE image_id = ?";
        conn.query(sqlDeletePerson, [id], (err, resultDeletePerson) => {
            if (err) throw err;

            res.status(201).json({
                deleted_star: resultDeleteStar.affectedRows,
                deleted_person: resultDeletePerson.affectedRows
            });
        });
    });
});

router.post("/rank", (req, res) => {
  // let date = +req.params.date;
  const search_date: votereq = req.body;
  let sql =
      "SELECT *  FROM vote   INNER JOIN Image ON vote.image_id = Image.image_id   WHERE vote_date = ?  ORDER BY score DESC";
  sql = mysql.format(sql,[
    search_date.vote_date,
    search_date.image_url
  ]);
  conn.query(sql, (err, result,fields) => {
    if (err) throw err;
    res.json(result);
  });
});