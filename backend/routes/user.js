const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const date = require('date-and-time');

const app = require('../app');

const client = require('../db/connectDB');

const justAuthenticate = require('../middlewares/verifyToken');


//All Users
app.get('/users', (req, result) =>
{
    client.query(`SELECT * FROM users`, (err, res) =>
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
            console.log('No User Has Been Registered');
            result.status(404).send('No User Has Been Registered');
        }
    });
});


//For creating Account
app.post('/register', function (req, response)
{
    if (!req.body.firstname || !req.body.lastname || !req.body.email || !req.body.password || !req.body.gender || !req.body.phone_number || !req.body.state_of_origin || !req.body.local_govt || !req.body.vin)
    {
        console.log('Request failed due to all required inputs were not included');
        res.status(500).json({
            "message": 'Request failed due to all required inputs were not included',
            "required inputs": "firstname, lastname, email, password, gender, phone_number, state_of_origin, local_govt, vin"
        });
    }
    else
    {
        // Grab data from http request
        const data = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: req.body.password,
            gender: req.body.gender,
            phone_number: req.body.phone_number,
            state_of_origin: req.body.state_of_origin,
            local_govt: req.body.local_govt,
            vin: req.body.vin
        };

        client.query(`SELECT email FROM users WHERE email ='${req.body.email}'`, (derr, myres) => 
        {
            if (derr)
            {
                console.log('We Encountered An Issue Proccessing With Our Server');
                response.status(500).send('We Encountered An Issue Proccessing With Our Server');
            }
            
            if (myres.rows[0])
            {
                console.log(req.body.email, "Already Exist");
                response.send(`${req.body.email} Already Exist`);
            }

            if (!myres.rows[0])
            {
                bcrypt.hash(req.body.password, 10, function (error, hash)
                {
                    if (error)
                    {
                        console.log('We Encountered an issue processing your Account');
                        response.status(500).send('We Encountered an issue processing your Account');
                    }
                    
                    const readDate = new Date();
                    const currentTimeAndDate = date.format(readDate, 'ddd. hh:mm A, MMM. DD YYYY', true);


                    const realvalues = [data.firstname, data.lastname, data.email, hash, data.gender, data.phone_number, data.state_of_origin, data.local_govt, data.vin, currentTimeAndDate];

                    client.query('INSERT INTO users (firstname, lastname, email, password, gender, phone_number, state_of_origin, local_govt, vin, reg_time) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', realvalues, (uerr, result) =>
                    {
                        if (uerr)
                        {
                            console.log('We Encountered an issue creating your Account');
                            response.status(500).send('We Encountered an issue creating your Account');
                        }
                        if (result)
                        {
                            client.query(`SELECT * FROM users WHERE email='${data.email}'`, (oerr, ures) =>
                            {
                                if (oerr)
                                {
                                    response.status(201).send(`Error Evaluating Account Created`);
                                }

                                if (ures.rows[0])
                                {
                                    const usersData = {
                                        email: req.body.email,
                                        password: req.body.password
                                    };

                                    jwt.sign({ usersData }, 'myscreteisreal', { expiresIn: '7d' }, (tokenErr, token) =>
                                    {
                                        if (tokenErr)
                                        {
                                            console.log('Token could not be processed but account has been created');
                                            response.status(201).send('Token could not be processed but account has been created');
                                        }

                                        if (token)
                                        {
                                            response.status(201).json({
                                                "status": "success",
                                                "data": {
                                                "message": "User account successfully created",
                                                "token": token,
                                                "userId": ures.rows[0].user_id
                                                }
                                            });
                                        }
                                    });
                                }
                                        
                                if (!ures.rows[0])
                                {
                                    response.status(201).send(`${data.firstname}'s Account Created`);
                                }
                                        
                                console.log(`${data.firstname}'s Account Created`);
                            });
                        }
                    });
                });
            }
        });
    }
});


//For Login
app.post('/login', (req, result) =>
{
    if (!req.body.email || !req.body.password)
    {
        console.log('Request failed due to all required inputs were not included');
        res.status(500).json({
            "message": 'Request failed due to all required inputs were not included',
            "required inputs": "email, password"
        });
    }
    else
    {
        const data = {
            email: req.body.email,
            password: req.body.password
        };

        client.query(`SELECT * FROM users WHERE email ='${req.body.email}' LIMIT 1`, (err, res) =>
        {
            if (res.rows[0])
            {
                const userPasswrd = res.rows[0].password;
                const userId = res.rows[0].user_id;

                bcrypt.compare(data.password, userPasswrd).then((valid) =>
                {
                    if (!valid)
                    {
                        console.log('Incorrect password!');
                        result.status(401).send('Incorrect password!');
                    }

                    if (valid)
                    {
                        jwt.sign({ data }, 'myscreteisreal', { expiresIn: '7d' }, (derr, token) =>
                        {
                            result.json({
                                    "status": "success",
                                    "data": {
                                    "token": token,
                                    "userId": userId
                                }
                            });
                        });
                    }
                });
            }

            if (err)
            {
                result.status(500).send('We Encountered An Internal Error, Try Again...');
            } 

            if (!res.rows[0])
            {
                console.log('Email Is Not Registered With Us');
                result.status(404).send('Email Is Not Registered With Us');
            }
        });
    }
});


//For Viewing Profile
app.get('/profile', justAuthenticate, (req, res) =>
{
    jwt.verify(req.token, 'myscreteisreal', (err, authData) =>
    {
        if (err)
        {
            res.status(403).json({ error: "You're Not Authorized To View This Profile, As You're Not Logged In With Correct Token..." });
        }
        else
        {
            const currentLoggedInEmail = authData.data.email;

            client.query(`SELECT * FROM users WHERE email ='${currentLoggedInEmail}' LIMIT 1`, (errquery, resquery) =>
            {
                if (resquery.rows[0])
                {
                    res.status(200).json({
                        "user_info": {
                            "fullname": `${resquery.rows[0].firstname+" "+resquery.rows[0].lastname}`,
                            "email": currentLoggedInEmail,
                            "gender": `${resquery.rows[0].gender}`,
                            "phone_number": `${resquery.rows[0].phone_number}`,
                            "state_of_origin": `${resquery.rows[0].state_of_origin}`,
                            "local_govt": `${resquery.rows[0].local_govt}`,
                            "vin": `${resquery.rows[0].vin}`
                        }
                    })
                }
                
                if (errquery)
                {
                    res.status(500).send('We Encountered An Internal Error, Try Again...');
                } 

                if (!resquery.rows[0])
                {
                    console.log('Email Is Not Registered With Us');
                    res.status(404).send('Email Is Not Registered With Us');
                }
            });
        }
    });
});


//Update user's basic profile
app.patch('/profile/:id', justAuthenticate, (req, res) =>
{
    jwt.verify(req.token, 'myscreteisreal', (err, authData) =>
    {
        if (err)
        {
            res.status(403).json({ error: "You're Not Authorized To Manage Profile, As You're Not Logged In With Correct Token..." });
        }
        else
        {
            if (!req.body.firstname || !req.body.lastname || !req.body.phone_number)
            {
                console.log('Request failed due to all required inputs were not included');
                res.status(500).json({
                    "message": 'Request failed due to all required inputs were not included',
                    "required inputs": "firstname, lastname, phone_number"
                });
            }
            else
            {
                const currentUserEmail = authData.data.email;

                const userId = req.params.id;

                if (!userId)
                {
                    return res.status(400).send({ error: true, message: 'Please provide an user ID' });
                }
                
                client.query(`SELECT * FROM users WHERE user_id ='${userId}' LIMIT 1`, (getErr, getRes) =>
                {
                    if (getErr)
                    {
                        console.log('We Encountered An Issue Proccessing Your Data');
                        res.status(500).send('We Encountered An Issue Proccessing Your Data');
                    }

                    if (getRes.rows[0])
                    {
                        if (getRes.rows[0].email === currentUserEmail)
                        {
                            client.query(`UPDATE users SET firstname ='${req.body.firstname}', lastname ='${req.body.lastname}', phone_number ='${req.body.phone_number}' WHERE user_id ='${userId}'`, (UpErr, UpRes) =>
                            {
                                if (UpErr)
                                {
                                    console.log('We Encountered An Issue Updating Your Profile');
                                    res.status(500).send('We Encountered An Issue Updating Your Profile');
                                }

                                if (UpRes)
                                {
                                    console.log('Account updated successfully');
                                    res.status(200).send("Account updated successfully")
                                }
                            });
                        }
                        else
                        {
                            console.log(`Sorry You're Not Authorized To Edit This Profile`);
                            res.status(403).send(`Sorry You're Not Authorized To Edit This Profile`);
                        }
                    }

                    if (!getRes.rows[0])
                    {
                        console.log(`User With Such ID Does Not Exists`);
                        res.status(400).send(`User With Such ID Does Not Exists`);
                    }
                });
            }
        }
    });
});


const userRoute = app;

module.exports = userRoute;