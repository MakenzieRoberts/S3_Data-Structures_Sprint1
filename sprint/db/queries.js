// In a production environment, you would want to put your configuration details in a
// separate file with restrictive permissions so that it is not accessible from version
// control. But, for the simplicity of this tutorial, we’ll keep it in the same file as the
// queries.

// These functions were originally just templates that get name and email columns, and the
// statements didn't include the schema names.. We edit them in class to suit our test_2022_09_08.users tables
const Pool = require("pg").Pool;
const pool = new Pool({
	user: "postgres",
	host: "localhost",
	database: "postgres",
	password: "Keyin2022",
	port: 5432,
});

// GET all users

// Our first endpoint will be a GET request. We can put the raw SQL that will touch the api database inside the pool.query(). We’ll SELECT all users and order by ID.

// We are creating a new router for the users resource. This router will handle all the requests that are made to the /users resource.
// We are creating a new route for the GET /users resource. This route will handle all the GET requests made to the /users resource.
// We are defining the callback function for the GET /users route.
const getUsers = (request, response) => {
	// We are querying the users table in the database and returning all the users.
	// We are using pool.query() to execute the query.
	// The first argument is the query text. The second argument is an array of values
	// The callback function has two arguments: error and results. The results argument is an object with a rows property. That's where our data is stored.
	// We are sending the results to the client in JSON format.
	pool.query(
		// You can put any query here! So if I just want users with the id of 3, I'd write "SELECT * FROM test_2022_09_08.users WHERE id = 3"
		"SELECT * FROM test_2022_09_08.users ORDER BY id ASC",
		(error, results) => {
			if (error) {
				throw error;
			}
			response.status(200).json(results.rows);
		}
	);
};

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
			response.status(200).json(results.rows);
		}
	);
};

const createUser = (request, response) => {
	// this is grabbing the name and email columns from the request body
	const { id, name, course_id } = request.body;
	// And then we take those and use an insert statement to add some data those columns/add a new record
	// The $ are binding our id, name and course_id variables. $1 = user the first variable, $2 = use the second, etc. So $1 = id value, $2 = name value, etc.
	pool.query(
		"INSERT INTO test_2022_09_08.users (id, name, course_id) VALUES ($1, $2, $3)",
		[id, name, course_id],
		(error, results) => {
			if (error) {
				throw error;
			}
			response.status(201).send(`User added with ID: ${id}`);
		}
	);
};

const updateUser = (request, response) => {
	const id = parseInt(request.params.id);
	const { name, course_id } = request.body;

	pool.query(
		"UPDATE test_2022_09_08.users SET name = $1, course_id = $2 WHERE id = $3",
		[name, course_id, id],
		(error, results) => {
			if (error) {
				throw error;
			}
			response.status(200).send(`User modified with ID: ${id}`);
		}
	);
};

const deleteUser = (request, response) => {
	const id = parseInt(request.params.id);

	pool.query(
		"DELETE FROM test_2022_09_08.users WHERE id = $1",
		[id],
		(error, results) => {
			if (error) {
				throw error;
			}
			response.status(200).send(`User deleted with ID: ${id}`);
		}
	);
};

module.exports = {
	getUsers,
	getUserById,
	createUser,
	updateUser,
	deleteUser,
};
