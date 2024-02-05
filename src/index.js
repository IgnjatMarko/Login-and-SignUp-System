const express=require("express");
const path=require("path");
const app=express();
//const hbs=require("hbs");
const LogInCollection=require("./mongodb");
const port = process.env.PORT || 3000;
app.use(express.json());


const templatePath=path.join(__dirname, '../templates');
const publicPath=path.join(__dirname, '../public');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "hbs");
app.set("views", templatePath);

app.use(express.static(publicPath));


app.get("/",(req,res)=>{
    res.render("login");
});

app.get("/signup",(req,res)=>{
    res.render("signup");
});


app.post("/signup",async (req,res)=>{

    const data={
        name:req.body.name,
        password:req.body.password
    }

    await LogInCollection.insertMany([data])
  
    res.render("home")
});



app.post('/login', async (req, res) => {

    try {
        const check = await LogInCollection.findOne({ name: req.body.name })
        console.log(check.password)
        console.log(req.body)
        if (check.password === req.body.password) {
            res.status(201).render("home", { naming: `${req.body.password}${req.body.name}` })
        }

        else {
            res.send("Incorrect password")
        }


    } 
    
    catch (e) {

        res.send("wrong details")
        

    }


})



app.listen(3000, ()=>{
    console.log("port connected");
});