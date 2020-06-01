const justAuthenticate = isAuthenticated = (req, res, next) =>
{
    if (typeof req.headers.authorization !== "undefined")
    {
        const token = req.headers.authorization.split(" ")[1];
        
        req.token = token;
        
        return next();
    }
    
        res.status(403).json({ error: "You're Not Authorized, As You're Not Logged In..." });
};

module.exports = justAuthenticate;