const nodemailer = require('nodemailer')
const { EMAIL_ACCOUNT, EMAIL_PASSWORD } = process.env;

const mail = {
    email: EMAIL_ACCOUNT || 'juiranotificaciones@gmail.com',
    pass: EMAIL_PASSWORD || 'nvhievuzjgaesoce'
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'juiranotificaciones@gmail.com',
        pass: 'nvhievuzjgaesoce'
    }
})


const sendEmail = async function (user, subject, html) {
    const mailOptions = {
        from: `Juira Market <>${mail.email}`,
        to: user.email,
        subject,
        html
    }
    try {
        const response = await transporter.sendMail(mailOptions)
        console.log('Email sent: ' + response.messageId)
    } catch (error) {
        console.log('Something went wrong. ', error)
    }
    
}

const bienvenida = (user) => {
    return `
    <p>Hola, <strong>${user.name}</strong>.</p>
    <p>Tu registro ha sido exitoso./p>
    <p>Ahora que estás registrado de Juira podrás comprar y vender tus productos de forma fácil, rápida y segura.</p>
    <p>Si tienes alguna duda puedes escribir al correo <a href="juiramarket@gmail.com">juiramarket@gmail.com</a></p>
    `
}

const productoPublicado = (user, product) => {
    return  `
        <p>Hola, <strong>${user.name}</strong>.</p>
        <p>Tu producto <strong>"${product.name}"</strong> ha sido publicado en Juira</p>
        <p>Este mensaje es para notificarte que tu producto ha sido publicado exitosamente y está listo para sacarlo juira. 
        Aquí encontrarás los detalles de tu producto:</p>
        <p><strong>Nombre:</strong> ${product.name}</p>
        <p><strong>Descripción:</strong> ${product.description}</p>
        <p><strong>Estado:</strong> ${product.condition}</p>
        <p><strong>Precio:</strong> $${product.price}</p>
        </p>Por favor no respondas a este mensaje.</p>
        </p>Si necesitas soporte escribe al correo <a href="juiramarket@gmail.com">juiramarket@gmail.com</a></p>
        `
}

const ordenPagada = (user, order) => {
    return `
        <p>¡<strong>${user.name}</strong>, felicidades por tu compra!</p>
        <p>Tu orden ha sido completada con éxito.</p>
        <p>Aquí te mostramos los detalles de tu compra:</p>
        <p><strong>Orden No.</strong> ${order.id}</p>
        <p><strong>Productos:</strong> ${order.products}</p>
        <p><strong>Monto:</strong> ${order.monto}</p>
        <p><strong>Número de confirmación:</strong> ${order.confirmation}</p>
   `
}

const ordenDespachada = (user, order) => {
    return `
        <p>¡<strong>${user.name}</strong>, tu orden ha sido despachada!</p>
        <p>Este mensaje es para informarte que tu orden No. ${order.id} ha sido despachada.</p>
        <p>A continuación te indicamos los datos del envío:</p>
    `
}

module.exports = {
    sendEmail,
    ordenDespachada,
    ordenPagada,
    productoPublicado,
    bienvenida
}
