// Jeffrey Phelps 2018



// APP CONFIG & PACKAGES

// Initializing Express.js NPM package
let express = require("express");
let app = express();
app.use(express.static('public'));

// Setting the view engine to ejs
app.set('view engine', 'ejs');

// Initializing Method-Override NPM package
let methodOverride = require("method-override");
app.use(methodOverride("_method"));


// Initializing body-parser NPM package
let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

// Initializing Mongoose NPM package, setting the database name, "simpleblogdb", creating a database schema, 
// compiling the schema into a model, and connecting the schema to a reference name, "Blog"
let mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/simpleblogdb", {useNewUrlParser: true}); // Optional {useNewUrlParser: true} object for Amazon c9.io to clear future error warning
let blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
let Blog = mongoose.model("Blog", blogSchema);



// RESTFUL ROUTES

// Home Route
app.get("/", function(req, res){
    Blog.find({}, function(err, allBlogs){
        if(err){
            console.log("ERROR!!!");
            console.log(err);
        } else{
            res.render("index.ejs", {allBlogs: allBlogs});
        }
    }); 
});

// New Post Route
app.get("/new", function(req, res){
   res.render("newpost.ejs");
});

// Create New Post Route
app.post("/", function(req, res){
    let title = req.body.title;
    let image = req.body.image;
    let body = req.body.body;
    let newPost = {title: title, image: image, body: body};
    Blog.create(newPost, function(err, newestPost){
        if(err){
            console.log("THERE'S AN ERROR!!!");
            console.log(err);
            res.render("newpost.ejs");
        } else{
            console.log("A new blog post was added.");
            console.log(newestPost);
            res.redirect("/");
        }
    });
});

// Show Post Route
app.get("/:id", function(req, res){
    Blog.findById(req.params.id, function(err, showBlog){
        if(err){
            console.log("THERE'S AN ERROR!!!");
            console.log(err);
            res.render("/");
        } else{
            res.render("post.ejs", {showBlog: showBlog});
        }
    });
});


// Edit Route
app.get("/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log("THERE'S AN ERROR!!!");
            console.log(err);
            res.render("/");
        } else{
            res.render("edit.ejs", {foundBlog: foundBlog});
        }
    });
});


// Update Route
app.put("/:id", function(req, res){
    let title = req.body.title;
    let image = req.body.image;
    let body = req.body.body;
    let updatedPost = {title: title, image: image, body: body};
    Blog.findOneAndUpdate(req.params.id, updatedPost, function(err, postUpdater){
        if(err){
            console.log("THERE'S AN ERROR!!!");
            console.log(err);
            res.render("/");
        } else{
            res.redirect("/" + req.params.id);
        }
    });
});


// Destroy Route
app.delete("/:id", function(req, res){
    Blog.findOneAndDelete(req.params.id, function(err){
        if(err){
            console.log("THERE'S AN ERROR!!!");
            console.log(err);
            res.redirect("/");
        } else{
            res.redirect("/");
        }
    });
});





// SERVER

// // Setting localhost port
// const port = 3000
// // Server displaying app on localhost:3000 with success message log
// app.listen(port, () => console.log(`YelpCamp app server listening on port ${port}!`))

// process.env must be used on Amazon c9.io dev platform in order to view local app
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server up and running!!!");
});




