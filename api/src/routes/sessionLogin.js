const { Router } = require("express");
const {getAuth, signInWithEmailAndPassword } = require("firebase/auth");
const { initializeApp } = require("firebase/app");
const { getRole } = require("../handlers");

const router = Router();

const firebaseConfig = {
    apiKey: "AIzaSyBjNyOJoOVqZHo4zSOtthyDp1nBn6K2NWU",
    authDomain: "juira-server-auth.firebaseapp.com",
    projectId: "juira-server-auth",
    storageBucket: "juira-server-auth.appspot.com",
    messagingSenderId: "150763589801",
    appId: "1:150763589801:web:c16f61befbb1ca1f2a99b8"
  };

const app = initializeApp(firebaseConfig)

router
.post('/', async (req,res) => {
    const {emailAddress, password} = req.body
    
    try {
        const auth = getAuth(app)
        const role = await getRole(emailAddress)
        const  {user}  = await signInWithEmailAndPassword(auth, emailAddress, password)
        const idToken = await user.getIdToken()
        res.json({role: role , idToken:idToken})
    } catch (error) {
        res.status(401).json({error: error.message})
    }  
});



module.exports = router;