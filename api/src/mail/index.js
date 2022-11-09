const nodemailer = require('nodemailer')
const { EMAIL_ACCOUNT, EMAIL_PASSWORD } = process.env;

const mail = {
    email: EMAIL_ACCOUNT || 'juiranotificaciones@gmail.com',
    pass: EMAIL_PASSWORD || 'iahcnadrjrwrknzz'
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: JSON.parse(process.env.MAILING_CREDENTIALS)
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
    <p>¡<strong>${user.name || 'Ey!'}</strong>.</p>
    <p>Tu registro ha sido exitoso./p>
    <p>Ahora que estás registrado de Juira podrás comprar y vender tus productos de forma fácil, rápida y segura.</p>
    <p>Si tienes alguna duda puedes escribir al correo <a href="juiramarket@gmail.com">juiramarket@gmail.com</a></p>
    `
}

const productoPublicado = (user, product) => {
    return  `
        <p>¡<strong>${user.name || 'Ey!'}</strong>.</p>
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


const ordenCreada = (user, order, products) => {
    return `
        <p>¡<strong>${user.name || 'Ey!'}</strong>, felicidades por tu compra!</p>
        <p>Se ha creado una nueva orden de compra.</p>
        <p>Aquí te mostramos los detalles de tu compra:</p>
        <p><strong>Orden No.</strong> ${order.id}</p>
        <p><strong>Productos:</strong></p>
        <ul>
            ${products.map( p => `<li> 1 ${p.name} x $ ${p.price}</li>`)}
        </ul>
        <p><strong>Total:</strong> ${order.total}</p>
        <p><strong>Status:</strong> ${order.state}</p>
   `
}

const ordenPagada = (user, order, products) => {
    return `
        <p>¡<strong>${user.name || 'Ey!'}</strong>, el estado de compra ha cambiado!</p>

        <p>Aquí te mostramos los detalles de tu orden de compra:</p>
        <p><strong>Orden No.</strong> ${order.id}</p>
        <p><strong>Productos:</strong></p>
        <ul>
            ${products.map( p => `<li> 1 ${p.name} x $ ${p.price}</li>`)}
        </ul>
        <p><strong>Total:</strong> ${order.total}</p>
        <p><strong>Número de confirmación:</strong> ${order.payment_id}</p>
        <p><strong>Status:</strong> ${order.state ? 'Pagado' : 'Pendiente por pagar'}</p>

   `
}

const ordenDespachada = (user, order) => {
    return `
        <p>¡<strong>${user.name || 'Ey!'}</strong>, tu orden ha sido despachada!</p>
        <p>Este mensaje es para informarte que tu orden No. ${order.id} ha sido despachada.</p>
        <p>A continuación te indicamos los datos del envío:</p>
    `
}

const preguntaPublicada = (user, question) => {
    return `
        <p>¡<strong>${user.name || 'Ey!'}</strong>, tienes una nueva pregunta en tu publicación!</p>
        <p>Un usuario preguntó: "${question}"</p>
        <p>Ve a tu perfil para responder.</p>
    `
}

const respuestaPublicada = (user, answer) => {
    return `
        <p><strong>${user.name || 'Ey!'}</strong>, recibiste una respuesta en tu pregunta.</p>
        <p>El vendedor respondió: "${answer}"</p>
    `
}

const productoEnviado = (user) => {
    return `
        <p><strong>${user.name || 'Ey!'}</strong>, tu producto ha sido enviado.</p>
        <p>El vendedor nos ha informado que ya realizó el envío de tu producto. Una vez hayas recibido el producto ve a tu perfil y confirma la recepción del mismo.</p>
    `
}

const productoRecibido = (user) => {
    return `
        <p><strong>${user.name || 'Ey!'}</strong>, </p>
        <p>El comprador ha confirmado que recibió el producto sin novedades. Nuestro equipo se pondrá en contacto contigo para gestionar la liberación de los fondos.</p>
    `
}

const enviarContactoAlVendedor = (buyer, seller) => {
    return `
        <p><strong>${seller.name || 'Ey!'}</strong>, </p>
        <p>Ponte en contacto con tu contraparte para que coordines la entrega de tu producto.</p>
        <p>Email: ${buyer.email}</p>
    `
}

const enviarContactoAlComprador = (buyer, sellers) => {
    return `
    <p><strong>${buyer.name || 'Ey!'}</strong>, </p>
    <p>Ponte en contacto con tu contraparte para que coordines la entrega de tu producto.</p>
    <ul>
     ${sellers.map(e => `<li>Email: ${e.emailAddress}</li>`)}
    </ul>
    `
}

module.exports = {
    sendEmail,
    ordenDespachada,

    ordenCreada,

    ordenPagada,
    productoPublicado,
    bienvenida,
    preguntaPublicada,
    respuestaPublicada,
    productoEnviado,
    productoRecibido,
    enviarContactoAlVendedor,
    enviarContactoAlComprador,
}
