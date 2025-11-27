require('dotenv').config();

module.exports = {
  port: process.env.PORT ? Number(process.env.PORT) : 4000,
  mongodbUri: process.env.MONGODB_URI || 'mongodb+srv://diegoyo16lol_db_user:Diego20300827@cluster0.fhom4lj.mongodb.net/RocketOdds?retryWrites=true&w=majority&appName=Cluster0',
  jwtSecret: process.env.JWT_SECRET || 'power_of_friendship'
};
