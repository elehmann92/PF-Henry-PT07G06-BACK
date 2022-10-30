const admin = require('firebase-admin');
const serviceAccount = require("../../serviceAccountKey.json");
const { User } = require("../db");

const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://juira-server-auth-default-rtdb.firebaseio.com"
  });

const isAuthenticated = async (req,res,next) => {
  try {
    const token = req.header("Authorization")
    const user = await app.auth().verifyIdToken(token)
    if (user) {
        return next();
    }
    res.redirect('https://juira-market-git-production-elehmann92.vercel.app/juira/login')
  } catch {
    res.redirect('https://juira-market-git-production-elehmann92.vercel.app/juira/login')
  }
};

const onlyAdmin = async (req,res,next) => {
    try {
      const token = req.header("Authorization")
      const user = await app.auth().verifyIdToken(token)
      const dbUser = await User.findOne({where:{emailAddress: user.email}})
      if (dbUser.toJSON().isAdmin) {
          return next();
      }
      res.redirect('https://juira-market-git-production-elehmann92.vercel.app/juira/login')
    } catch {
      res.redirect('https://juira-market-git-production-elehmann92.vercel.app/juira/login')
    }  
};

module.exports = {
    isAuthenticated,
    onlyAdmin
};