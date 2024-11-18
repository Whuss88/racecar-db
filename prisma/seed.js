const prisma = require("../prisma")
const seed = async () => {
  const racecars = []
  for (i=0; i < 15; i++) {
    racecars.push({name: `Car ${i}`, make: `Make ${i}` })
  }
  await prisma.racecar.createMany({data: racecars})
};
seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })