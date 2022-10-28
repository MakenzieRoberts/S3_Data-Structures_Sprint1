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

// This function adds the record to the messages table. This function is executed when the
// user submits a new message through the form.
const addMessage = (request, response) => {
	// Using the request body, we can access the data sent by the user to create a record and insert it into the messages table
	let { id, data, structure } = request.body;

	// If the data structure ID entered by the user is 1 or 2, continue on with the function.
	if (structure == 1 || structure == 2) {
		// The $ are binding our id, name and course_id variables. $1 = user the first
		// variable, $2 = use the second, etc. So $1 = id value, $2 = name value, etc.
		pool.query(
			"INSERT INTO secret.messages (agent_id, data, structure_id) VALUES ($1, $2, $3)",
			[id, data, structure],
			(error, results) => {
				if (error) {
					throw error;
				}
				response.end(
					`Message added with Agent ID: ${id}, Data: ${data}, Structure: ${structure}`
				);
			}
		);
	} else {
		// If the data structure is not 1 or 2, send an error message to the user.
		response.end(
			`Invalid Data Structure. Please enter 1 for stack or 2 for queue.`
		);
	}
};

// This function grabs user input and retrieves appropriate record from the messages
// table, based on which data structure ID is entered.
const getMessage = (request, response) => {
	// When a user puts in a request for a message, they ust input their agent ID number
	// and the ID of the data structure they want to retrieve from

	// This is grabbing the agent_id and structure_id columns from the request
	const retrieving_agent_id = request.query.id;
	const structure = parseInt(request.query.structure);

	// Logging the input values to the console
	console.log("\nRetrieving agent ID:", retrieving_agent_id);
	console.log("Retrieval Structure:", structure);

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

			// This next if-statement checks structure type and then call the appropriate
			// function. If the structure is 1, the stack function is called. If the
			// structure is 2, the queue function is called.

			// Initializing a variable to hold the record that is returned from the stack
			// or queue function
			let result;

			if (structure === 1) {
				console.log("Structure 1 (Stack) Selected");
				// Assigning the result of our stack function to a variable
				result = handleStack(records);
			} else if (structure === 2) {
				// This does the same thing as above but with the queue function
				console.log("Structure 2 (Queue) Selected");
				// Assign result from the queue function to a variable
				result = handleQueue(records);
			} else {
				// If the structure is neither 1 or 2, it means that an invalid structure
				// ID was entered, so we send an error message to the user.
				response.end(
					`Invalid Data Structure. Please enter 1 for stack or 2 for queue.`
				);
			}

			// The stack and queue functions are set up to return null if they are
			// empty. If the result is null, we send a response to the user that lets
			// them know there was no data found in that structure.
			if (result === null) {
				console.log("No data found in structure 1");
				response.end("No data found in structure 1.");
			} else {
				// If the result is not null, and therefore contains data, we continue on
				// and parse the data into a JSON object so we can access the properties
				// and use that information to archive and delete the correct record.

				// Here we parse the result of the stack function into a JSON object so we
				// can access the properties
				let parsedResult = JSON.parse(result);
				console.log("Stack result:", parsedResult);

				let message_id = parsedResult.message_id;
				let retrieved_data = parsedResult.data;

				// Before we send the response back to the user, we need to add the
				// record to the retrievals table (to archive the deleted message) and
				// delete the record from the messages table

				// This function adds the record to the retrievals table for archival purposes
				addRetrieval(retrieving_agent_id, retrieved_data, structure);

				// Lastly, we call our delete function and pass it the message_id to
				// delete the record from the messages table.
				deleteMessage(message_id);

				// Send response back to the user containing the data they retrieved (while omitting sending agent id)
				response.end(`Data retrieved: ${parsedResult.data}`);
				console.log(
					"Message data displayed in browser: '" + parsedResult.data + "' \n"
				);
			}
		}
	);
};

// This function adds the record to the retrievals table for archival purposes
function addRetrieval(retrieving_agent_id, retrieved_data, structure) {
	// This is the insert statement that adds the record to the retrievals table, it uses
	// the properties of the record returned from the stack/queue function to create a new
	// record in the retrievals table.
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

// This function deletes the record from the messages table
function deleteMessage(message_id) {
	// Here we are using a delete statement to delete the record from the messages table,
	// using the message_id we retrieved from the stack or queue function
	pool.query(
		"DELETE FROM secret.messages WHERE message_id = $1",
		[message_id],
		(error, results) => {
			if (error) {
				throw error;
			}
		}
	);
	console.log("Record *DELETED* from messages table!");
}

// When a user submits a retrieval request, the getMessages function is called.
app.get("/view/", getMessage);

// When a user submits a new message, the addMessage function is called.
app.post("/add", addMessage);

// Server listening on port 3000
app.listen(3000, function () {
	console.log("server is listening on port: 3000");
});
