const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const {v1 : uuidv1} = require('uuid');
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

var upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // 콜백 함수를 통해 전송된 파일이 저장될 디렉토리 설정
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname) // 콜백 함수를 통해 전송된 파일 이름 설정
    }
  })
});

//업로드된 파일 저장 & 메세지 저장
router.post('/', upload.single('file'), (req, res) => {
  console.log(req.file);
  console.log(req.query)

  var sql1 = `INSERT INTO message (message, type, user_no, channel_no)
              VALUES ("${req.file.originalname}", 1, ${req.query.uno}, ${req.query.channel});`;
  var sql2 = `INSERT INTO file (original_name, saved_name, m_no)
              VALUES ("${req.file.originalname}", "${uuidv1()}", (
              SELECT MAX(no) FROM message 
              ));`;
  connection.query(sql1 + sql2, (err, rows) => {
    if(err) throw err;
    
    console.log(`sql1: ${rows}`);
  })
  res.json(req.file);
})

module.exports = router;