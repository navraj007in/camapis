var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('winedb', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'winedb' database");
        db.collection('stars', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'stars' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

        var admin = require("firebase-admin");

    var serviceAccount = require("./sexcam-d0695-firebase-adminsdk-hy3ah-776acf4faa.json");
   // var serviceAccount = require("./google-services.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sexcam-d0695.firebaseio.com"
});
var firebase = require("firebase");

var config = {
  apiKey: "AIzaSyCXD0qcBKi0sbjC-azOr2qDhL8A_nD9QeE",
  authDomain: "sexcam-d0695.firebaseapp.com",
  databaseURL: "https://sexcam-d0695.firebaseio.com",
  storageBucket: "sexcam-d0695.appspot.com",
};
firebase.initializeApp(config);

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving stars: ' + id);
    db.collection('stars', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findStarPosts = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving stars: ' + id);
    db.collection('posts', function(err, collection) {
        collection.find({'user_id': id}).toArray(function(err, items) {
            res.send(items);
        });
    });


};

exports.findAll = function(req, res) {
    db.collection('stars', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addStar = function(req, res) {
    var wine = req.body;



var email = req.body.email;
console.log(req.body);
var password = req.body.password;
var name = req.body.name;

console.log("Creating user for -"+email+"-"+password);
//firebase.auth().createUserWithEmailAndPassword(email, password).then(function(result) {
//    wine.userid = result.uid;
    
   // console.log(result)
//}).catch(function(error) {
//    console.log(error)
//});

var defaultAuth = admin.auth();


admin.auth().createUser({
  email: email,
  emailVerified: false,
  password: password,
  displayName: name,
  disabled: false
})
  .then(function(userRecord) {
    // A UserRecord representation of the newly created user is returned
    console.log("Created Firebase User successfully with id :", userRecord.uid);
        var wine = req.body;
    wine.userId = userRecord.uid;
    wine.timestamp = Date.now();
    wine.description = "";
    wine.image ="";
    delete wine.password;
    status = "201";
    var reply = JSON.stringify(wine);
    
    db.collection('stars', function(err, collection) {
        collection.insert(wine, {safe:true}, function(err, result) {
            if (err) {
                wine.status = "200";
                wine.message = "An error occured";
                reply.set('status',"201");
                res.status(201).send(wine);

            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                status= "200";
                wine.status = "200";
                wine.message = "Account created Successfully";
                res.status(200).send(wine);
            }
        });
    });
  })
  .catch(function(error) {
                      wine.message = "An error occured---";
                wine.status = "201";

    console.log("User Creation onf Firebase failed:", error);
                res.status(201).send(wine);
  });
   
    
}

exports.updateStar = function(req, res) {
    var id = req.params.id;
    var wine = req.body;
    var token = wine['x-access-token']; 
    var header = JSON.stringify(req.headers);
    var tokenh = req.headers.token;
    console.log('Header Token -'+header);    
    console.log('Updating stars: ' + id);
    console.log(JSON.stringify(wine));
    db.collection('stars', function(err, collection) {
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

exports.deleteStar = function(req, res) {
    var id = req.params.id;
    console.log('Deleting stars: ' + id);
    
    db.collection('stars', function(err, collection) {
        
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
