const express = require("express");
const path = require("path");
const app = express();

// import stack module
const { handleStack } = require("./stack.js");
const { handleQueue } = require("./queue.js");
const pool = require("./config.js").pool;

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "./public")));

app.get("/", function (req, res) {
	res.sendFile(path.join(__dirname, "./public/form.html"));
});

const getMessage = (request, response) => {
	// When a user puts in a request for a message, they ust input their agent ID number
	// and the ID of the data structure they want to retrieve from

	// This is grabbing the agent_id and structure_id columns from the request
	const retrieving_agent_id = request.query.id;
	const structure = parseInt(request.query.structure);

	// Logging the input values to the console
	console.log("Retrieving agent ID:", retrieving_agent_id);
	console.log("Structure:", structure);

	// This if-statement makes sure the user is entering a valid data structure ID. If
	// they enter anything other than 1 or 2, the response sent back is a string containing an error message.

	// Here we are using a select statement to grab only the records from the messages
	// table that have the same structure_id as the one the user entered.
	pool.query(
		"SELECT * FROM secret.messages WHERE structure_id = $1",
		[structure],
		(error, results) => {
			if (error) {
				throw error;
			}

			// Now we have a variable containing the results of the query. Below, this
			// variable is passed into either the handleStack or handleQueue function,
			// depending on the structure ID the user entered. depending on the
			// structure ID the user entered.
			let records = results.rows;

			// This console log is how we can access each individual property in the json object
			// So if we want to display all messages nicely in the browser, we can use the .map() function to iterate through the array and display each property
			console.log("Results rows: \n", records);

			// This if-statement checks structure type and then call the appropriate function.
			// If the structure is 1, the stack function is called. If the structure is 2, the queue function is called.
			if (structure === 1) {
				console.log("Structure 1 (Stack) Selected");
				let stackResult = handleStack(records);
				if (stackResult === null) {
					console.log("No data found in structure 1");
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

				if (queueResult === null) {
					console.log("No data found for structure 2");
					response.status(200).send("No data found in structure 2");
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
	const { id, data, structure } = request.body;

	// And then we take those and use an insert statement to add some data those columns/add a new record
	// The $ are binding our id, name and course_id variables. $1 = user the first variable, $2 = use the second, etc. So $1 = id value, $2 = name value, etc.
	console.log("ADDMESSAGE STRUCTURE", structure);

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

app.listen(3000, function () {
	console.log("server is listening on port: 3000");
});
