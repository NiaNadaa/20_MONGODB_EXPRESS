const express = require("express");
const app = express();
const mongodb = require("mongodb");

app.listen(process.env.PORT || 3000);
console.log('Servidor corriendo en puerto: 3000');

const MongoClient = mongodb.MongoClient;

MongoClient.connect("mongodb://localhost:27017", function (err, client) {
  if(err){
    console.log("Conexion a base de datos fallida")
  }else{
    app.locals.db = client.db("test")
    console.log("Conectado a la base de datos con exito");
  }
});


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/api/mesas", (req, res) => {
  app.locals.db.collection("mesas").find().toArray(function (err, data) {
      if(err){
        res.send({ error: err })
      }else{
        res.send({ result: data })
      }
  });
});

app.post("/api/anyadir", (req, res) => {
  app.locals.db.collection("mesas").insertOne({
      size: req.body.size,
      color: req.body.color,
      material: req.body.material,
      patas: req.body.patas,
    },
    function (err, data) {
      if(err){
        res.send({ error: err })
      }else{
        res.send({ result: data })
      }
    }
  );
});

app.put("/api/modificar/:color", (req, res) => {
  app.locals.db.collection("mesas").updateMany(
    { color: req.params.color },
    { $set: { color: "granate" }
    },
    function (err, data) {
      if(err){
        res.send({ error: err })
      }else{
        res.send({ result: data })
      }
    }
  );
});

app.delete("/api/borrar/:patas", (req, res) => {
  app.locals.db.collection("mesas").deleteMany({ patas: parseInt(req.params.patas)
  },
  function (err, data) {
    if(err){
      res.send({ error: err })
    }else{
      res.send({ result: data })
    }
  });
});
