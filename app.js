const express = require("express");
const multer = require("multer");
const ejs = require("ejs");
const path = require("path");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");

mongoose.connect("mongodb+srv://<username>:<password>@cluster0.hbkdpsr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const uploadSchema = {
    header:String,
    content:String,
    picture: String
};

const Post = mongoose.model("Post", uploadSchema);

const storage = multer.diskStorage({
        destination: "./public/uploads/",
        filename: function(req, file, cb){
          cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
});

const upload = multer({
        storage: storage,
        // limits:{fileSize: 1000000},
        fileFilter: function(req, file, cb){
           checkFileType(file, cb);
        }
});

function checkFileType(file, cb){
       const filetypes = /jpeg|jpg|png|gif/;
       const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
       const mimetype = filetypes.test(file.mimetype);

      if(mimetype && extname){
         return cb(null,true);
      } else {
        cb("Error: Images Only!");
      }
}

app.get("/", function(req, res){
        Post.find({}).then(function(data){
             res.render("home", {homecontent: homeStartingContent, x:data})
        });
});

app.get("/compose", function(req, res){
        res.render("compose");
});

app.get("/about", function(req, res){
        res.render("about", {aboutcontents: aboutContent});
});

app.get("/contact", function(req, res){
        res.render("contact", {contactcontents:contactContent});
});

app.get("/postes/:parametername", function(req, res){
        const userpreference = req.params.parametername;
        Post.find({}).then(function(data){
                data.forEach(function(element){
                        if(element.header==userpreference){
                                res.render("post", {eachposttitle:element.header, eachpostdetail:element.content, eachpostimage: element.picture});
                        }
                })
        })

});

app.post("/upload", upload.single("myImage"), function(req, res){
        const post = new Post({
           header: req.body.title,
           content: req.body.content,
           picture: "uploads/"+req.file.filename
        });

        post.save().then(function(){
          res.redirect("/");
        });
});

app.listen(process.env.PORT || 3000, function(){
      console.log("Server started on port 3000");
});




// <!-- <img src="<%= eachpost.picture %>"> -->
