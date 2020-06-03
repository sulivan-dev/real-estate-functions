import * as admin from 'firebase-admin'

if (! admin.apps.length) {
    admin.initializeApp();
}

export function validateIfExistToken (tokenRoles: any) {
    return async function (request: any, response: any, next: any) {
        const { authorization } = request.headers;

        if (! authorization) {
            response.status(200);
            response.send({
                status: 'error',
                message: 'No existe token',
            })
            return
        }

        if (! authorization.startsWith('Bearer ')) {
            response.status(200);
            response.send({
                status: 'error',
                message: 'No existe token',
            })
            return
        }

        try {
            const split = authorization.split('Bearer ');

            if (split.length !== 2) {
                response.status(200);
                response.send({
                    status: 'error',
                    message: 'No tiene token en este módulo',
                })
                return
            }

            const token = split[1];
            const decodedToken = await admin.auth().verifyIdToken(token);

            let requestStatus = false;
            tokenRoles.map((role: string) => {
               if (decodedToken[role] === true) {
                   requestStatus = true;
               }
            })

            if (!requestStatus) {
                response.status(200);
                response.send({
                    status: 'error',
                    message: 'No tiene permisos para ejecutar este servicio',
                })
                return
            }

            request.user = decodedToken;
            next();
            return
        }
        catch (e) {
            response.status(200);
            response.send({
                status: 'error',
                message: 'Errores decodificando',
            })
        }
    }
}
