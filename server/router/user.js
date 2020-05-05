const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1111',
  port: '3306',
  database: 'aiow'
})

// 사용자 조회
router.get('/', (req, res) => {
  var sql = `SELECT * FROM user WHERE id="${req.query.id}"`;
  connection.query(sql, (err, rows) => {
    if(err) throw err;
    console.log(rows);
    res.json(rows);
  })
})

// 로그인
router.post('/login', (req, res) => {

  var id = req.body.id;
  var pw = req.body.pw;

  connection.query(`SELECT * FROM user WHERE id="${id}"`, (err, rows) => {
    if(err) throw err;

    if(rows[0] != null){
      if(rows[0].id == id && rows[0].pw == pw){
        res.json(
          {
            login: "success",
            uno: rows[0].no,
            name: rows[0].name
          }
        )
      }else{
        res.json({login: "fail"})        
      }
    }else{
      res.json({login: "fail"})        
    }
  })
});

// workspace 사용자 초대
router.post('/workspace', (req, res) => {
  console.log(req.body);
  var sql1 = `SELECT no FROM user
              WHERE id="${req.body.name}"`;
  var sql2 = `SELECT no FROM workspace
              WHERE name="${req.body.workspace}"`;
  var sql3 = `INSERT INTO workspace_user (user_no, workspace_no)
              VALUES ((${sql1}), (${sql2}))`;
  connection.query(sql3, (err, rows) => {
    if(err) throw err;

    console.log(rows);
    res.json(rows);
  })
})
 
module.exports = router;