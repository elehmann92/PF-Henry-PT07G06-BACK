import axios from "axios";

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
          quatity: 1,
          unit_price: 10,
        },
      ],
      back_urls: {
        success: "https://www.success.com",
        failure: "http://www.failure.com",
        pending: "http://www.pending.com",
      },
      notifications_url: "https://www.your-site.com/ipn",
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
