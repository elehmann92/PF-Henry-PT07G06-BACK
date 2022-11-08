const { User } = require("../db");
const {app} = require("../routes/sessionLogin")

const getRole = async (req,res,next) => {
  try {
    const token = req.header("Authorization")
    if(!token) {
      req.role = 'guest';
      return next()
    };
    const user = await app.auth().verifyIdToken(token)
    if (user) {
        const dbUser = await User.findOne({where:{emailAddress: user.email}})
        req.id = dbUser.toJSON().id
        req.role = dbUser.toJSON().isAdmin ? "admin" : "user"
        return next();
    }
  } catch (error) { 
    res.status(error.number || 400).json(error.message)
  }
};

module.exports = {
    getRole
};