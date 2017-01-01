var express = require('express'),
    path = require('path'),
    http = require('http'),
    wine = require('./routes/wines');
    star = require('./routes/stars');
    posts = require('./routes/posts');
    users = require('./routes/users');
    firebaseusr = require('./routes/firebaseusr');

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser()),
    app.use(express.static(path.join(__dirname, 'public')));
});

app.get('/wines', wine.findAll);
app.get('/wines/:id', wine.findById);
app.post('/wines', wine.addWine);
app.put('/wines/:id', wine.updateWine);
app.delete('/wines/:id', wine.deleteWine);

app.get('/firestar', users.findAll);
app.get('/firestar/:id', firebaseusr.findById);

app.get('/stars', star.findAll);
app.get('/stars/:id', star.findById);
app.get('/stars/posts/:id', star.findStarPosts);

app.post('/stars', star.addStar);
app.put('/stars/:id', star.updateStar);
app.delete('/stars/:id', star.deleteStar);

app.get('/posts', posts.findAll);
app.get('/posts/:id', posts.findById);
app.post('/posts', posts.addPost);
app.put('/posts/:id', posts.updatePost);
app.delete('/posts/:id', posts.deletePost);

app.get('/users', users.findAll);
app.get('/users/:id', users.findById);
app.post('/users', users.addUser);
app.put('/users/:id', users.updateUser);
app.delete('/users/:id', users.deleteUser);

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});