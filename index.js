var express = require("express");

var PORT;
var Cloudant = require("@cloudant/cloudant");

if (process.env.PORT) {
  PORT = process.env.PORT;
} else {
  PORT = 8000;
}
var Cloudant = require("@cloudant/cloudant");
var url =
  "https://apikey-v2-1ccx9t83a8laojqvhrxps3q6ju1np7km1jvq38d2vvjz:ca8a4470599fa35c970f9b3b9a7d7760@2da779cb-344e-49a0-8bb8-d3f15f6e1d2a-bluemix.cloudantnosqldb.appdomain.cloud";
var username = "apikey-v2-1ccx9t83a8laojqvhrxps3q6ju1np7km1jvq38d2vvjz";
var password = "ca8a4470599fa35c970f9b3b9a7d7760";

var app = express();
const bodyParser = require("body-parser");
//const cors = require('cors');
//app.use(cors());
// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//
app.get("/", function (req, res) {
  res.send("Welcome to cloudant database on IBM Cloud");
});

//
app.get("/list_of_databases", function (req, res) {
  Cloudant(
    { url: url, username: username, password: password },
    function (err, cloudant, pong) {
      if (err) {
        return console.log("Failed to initialize Cloudant: " + err.message);
      }
      console.log(pong); // {"couchdb":"Welcome","version": ...

      // Lists all the databases.
      cloudant.db
        .list()
        .then((body) => {
          res.send(body);
        })
        .catch((err) => {
          res.send(err);
        });
    }
  );
});

//create database
app.post("/create-database", (req, res) => {
  var name = req.body.name;
  Cloudant(
    { url: url, username: username, password: password },
    function (err, cloudant, pong) {
      if (err) {
        return console.log("Failed to initialize Cloudant: " + err.message);
      }
      console.log(pong); // {"couchdb":"Welcome","version": ...

      cloudant.db.create(name, (err) => {
        if (err) {
          res.send(err);
        } else {
          res.send("database created");
        }
      });
    }
  );
});

// insert single document
app.post("/insert-document", function (req, res) {
  var id, name, address, phone, age, database_name;
  database_name = req.body.db;
  (id = req.body.id), (name = req.body.name);
  address = req.body.address;
  phone = req.body.phone;
  age = req.body.age;
  Cloudant(
    { url: url, username: username, password: password },
    function (err, cloudant, pong) {
      if (err) {
        return console.log("Failed to initialize Cloudant: " + err.message);
      }
      console.log(pong); // {"couchdb":"Welcome","version": ..

      cloudant
        .use(database_name)
        .insert(
          { name: name, address: address, phone: phone, age: age },
          id,
          (err, data) => {
            if (err) {
              res.send(err);
            } else {
              res.send(data); // { ok: true, id: 'rabbit', ...
            }
          }
        );
    }
  );
});

//insert bulk documents
app.post("/insert-bulk/:database_name", function (req, res) {
  const database_name = req.params.database_name;
  const students = [];

  for (let i = 0; i < 3; i++) {
    const student = {
      _id: req.body.docs[i].id,
      name: req.body.docs[i].name,
      address: req.body.docs[i].address,
      phone: req.body.docs[i].phone,
      age: req.body.docs[i].age,
    };

    students.push(student);
  }

  Cloudant(
    { url: url, username: username, password: password },
    function (err, cloudant, pong) {
      if (err) {
        return console.log("Failed to initialize Cloudant: " + err.message);
      }

      cloudant.use(database_name).bulk({ docs: students }, function (err) {
        if (err) {
          throw err;
        }

        res.send("Inserted all documents");
      });
    }
  );
});

console.log(students);
Cloudant(
  { url: url, username: username, password: password },
  function (err, cloudant, pong) {
    if (err) {
      return console.log("Failed to initialize Cloudant: " + err.message);
    }
    console.log(pong); // {"couchdb":"Welcome","version": ..

    cloudant.use(database_name1).bulk({ docs: students }, function (err) {
      if (err) {
        throw err;
      }

      res.send("Inserted all documents");
    });
  }
);

//delete a document
app.delete("/delete-document", function (req, res) {
  var id, rev, database_name;
  database_name = req.body.db;
  id = req.body.id;
  rev = req.body.rev;
  Cloudant(
    { url: url, username: username, password: password },
    function (err, cloudant, pong) {
      if (err) {
        return console.log("Failed to initialize Cloudant: " + err.message);
      }
      console.log(pong); // {"couchdb":"Welcome","version": ..

      cloudant.use(database_name).destroy(id, rev, function (err) {
        if (err) {
          throw err;
        }

        res.send("document deleted");
      });
    }
  );
});

//

// update existing document
app.put("/update-document", function (req, res) {
  var id, rev, database_name;
  database_name = req.body.db;
  id = req.body.id;
  rev = req.body.rev;
  name = req.body.name;
  address = req.body.address;
  phone = req.body.phone;
  age = req.body.age;
  Cloudant(
    { url: url, username: username, password: password },
    function (err, cloudant, pong) {
      if (err) {
        return console.log("Failed to initialize Cloudant: " + err.message);
      }
      console.log(pong); // {"couchdb":"Welcome","version": ..

      cloudant.use(database_name).insert(
        {
          _id: id,
          _rev: rev,
          name: name,
          age: age,
          address: address,
          phone: phone,
        },
        (err, data) => {
          if (err) {
            res.send(err);
          } else {
            res.send(data); // { ok: true, id: 'rabbit', ...
          }
        }
      );
    }
  );
});

app.listen(PORT);
//console.log(message.getPortMessage() + PORT);
