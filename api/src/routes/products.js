const { Router } = require("express");

const router = Router();

router.get("/", (req, res) => {
  res.json("Products route working :D");
});

module.exports = router;
