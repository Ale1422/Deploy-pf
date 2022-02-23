const { TUCANCHAYAMAIL, TUCANCHAYAMAILPASS } = process.env;
const ical = require("ical-generator");
const nodemailer = require("nodemailer");



function minutesToHour(min) {
    let newMin = min % 60 ? min % 60 : "00";
    let newHour = (min - newMin) / 60;
  
    return newHour + ":" + newMin;
  }
  function randomString(length) {
    var result = Array(length)
      .fill(0)
      .map((x) => Math.random().toString(32).charAt(2))
      .join("");
    return result;
  }

  function formatBookingsEst(bookings){
    let result = bookings.map(b => {
      return {
        id: b.id,
        details: b.details,
        startTime: b.startTime,
        endTime: b.endTime,
        payment_id: b.payment_id,
        payment_status: b.payment_status,
        courtId: b.court.id,
        courtName: b.court.name,
        courtPrice: b.court.price,
        courtSport: b.court.sport,
        siteName: b.court.site.name,
        establishmentName: b.court.site.establishment.name,
        userName: b.user.name,
        userLastName: b.user.lastName,
      }
    })
    return result
  }

  async function emailSender(userEmail, contentHTML, booking) {
    console.log(userEmail, booking);
    const courtInfo = await Court.findOne({
      where: { id: booking.courtId },
      include: { model: Site },
    });
  console.log(1);
    let transporter = nodemailer.createTransport({
      host: "smtp.mailgun.org",
      port: 587,
      secure: false, // sin SSL
      auth: {
        user: TUCANCHAYAMAIL, // generated ethereal user
        pass: TUCANCHAYAMAILPASS, // generated ethereal password
      },
    });

    console.log(2);
    const calendar = ical({ name: "Tu cancha Ya - Calendar" });
    calendar.createEvent({
      start: booking.startTime ,
      end: booking.endTime,
      summary: `Reserva de cancha ${courtInfo.sport}`,
      description: `${courtInfo.sport}`,
      location: {
        title: ' ',
        address:`${courtInfo.site.street} ${courtInfo.site.streetNumber.toString()} , ${courtInfo.site.city}`,
        geo:{lat: parseFloat(courtInfo.site.latitude), lon: parseFloat(courtInfo.site.longitude)}
      },
      organizer: {
        email: 'tucanchaya@noresponse.com',
        name:"Tu cancha YA!"}
    });
    console.log(3);
    const response = await transporter.sendMail({
      from: "'Tu Cancha YA!' <tucanchaya@noresponse.com>",
      to: userEmail,
      subject: "Codigo de reserva",
      html: contentHTML,
      icalEvent: {
        filename: "reservaCancha.ics",
        method: "request",
        content: calendar.toString(),
      },
    });
    console.log('termine');
  }


  module.exports = {
    randomString,
    minutesToHour,
    formatBookingsEst,
  };
  