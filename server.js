const exp = require('constants');
const express = require('express')
const app = express()
const path = require('path')

app.listen(8080, () => {
    console.log('http://localhost:8080 에서 서버 실행 중');
})

app.use(express.static(path.join(__dirname, 'hoseo_graduation/build')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'hoseo_graduation/build/index.html'))
})