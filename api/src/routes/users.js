const { Router } = require("express");
const { getUsersDb, getUserById } = require("../handlers");

const router = Router();

router
  .get("/", async (req, res) => {
    try {
      const usersDb = await getUsersDb();
      res.json(usersDb);
    } catch (error) {
      res.status(404).json(error.message);
    }
  })

  .get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const user = await getUserById(id);
      res.json(user);
    } catch (error) {
      res.status(404).json(error.message)
    }
  })

  .put("/:id", async (req, res) => {
    const { id } = req.params;
    const body = req.body;

    try {
      if (!body || !Object.keys(body).length) {
        throw new Error("No data provided. Nothing to update");
      }

      const userToUpdate = await getUserById(id);
      if (!userToUpdate)
        return res.status(404).json("No user matches the provided id");

      const updated = userToUpdate.set(body);
      await userToUpdate.save();

      res.status(200).json(updated);
    } catch (error) {
      res.status(400).json(error.message);
    }
  });

module.exports = router;
