var express = require("express");
var http = require("http");
var path = require("path");
var bodyParser = require("body-parser");
// const db = require("./db/queries");

var app = express();
var server = http.createServer(app);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "./public")));

// db.run('CREATE TABLE IF NOT EXISTS emp(id TEXT, name TEXT)');

app.get("/", function (req, res) {
	res.sendFile(path.join(__dirname, "./public/form.html"));
});

const Pool = require("pg").Pool;
const pool = new Pool({
	user: "postgres",
	host: "localhost",
	database: "postgres",
	password: "Keyin2022",
	port: 5432,
});

const getUserById = (request, response) => {
	// This will pull the id AND PARSE IT TO A NUMBER
	// const id = parseInt(request.params.id); // This was for path mapping (users/1). we're changing it to param (users?id=1)
	const id = parseInt(request.query.id); // This is the parameter method

	pool.query(
		"SELECT * FROM test_2022_09_08.users WHERE id = $1",
		[id],
		(error, results) => {
			if (error) {
				throw error;
			}
			// response.status(200).json(results.rows);
			let test = results.rows;
			// This console log is how we can access each individual property in the json object
			// So if we want to display all messages nicely in the browser, we can use the .map() function to iterate through the array and display each property
			console.log(test[0].id);

			// response.status(200).send(`Results: ${JSON.stringify(results.rows)}`);
			response.status(200).send(
				`<b>Results:</b> <br>
			 	 	ID: 		${JSON.stringify(test[0].id)} <br>
				 	Name: 		${JSON.stringify(test[0].name)} <br>
				 	Course Id: 	${JSON.stringify(test[0].course_id)}`
			);
		}
	);
};

// // Add
const createUser = (request, response) => {
	// this is grabbing the name and email columns from the request body
	const { id, name } = request.body;
	// And then we take those and use an insert statement to add some data those columns/add a new record
	// The $ are binding our id, name and course_id variables. $1 = user the first variable, $2 = use the second, etc. So $1 = id value, $2 = name value, etc.
	pool.query(
		"INSERT INTO test_2022_09_08.users (id, name) VALUES ($1, $2)",
		[id, name],
		(error, results) => {
			if (error) {
				throw error;
			}
			response.status(201).send(`User added with ID: ${id}`);
		}
	);
};

app.get("/view/", getUserById);
app.post("/add", createUser);

// app.post('/add', function(req,res){
//   db.serialize(()=>{
//     db.run('INSERT INTO emp(id,name) VALUES(?,?)', [req.body.id, req.body.name], function(err) {
//       if (err) {
//         return console.log(err.message);
//       }
//       console.log("New employee has been added");
//       res.send("New employee has been added into the database with ID = "+req.body.id+ " and Name = "+req.body.name);
//     });

//   });

// });

// // View
// app.post('/view', function(req,res){
//   db.serialize(()=>{
//     db.each('SELECT id ID, name NAME FROM emp WHERE id =?', [req.body.id], function(err,row){     //db.each() is only one which is funtioning while reading data from the DB
//       if(err){
//         res.send("Error encountered while displaying");
//         return console.error(err.message);
//       }
//       res.send(` ID: ${row.ID},    Name: ${row.NAME}`);
//       console.log("Entry displayed successfully");
//     });
//   });
// });

// //Update
// app.post('/update', function(req,res){
//   db.serialize(()=>{
//     db.run('UPDATE emp SET name = ? WHERE id = ?', [req.body.name,req.body.id], function(err){
//       if(err){
//         res.send("Error encountered while updating");
//         return console.error(err.message);
//       }
//       res.send("Entry updated successfully");
//       console.log("Entry updated successfully");
//     });
//   });
// });

// // Delete
// app.post('/delete', function(req,res){
//   db.serialize(()=>{
//     db.run('DELETE FROM emp WHERE id = ?', req.body.id, function(err) {
//       if (err) {
//         res.send("Error encountered while deleting");
//         return console.error(err.message);
//       }
//       res.send("Entry deleted");
//       console.log("Entry deleted");
//     });
//   });

// });

// // Closing the database connection.
// app.get('/close', function(req,res){
//   db.close((err) => {
//     if (err) {
//       res.send('There is some error in closing the database');
//       return console.error(err.message);
//     }
//     console.log('Closing the database connection.');
//     res.send('Database connection successfully closed');
//   });

// });

server.listen(3000, function () {
	console.log("server is listening on port: 3000");
});
