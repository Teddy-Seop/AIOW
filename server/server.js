const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(bodyParser.json())
app.use(cors());

app.get('/api', (req, res) => {
    res.json(
        {
            username: "Kim"
        }
    );
})

app.listen(3001, () => {
    console.log('express is running on 3001');
})