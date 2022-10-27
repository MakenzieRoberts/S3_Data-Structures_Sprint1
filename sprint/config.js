const Pool = require("pg").Pool;

const pool = new Pool({
	user: "postgres",
	host: "localhost",
	database: "data-structures-sprint1",
	password: "Keyin2022",
	port: 5432,
});

// // exports.pool = pool;
// module.exports = new pg.Pool(config);

module.exports = {
	pool,
};
