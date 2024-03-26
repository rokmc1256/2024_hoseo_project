const punycode = require('punycode/');
const express = require('express')
const app = express();
const bcrpyt = require('bcrypt')
const methodOverride = require('method-override')
require('dotenv').config()

app.use(methodOverride('_method')) 
app.use(express.static(__dirname+'/public'))
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({extended:true})) 

const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const MongoStore = require('connect-mongo')


app.use(passport.initialize())
app.use(session({
  secret: process.env.secret,
  resave : false,
  saveUninitialized : false,
  cookie : {maxAge : 60 * 60 * 1000},

  store : MongoStore.create({
    mongoUrl : process.env.DB_URL,
    dbName : 'forum'
    })

}))

app.use(passport.session())

const { MongoClient, ObjectId } = require('mongodb')

let db
const url = 'mongodb+srv://admin:mongo123@cluster0.o43budv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
new MongoClient(url).connect().then((client)=>{
  console.log('DB연결성공')
  db = client.db('forum')
  app.listen(process.env.PORT, function(){
    console.log("listen 8080")
});
}).catch((err)=>{
  console.log(err)
})


const { S3Client } = require('@aws-sdk/client-s3')
const multer = require('multer')
const multerS3 = require('multer-s3')
const s3 = new S3Client({
  region : 'ap-northeast-2',
  credentials : {
      accessKeyId : process.env.accessKeyId,
      secretAccessKey : process.env.secretAccessKey
  }
})

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'hellogradu',
    key: function (요청, file, cb) {
      cb(null, Date.now().toString()) //업로드시 파일명 변경가능
    }
  })
})



function idpwcheck (요청, 응답, next) { //아이디 비번 null 검사
  if (요청.body.username == '' || 요청.body.password == '') {
    응답.send('아이디 혹은 비밀번호를 입력해주세요')
  } else {
    next()
  }
}

function checklogin(요청, 응답,next){ //로그인 하지 않았다면 로그인알림이 뜨게함
  
  if(!요청.user){
    응답.send('로그인하세요')  
  }
  next()
}

app.use('/URL',checklogin) //모든 API에 체크로그인함수 일괄 적용

app.use('/list', (요청, 응답, next) => { //list시작하는 API는 현재시간 출력
  console.log(new Date())
  next()
}) 

app.get('/pet', function(요청, 응답){
    응답.send(__dirname);
});

app.get('/',function(요청,응답){
  
    응답.sendfile(__dirname + '/index.html');
});

app.get('/about',function(요청,응답){
    응답.sendfile(__dirname + '/introduce.html');
});

app.get('/news',function(요청,응답){
    db.collection('post').insertOne({title:'ㅎㅇ'})
})

app.get('/list', async (요청, 응답) =>{
    console.log('list')
    let result = await db.collection('post').find().toArray()
    //console.log(result[0].title)
    //응답.send(result[0].title)
    응답.render('list.ejs', {글목록 : result})
  })

  app.get('/time', async (요청, 응답) =>{
    let result = await db.collection('post').find().toArray()
    //console.log(result[0].title)
    //응답.send(result[0].title)
    응답.render('time.ejs', {data : new Date()})
  })


app.get('/write', (요청, 응답) =>{
    응답.render('write.ejs')
});

app.post('/add',upload.single('img1'), async (요청, 응답) =>{//array 2는 최대 이미지 갯수를 의미함
    let result = 요청.body
    console.log(result)
    console.log(요청.file.location)
    console.log('이미지 추가')
    try{
        if (result.title == ''){
            응답.send('제목입력안함 ㅅㄱ')
        }else{
            await db.collection('post').insertOne({title : 요청.body.title,content:요청.body.content, img : 요청.file.location})
            응답.redirect('/list')
        }
    }
    catch(e){
        console.log(e)
        응답.status(500).send('에러발생')
    }
    
});

app.get('/detail/:id', async (req, res) => {
    try{
        let result = await db.collection('post').findOne({ _id : new ObjectId(req.params.id) })
        console.log(1)
        console.log(result)
        res.render('detail.ejs', { result : result })
    } catch(e){
        console.log(e)
        응답.status(404).send('이상한 url 입력함')
    }
  })

app.get('/edit/:id', async (요청, 응답) => {
    let result = await db.collection('post').findOne({ _id : new ObjectId(요청.params.id) })
    응답.render('edit.ejs', {result : result})
  })

  app.put('/edit', async (요청, 응답)=>{
    await db.collection('post').updateOne({ _id : new ObjectId(요청.body.id) },
      {$set : { title : 요청.body.title, content : 요청.body.content }
    })
    console.log(요청.body)
    응답.redirect('/list')
  }) 
  app.post('/abc', async (요청, 응답)=>{
    console.log('안녕')
    console.log(요청.query)

  })

  passport.use(new LocalStrategy(async (입력한아이디, 입력한비번, cb) => {
    let result = await db.collection('user').findOne({ username : 입력한아이디})
    if (!result) {
      return cb(null, false, { message: '아이디 DB에 없음' })
    }
    if (await bcrpyt.compare(입력한비번, result.password)){
        return cb(null, result)
    }
     else {
      return cb(null, false, { message: '비번불일치' });
    }
  }))

  passport.serializeUser((user, done) => {
    process.nextTick(() => {
      done(null, { id: user._id, username: user.username })
    })
  })

  passport.deserializeUser(async (user, done) => {
    let result = await db.collection('user').findOne({_id : new ObjectId(user.id) })
    delete result.password
    process.nextTick(() => {
      return done(null, result)
    })
  })

  app.get('/login', async (요청, 응답) => {
    console.log(요청.user)
    응답.render('login.ejs')
  })

  app.post('/login', async (요청, 응답, next)=>{

    passport.authenticate('local',(error, user, info)=> {

     
        if(error) return 응답.status(500).json(error)
        if(!user) return 응답.status(401).json(info.message)
        요청.logIn(user,(err)=>{
            if(err) return next(err)
            응답.redirect('/')
        })
    })(요청, 응답, next)

  })

  app.get('/register', async (요청, 응답)=> {
    응답.render('register.ejs')
  })

app.post('/register',idpwcheck, async (요청, 응답)=> { //미들웨어함수 아이디비번 null검사

    let 해시 = await bcrpyt.hash(요청.body.password, 10)
    console.log(해시)

    await db.collection('user').insertOne({
        username : 요청.body.username,
        password : 해시
    })
    응답.redirect('/')
})
