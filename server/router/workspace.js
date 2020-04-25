var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1111',
  port: '3306',
  database: 'aiow'
})

router.get("/:workspace", (req, res) => {
    
    connection.query(`SELECT * FROM workspace WHERE name="${req.params.workspace}"`, (err, rows) => {
      if(err) throw err;
      
      if(rows[0] != null){
        rows[0].validate = 'success';
        res.json(rows[0]);
      }else{
        res.json({validate: 'fail'});
      }
    })
})

module.exports = router;