'use strict';
 
const express =require('express');
const pg =require('pg');
const superagent =require('superagent');
const cors = require('cors');
const methodoverride =require('method-override');


require('dotenv').config();
const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;

const server =express();
const client = new pg.Client(DATABASE_URL);
server.use(express.urlencoded({extended:true}));
server.use(express.static('./public'))
server.use(methodoverride('_method'))
server.use(cors())
server.set('view engine' ,'ejs')



server.get('/',renderallheros);
server.post('/addtodb',addtodb);
server.get('/renderfromdb',renderfromdb);
server.get('/viewdetails/:id',viewdetail);
server.put('/update/:id',updateinfo);
server.delete('/delete/:id',deleteinfo)

function deleteinfo (req,res){
    const id = req.params.id;
    const sql = `DELETE FROM rama WHERE id=$1 `
    const safevalue=[id]
    client.query(sql,safevalue).then(()=>{
        res.redirect('/renderfromdb')
    })
}

function updateinfo (req,res){
    const id = req.params.id;
    const {name,image,house,actor}=req.body
    const sql = `UPDATE rama SET name=$1 , house=$2 , image=$3 , actor=$4 WHERE id=$5  `
    const safevalue=[name,image,house,actor,id]
    client.query(sql,safevalue).then(()=>{
        res.redirect(`/viewdetails/${id}`)
    })
    
}


function viewdetail (req,res){
const id = req.params.id;
const sql =`SELECT * FROM rama WHERE id=$1;`
const safevalues=[id];
client.query(sql,safevalues).then(data =>{
    res.render('details',{suhaib:data.rows})
})



}

function renderfromdb (req,res){

    const sql = `SELECT * FROM rama;`
    client.query(sql).then(data =>{
        res.render('favorite',{suhaib:data.rows})
    })

}


function addtodb (req,res){
    const {name,house,image,actor}=req.body
    const sql =`INSERT INTO rama(name,house,image,actor)  VALUES($1,$2,$3,$4)`
    const safevalue=[name,house,image,actor]
    client.query(sql,safevalue).then(()=>{
        res.redirect('/renderfromdb')
    })
}





function Harry(info){
    this.name=info.name;
    this.house=info.house;
    this.image=info.image;
    this.actor=info.actor;
}
function renderallheros (req,res){
    const url =`http://hp-api.herokuapp.com/api/characters`
    superagent.get(url).then(data =>{
        const heros = data.body.map(result=>{
            return new Harry(result)
        })
        res.render('home',{suhaib:heros})
    })
}



client.connect().then(()=>{
    server.listen(PORT,()=>{
        console.log(`HI ${PORT}`);
    })
})
