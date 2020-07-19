import * as functions from 'firebase-functions'
import * as cors from 'cors'
import * as express from 'express'
import * as admin from 'firebase-admin'
import * as cookieParser from "cookie-parser"
import { validateIfExistToken } from "../security/validateSession";

if (! admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore()
const endPointExpress = express()
const corsValue = cors({ origin: true })
endPointExpress.options('*', corsValue)
endPointExpress.use(corsValue)
endPointExpress.use(cookieParser())

const roles = ['admin', 'operator'];
endPointExpress.use(validateIfExistToken(roles));

endPointExpress.post('*', async (request: any, response: any) => {
  try {
    const _id = request.body.id;
    const _role = request.body.role;
    const _roles = request.body.roles;

    await admin.auth().setCustomUserClaims(_id, _role);
    await db.collection('users')
      .doc(_id)
      .set({
        roles: _roles,
      }, { merge: true });

    response.status(200);
    response.send({
      status: 'success',
    });
  }
  catch (e) {
    response.status(403);
    response.send({
      status: 'error',
      message: e.message,
    });
  }
});

exports = module.exports = functions.https.onRequest((request, response) => {
  return endPointExpress(request, response);
})
