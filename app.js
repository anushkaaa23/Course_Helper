const express = require('express');
const app = express();
const courseModel = require('./models/coursemodel');
const cookieParser = require('cookie-parser');
const userModel = require('./models/user');
const jwt = require('jsonwebtoken');

const path = require('path');
const bcrypt = require('bcrypt'); 

app.set("view engine" , "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended :true}));
app.use(express.static(path.join(__dirname,'public')));
app.use(cookieParser());

app.get('/',isLoggedIn ,(req,res) =>{
     
    res.render("");
})
 
app.get('/login', (req,res) =>{
    res.render("login");
})

app.post('/login', async (req,res) =>{
    let user = await userModel.findOne({username:req.body.username})
    if(!user){
        return res.status(500).send("Something went wrong");
    }

    bcrypt.compare(req.body.password,user.password, function(err,result){
        if(result){
        let token =jwt.sign({username:user.username}, "anuraggggg");
        res.cookie("token",token);
        res.redirect("Home");
        // res.render("Home", {cookies: req.cookies});
        } 
        else{
            return res.status(500).send("Something went wrong");
        }
    });
    
});

app.get('/signup', (req,res) =>{
    res.render("signup");
})              

app.post('/create2',  async (req,res) => {

    let {username , password} = req.body;
    let user = await userModel.findOne({username});
    if(user) return res.status(500).send("Username already registered");
    

    bcrypt.genSalt(10,(err,salt) =>{
        
        bcrypt.hash(password,salt, async (err,hash) =>{
            let createdUser = await userModel.create({
           
                username,
                password: hash,
          
            })
            let token =jwt.sign({username}, "anuraggggg");
            res.cookie("token",token);
            res.redirect("login");
        })


    })
    
    
    

    
}) ;  

app.get("/logout",function(req,res){
    // res.cookie("token","");
    res.clearCookie('token')
    res.redirect("/Home")
})



                  


app.get('/Home', async (req, res) => {
    // Make sure `isLoggedIn` is passed to the template
    res.render("Home", {cookies: req.cookies});
});

function isLoggedIn(req, res, next) {
    const token = req.cookies.token;  // Get the token from cookies

    if (!token) {
        // If token is not found in cookies, redirect to login page
        return res.redirect("/login");
    }

    try {
        // If token is present, verify it
        const data = jwt.verify(token, "anuraggggg");
        req.user = data;  // Attach user data to the request object
        next();  // Proceed to the next middleware or route handler
    } catch (error) {
        // If token is invalid or expired, redirect to login page
        return res.redirect("/login");
    }
}




app.post('/create', async (req,res) =>{
    let {name , image, code,Type, credit,Description}  = req.body;
    let  allCourses =  await courseModel.create({
         name,
         image,
         code,
        
         credit,
         Description
    })
    res.redirect('/all');
    
 })

 app.get('/delete/:id',isLoggedIn, async (req,res) =>{
    let course = await courseModel.findOneAndDelete({_id: req.params.id})
    const redirectUrl = req.get('Referrer') || '/Home';
    res.redirect(redirectUrl);
   
})

app.get('/edit/:id',isLoggedIn, async (req,res) =>{
    let course = await courseModel.findOne({_id: req.params.id})
   res.render("edit", {course});
})




app.get('/all', async (req,res) =>{
    let course = await courseModel.find()
   res.render("all", {course});
})




app.post('/update/:id',isLoggedIn, async (req,res) =>{
    let {name , image, code,Type, credit,Description}  = req.body;

    let course = await courseModel.findOneAndUpdate({_id: req.params.id},{name , image, code,Type, credit,Description},{new:true});
    // const redirectUrl = req.headers.referer || '/Home';
    // res.redirect(redirectUrl)
   res.redirect('/Home');
})

app.get('/Description/:id',isLoggedIn, async (req, res) => {
        let course = await courseModel.findOne({ _id: req.params.id });
        res.render("Description", { course });
    
});


 
app.listen(3002);

