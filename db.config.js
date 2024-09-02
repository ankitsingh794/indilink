module.exports = {
  HOST: "localhost",
  USER: "techsphere",///techsphere
  PASSWORD: "SIH1757",//SIH1757
  DB: "temp",
  dialect: "mysql",
  charset: "utf8mb4",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
