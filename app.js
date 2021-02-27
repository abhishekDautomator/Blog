//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
var _ = require('lodash');

mongoose.connect("mongodb+srv://admin-resumecrafto:Mongo707197@cluster0.od1tw.mongodb.net/BlogDB",{useNewUrlParser: true, useUnifiedTopology: true});

const blogSchema = {
  title : {
    type : String,
    required : true
  },
  content : {
    type : String,
    required : true
  }
};

const Blog = mongoose.model("Blog",blogSchema);

const PageContent = mongoose.model("PageContent",blogSchema);

const homeStartingContent = new PageContent({
  title : "Home",
  content : "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing."
});
const aboutContent = new PageContent({
  title : "About",
  content: "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui."
});
const contactContent = new PageContent({
  title : "Contact",
  content : "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero."
});

const app = express();

const postList=[];
let home = about = contact ="";

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/",function(req, res){
    PageContent.find({},function(err,data){
        if(data.length == 0){
          homeStartingContent.save();
          aboutContent.save();
          contactContent.save();
        }else{
          home = data[0].content;
          about = data[1].content;
          contact = data[2].content;
        }
      });
    Blog.find({},function(err,foundList){
        if(foundList.length == 0){
          res.render("home",{startingContent:home,post:postList});
        }else{
          res.render("home",{startingContent:home,post:foundList});
        }
    });
  });

app.get("/contact",function(req, res){
  PageContent.find({},function(err,data){
    res.render("contact",{contactContent:contact});
  });
});

app.get("/about",function(req, res){
  PageContent.find({},function(err,data){
    res.render("about",{aboutContent:about});
  });
});

app.get("/compose",function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
    const post = new Blog({
      content : req.body.contentPost,
      title : req.body.contentTitle
    });

    post.save();
    res.redirect("/");
});

app.get("/posts/:redirectPost",function(request, response){
  Blog.find({},function(err,foundList){
    foundList.forEach((item,i) => {
    if(_.lowerCase([string=item.title]) === _.lowerCase([string=request.params.redirectPost]))
      response.render("post",{title:item.title,post:item.content});
    });
  });
});

let port = process.env.PORT;

if(port == null || port == ""){
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port "+port);
});
