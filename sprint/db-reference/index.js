const express = require("express");
const bodyParser = require("body-parser");
const db = require("./queries");
const app = express();
const port = 3000;

// 1. The bodyParser.json() function is a built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser.

//    app.use() is intended for binding middleware to your application. The path is a
//    "mount" or "prefix" path and limits the middleware to only apply to any paths
//    requested that begin with it. It can even be used to embed another application:
app.use(bodyParser.json());
app.use(
	// 2. The bodyParser.urlencoded() function is a built-in middleware function in Express. It parses incoming requests with urlencoded payloads and is based on body-parser. */
	bodyParser.urlencoded({
		extended: true,
	})
);

// We’ll tell a route to look for a GET request on the root / URL and return some JSON:
// // app.get() is part of Express' application routing and is intended for matching and handling a specific route when requested with the GET HTTP verb:
// GET = retrieving
app.get("/", (request, response) => {
	response.json({ info: "Node.js, Express, and Postgres API" });
});

// The :id has a colon because we need to tell it what parameters to expect(?)
// app.get("/users", db.getUsers); // Commenting out because jamie think it might be blocking the function after
// app.get("/users/:id", db.getUserById); // This is used to map a path (http://localhost:3000/users/1) but Jamie wants to use parameters instead (http://localhost:3000/users?id=1)
app.get("/users/", db.getUserById); // This is used to map a path (http://localhost:3000/users/1) but Jamie wants to use parameters instead (http://localhost:3000/users?id=1)
// Postman example - GET (retrieves all): http://localhost:3000/users
// Postman example - GET (retrieves by id): http://localhost:3000/users?id=2

// So we've used GET to retrieve data, but we also need to be able to create new data. We'll use POST for that.
// Check out the createUser() function ins queries.js for more info on what it does
// POST = Adding
app.post("/users", db.createUser);
// Postman example - POST: http://localhost:3000/users
// Click Body > Raw > Change dropdown from Text to JSON
// Template to paste in body:
// {
//     "id": "7",
//     "name": "test express user1",                                                                                                                                                                                                                                                           ",
//     "course_id": "1"
// }

// PUT = Modifying
app.put("/users/:id", db.updateUser);
// Postman example - PUT: http://localhost:3000/users/7
// Template to paste in body (will update user with id 7 to have the course_id 2):
// {
//     "id": "7",
//     "name": "test express user1",                                                                                                                                                                                                                                                           ",
//     "course_id": "2"
// }

app.delete("/users/:id", db.deleteUser);
// Postman example - DELETE: http://localhost:3000/users/7

// Now, set the app to listen on the port you set:
app.listen(port, () => {
	console.log(`App running on port ${port}.`);
});
