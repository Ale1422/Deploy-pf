const { DB_HOST } = process.env;
const { User } = require('../db')
// SDK de Mercado Pago
const mercadopago = require("mercadopago");
const { randomString } = require("./utils/utils");
const { ACCESS_TOKEN, CORS } = process.env;

//Agrega credenciales
mercadopago.configure({
  access_token: ACCESS_TOKEN,
});

const createPreference = async (req, res, next) => {
  const userId = req.user.id;
  let { courtId, courtName, price, startTime, establishmentName } =
    req.body[0];
  const [year, month, day,hour] = startTime.split(',')


  const user = await User.findOne({
    where: { id: userId },
    attributes: ["name", "lastName", "email"]
  })

  let preference = {
    items: [
      {
        id: courtId,
        title: `Turno en ${courtName}-${day}-${month}-${year} `,
        quantity: 1,
        unit_price: price,
        description: startTime
      }
    ],
    payment_methods: {
      excluded_payment_types: [
        { id: "atm" },
        { id: "ticket" }
      ],
      installments: 1,
    },

    payer: {
      name: user.name,
      surname: user.lastName,
      email: user.email
    },
    back_urls: {
      success: CORS,
      failure: CORS,
      pending: CORS
    },
    notification_url: "https://api-pf-booking.herokuapp.com/booking/new",
    statement_descriptor: establishmentName,
    external_reference: randomString(8) + `-${userId}`,
    expires: true
  }
  mercadopago.preferences
    .create(preference)

    .then(function (response) {
      //Este valor reemplazará el string"<%= global.id %>" en tu HTML
      global.id = response.body.id;
      res.send(global.id);
    })
    .catch(function (error) {
      console.log(error);
    });
};

module.exports = { createPreference };