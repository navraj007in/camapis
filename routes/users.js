var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('winedb', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'sexcams' database");
        db.collection('posts', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'posts' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving User: ' + id);
    db.collection('users', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('users', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addUser = function(req, res) {
    var admin = require("firebase-admin");

    var serviceAccount = require("./sexcam-d0695-firebase-adminsdk-hy3ah-afddc4c3d0.json");
console.log('fetching users');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sexcam-d0695.firebaseio.com"
});

var defaultAuth = admin.auth();

admin.auth().createUser({
  email: "navraj007in@gmail.com",
  emailVerified: false,
  password: "secretPassword",
  displayName: "Navraj Singh",
  photoURL: "http://www.example.com/12345678/photo.png",
  disabled: false
})
  .then(function(userRecord) {
    // A UserRecord representation of the newly created user is returned
    console.log("Successfully created new user:", userRecord.uid);
  })
  .catch(function(error) {
    console.log("Error creating new user:", error);
  });
//admin.auth.createUser();

    var wine = req.body;
    wine.timestamp = Date.now();
    console.log('Added user :' + "test@gmail.com");
    
                    res.send('Success: ' );

}

exports.updateUser = function(req, res) {
    var id = req.params.id;
    var wine = req.body;
    console.log('Updating post: ' + id);
    console.log(JSON.stringify(wine));
    db.collection('posts', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, wine, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating wine: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(wine);
            }
        });
    });
}

exports.deleteUser = function(req, res) {
    var id = req.params.id;
    console.log('Deleting post: ' + id);
    db.collection('posts', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}

