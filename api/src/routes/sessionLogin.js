const { Router } = require("express");
const { getRole } = require("../handlers");
const admin = require('firebase-admin');
const {GOOGLE_CREDENTIALS} = require('../config')
const { User, Cart, Favorites, Product } = require("../db");

const serviceAccount = JSON.parse(GOOGLE_CREDENTIALS)

const sessionLoginRouter = Router();

const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://juira-server-auth-default-rtdb.firebaseio.com"
  });

sessionLoginRouter
.post('/', async (req,res) => {
    const {token} = req.body
    
    try {
        const user = await app.auth().verifyIdToken(token)
        const [dbUser, created] = await User.findOrCreate({where:{emailAddress: user.email}})
        if(created)  {
            await dbUser.createCartUser({total: 0}); 
            await dbUser.createFavoritesUser();
            await dbUser.update({status: "active", isAdmin: false})
        } 
        const userWithCart = await User.findOne({where: 
            {emailAddress: user.email},
            include : [{
                model: Cart,
                as: "cartUser",
                include: {
                    model: Product
                }
            },{
                model: Favorites,
                as: "favoritesUser",
                include: {
                    model: Product
                }
            }]
        });
        const role = await getRole(userWithCart.toJSON().emailAddress)
        res.json({role: role, user: userWithCart.toJSON()})
    } catch (error) {
        res.status(401).json({error: error.message})
    }  
});

module.exports = {
    sessionLoginRouter ,
    app
};