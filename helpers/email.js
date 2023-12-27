import nodemailer from 'nodemailer';

export const emailRegistro = async (datos) =>{
    const {email,nombre,token} = datos;

    const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port:process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    //   informacion del email
    const info = await transport.sendMail({
        from:'"mern - Administrador de proyectos" <cuentas@mern.com>',
        to: email,
        subject: "mern - comprueba tu cuenta",
        text: "comprueba tu cuenta mern",
        html:`
            <p>Hola: ${nombre} comprueba tu cuenta de mern</p>
            <p>tu cuenta ya casi esta lista, solo debes comprobarla en el siguiente enlace </p>
            <a href="${process.env.FRONTEND_URL}/confirmar/${token}">comprobar cuenta </a>
            <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
        `
    })
}

export const emailOlvidePassword = async (datos) =>{
    const {email,nombre,token} = datos;

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port:process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    //   informacion del email
    const info = await transport.sendMail({
        from:'"mern - Administrador de proyectos" <cuentas@mern.com>',
        to: email,
        subject: "mern - Reestablece tu password",
        text: "Reestablece tu password",
        html:`
            <p>Hola: ${nombre} has solicitado reestablecer tu password</p>
            <p>Sigue el siguiente enlace para generar un nuevo pasword </p>
            <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer password</a>
            <p>Si tu no solicitaste este email, puedes ignorar el mensaje</p>
        `
    })
}