const express = require("express");
const app = express();
const users = require("../routes/user.js");
const posts = require("../routes/post.js");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("view", Path2D.join(__dirname, "views"));

const sessionOption = { 
        secret: "mysuperrsecrete",
    resave: false,
    saveUninitialized: true,
};


app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    req.locals.errorMsg = req.flash("error");
    next();
})

app.get("/register", (req, res) => {
    let { name = "anonymous" } = req.query;
    req.session.name = name;
    
    if(name === "anonymous") {
     req.flash("error", "user not registered");
    } else {
    req.flash("success", "user registered successfully");
} 
    res.redirect("/hello");
});

app.get("/hello", (req, res) => {
    res.render("page.ejs", {name: req.session.name });
});


// app.get("/reqcount", (req, res) => {
//     if (req.session.count) {
//         req.session.count++;
//     } else {
//         req.session.count =1;
//     }
//     res.send(`test succesfull ${req.session.count} times`);
// });

// app.get("/getcookies", (req, res) => {
//     res.cookie("great", "hello");
//     res.send("sent you some cookies");
// });

// app.get("/", (req, res) => {
//     res.send("Hi, I am root");
// });

// app.use("/users", users);
// app.use("/posts", posts);



app.listen(3000, () => {
    console.log("server is listing to 3000");
});