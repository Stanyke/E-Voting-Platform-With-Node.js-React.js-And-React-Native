const client = require('./connectDB');

const runUserTable = client.query("CREATE TABLE IF NOT EXISTS users ( user_id SERIAL PRIMARY KEY, firstname VARCHAR (100) NOT NULL, lastname VARCHAR (100) NOT NULL, email VARCHAR (100) UNIQUE NOT NULL, password VARCHAR (250) NOT NULL, gender VARCHAR (50) NOT NULL, phone_number VARCHAR (50) NOT NULL, state_of_origin VARCHAR (100) NOT NULL, local_govt VARCHAR (100) NOT NULL, vin VARCHAR (100) NOT NULL, reg_time VARCHAR (100) NOT NULL)", (err, res) =>
{
    console.log(err, res);
});

module.exports = runUserTable;