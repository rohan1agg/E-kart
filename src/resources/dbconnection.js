import mysql from 'mysql'
import {} from 'dotenv/config'
let conPool
const getConnection = () => {
  try {
    !conPool && (conPool = mysql.createPool({
      connectionLimit: 10,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    }))
    return conPool
  } catch (e) {
    console.log(e)
    throw e
  }
}
export default getConnection