const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const {v1 : uuidv1} = require('uuid');
const fs = require('fs');
const path = require('path');
const mime = require('mime');
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
app.use('/file', express.static('upload')); // /file 경로를 통해 upload 디렉토리에 저장된 파일을 로드할 수 있음

var uuid = null;

var upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // 콜백 함수를 통해 전송된 파일이 저장될 디렉토리 설정
    },
    filename: (req, file, cb) => {
        cb(null, uuid = uuidv1()) // 콜백 함수를 통해 전송된 파일 이름 설정
    }
  })
});

//업로드된 파일 저장 & 메세지 저장
router.post('/', upload.single('file'), (req, res) => {
  console.log(req.file);
  console.log(uuid);

  var sql1 = `INSERT INTO message (message, type, user_no, channel_no)
              VALUES ("${req.file.originalname}", 1, ${req.query.uno}, ${req.query.channel});`;
  var sql2 = `INSERT INTO file (original_name, saved_name, m_no)
              VALUES ("${req.file.originalname}", "${uuid}", (
              SELECT MAX(no) FROM message 
              ));`;
  connection.query(sql1 + sql2, (err, rows) => {
    if(err) throw err;
    
    console.log(rows);
  })
  res.json(req.file);
})

// 파일 다운로드
router.get('/:no', (req, res) => {
  console.log(req.params.no)
  var sql = `SELECT * FROM file WHERE m_no = ${req.params.no}`;
  connection.query(sql, (err, rows) => {
    if(err) throw err;
    
    var file = `uploads/${rows[0].saved_name}`;
    var originalName = rows[0].original_name;

    res.setHeader('Content-disposition', 
                  `attachment; filename=${encodeURI(originalName)}`);
    res.setHeader(`Content-type`, "binary/octet-stream")
    var filestream = fs.createReadStream(file);
    filestream.pipe(res);
  })
})

module.exports = router;