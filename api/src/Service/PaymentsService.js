const axios = require("axios")
class PaymentService {
  async createPayment() {

    const items = [
      {
        title: "Iphone 11",
        description: "Teléfono Iphone 11 con 1 año de uso. Excelentes condiciones. En caja original.",
        picture_url: "http://www.vicionet.com/Vel/418-large_default/apple-iphone-11-128gb-.jpg",
        category_id: "Tecnología",
        quantity: 1,
        unit_price: 2000,
      },
      {
        title: "Pelota Adidas",
        description: "Pelota de futbol Adidas usada. Ideal para los niños",
        picture_url: "https://http2.mlstatic.com/D_NQ_NP_818059-MLA32029904978_082019-O.jpg",
        category_id: "Aire Libre",
        quantity: 1,
        unit_price: 1500,
      }
    ]

    const url = "https://api.mercadopago.com/checkout/preferences";

    const body = {
      items,
      back_urls: {
        success: "https://google.com",
        failure: "https://google.com",
        pending: "https://google.com",
      },
      notification_url: "https://pf-henry-pt07g06-back-production.up.railway.app/payment/response",
      
    };

    const payment = await axios.post(url, body, {
      headers: {
        "Content-Type": "aplication/json",
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      },
    });
    return payment.data;
  }
}
module.exports = PaymentService
