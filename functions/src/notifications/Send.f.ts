import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as cors from 'cors'
import * as express from 'express'
import * as cookieParser from "cookie-parser"

if (! admin.apps.length) {
  admin.initializeApp();
}

const messaging = admin.messaging();
const endPointExpress = express();
const corsValue = cors({ origin: true });
endPointExpress.options('*', corsValue);
endPointExpress.use(corsValue);
endPointExpress.use(cookieParser());

endPointExpress.post('*', async (request: any, response: any) => {
  try {
    const _notificationToken = request.body.token;
    const options = {
      priority: 'high',
      timeToLive: 60 * 60 * 24,
    }
    const payload = {
      notification: {
        title: 'Saludo desde Home App',
        body: 'Enviando notificación desde Home App',
      },
      data: {
        field1: 'Este es un contenido extra en la notificación',
      }
    }

    if (_notificationToken && _notificationToken.length > 0) {
      const responseMessaging = await messaging.sendToDevice(_notificationToken, payload, options);
      response.status(200);
      response.send({
        status: 'success',
        message: 'La notificación se envio correctamente',
        detail: responseMessaging,
      });
    } else {
      response.status(200);
      response.send({
        status: 'success',
        message: 'Este usuario no tiene token',
      })
    }
  }
  catch (e) {
    response.status(401);
    response.send(e);
  }
});

exports = module.exports = functions.https.onRequest((request, response) => {
  return endPointExpress(request, response);
})
