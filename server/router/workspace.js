var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1111',
  port: '3306',
  database: 'aiow',
  multipleStatements: true
})

router.get("/:workspace", (req, res) => {
  
  var sql1 = `SELECT * FROM workspace WHERE name="${req.params.workspace}";`;
  var sql2 = `SELECT * FROM channel WHERE workspace_no = (SELECT no FROM workspace WHERE name="${req.params.workspace}");`
  connection.query(sql1 + sql2, (err, rows) => {
    if(err) throw err;
    console.log(rows);
    if(rows[0] != null){
      rows[0].validate = 'success';
      res.json(rows);
    }else{
      res.json({validate: 'fail'});
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