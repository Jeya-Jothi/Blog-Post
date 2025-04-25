import express, { query } from "express";

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use((req,res,next)=>{
  res.locals.fullMessage = fullMessage;
  next();
})


let fullMessage = [
  {title: "Welcome to Postify",content:"Start organizing your ideas effortlessly with Postify! Click the '+ New' button to create your first post, or explore the 'List' section to see all your saved posts. Let Postify simplify your workflow and keep your thoughts organized in one place.",time:"4:46:32 PM",date:"29-11-2024"}
]

function timeDate(){
  const d = new Date();
  const date = `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
  let hours = d.getHours();
  let minutes = d.getMinutes();
  let seconds = d.getSeconds();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  // Convert 24-hour format to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;

  const time = hours + ':' + minutes + ':' + seconds + ' ' + ampm;

  return { time, date };
}

app.get("/",(req,res)=>{

  res.render("index.ejs");
});

app.get("/new",(req,res)=>{
  res.render("new.ejs",{post : null,indexId:null});
});

app.get("/list",(req,res)=>{
  res.render("list.ejs");
});

app.get("/about",(req,res)=>{
  res.render("about.ejs");
});

app.get("/contact",(req,res)=>{
  res.render("contact.ejs");
});

app.post("/post",(req,res)=>{
  const {title,content} = req.body;
  const { time, date } = timeDate();
  if(title && content){
    fullMessage.unshift({title,content,time,date});
  }
  console.log(fullMessage);
  res.redirect("/");
});

app.post("/delete",(req,res)=>{
  const { indexId } = req.body;
  if(indexId >=0 && fullMessage[indexId]){
    fullMessage.splice(indexId, 1);
    console.log(`Delete post at index: ${indexId}`);
  }
  res.redirect("/");
});

// Route to render view.ejs based on indexId
app.get("/view/:id", (req, res) => {
  const indexId = parseInt(req.params.id, 10);
  if (indexId>=0 && fullMessage[indexId]) {
    const post = fullMessage[indexId];
    res.render("view.ejs", { post,indexId });
  } else {
    res.status(404).render("error.ejs", { message: "Post not found!" });
  }
});

app.get("/edit/:id", (req, res) => {
  const indexId = parseInt(req.params.id, 10);
  if (indexId>=0 && fullMessage[indexId]) {
    const post = fullMessage[indexId];
    res.render("new.ejs", { post,indexId });
  } else {
    res.status(404).render("error.ejs", { message: "Post not found!" });
  }
});

app.post("/edit/:id", (req, res) => {
  const { title,content } = req.body;
  const id = parseInt(req.params.id, 10); // Extract id from url
  const { time, date } = timeDate();
  if(id>=0){
    fullMessage[id].title = title;
    fullMessage[id].content = content;
    fullMessage[id].time = time;
    fullMessage[id].date = date;
    res.redirect(`/view/${id}`);
  } else{
    res.status(404).send("Post not found!");
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
  console.log(`Server in listening on port ${PORT}`);
});
