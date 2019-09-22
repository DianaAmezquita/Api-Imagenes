const mysql = require("mysql");
const express = require("express");
var app = express();
const bodyparser = require("body-parser");

//app.use(bodyparser.json());
app.use(bodyparser.json({ limit: "50mb" }));
app.use(bodyparser.urlencoded({ limit: "50mb", extended: true }));

//app.use(
//  bodyparser(
//    json({ limit: "50mb" }),
//    urlencoded({ limit: "50mb", extended: true })
//  )
//);

var mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "db_telcomsis",
  multipleStatements: true
});

mysqlConnection.connect(err => {
  if (!err)
    console.log("La conexión de base de datos se realizó correctamente. ");
  else
    console.log(
      "DB connection failed \n Error: " + JSON.stringify(err, undefined, 2)
    );
});

app.listen(3000, () =>
  console.log("El Servidor Express se ejecuta en el puerto numero : 3000.")
);

// get all telcomsis- registro
app.get("/telcomsis", (req, res) => {
  mysqlConnection.query("SELECT * FROM registro", (err, rows, fields) => {
    if (!err) res.send(rows);
    //console.log(rows[0].id);
    else console.log(err);
  });
});

// get an telcomsis- registro
app.get("/telcomsis/:id_cliente", (req, res) => {
  mysqlConnection.query(
    "SELECT * FROM registro WHERE id_cliente = ?",
    [req.params.id],
    (err, rows, fields) => {
      if (!err) res.send(rows);
      else console.log(err);
    }
  );
});

// Delete an telcomsis- registro
app.delete("/telcomsis/:id_cliente", (req, res) => {
  mysqlConnection.query(
    "DELETE FROM registro WHERE id_cliente = ?",
    [req.params.id],
    (err, rows, fields) => {
      if (!err) res.send("Deleted successfully. ");
      else console.log(err);
    }
  );
});

// Insert an telcomsis- registro
app.post("/telcomsis", (req, res) => {
  let emp = req.body;
  var sql =
    "SET @id_cliente = ?;SET @foto = ?;SET @cedula = ?;SET @firma = ?;SET @huella = ?; \
    CALL usersAddOrEdit(@id_cliente,@foto,@cedula,@firma,@huella);";
  mysqlConnection.query(
    sql,
    [emp.id_cliente, emp.foto, emp.cedula, emp.firma, emp.huella],
    (err, rows, fields) => {
      if (!err)
        rows.forEach(element => {
          if (element.constructor == Array)
            res.send("Inserted registro id :" + element[0].id_cliente);
        });
      else console.log(err);
    }
  );
});

// Update an telcomsis- registro
app.put("/telcomsis", (req, res) => {
  let emp = req.body;
  var sql =
    "SET @id_cliente = ?;SET @foto = ?;SET @cedula = ?;SET @firma = ?;SET @huella = ?; \
    CALL usersAddOrEdit(@id_cliente,@foto,@cedula,@firma,@huella);";
  mysqlConnection.query(
    sql,
    [emp.id_cliente, emp.foto, emp.cedula, emp.firma, emp.huella],
    (err, rows, fields) => {
      if (!err) res.send("Update successfully. ");
      else console.log(err);
    }
  );
});
