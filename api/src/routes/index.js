const {Router} = require('express')
const productsRouter = require('./products')

const router = Router();

router.use('/products', productsRouter)

module.exports = router