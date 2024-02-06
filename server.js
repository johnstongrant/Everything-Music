//  Constant Variables
const express = require('express')
const session = require('express-session')
const mysql = require('./data')
const app = express()
const port = 4131

//  Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static("./resources"));
app.set("views", "./resources/templates");
app.set("view engine", "pug")
app.use(session({secret:"lnsfanlijijldwimlekyfvydashklmfajmsati9r4riuuirsehdkytyio/WSu/irawyutse.yawro.trn"}));


app.get("/", async (req, res) => {
    res.set({'Content-Type': 'text/html; charset=utf-8'})
    let posts = await mysql.getPosts();
    let user;
    if (! req.session.name) {
        user = ""
    } else {
        user = req.session.name;
    }
    res.status(200).render("mainpage.pug", {posts:posts, user:user})
})

app.get("/account", async (req,res) => {
    res.set({'Content-Type': 'text/html; charset=utf-8'})
    let id = await mysql.getUserId(req.session.name)
    let posts = await mysql.getUserPosts(id[0].id)
    res.status(200).render("account.pug",{posts:posts, user:req.session.name});
})

app.get("/signup", (req,res) => {
    res.set({'Content-Type': 'text/html; charset=utf-8'})
    res.status(200).render("signup.pug");
})

app.get("/login", (req,res) => {
    res.set({'Content-Type': 'text/html; charset=utf-8'})
    res.status(200).render("login.pug");
})

app.get("/logout", (req, res) => {
    res.set({'Content-Type': 'text/html; charset=utf-8'})
    req.session.destroy();
    res.status(200).render("logout.pug")
})

app.post("/addUser", async (req,res) => {
    res.set({'Content-Type': 'text/html; charset=utf-8'})
    let user = req.body.username;
    let pass = req.body.password;
    let data = await mysql.findUser(user,pass);
    if(data[0].username === user) {
        res.status(400).render('duplicate.pug')
     } else {
        await mysql.addUser(user,pass);
        let check = await mysql.findUser(user,pass);
        if (check[0].username === user && check[0].password === pass) {
            res.status(200).render("confirmation.pug")
        } else {
            res.status(500).render("failure.pug")
        }
     }
})

app.post("/api/findUser", async (req,res) => {
    res.set({'Content-Type': 'text/html; charset=utf-8'})
    let user = req.body.username;
    let pass = req.body.password;
    let ret = await mysql.findUser(user,pass);
    if (ret.length == 0) {
        res.redirect("/login")
    }
    else if (ret[0].username === user && ret[0].password === pass) {
        const name = ret[0].username
        req.session.name = name
        res.redirect("/")
    }
})

app.get("/vinyl/:page", async (req,res) => {
    res.set({'Content-Type': 'text/html; charset=utf-8'})
    let page = parseInt(req.params.page);
    if (page <= 0 || !page) {
        page = 1;
    }
    let filter = req.query.filter ?? "like";
    if (filter === "like") {
        filter = "like_count";
    } 
    else if (filter === "time") {
        filter = "time_created"
    }

    let user;
    if (! req.session.name) {
        user = ""
    } else {
        user = req.session.name;
    }

    let posts = await mysql.getPostsbyCategory("vinyl",page, filter);
    res.status(200).render("vinyl.pug", {posts:posts, user:user});
})

app.get("/cd/:page", async (req,res) => {
    res.set({'Content-Type': 'text/html; charset=utf-8'})
    let page = parseInt(req.params.page);
    if (page <= 0 || !page) {
        page = 1;
    }
    let filter = req.query.filter ?? "like";
    if (filter === "like") {
        filter = "like_count";
    } 
    else if (filter === "time") {
        filter = "time_created"
    }

    let user;
    if (! req.session.name) {
        user = ""
    } else {
        user = req.session.name;
    }

    let posts = await mysql.getPostsbyCategory("cd",page,filter);
    res.status(200).render("cd.pug", {posts:posts, user:user});
})

app.get("/playlist/:page", async (req,res) => {
    res.set({'Content-Type': 'text/html; charset=utf-8'})
    let page = parseInt(req.params.page);
    if (page <= 0 || !page) {
        page = 1;
    }
    let filter = req.query.filter ?? "like";
    if (filter === "like") {
        filter = "like_count";
    } 
    else if (filter === "time") {
        filter = "time_created"
    }

    let user;
    if (! req.session.name) {
        user = ""
    } else {
        user = req.session.name;
    }
    let posts = await mysql.getPostsbyCategory("playlists",page,filter);
    res.status(200).render("playlist.pug", {posts:posts, user:user});
})

app.get("/default/:page", async (req,res) => {
    res.set({'Content-Type': 'text/html; charset=utf-8'})
    let page = parseInt(req.params.page);
    if (page <= 0 || !page) {
        page = 1;
    }
    let filter = req.query.filter ?? "like";
    if (filter === "like") {
        filter = "like_count";
    } 
    else if (filter === "time") {
        filter = "time_created"
    }
    let user;
    if (! req.session.name) {
        user = ""
    } else {
        user = req.session.name;
    }

    let posts = await mysql.getPostsOffset(page,filter);
    res.status(200).render("mainpage.pug", {posts:posts, user:user})
})

app.post("/add", async (req,res) => {
    res.set({'Content-Type': 'text/html; charset=utf-8'})
    let message = req.body.post_content;
    let category = req.body.category;
    let user = req.session.name;
    let user_id = await mysql.getUserId(user);
    let data = {"message": message, "user_id": user_id[0].id, "category": category};
    await mysql.addPost(data)
    res.redirect("/")
})

app.post("/api/post", async (req, res) => {
    res.set({'Content-Type': 'application/json'})
    let id = req.body.id;
    await mysql.updatePost(id)
    res.status(200).send("updated post");
})

app.post("/api/updatePost", async (req, res) => {
    res.set({'Content-Type': 'text/html; charset=utf-8'})
    let message = req.body.post_content;
    let id = req.body.id;
    let username = await mysql.getUserByPost(id);
    if (username[0].username === req.session.name) {
        await mysql.updateMessage(message, id);
        res.redirect("/")
    } else {
        res.redirect("/")
    }
})

app.delete("/api/delete", async (req,res) => {
    res.set({'Content-Type': 'text/html; charset=utf-8'})
    let id = req.body.id;
    let username = await mysql.getUserByPost(id);
    if (username[0].username === req.session.name) {
        await mysql.deletePost(id);
        let posts = await mysql.getPosts();
        let user;
        if (! req.session.name) {
            user = ""
        } else {
            user = req.session.name;
        }
        res.status(200).render("mainpage.pug", {posts:posts, user:user});
    } else {
        res.send({"invalid": 'user cannot delete others posts', "redirect_path": "/"});
    }
})

app.use((req, res, next) => {
    res.set('Content-Type: text/html; charset=utf-8')
    res.status(404).render("404.pug")
  })

app.listen(port, () => {
    console.log(`Website being hosted on http://localhost:${port}/`)
})
