import mysql from 'mysql'
let conPool
const getConnection = () => {
  try {
    !conPool && (conPool = mysql.createPool({
      connectionLimit: 10,
      host: 'localhost',
      user: 'root',
      password: 'rohan296',
      database: 'ekart'
    }))
    return conPool
  } catch (e) {
    console.log(e)
    throw e
  }
}
export default getConnection