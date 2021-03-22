const express=require("express");
const app=express();

const bodyParser=require("body-parser");

const session=require("express-session");

app.set('view engine','ejs');
app.use(express.static('public'));

app.use(session({
    secret: "FkjdD33s",
    cookie: {maxAge: 600000}
}));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const servicesController=require("./services/ServicesController");
const apiController=require("./api/ApiController");
const usersController=require("./users/UsersController");

app.use("/",servicesController);
app.use("/",usersController);
app.use("/",apiController);

app.get("/",(req,res)=>{
    res.render("index");
});

app.listen(4000,()=>{
    console.log("Servidor ativo!");
});