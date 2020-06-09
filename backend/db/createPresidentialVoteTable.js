const client = require('./connectDB');

const runPresidentialVotesTable = client.query("CREATE TABLE IF NOT EXISTS presidential_votes ( id SERIAL PRIMARY KEY, email TEXT UNIQUE NOT NULL, fullname VARCHAR (200) NOT NULL, voter_party VARCHAR (200) NOT NULL, reg_time VARCHAR (100) NOT NULL)", (err, res) =>
{
    console.log(err, res);
});

module.exports = runPresidentialVotesTable;