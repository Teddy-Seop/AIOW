const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1111',
  port: '3306',
  database: 'aiow',
  multipleStatements: true
})

app.use(bodyParser.json());

// workspace 생성
router.post(`/`, (req, res) => {
  console.log(req.body);
  var sql = `INSERT INTO workspace (name, owner_no)
              VALUES ("${req.body.workspace}", ${req.body.uno})`;
  connection.query(sql, (err, rows) => {
    if(err) throw err;

    console.log('Success');
  })
  
})

// workspace 조회
router.get("/:workspace", (req, res) => {
  
  var sql1 = `SELECT * FROM workspace 
              WHERE name="${req.params.workspace}";`;
  var sql2 = `SELECT * FROM channel 
              WHERE workspace_no = (
                SELECT no FROM workspace 
                WHERE name="${req.params.workspace}"
              );`;
  var sql3 = `SELECT * FROM workspace_user
              WHERE user_no = (
                SELECT no FROM user 
                WHERE no="${req.query.uno}"
              )`;
  connection.query(sql1 + sql2 + sql3, (err, rows) => {
    if(err) throw err;
    if(rows[0][0] != null && rows[2][0] != null){
      rows[0][0].validate = 'success';
      console.log(rows)
      res.json(rows);
    }else if(rows[2][0] == null) {
      rows[0][0].validate = 'authority'
      rows[0][0].message = '접근 권한이 없습니다.';
      console.log(rows);
      res.json(rows);
    }else{
      rows[0].push({
        validate : 'fail',
        workspace: req.params.workspace,
        message : 'Workspace가 존재하지 않습니다.\n새 Workspace를 생성하시겠습니까?'
      })
      console.log(rows);
      res.json(rows);
    }
  })
})

// channel 조회
router.get("/:workspace/:channel", (req, res) => {
  var channel = req.params.channel;
  console.log(`channel : ${channel}`);
  var sql = `SELECT * FROM message WHERE channel_no=${channel}`;
  connection.query(sql, (err, rows) => {
    if(err) throw err;

    res.json(rows);
  })
})

module.exports = router;