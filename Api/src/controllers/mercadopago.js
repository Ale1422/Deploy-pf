const { DB_HOST } = process.env;
const {User}= require('../db')
// SDK de Mercado Pago
const mercadopago = require("mercadopago");
const { randomString } = require("./utils/utils");
const { ACCESS_TOKEN } = process.env;

//Agrega credenciales
mercadopago.configure({
  access_token: ACCESS_TOKEN,
});

const createPreference = async (req, res, next) => {
  const userId = req.user.id;
  let { courtId, courtName, price, startTime, establishmentName} =
    req.body[0];

  const user = await User.findOne({
    where:{id: userId},
    attributes: ["name", "lastName", "email"]
  })


  // console.log('startTime',startTime)
  // console.log('typeof startTime',typeof startTime)

  // startTimeDate = new Date(startTime);
  // console.log('startTimeDate',startTimeDate)
  // endTimeDate = new Date(endTime);
  // const day = startTimeDate.toLocaleDateString().split("/").join("-");

  // console.log('day', day)
  // console.log('typeof day',typeof day)

  // const date =
  //   day +
  //   ", " +
  //   startTimeDate.getHours() +
  //   ":" +
  //   startTimeDate.getMinutes() +
  //   "-" +
  //   endTimeDate.getHours() +
  //   ":" +
  //   endTimeDate.getMinutes();

  let preference={
    items :[
        {
            id : courtId,
            title : `Turno en cancha ${courtName}`,
            quantity: 1,
            unit_price: price,
            description: startTime
        }
    ],
    payment_methods: {
      excluded_payment_types: [
        { id: "atm" },
        { id: "ticket"}
      ],
      installments: 1, 
    },

    payer: {
        name: user.name,
        surname: user.lastName,
        email: user.email
    },
    back_urls: {
      success: "https://localhost:3000",
      failure: "https://localhost:3000",
      pending: "https://localhost:3000"
    },
    notification_url: "https://api-pf-booking.herokuapp.com/booking/new?source_news=webhooks",
    statement_descriptor: establishmentName,
    external_reference: randomString(8)+`-${userId}`,
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