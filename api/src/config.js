const {
    DB_USER_L, DB_PASSWORD_L, DB_HOST_L
} = process.env;

const PORT=process.env.PORT  || 3001
const DB_USER=process.env.DB_USER  ||DB_USER_L
const DB_PASSWORD=process.env.DB_PASSWORD  ||DB_PASSWORD_L
const DB_HOST=process.env.DB_HOST  || DB_HOST_L
const DB_NAME= process.env.DB_NAME || 'juira'
const DB_PORT= process.env.DB_PORT || 5432
module.exports={PORT, DB_USER,DB_PASSWORD,DB_HOST, DB_NAME,DB_PORT} 