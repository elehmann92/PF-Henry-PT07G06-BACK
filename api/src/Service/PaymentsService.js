const axios = require("axios")
const {ShoppingOrder, Transaction, Product} = require("../db");

class PaymentService {
  async createPayment(id) {

    const products = await ShoppingOrder.findByPk(id , {include: {
      model: Transaction, 
      as:"transactionList",
      include: {
        model: Product,
        as: "product"
      } 
    }});

    const productsList = products.toJSON().transactionList

    const items = productsList.map( el => {return {
      title: el.product.name,
      quantity: 1,
      unit_price: el.total,
      id: el.productId,
      description : el.product.description,
      currencyId: "ARS",
      picture_url: el.product.image,
    }});


    /*const items = [
      {
        title: "Iphone 11",
        description: "Teléfono Iphone 11 con 1 año de uso. Excelentes condiciones. En caja original.",
        picture_url: "http://www.vicionet.com/Vel/418-large_default/apple-iphone-11-128gb-.jpg",
        category_id: "Tecnología",
        quantity: 1,
        unit_price: 1000,
      },
      {
        title: "Pelota Adidas",
        description: "Pelota de futbol Adidas usada. Ideal para los niños",
        picture_url: "https://http2.mlstatic.com/D_NQ_NP_818059-MLA32029904978_082019-O.jpg",
        category_id: "Aire Libre",
        quantity: 1,
        unit_price: 100,
      }
    ]*/

    const url = "https://api.mercadopago.com/checkout/preferences";

    // const body = {
    //   items,
    //   back_urls: {
    //     success: "https://juira-market-git-production-elehmann92.vercel.app/juira/order",
    //     failure: "https://juira-market-git-production-elehmann92.vercel.app/juira/order",
    //     pending: "https://juira-market-git-production-elehmann92.vercel.app/juira/order",
    //   },
    //   notification_url: "https://pf-henry-pt07g06-back-production.up.railway.app/payment/response",
    //   auto_return: "all",       
    // };
    const body = {
      items,
      back_urls: {
        success: "https://juira-market-git-developmentv2-elehmann92.vercel.app/juira/order",
        failure: "https://juira-market-git-developmentv2-elehmann92.vercel.app/juira/order",
        pending: "https://juira-market-git-developmentv2-elehmann92.vercel.app/juira/order",
      },
      notification_url: "https://pf-henry-pt07g06-back-production.up.railway.app/payment/response",
      auto_return: "all",       
    };

    const payment = await axios.post(url, body, {
      headers: {
        "Content-Type": "aplication/json",
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      },
    });
    return await payment.data;
  }
}
module.exports = PaymentService
