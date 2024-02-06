// this package behaves just like the mysql one, but uses async await instead of callbacks.
const mysql = require(`mysql-await`); // npm install mysql-await

// first -- I want a connection pool: https://www.npmjs.com/package/mysql#pooling-connections
// this is used a bit differently, but I think it's just better -- especially if server is doing heavy work.
var connPool = mysql.createPool({
  connectionLimit: 5, // it's a shared resource, let's not go nuts.
  host: "127.0.0.1",// this will work
  user: "C4131F23U99",
  database: "C4131F23U99",
  password: "9851", // we really shouldn't be saving this here long-term -- and I probably shouldn't be sharing it with you...
});

async function addUser(username, password) {
  return await connPool.awaitQuery("INSERT INTO user (username, password) VALUES (?,?)", [username, password]);

}

async function findUser(username,password) {
  return await connPool.awaitQuery("SELECT * FROM user WHERE username=? AND password=?",[username,password]);

}

async function addPost(data) {
  let message = data.message;
  let user_id = data.user_id;
  let category = data.category;
  let addThis = "INSERT INTO post (message, user_id, category) VALUES (?,?,?)"
  return await connPool.awaitQuery(addThis, [message,user_id,category]);
}

async function deletePost(id) {
  const del = "DELETE FROM post WHERE id=?"
  try {
    connPool.awaitQuery(del,[id]);
  } catch (error) {
    return -1;
  }
  
}

async function getPosts() {
  return await connPool.awaitQuery('SELECT * FROM post limit 10')
}

async function getPostsOffset(page,filter) {
  let start = (page-1)*10
  return await connPool.awaitQuery(`SELECT * FROM post order by ${filter} desc limit ${start}, 10`)
}


async function getPostsbyCategory(category,page,filter) {
  let start = (page-1)*10
  return await connPool.awaitQuery(`SELECT * FROM post WHERE category=? order by ${filter} desc limit ${start},10` ,[category]);
}

async function updatePost(id) {
  return await connPool.awaitQuery("update post set like_count = like_count + 1 where id=?", [id]);
}

async function updateMessage(message,id) {
  return await connPool.awaitQuery("update post set message = ? where id = ?",[message,id])
}

async function getUserByPost(id) {
  let user = await connPool.awaitQuery("select user_id from post where id=?", [id])
  return await connPool.awaitQuery("select username from user where id=?",[user[0].user_id])
}

async function getUserId(username) {
  return await connPool.awaitQuery("select id from user where username=?", [username])
}

async function getUserPosts(id) {
  return await connPool.awaitQuery("select * from post where user_id=?",[id])
}

module.exports = {addUser, getUserId, findUser, addPost, getPosts, getPostsOffset, getUserPosts, deletePost, getPostsbyCategory, updatePost, updateMessage, getUserByPost}