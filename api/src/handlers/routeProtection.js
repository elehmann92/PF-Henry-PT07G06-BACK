const { User } = require("../db");
const {app} = require("../routes/sessionLogin")

/*const isAuthenticated = async (req,res,next) => {
  try {
    const token = req.header("Authorization")
    const user = await app.auth().verifyIdToken(token)
    if (user) {
        const dbUser = await User.findOne({where:{emailAddress: user.email}})
        req.id = dbUser.toJSON().id
        return next();
    }
  } catch (error) { 
    res.json(error.message)
  }
};*/

/*const onlyAdmin = async (req,res,next) => {
    try {
      const token = req.header("Authorization")
      const user = await app.auth().verifyIdToken(token)
      const dbUser = await User.findOne({where:{emailAddress: user.email}})
      if (!dbUser.toJSON().isAdmin) {
          throw new Error('User is not admin')
      }
      return next();
    } catch (error) {
      res.json(error.message)
    }  
};*/

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
    res.json(error.message)
  }
};

module.exports = {
    getRole
};