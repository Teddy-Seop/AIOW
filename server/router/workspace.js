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
    console.log(rows);
    if(rows[0][0] != null && rows[2][0] != null){
      rows[0][0].validate = 'success';
      console.log(rows)
      res.json(rows);
    }else if(rows[2][0] == null) {
      rows[0][0].validate = '접근 권한이 없습니다.';
      res.json(rows);
    }else{
      rows[0][0].validate = 'Workspace does not exist';
      res.json(rows);
    }
  })
})

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