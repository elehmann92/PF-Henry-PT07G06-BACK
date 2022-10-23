const axios = require("axios")
class PaymentService {
  async createPayment() {
    const url = "https://api.mercadopago.com/checkout/preferences";

    const body = {
      items: [
        {
          title: "Dummy Title",
          description: "Dummy description",
          picture_url: "http://www.myapp.com/myimage.jpg",
          category_id: "cat123",
          quantity: 1,
          unit_price: 10,
        },
      ],
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
