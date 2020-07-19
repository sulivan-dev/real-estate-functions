import * as functions from 'firebase-functions'
import * as cors from 'cors'
import * as express from 'express'
import * as admin from 'firebase-admin'
import * as cookieParser from 'cookie-parser'

if (! admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const endPointExpress = express();
const corsValue = cors({ origin: true });
endPointExpress.options('*', corsValue);
endPointExpress.use(corsValue);
endPointExpress.use(cookieParser());

endPointExpress.get('/list', async (request: any, response: any) => {
  const users = db.collection('users');
  const snapshot = await users.get();
  const arrayUsers = snapshot.docs.map(doc => {
    const data = doc.data();
    const id = doc.id;

    return { id, ...data, };
  })

  response.status(200);
  response.json({
    status: 'success',
    data: arrayUsers,
  })
});

exports = module.exports = functions.https.onRequest((request, response) => {
  return endPointExpress(request, response);
})
