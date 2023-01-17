const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.set('strictQuery', true);

mongoose.connect('mongodb://127.0.0.1:27017/wikiDB', { useNewUrlParser: true });

//aticle Schema
const articlesSchema = new mongoose.Schema({   
    title : String,
    content : String
  });
  //declare Article
  const Article = mongoose.model('Article', articlesSchema);
  




//Chain routes /articles request targetting all articles 
app.route("/articles")

.get(function(req,res) {
    
    Article.find({},function(err, articles){
        if(!err){
            res.send(articles);
        }else{
            res.send(err);
        }   
    });
})

.post(function(req,res){
    const Title = req.body.title;
    const Content = req.body.content;
    
    const newArticle = new Article({
    
        title : Title,
        content : Content
    });
    
    newArticle.save(function(err){
        if(!err){
            res.send("Successfully added a new article.")
        }else{
            res.send(err);
        }
    });
    console.log("new article saved!");
    
})

.delete(function(req,res){

        Article.deleteMany({}, function(err){
            if(!err){
                res.send("Successfully deleted all articles.")
            }else{
                res.send(err);
            }
        });   
});



//Chain routes /articles/:post    request targetting specific article

app.route("/articles/:articleTitle")


.get(function(req,res){
    const title = req.params.articleTitle;
    console.log(title);
   Article.findOne({ title : title}, function(err, article){
    if(article){
        res.send(article);
    }else{
        res.send("Error finding article "+title);
    }
    
   });
})



.put(function(req,res){
 Article.findOneAndUpdate({title : req.params.articleTitle}, {title: req.body.title, content: req.body.content},function(err,Result){
if(Result){
   // console.log("Updated the "+req.body.title+" article with the content *"+req.body.content+"*");
   res.send("Updated the "+req.body.title+" article with the content *"+req.body.content+"*");
}
else{
    console.log("Erro: "+err);
}
 });
})

.patch(function(req,res){
    Article.findOneAndUpdate({title : req.params.articleTitle}, {$set: req.body},function(err,Result){
        if(Result){
           // console.log("Updated the "+req.body.title+" article with the content *"+req.body.content+"*");
           res.send("Updated the "+req.body.title+" article with the content *"+req.body.content+"*");
        }
        else{
            console.log("Erro: "+err);
        }
         });
        })

.delete(function(req,res){
    Article.findOneAndDelete({ title : req.params.articleTitle}, function(err, article){
        if(!err){
            res.send(req.params.articleTitle+" was succesfuly deleted!");
        }else{
            res.send("Error finding article "+req.params.articleTitle);
        }
        
       });
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});