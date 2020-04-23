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

router.post('/login', (req, res) => {

  var id = req.body.id;
  var pw = req.body.pw;

  connection.query(`SELECT * FROM user WHERE id="${id}"`, (err, rows) => {
    if(err) throw err;

    if(rows[0].id == id && rows[0].pw == pw){
      res.json(
        {
          login: "success"
        }
      );
    }
  })
});

router.get('/chat', (req, res) => {
  res.render('../static/index', { title: 'Express' });
});
 
module.exports = router;