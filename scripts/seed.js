// scripts/seed.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const seats = [];

  for (let i = 0; i < 80; i++) {
    const row = Math.floor(i / 7) + 1;
    const col = (i % 7) + 1;
    seats.push({
      row: row,
      col: col,
      isBooked: false,
    });
  }

  await prisma.seat.createMany({
    data: seats,
  });

  console.log(" 80 seats inserted!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
