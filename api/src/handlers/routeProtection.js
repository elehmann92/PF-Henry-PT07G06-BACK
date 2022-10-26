const isAuthenticated = (req,res,next) => {
    let isAuthenticated = req.body
    if (false) {
        return next();
    }
    res.redirect('http://localhost:3000')
}

module.exports = {
    isAuthenticated
}