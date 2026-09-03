require("temporal-polyfill/full/global");
const { db } = require("../prisma/client.ts");

module.exports = {
  db,
};
