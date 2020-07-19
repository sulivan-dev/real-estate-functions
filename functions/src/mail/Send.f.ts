import * as functions from 'firebase-functions'
import * as cors from 'cors'
import * as nodemailer from 'nodemailer'
import * as express from 'express'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '',
    pass: ''
  }
});

const endPointExpress = express();
const corsValue = cors({ origin: true });
endPointExpress.options('*', corsValue);
endPointExpress.use(corsValue);
endPointExpress.use(express.json);

endPointExpress.post('*', (request, response) => {
  const _email = request.body.email;
  const _title = request.body.title;
  const _message = request.body.message;

  const emailOptions = {
    from: 'homes.firebase@gmail.com',
    to: _email,
    subject: _title,
    html: '<p>' + _message + '</p>',
  }

  transporter.sendMail(emailOptions, function(error, info) {
    if (error) {
      response.send(error);
    } else {
      response.send('El correo fue enviado correctamente');
    }
  });
});

exports = module.exports = functions.https.onRequest((request, response) => {
  return endPointExpress(request, response);
});
