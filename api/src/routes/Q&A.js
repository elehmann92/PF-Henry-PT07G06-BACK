const { Router } = require("express");

const { QandA, Product, User } = require("../db");
const { getInstanceById, throwError } = require("../handlers");
const { getRole } = require("../handlers/routeProtection");

const { 
  sendEmail,
  preguntaPublicada,
  respuestaPublicada,
 } = require("../mail/index");

// const user = {
// name: 'Usuario',
// email: 'juiraMarket@gmail.com' //para probar, estos datos deberian obtenerse desde la db
// } 

const router = Router();

router
  .get("/", async (req, res) => {
    const {productQAndAId} = req.query
    let where = {}
    try {
      if (productQAndAId) {
        where = {
          productQAndAId,
        }
      }
      const qA = await QandA.findAll({ order: ["id"] , where, include:{
        model: Product,
        as: "productQAndA"
      }});

      return res.status(200).json(qA);
    } catch (error) {
      return res.status(404).json(error.message);
    }
  })

  .get("/byToken",getRole, async (req,res) => {
    const {role, id} = req
    try {
      if (role === 'guest') throwError('You are not signed in', 401)
      const qAndAs = await QandA.findAll({include:{
        model: Product,
        as: "productQAndA"
      }})

      const asAsker = qAndAs.filter(ele => ele.askerId === id);
      const asOwner = qAndAs.filter(ele => ele.productQAndA?.ownerId === id);
    
      res.json({
        userQAndAs: {
          asAsker,
          asOwner,
        },
      });
    } catch (error) {
      res.status(error.number || 400).json(error.message);
    }
  })

  .get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const qAndABlock = await QandA.findByPk(id, {
        include: {
          model: Product,
          as: "productQAndA",
        },
      });
      res.json(qAndABlock);
    } catch (error) {
      res.status(400).json(error.message);
    }
  })

  .post("/", getRole,async (req, res) => {
    const { question, productQAndAId } = req.body;
    const {role, id} = req
    try {
      if (role === 'guest') throwError('You are not signed in', 401)
      if (!question || !productQAndAId) throwError("No question or product id where received", 400);

      const newQAndABlock = await QandA.create({
        question,
      });

      await newQAndABlock.setAsker(id);
      await newQAndABlock.setProductQAndA(productQAndAId);

      const productWithUserInfo = (await Product.findByPk(productQAndAId, {
        include: { model: User, as: "owner" },
      })).toJSON();

      console.log(productWithUserInfo)
      // Esto devuelve así:
      // {
      //   id: 1,
      //   name: 'Iphone 11',
      //   price: 100000,
      //   description: 'Teléfono Iphone 11 con 1 año de uso. Excelentes condiciones. En caja original.',
      //   condition: 'Como nuevo',
      //   image: 'http://www.vicionet.com/Vel/418-large_default/apple-iphone-11-128gb-.jpg',
      //   status: 'Publicado',
      //   ownerId: 1,
      //   owner: {
      //     id: 1,
      //     name: 'elehmann92',
      //     image: '',
      //     emailAddress: 'equilehmann92@gmail.com',
      //     homeAddress: 'Yerbal 2333',
      //     region: 'Capital Federal',
      //     city: 'Buenos Aires',
      //     phoneNumber: '5491155790833',
      //     lastTransaction: 'elehmann92-0',
      //     status: 'active',
      //     isAdmin: true,
      //     rating: null
      //   }
      // }

      // **PENDIENTE** -> DESPACHAR MAIL AL OWNER AVISANDO QUE LE PREGUNTARON
      const user = {
        name: productWithUserInfo.owner.name ? productWithUserInfo.owner.name : productWithUserInfo.owner.emailAddress, //en caso de que no haya nombre registrado, usar el mail como nombre
        email: productWithUserInfo.owner.emailAddress,
      }
      const html = preguntaPublicada(user, question)
      await sendEmail(user, `Tienes una nueva pregunta sobre tu producto ${productWithUserInfo.description}`, html)

      res.json(newQAndABlock);
    } catch (error) {
      res.status(error.number || 400).json(error.message);
    }
  })

  .put("/updateAnswer/:qAndABlockId", getRole,async (req, res) => {
    const { qAndABlockId } = req.params;
    const { answer } = req.body;
    const {role, id} = req
    try {
      if (role === "guest") throwError("You are not signed in", 401);
      if (!answer) throwError("Update failed. No answer text was received", 400);
      const qAndABlock = await QandA.findByPk(qAndABlockId, {
        include: { model: Product, as: "productQAndA" },
      });
      if (role === 'user' && parseInt(id) !== qAndABlock.toJSON()?.productQAndA?.ownerId)
        throwError(
          "You can not update answers to questions which you do not own",
          401
        );
      const updated = await qAndABlock.update({ answer });

      const userAsker = (await User.findByPk(qAndABlock.askerId)).toJSON()

      // Esto devuelve así:
      // {
      //   id: 9,
      //   name: null,
      //   image: null,
      //   emailAddress: 'prueba@1234.com',
      //   homeAddress: null,
      //   region: null,
      //   city: null,
      //   phoneNumber: null,
      //   lastTransaction: null,
      //   status: 'active',
      //   isAdmin: false,
      //   rating: null
      // }

      // **PENDIENTE** -> DESPACHAR MAIL AL ASKER AVISANDO QUE LE CONTESTARON
      const user = {
        name: userAsker.name ? userAsker.name : userAsker.emailAddress,
        email: userAsker.emailAddress
      }
      const html = respuestaPublicada(user, answer)
      await sendEmail(user, 'Respondieron tu pregunta', html)

      res.json(updated);
    } catch (error) {
      res.status(error.number || 400).json(error.message);
    }
  });
module.exports = router;
