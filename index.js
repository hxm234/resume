const express=require("express")
const router=express.Router()
const pool=require("../pool")

router.get('/indexTitle',(req,res)=>{
    var output1=[]
    var output2=[]
    var sql1='select id,title from index_title'
    var sql2='select id,img_url,tid from index_img'
    Promise.all([
        new Promise(function(open){
            pool.query(sql1,(err,result)=>{
                if(err)throw err;
                output1=result;
                open()
            })
        }),
        new Promise(function(open){
            pool.query(sql2,(err,result)=>{
                if(err)throw err;
                output2=result;
                open()
            })
        }),
    ]).then(function(){
        for(var i=0;i<output1.length;i++){
            var arr=[];
            for(var j=0;j<output2.length;j++){
                if(output1[i].id==output2[j].tid)
                arr.push(output2[j])
            }
            output1[i].more=arr
        }
        res.send(output1)
    })
    
})


module.exports=router;