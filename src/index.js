const express=require("express");
const path=require("path");
const bcrypt=require("bcrypt")
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

    const existingUser = await LogInCollection.findOne({name: data.name});
    
    try{

    if(existingUser) {
        res.send("User already exists. Please choose a different Username.")
    } else {
        
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPassword;

        await LogInCollection.insertMany([data])  
       }
    } catch{
        res.send("Wrong details")
    }

    res.status(201).render("home", { message: `Hello ${req.body.name}!` });

});

const now = new Date();

const hour = now.getHours() + ':' + now.getMinutes();

const loginTime = hour.toString();

app.post('/login', async (req, res) => {

    try {

        const check = await LogInCollection.findOne({ name: req.body.name });

        if (!check) {
            res.send("User cannot be found")
        }

        const passwordMatch = await bcrypt.compare(req.body.password, check.password);

        if (passwordMatch) {
            res.status(201).render("home", { message: `Hello ${req.body.name}!`, time: `Login: ${loginTime}` });
        } else {
            res.send("Incorrect password")
        }
       


    } 
    
    catch (e) {

        res.send("Wrong details")
        

    }


})



app.listen(3000, ()=>{
    console.log("port connected");
});