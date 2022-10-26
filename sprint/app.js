var express = require("express");
var http = require("http");
var path = require("path");
var bodyParser = require("body-parser");
// const db = require("./db/queries");

var app = express();
var server = http.createServer(app);
// import stack module
const { handleStack } = require("./stack.js");
const { handleQueue } = require("./queue.js");
const { create } = require("domain");

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
	database: "data-structures-sprint1",
	password: "Keyin2022",
	port: 5432,
});

const getMessage = (request, response) => {
	// This will pull the id AND PARSE IT TO A NUMBER
	// const id = parseInt(request.params.id); // This was for path mapping (users/1). we're changing it to param (users?id=1)
	const retrieving_agent_id = request.query.id;
	const structure = parseInt(request.query.structure); // This is the parameter method
	console.log("Retrieving agent ID:", retrieving_agent_id);
	console.log("Structure:", structure);
	pool.query(
		"SELECT * FROM secret.messages WHERE structure_id = $1",
		[structure],
		(error, results) => {
			if (error) {
				throw error;
			}
			let records = results.rows;
			// This console log is how we can access each individual property in the json object
			// So if we want to display all messages nicely in the browser, we can use the .map() function to iterate through the array and display each property
			console.log("Results rows: \n", records);

			// !TODO: Maybe this is where the stack/queue functions should go? Like, we'll
			// get rid of the "by id" parts so it returns all, and then we can use our
			// stack/queue functions to sort the data to be displayed the data in the
			// browser
			//!TODO: add if statement to check structure type and then call the appropriate function
			if (structure === 1) {
				console.log("Structure 1 (Stack) Selected");
				let stackResult = handleStack(records);

				if (stackResult === undefined) {
					console.log("No data found for structure 1");
					response.status(200).send("No data found for structure 1");
				} else {
					let parsedResult = JSON.parse(stackResult);
					console.log("Stack result:", parsedResult);

					const message_id = parsedResult.message_id;
					const retrieved_data = parsedResult.data;

					// ADD TO RETRIEVALS TABLE
					addRetrieval(retrieving_agent_id, retrieved_data, structure);

					// SEND RESPONSE
					response.status(200).send(`DATA: ${parsedResult.data}`);
					console.log(
						"Message data displayed in browser: '" + parsedResult.data + "'"
					);

					// DELETE FROM MESSAGES TABLE
					deleteMessage(message_id);

					response.end();
				}
			} else if (structure === 2) {
				console.log("Structure 2 (Queue) Selected");
				let queueResult = handleQueue(records);

				if (queueResult === undefined) {
					console.log("No data found for structure 2");
					response.status(200).send("No data found for structure 2");
				} else {
					let parsedResult = JSON.parse(queueResult);
					console.log("Queue result:", parsedResult);

					const message_id = parsedResult.message_id;
					const retrieved_data = parsedResult.data;

					// ADD TO RETRIEVALS TABLE
					addRetrieval(retrieving_agent_id, retrieved_data, structure);

					// SEND RESPONSE
					response.status(200).send(`DATA: ${parsedResult.data}`);
					console.log("Message data displayed in browser: ", parsedResult.data);

					// DELETE FROM MESSAGES TABLE
					deleteMessage(message_id);

					response.end();
				}
			}
			//!TODO: Add agent id, structure id, and data retrieved to new table called "retrieved"
			//!TODO: Then delete the retrived message from messsages table
			// response.status(200).send(`Results: ${JSON.stringify(results.rows)}`);

			// response.status(200).send(
			// 	`<b>Results:</b> <br>
			//  	 	ID: 		${JSON.stringify(records[0].id)} <br>
			// 	 	Name: 		${JSON.stringify(records[0].name)} <br>
			// 	 	Course Id: 	${JSON.stringify(records[0].course_id)}`
			// );

			// !TODO: Remember to hide the agent_id from the receiver! (?)
			// response
			// 	.status(200)
			// 	.send(
			// 		records.map(
			// 			(item) =>
			// 				`AGENT_ID: ${item.agent_id}, DATA: ${item.data}, STRUCTURE: ${item.structure_id}`
			// 		)
			// 	);
		}
	);
};

// OLD before making one with request and response
function addRetrieval(retrieving_agent_id, retrieved_data, structure) {
	pool.query(
		"INSERT INTO secret.retrievals (retrieving_agent_id, retrieved_data, retrieval_structure_id) VALUES ($1, $2, $3)",
		[retrieving_agent_id, retrieved_data, structure],
		(error, results) => {
			if (error) {
				throw error;
			}
		}
	);
	console.log("Record *ADDED* to retrievals table!");
}

function deleteMessage(message_id) {
	pool.query(
		"DELETE FROM secret.messages WHERE message_id = $1",
		[message_id],
		(error, results) => {
			if (error) {
				throw error;
			}

			// response.status(200).send(`User deleted with ID: ${id}`);
		}
	);
	console.log("Record *DELETED* from messages table!");
}

// // Add
const addMessage = (request, response) => {
	// this is grabbing the name and email columns from the request body
	console.log(request.body);
	const { id, data, structure } = request.body;
	// And then we take those and use an insert statement to add some data those columns/add a new record
	// The $ are binding our id, name and course_id variables. $1 = user the first variable, $2 = use the second, etc. So $1 = id value, $2 = name value, etc.
	pool.query(
		"INSERT INTO secret.messages (agent_id, data, structure_id) VALUES ($1, $2, $3)",
		[id, data, structure],
		(error, results) => {
			if (error) {
				throw error;
			}
			response
				.status(201)
				.send(
					`User added with ID: ${id}, DATA: ${data}, STRUCTURE: ${structure}`
				);
		}
	);
};

app.get("/view/", getMessage);
app.post("/add", addMessage);

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
