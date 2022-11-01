const { Router } = require("express");
const { getUsersDb, getUserById } = require("../handlers");
const {
  getRole
} = require("../handlers/routeProtection");

const router = Router();

router
  .get("/", getRole, async (req, res) => {
    try {
      if(req.role !== 'admin'){ throw new Error('You are not an admin')}
      const usersDb = await getUsersDb();
      res.json(usersDb);
    } catch (error) {
      res.status(404).json(error.message);
    }
  })

  .get("/unique", getRole, async (req, res) => {
    const id  = req.id;
    try {
      if(req.role === "guest"){ throw new Error('You are not signed in')}
      const user = await getUserById(id);
      res.json(user);
    } catch (error) {
      res.status(404).json(error.message)
    }
  })

  .get("/:id",getRole, async (req, res) => {
    const {id}  = req.params;
    role = req.role
    try {
      const user = await getUserById(id);
      if(role === 'admin'){
           return res.json(user)
      };

      res.json({
        name: user.name,
        image: user.image,
        rating: user.rating,
        productsOwner: user.productsOwner,
        userReviewed: user.userReviewed
      });
    } catch (error) {
      res.status(404).json(error.message)
    }
  })

  .put("/:id", getRole, async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const role = req.role;
    const idToken = req.id;

    try {
      if (!body || !Object.keys(body).length) {
        throw new Error("No data provided. Nothing to update");
      }

      if(role === 'admin' || parseInt(id) === parseInt(idToken)) {

        const userToUpdate = await getUserById(id);
  
        const updated = userToUpdate.set(body);
        await userToUpdate.save();
  
        return res.status(200).json(updated);
      }
      res.status(401).json('Unauthorized');
    } catch (error) {
      res.status(400).json(error.message);
    }
  });

module.exports = router;
