const express = require('express')
const app = express();
const cors = require('cors')
const path = require('path');
app.use(cors());

const { MongoClient, ObjectId } = require('mongodb')

const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local')

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(passport.initialize())
app.use(session({
  secret: 'hello',
  resave : false,
  saveUninitialized : false
}))

app.use(passport.session()) 

let db
const url = 'mongodb+srv://rokmc1256:hoseo19@cluster0.ljpssec.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
new MongoClient(url).connect().then((client)=>{
  console.log('DB연결성공')
  db = client.db('forum')
  app.listen(8080, function(){
    console.log("listen 8080")
})
}).catch((err)=>{
  console.log(err)
})

passport.use(new LocalStrategy(async (입력한아이디, 입력한비번, cb) => {
    let result = await db.collection('user').findOne({ username : 입력한아이디})
    if (!result) {
      return cb(null, false, { message: '아이디 DB에 없음' })
    }
    if (result.password == 입력한비번) {
      return cb(null, result)
    } else {
      return cb(null, false, { message: '비번불일치' });
    }
}))

//req.logIn 이 실행될 때 마다 같이 자동으로 실행되는 부분
// 로그인시 세션 document를 발행해주고 document에 있는 _id를 쿠키에 적어서 보내줌
passport.serializeUser((user, done) => { 
    process.nextTick(() => { //nextTick은 비동기적으로 실행됨
      done(null, { id: user._id, username: user.username })
    })
})

//유저가 보낸 쿠키를 분석해줌
//쿠키는 유저가 서버로 요청을 보낼 때 마다 자동으로 날라감
passport.deserializeUser(async (user, done) => {
    let result = await db.collection('user').findOne({_id : new ObjectId(user.id) })
    delete result.password
    process.nextTick(() => {
      return done(null, result)
    })
})

//---------------------------------이 밑에다가 API 개발하기--------------------------------------//

app.get('/mypage', (req, res) => {
    const data = req.user
    res.json(data);
})

app.post('/login', async (req, res, next) => {
    passport.authenticate('local', (error, user, info) => {
      if (error) return res.status(500).json(error)
      if (!user) return res.status(401).json(info.message)

      //성공하면 세션만들기 시작
      req.logIn(user, (err) => {
        if (err) return next(err)
        res.redirect('/')
      })
    })(req, res, next)
}) 

// app.post('/register', async(req, res) => {
//     // console.log(req.body)
//     await db.collection('user').insertOne({
//         username: req.body.username,
//         password: req.body.password
//     })
//     res.redirect('/')
// })

app.post('/addpost', async(req, res) => {
    // await db.collection('post').insertOne({
    //     title: req.body.title,
    //     content: req.body.content
    // })
    // res.redirect('/')
})