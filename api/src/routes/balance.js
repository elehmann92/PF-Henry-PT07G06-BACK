const { Router } = require("express");
const { Cart, Product, Balance } = require("../db");
const { getRole } = require("../handlers/routeProtection");

const router = Router();

router.get('/', getRole, async (req, res) => {
    try {
        const {role} = req
        if(role !== 'admin') throwError('You are not Authorized', 401)
        const balance = await Balance.findByPk('1')
        res.json({total : balance.toJSON().total})
    } catch (error) {
        res.status(400).json(error.message)
    }
});

module.exports = router;

