const express=require('express')
const bodyParser=require('body-parser')
const mysql=require('mysql')
const res = require('express/lib/response')

const app=express()
const port=3000
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json()) 

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database:"ecommerce"
  });
  con.connect(function(err) {
    if (err) throw err;
    console.log("DB Connected!");
  });
////////CORS
  app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type,Accept"
        );
        res.setHeader(
            "Access-Control-Allow-Methods",
            "GET,POST,PATCH,PUT,DELETE,OPTIONS"
            );
            next();
})
// testing
app.get('',(req,res)=>{
    con.query('select * from user ',(err,rows)=>{
        if(err)
        console.log('the fetching is not working')
        else
        res.send(rows)
    })
 })
 //Signup
app.post('/signUp',(req,res)=>{
  const body=req.body
  con.query
  ('Insert into user(firstname,lastname,email,password)values (?,?,?,?)',[body.Firstname,body.Lastname,body.Email,body.Password],(err,rows)=>{
    if(err)
    console.log(err)
   else{
     console.log('Succesfully inserted')
    console.log(rows)
     res.send(rows)
    }
  })
  
})
////Login

app.post('/logIn',(req,res)=>{
  console.log("inside get logIn")
  const body=req.body
  console.log(body.Username)
  console.log(body.Password)
  con.query('select * from user where email=? and password=?',[body.Username,body.Password],(err,rows)=>{
      if(err)
      console.log(err)
      else{
      console.log(rows)
      res.send(rows)
      }
    })
})



//////all products
app.get('/allProducts',(req,res)=>{
  con.query('select * from product_tbl',(err,rows)=>{
    if(err)
    console.log(err)
    else
    res.status(201).send(rows)
    
    
  })
})

//////product by id
app.post('/product',(req,res)=>{
  console.log("inside getprodid")
 const body=req.body
 console.log(body.id)
 con.query('select * from product_tbl where product_ID=?',[body.id],(err,rows)=>{
   if(err)
   console.log(err)
   else
   res.send(rows)
 })
 //console.log(req)
// console.log(body.id)
 //console.log([req.params.id])
// con.query('select * from product_tbl where product_ID =?')

})
///////product by category id
app.post('/category',(req,res)=>{
  console.log("inside getprodbycat_id")
 const body=req.body
 console.log(body.id)
 con.query('select * from product_tbl p inner join category_tbl ct on p.category_Id=ct.category_Id WHERE ct.category_ID=?',[body.id],(err,rows)=>{
   if(err)
   console.log(err)
   else{
   console.log("fetching succesfully")
    res.send(rows)

   }
   
 })


 
 //console.log(req)
// console.log(body.id)
 //console.log([req.params.id])
// con.query('select * from product_tbl where product_ID =?')

})
/////// add items to cart by userid
app.post('/addCart',(req,res)=>{
  console.log("inside AddCart")
 const body=req.body
 console.log(body);
 console.log(body.id)
 con.query('  INSERT INTO `cart_tbl` (`cart_ID`, `user_ID`, `Quantity`, `product_ID`) VALUES ( ?, ?, ?, ?)',[body.user_Id,body.user_Id,body.quan,body.prod_Id],(err,rows)=>{
   if(err)
   console.log(err)
   else{
   console.log("added  succesfully")
    res.send(rows)

   }
   
 })
})
//////Get Cart Items;

app.post('/cartItems',(req,res)=>{
  console.log("inside CartItems")
 const body=req.body
 console.log(body);
 console.log(body.id)
 con.query('select product_tbl.product_ID ,product_tbl.product_descp,product_tbl.product_img,product_tbl.product_title,product_tbl.product_price,product_tbl.product_ratings,c.Quantity from product_tbl INNER JOIN cart_tbl as c on c.user_ID=? where product_tbl.product_ID=c.product_ID',[body.user_Id],(err,rows)=>{
   if(err)
   console.log(err)
   else{
   console.log("fetchedd  succesfully")
    res.send(rows)

   }
   
 })
})

////////delete item in cart by iD
app.post('/cartDelete',(req,res)=>{
  console.log("inside the detele  cart");
  // console.log(req.body.user_Id)
   user_id=req.body.user_Id
 prod_id=req.body.prod_ID
 console.log("user id is ")
 console.log(user_id)
 console.log("prod id is ")
 console.log(prod_id)
  con.query('DELETE FROM `cart_tbl` WHERE user_ID=? and product_ID=? ',[user_id,prod_id],(err,rows)=>{
    if(err)
   console.log(err)
   else{

   console.log("deleted successfully")
    res.send(rows)
   }
  })
})











app.listen(port)