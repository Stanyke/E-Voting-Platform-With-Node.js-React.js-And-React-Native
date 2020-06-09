const app = require('./app');

const userRoute = require('./routes/user');

const contestantRoute = require('./routes/contestant');

const voteRoute = require('./routes/vote');

const client = require('./db/connectDB');

const port = process.env.PORT || 3000;

app.listen(port, () =>
{
    console.log(`Server Running On port ${port}`);
});