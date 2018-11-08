const express=require("express")
const router=express.Router()
const pool=require("../pool")

router.post('/login',(req,res)=>{
    var uname=req.body.uname;
    var upwd=req.body.upwd;
    var sql='select * from pro_user where uname=? and upwd=?'
    pool.query(sql,[uname,upwd],(err,result)=>{
        if(err)throw err;
        if(result.length>0){
            var user=result[0]
            req.session.uid=user.uid;
            console.log(req.session.uid)
            res.send({code:1})
        }else{
            res.send({code:0,msg:'用户名或密码错误'})
        }
    })
})

router.get('/islogin',(req,res)=>{
    if(req.session['uid']==undefined){
        res.write(JSON.stringify({
            code:0,msg:'请先登录!'
        }))
        res.end()
    }else{
        var uid=req.session.uid;
        var sql='select * from pro_user where uid=?'
        pool.query(sql,[uid],(err,result)=>{
            if(err)throw err;
            var user=result[0]
            res.write(JSON.stringify({
                code:1,msg:user.uname
            }))
            res.end()
        })
    }
})

router.get('/signout',(req,res)=>{
    req.session['uid']=undefined;
    res.end()
})

router.post('/register',(req,res)=>{
    var uname=req.body.uname;
    var upwd=req.body.upwd;
    var email=req.body.email;
    var phone=req.body.phone;
    var user_name=req.body.user_name;
    var sql='insert into pro_user(uid,uname,upwd,email,phone,user_name) values(null,?,?,?,?,?)';
    
    pool.query(sql,[uname,upwd,email,phone,user_name],(err,result)=>{
        if(err)throw err;
        if(result.affectedRows>0){
            res.send({code:1,msg:'注册成功'})
        }else{
            res.send({code:0,msg:'注册失败'})
        }
    })
    

})

router.get('/isreg',(req,res)=>{
    var uname=req.query.uname;
    var sql='select uid from pro_user where uname=?'
    pool.query(sql,[uname],(err,result)=>{
        if(err)throw err;
        if(result.length>0){
            res.send({code:0,msg:'用户名已存在'})
        }

    })
})

module.exports=router;