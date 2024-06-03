//if(proccess.env.config!= "PRODUCTION") const dotenv = require("dotenv");
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
  }
const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors());

//Database connection with MongoDB
mongoose.connect(process.env.mongo_url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

//API Creation

app.get("/",(req,res)=>{
    res.send("Express App is Running")
})

// Image Storage Engine

const storage= multer.diskStorage({
    destination: "./upload/images",
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage:storage})


// Creating Upload Endpoints for images
app.use("/images",express.static('upload/images'))

app.post("/upload",upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
})

// Schema for Creating Products

const Product = mongoose.model("Product",{
    id:{
        type:Number,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    new_price:{
        type:Number,
        required:true,
    },
    old_price:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    available:{
        type:Boolean,
        default:true,
    },
})

app.post('/addproduct',async(req,res)=>{
    let products = await Product.find({});
    let id;
    if(products.length>0)
        {
            let last_product_array = products.slice(-1);
            let last_product = last_product_array[0];
            id=last_product.id+1;
        }
    else{
        id=1;
    }
    const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    });
    console.log(product);
    try {
        await product.save();
        res.json({ success: true, name: req.body.name });
      } catch (err) {
        console.error('Error saving product:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
      }
})

// Creating API For deleting Products

app.post('/removeproduct', async (req, res) => {
    try {
      await Product.findOneAndDelete({ id: req.body.id });
      res.json({ success: true, name: req.body.name });
    } catch (err) {
      console.error('Error removing product:', err);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });

//Creating API for getting all products
app.get('/allproducts', async (req, res) => {
    try {
      let products = await Product.find({});
      res.send(products);
    } catch (err) {
      console.error('Error fetching products:', err);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });
  

// Schema creating for User model
const Users=mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
})

//Creating Endpoint for registering the user
app.post('/signup',async (req,res)=>{

    let check= await Users.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false,error:"existing user found with same email address"})
    }
    let cart={};
    for (let i = 0; i < 300; i++) {
        cart[i] = 0;
    }
    const user = new Users({
    name:req.body.username,
    email:req.body.email,
    password:req.body.password,
    cartData:cart,
    });
    
    await user.save();

    const data = {
        user:{
            id:user.id
        }
    }
    
    const token = jwt.sign(data,process.env.secret);
    res.json({success:true,token})

})

// Creating endpoint for user login
app.post('/login',async (req,res)=>{
    let user=await Users.findOne({email:req.body.email});
    if(user){
        const passCompare = req.body.password === user.password;
        if(passCompare){
            const data = {
                user:{
                    id:user.id
                }
            }
            const token =jwt.sign(data,process.env.secret);
            res.json({success:true,token});
        }
        else{
            res.json({success:false,errors:"Wrong Password"})
        }
    }
    else{
        res.json({success:false,errors:"Wrong Email Id"})
    }
})

// creating endpoint for newcollection data
app.get('/newcollections', async (req, res) => {
    try {
      let products = await Product.find({});
      let newcollection = products.slice(-8);
      res.send(newcollection);
    } catch (err) {
      console.error('Error fetching new collections:', err);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });

//creating endpoint for popular in women category
app.get('/popularinwomen', async (req, res) => {
    try {
      let products = await Product.find({ category: "women" });
      let popular_in_women = products.slice(0, 4);
      res.send(popular_in_women);
    } catch (err) {
      console.error('Error fetching popular in women:', err);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });

// creating middleware to fetch user
const fetchUser = async (req,res,next)=>{
    const token =req.header('auth-token');
    if(!token){
        res.status(401).send({errors:"Please authenticate using valid token"})
    }
    else{
        try {
            const data = jwt.verify(token,process.env.secret);
            req.user = data.user;
            next();
        } catch (error) {
            res.status(401).send({errors:"please authenticate using a valid token"})
        }
    }
}

// creating endpoint for adding proucts in cartdata
app.post('/addtocart', fetchUser, async (req, res) => {
    try {
      let userData = await Users.findOne({ _id: req.user.id });
      userData.cartData[req.body.itemId] += 1;
      await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
      res.send("Added");
    } catch (err) {
      console.error('Error adding to cart:', err);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });

// creating endpoint to remove product from cartdata
app.post('/removefromcart', fetchUser, async (req, res) => {
    try {
      let userData = await Users.findOne({ _id: req.user.id });
      if (userData.cartData[req.body.itemId] > 0) {
        userData.cartData[req.body.itemId] -= 1;
        await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
      }
      res.send("Removed");
    } catch (err) {
      console.error('Error removing from cart:', err);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });

//creating endpoint to get cartdata
app.post('/getcart', fetchUser, async (req, res) => {
    try {
      let userData = await Users.findOne({ _id: req.user.id });
      res.json(userData.cartData);
    } catch (err) {
      console.error('Error fetching cart data:', err);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });

app.listen(port,(error)=>{
    if(!error){
        console.log("Server Running on Port " +port)
    }
    else{
        console.log("Error : "+error)
    }
});

module.exports=app;