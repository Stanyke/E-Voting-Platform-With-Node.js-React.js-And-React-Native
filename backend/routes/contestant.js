const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const date = require('date-and-time');

const app = require('../app');

const client = require('../db/connectDB');

const justAuthenticate = require('../middlewares/verifyToken');


//All Contestants
app.get('/contestant', justAuthenticate, (req, result) =>
{
    jwt.verify(req.token, 'myscreteisreal', (err, authData) =>
    {
        if (err)
        {
            result.status(403).json({ error: "You're Not Authorized To View This Profile, As You're Not Logged In With Correct Token..." });
        }
        else
        {
            client.query(`SELECT * FROM contestants`, (err, res) =>
            {
                if (res.rows[0])
                {
                    result.status(200).send(JSON.stringify(res.rows));
                }

                if (err)
                {
                    result.status(500).send('We Encountered An Internal Error, Try Again...');
                } 

                if (!res.rows[0])
                {
                    console.log('No Contestant Has Been Registered');
                    result.status(404).send('No Contestant Has Been Registered');
                }
            });
        }
    });
});


//For Registering Contestants
app.post('/contestant', justAuthenticate, (req, response) =>
{
    if (!req.body.email || !req.body.party || !req.body.admin)
    {
        console.log('Request failed due to all required inputs were not included');
        res.status(500).json({
            "message": 'Request failed due to all required inputs were not included',
            "required inputs": "email, party, admin"
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
                // Grab data from http request
                const data = {
                    email: req.body.email,
                    party: req.body.party,
                    admin: req.body.admin
                };

                //Admin Pass
                if(data.admin === 'secured')
                {
                    //Check if user has been registered to any party before
                    client.query(`SELECT email FROM contestants WHERE email ='${req.body.email}'`, (aperr, apres) => 
                    {
                        if (aperr)
                        {
                            console.log('We Encountered An Issue Proccessing With Our Server');
                            response.status(500).send('We Encountered An Issue Proccessing With Our Server');
                        }
                        
                        if (apres.rows[0])
                        {
                            console.log(req.body.email, "Already Registered As A Contestant");
                            response.send(`${req.body.email} Already Registered As A Contestant`);
                        }

                        if (!apres.rows[0])
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
                                    const fullname = `${myres.rows[0].firstname+" "+myres.rows[0].lastname}`;
                                    const state = `${myres.rows[0].state_of_origin}`;

                                    const readDate = new Date();
                                    const currentTimeAndDate = date.format(readDate, 'ddd. hh:mm A, MMM. DD YYYY', true);


                                    const realvalues = [data.email, fullname, data.party, state, currentTimeAndDate];

                                    client.query('INSERT INTO contestants (email, fullname, party, state, reg_time) values($1, $2, $3, $4, $5)', realvalues, (uerr, result) =>
                                    {
                                        if (uerr)
                                        {
                                            console.log('We encountered an issue uploading user as contestant');
                                            response.status(500).send('We encountered an issue uploading user as contestant');
                                        }
                                        if (result)
                                        {
                                            console.log('Contestant was successfully created');
                                            response.status(201).send('Contestant was successfully created');   
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
                    });
                }
                else
                {
                    console.log('Admin Pass Was Unsuccessful');
                    response.status(400).send('Admin Pass Was Unsuccessful');
                }
            }
        });
    }
});

const contestantRoute = app;

module.exports = contestantRoute;