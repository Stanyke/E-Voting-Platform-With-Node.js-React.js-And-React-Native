const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const date = require('date-and-time');

const app = require('../app');

const client = require('../db/connectDB');

const justAuthenticate = require('../middlewares/verifyToken');


//Number Of People Who Voted For The Local Govt. Election
app.get('/people/votes/local', justAuthenticate, (req, result) =>
{
    jwt.verify(req.token, 'myscreteisreal', (err, authData) =>
    {
        if (err)
        {
            result.status(403).json({ error: "You're Not Authorized To View This Profile, As You're Not Logged In With Correct Token..." });
        }
        else
        {
            //Check total number of local Govt. votes
            client.query(`SELECT COUNT(*) FROM local_votes`, (loerr, lores) =>
            {
                if (lores.rows[0])
                {
                    result.status(200).json({
                        "local_govt_election_total_vote_number": lores.rows[0].count
                    });
                }

                if (loerr)
                {
                    result.status(500).send('We Encountered An Internal Error, Try Again...');
                } 

                if (!lores.rows[0])
                {
                    console.log('No Vote Count Was Recoreded From Local Govt. Election');
                    result.status(404).send('No Vote Count Was Recoreded From Local Govt. Election');
                }
            });
        }
        
    });
});

//Number Of People Who Voted For The State Election
app.get('/people/votes/state', justAuthenticate, (req, result) =>
{
    jwt.verify(req.token, 'myscreteisreal', (err, authData) =>
    {
        if (err)
        {
            result.status(403).json({ error: "You're Not Authorized To View This Profile, As You're Not Logged In With Correct Token..." });
        }
        else
        {
            //Check total number of state votes
            client.query(`SELECT COUNT(*) FROM state_votes`, (sterr, stres) =>
            {
                if (stres.rows[0])
                {
                    result.status(200).json({
                        "state_election_total_vote_number": stres.rows[0].count
                    });
                }

                if (sterr)
                {
                    result.status(500).send('We Encountered An Internal Error, Try Again...');
                } 

                if (!stres.rows[0])
                {
                    console.log('No Vote Count Was Recoreded From State Election');
                    result.status(404).send('No Vote Count Was Recoreded From State Election');
                }
            });
        }
        
    });
});

//Number Of People Who Voted For The Presidential Election
app.get('/people/votes/country', justAuthenticate, (req, result) =>
{
    jwt.verify(req.token, 'myscreteisreal', (err, authData) =>
    {
        if (err)
        {
            result.status(403).json({ error: "You're Not Authorized To View This Profile, As You're Not Logged In With Correct Token..." });
        }
        else
        {
            //Check total number of presidential votes
            client.query(`SELECT COUNT(*) FROM presidential_votes`, (coerr, cores) =>
            {
                if (cores.rows[0])
                {
                    result.status(200).json({
                        "country_election_total_vote_number": cores.rows[0].count
                    });
                }

                if (coerr)
                {
                    result.status(500).send('We Encountered An Internal Error, Try Again...');
                } 

                if (!cores.rows[0])
                {
                    console.log('No Vote Count Was Recoreded From Presidential Election');
                    result.status(404).send('No Vote Count Was Recoreded From Presidential Election');
                }
            });
        }
        
    });
});

//Check if logged in user has voted for local Govt. election
app.get('/vote/local', justAuthenticate, (req, result) =>
{
    jwt.verify(req.token, 'myscreteisreal', (err, authData) =>
    {
        if (err)
        {
            result.status(403).json({ error: "You're Not Authorized To View This Profile, As You're Not Logged In With Correct Token..." });
        }
        else
        {
            const currentLoggedInEmail = authData.data.email;

            client.query(`SELECT * FROM local_votes WHERE email = '${currentLoggedInEmail}' LIMIT 1`, (lerr, lres) =>
            {
                if (lres.rows[0])
                {
                    result.status(200).json({
                        "fullname": lres.rows[0].fullname,
                        "message": `You voted for ${lres.rows[0].voter_party} as your supported local Govt. political party`,
                        "time": lres.rows[0].reg_time
                    });
                }

                if (lerr)
                {
                    result.status(500).send('We Encountered An Internal Error Getting Local Govt. Vote, Try Again...');
                } 

                if (!lres.rows[0])
                {
                    console.log('You have not voted for your preferred local Govt. party');
                    result.status(404).send('You have not voted for your preferred local Govt. party');
                }
            });
        }
        
    });
});

//For logged in user voting for local Govt. election
app.post('/vote/local', justAuthenticate, (req, response) =>
{
    if (!req.body.email || !req.body.voter_party)
    {
        console.log('Request failed due to all required inputs were not included');
        res.status(500).json({
            "message": 'Request failed due to all required inputs were not included',
            "required inputs": "email, voter_party"
        });
    }
    else
    {
        jwt.verify(req.token, 'myscreteisreal', (err, authData) =>
        {
            if (err)
            {
                response.status(403).json({ error: "You're Not Authorized To View This Profile, As You're Not Logged In With Correct Token..." });
            }
            else
            {
                const currentLoggedInEmail = authData.data.email;
                
                if(currentLoggedInEmail === req.body.email)
                {
                    client.query(`SELECT * FROM users WHERE email ='${req.body.email}'`, (derr, myres) => 
                    {
                        if (derr)
                        {
                            console.log('We Encountered An Issue Proccessing With Our Server');
                            response.status(500).send('We Encountered An Issue Proccessing With Our Server');
                        }
                        
                        if (myres.rows[0])
                        {
                            // Grab data from http request
                            const data = {
                                email: req.body.email,
                                voter_party: req.body.voter_party
                            };

                            //Check if user has voted before
                            client.query(`SELECT * FROM local_votes WHERE email ='${req.body.email}'`, (vberr, vbres) => 
                            {
                                if (vberr)
                                {
                                    console.log('We Encountered An Issue Proccessing With Our Server');
                                    response.status(500).send('We Encountered An Issue Proccessing With Our Server');
                                }

                                if (vbres.rows[0])
                                {
                                    console.log('You have voted for your preferred local Govt. party and can only vote ones');
                                    response.status(400).send('You have voted for your preferred local Govt. party and can only vote ones');
                                }

                                if (!vbres.rows[0])
                                {
                                    const fullname = `${myres.rows[0].firstname+" "+myres.rows[0].lastname}`;

                                    const readDate = new Date();
                                    const currentTimeAndDate = date.format(readDate, 'ddd. hh:mm A, MMM. DD YYYY', true);


                                    const realvalues = [data.email, fullname, data.voter_party, currentTimeAndDate];

                                    client.query('INSERT INTO local_votes (email, fullname, voter_party, reg_time) values($1, $2, $3, $4)', realvalues, (uerr, result) =>
                                    {
                                        if (uerr)
                                        {
                                            console.log('We encountered an issue submitting your local Govt. election vote');
                                            response.status(500).send('We encountered an issue submitting your local Govt. election vote');
                                        }
                                        if (result)
                                        {
                                            console.log('You have successfully voted for your preferred local Govt. election party');
                                            response.status(201).send('You have successfully voted for your preferred local Govt. election party');   
                                        }
                                    });
                                }
                            });
                        }

                        if (!myres.rows[0])
                        {
                            console.log('Email Is Not Registered With Us');
                            response.status(404).send('Email Is Not Registered With Us');
                        }
                    });
                }
                else
                {
                    console.log('You are only allowed to vote with your currently logged in email');
                    response.status(400).send('You are only allowed to vote with your currently logged in email');
                }
            }
        });
    }
});

//Check if logged in user has voted for state election
app.get('/vote/state', justAuthenticate, (req, result) =>
{
    jwt.verify(req.token, 'myscreteisreal', (err, authData) =>
    {
        if (err)
        {
            result.status(403).json({ error: "You're Not Authorized To View This Profile, As You're Not Logged In With Correct Token..." });
        }
        else
        {
            const currentLoggedInEmail = authData.data.email;

            client.query(`SELECT * FROM state_votes WHERE email = '${currentLoggedInEmail}' LIMIT 1`, (sterr, stres) =>
            {
                if (stres.rows[0])
                {
                    result.status(200).json({
                        "fullname": stres.rows[0].fullname,
                        "message": `You voted for ${stres.rows[0].voter_party} as your supported state political party`,
                        "time": stres.rows[0].reg_time
                    });
                }

                if (sterr)
                {
                    result.status(500).send('We Encountered An Internal Error Getting Local Govt. Vote, Try Again...');
                } 

                if (!stres.rows[0])
                {
                    console.log('You have not voted for your preferred local Govt. party');
                    result.status(404).send('You have not voted for your preferred local Govt. party');
                }
            });
        }
        
    });
});

//For logged in user voting for state election
app.post('/vote/state', justAuthenticate, (req, response) =>
{
    if (!req.body.email || !req.body.voter_party)
    {
        console.log('Request failed due to all required inputs were not included');
        res.status(500).json({
            "message": 'Request failed due to all required inputs were not included',
            "required inputs": "email, voter_party"
        });
    }
    else
    {
        jwt.verify(req.token, 'myscreteisreal', (err, authData) =>
        {
            if (err)
            {
                response.status(403).json({ error: "You're Not Authorized To View This Profile, As You're Not Logged In With Correct Token..." });
            }
            else
            {
                const currentLoggedInEmail = authData.data.email;
                
                if(currentLoggedInEmail === req.body.email)
                {
                    client.query(`SELECT * FROM users WHERE email ='${req.body.email}'`, (derr, myres) => 
                    {
                        if (derr)
                        {
                            console.log('We Encountered An Issue Proccessing With Our Server');
                            response.status(500).send('We Encountered An Issue Proccessing With Our Server');
                        }
                        
                        if (myres.rows[0])
                        {
                            // Grab data from http request
                            const data = {
                                email: req.body.email,
                                voter_party: req.body.voter_party
                            };

                            //Check if user has voted before
                            client.query(`SELECT * FROM state_votes WHERE email ='${req.body.email}'`, (vberr, vbres) => 
                            {
                                if (vberr)
                                {
                                    console.log('We Encountered An Issue Proccessing With Our Server');
                                    response.status(500).send('We Encountered An Issue Proccessing With Our Server');
                                }

                                if (vbres.rows[0])
                                {
                                    console.log('You have voted for your preferred state party and can only vote ones');
                                    response.status(400).send('You have voted for your preferred state party and can only vote ones');
                                }

                                if (!vbres.rows[0])
                                {
                                    const fullname = `${myres.rows[0].firstname+" "+myres.rows[0].lastname}`;

                                    const readDate = new Date();
                                    const currentTimeAndDate = date.format(readDate, 'ddd. hh:mm A, MMM. DD YYYY', true);


                                    const realvalues = [data.email, fullname, data.voter_party, currentTimeAndDate];

                                    client.query('INSERT INTO state_votes (email, fullname, voter_party, reg_time) values($1, $2, $3, $4)', realvalues, (uerr, result) =>
                                    {
                                        if (uerr)
                                        {
                                            console.log('We encountered an issue submitting your state election vote');
                                            response.status(500).send('We encountered an issue submitting your state election vote');
                                        }
                                        if (result)
                                        {
                                            console.log('You have successfully voted for your preferred state election party');
                                            response.status(201).send('You have successfully voted for your preferred state election party');   
                                        }
                                    });
                                }
                            });
                        }

                        if (!myres.rows[0])
                        {
                            console.log('Email Is Not Registered With Us');
                            response.status(404).send('Email Is Not Registered With Us');
                        }
                    });
                }
                else
                {
                    console.log('You are only allowed to vote with your currently logged in email');
                    response.status(400).send('You are only allowed to vote with your currently logged in email');
                }
            }
        });
    }
});

//Check if logged in user has voted for presidential election
app.get('/vote/country', justAuthenticate, (req, result) =>
{
    jwt.verify(req.token, 'myscreteisreal', (err, authData) =>
    {
        if (err)
        {
            result.status(403).json({ error: "You're Not Authorized To View This Profile, As You're Not Logged In With Correct Token..." });
        }
        else
        {
            const currentLoggedInEmail = authData.data.email;

            client.query(`SELECT * FROM presidential_votes WHERE email = '${currentLoggedInEmail}' LIMIT 1`, (coerr, cores) =>
            {
                if (cores.rows[0])
                {
                    result.status(200).json({
                        "fullname": cores.rows[0].fullname,
                        "message": `You voted for ${cores.rows[0].voter_party} as your supported presidential political party`,
                        "time": cores.rows[0].reg_time
                    });
                }

                if (coerr)
                {
                    result.status(500).send('We Encountered An Internal Error Getting Presidential Vote, Try Again...');
                } 

                if (!cores.rows[0])
                {
                    console.log('You have not voted for your preferred presidential party');
                    result.status(404).send('You have not voted for your preferred presidential party');
                }
            });
        }
        
    });
});

//For logged in user voting for presidential election
app.post('/vote/country', justAuthenticate, (req, response) =>
{
    if (!req.body.email || !req.body.voter_party)
    {
        console.log('Request failed due to all required inputs were not included');
        res.status(500).json({
            "message": 'Request failed due to all required inputs were not included',
            "required inputs": "email, voter_party"
        });
    }
    else
    {
        jwt.verify(req.token, 'myscreteisreal', (err, authData) =>
        {
            if (err)
            {
                response.status(403).json({ error: "You're Not Authorized To View This Profile, As You're Not Logged In With Correct Token..." });
            }
            else
            {
                const currentLoggedInEmail = authData.data.email;
                
                if(currentLoggedInEmail === req.body.email)
                {
                    client.query(`SELECT * FROM users WHERE email ='${req.body.email}'`, (derr, myres) => 
                    {
                        if (derr)
                        {
                            console.log('We Encountered An Issue Proccessing With Our Server');
                            response.status(500).send('We Encountered An Issue Proccessing With Our Server');
                        }
                        
                        if (myres.rows[0])
                        {
                            // Grab data from http request
                            const data = {
                                email: req.body.email,
                                voter_party: req.body.voter_party
                            };

                            //Check if user has voted before
                            client.query(`SELECT * FROM presidential_votes WHERE email ='${req.body.email}'`, (vberr, vbres) => 
                            {
                                if (vberr)
                                {
                                    console.log('We Encountered An Issue Proccessing With Our Server');
                                    response.status(500).send('We Encountered An Issue Proccessing With Our Server');
                                }

                                if (vbres.rows[0])
                                {
                                    console.log('You have voted for your preferred presidential party and can only vote ones');
                                    response.status(400).send('You have voted for your preferred presidential party and can only vote ones');
                                }

                                if (!vbres.rows[0])
                                {
                                    const fullname = `${myres.rows[0].firstname+" "+myres.rows[0].lastname}`;

                                    const readDate = new Date();
                                    const currentTimeAndDate = date.format(readDate, 'ddd. hh:mm A, MMM. DD YYYY', true);


                                    const realvalues = [data.email, fullname, data.voter_party, currentTimeAndDate];

                                    client.query('INSERT INTO presidential_votes (email, fullname, voter_party, reg_time) values($1, $2, $3, $4)', realvalues, (uerr, result) =>
                                    {
                                        if (uerr)
                                        {
                                            console.log('We encountered an issue submitting your presidential election vote');
                                            response.status(500).send('We encountered an issue submitting your presidential election vote');
                                        }
                                        if (result)
                                        {
                                            console.log('You have successfully voted for your preferred presidential election party');
                                            response.status(201).send('You have successfully voted for your preferred presidential election party');   
                                        }
                                    });
                                }
                            });
                        }

                        if (!myres.rows[0])
                        {
                            console.log('Email Is Not Registered With Us');
                            response.status(404).send('Email Is Not Registered With Us');
                        }
                    });
                }
                else
                {
                    console.log('You are only allowed to vote with your currently logged in email');
                    response.status(400).send('You are only allowed to vote with your currently logged in email');
                }
            }
        });
    }
});


const voteRoute = app;

module.exports = voteRoute;