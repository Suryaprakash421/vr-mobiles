/**
 * This file is a simple re-export of the Prisma singleton.
 * It ensures that all imports of prisma use the same instance.
 */

const prisma = require("./prisma-singleton");

module.exports = prisma;
