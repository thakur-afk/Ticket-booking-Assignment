import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { getCombinations } from "@/utils/getCombinations";

const prisma = new PrismaClient();

// Function to calculate distance between two seats (Euclidean)
const distance = (a, b) => {
  return Math.sqrt(Math.pow(a.row - b.row, 2) + Math.pow(a.col - b.col, 2));
};

// Calculate total pairwise distance in a group of seats ==> [a,b,c]=>[a,b],[b,c],[a,c]
const getTotalDistance = (group) => {
  let total = 0;
  for (let i = 0; i < group.length; i++) {
    for (let j = i + 1; j < group.length; j++) {
      total += distance(group[i], group[j]);
    }
  }
  return total;
};

export async function POST(request) {
  try {
    const numOfSeat = await request.json();

    // Validate number of seats
    if (!numOfSeat || numOfSeat < 1 || numOfSeat > 7) {
      console.log(numOfSeat);
      return NextResponse.json(
        {
          success: false,
          message: "Seat range not acceptable",
        },
        { status: 400 }
      );
    }
    // Fetch all available (not booked) seats from DB
    const availableSeat = await prisma.seat.findMany({
      where: { isBooked: false },
      orderBy: { id: "asc" },
    });

    if (availableSeat.length < numOfSeat)
      return NextResponse.json(
        {
          success: false,
          message: "Not engough seats available",
        },
        { status: 400 }
      );

    // First priority: try to find numSeats in a single row
    for (let i = 1; i <= 12; i++) {
      const rowSeats = availableSeat.filter((seat) => seat.row === i);
      for (let j = 0; j <= rowSeats.length - numOfSeat; j++) {
        const group = rowSeats.slice(j, j + numOfSeat);
        if (group.length === numOfSeat) {
          const seatIds = group.map((seat) => seat.id);
          await prisma.seat.updateMany({
            where: { id: { in: seatIds } },
            data: { isBooked: true },
          });
          const seats = await prisma.seat.findMany({ orderBy: { id: "asc" } });
          const availableSeatsCount = await prisma.seat.count({
            where: { isBooked: false },
          });
          const bookedSeatsCount = await prisma.seat.count({
            where: { isBooked: true },
          });
          const recentlyBooked = await prisma.seat.findMany({
            where: { id: { in: seatIds } },
            orderBy: { id: "asc" },
          });

          return NextResponse.json(
            {
              success: true,
              message: "Seats booked successfully",
              recentlyBooked,
              seats,
              availableSeatsCount,
              bookedSeatsCount,
            },
            { status: 200 }
          );
        }
      }
    }

    // nearby data combination
    // to generate all possible combination
    const combos = getCombinations(availableSeat, numOfSeat);
    if (combos.length === 0) {
      return res.status(400).json({ message: "Not enough seats available" });
    }

    //take the closest combination based on min distance (distance between two points)
    let bestCombo = null;
    let minDistance = Infinity;

    for (const combo of combos) {
      const dist = getTotalDistance(combo);
      if (dist < minDistance) {
        minDistance = dist;
        bestCombo = combo;
      }
    }
    // updating the ids in db
    const idsToUpdate = bestCombo.map((seat) => seat.id);
    await prisma.seat.updateMany({
      where: { id: { in: idsToUpdate } },
      data: { isBooked: true },
    });

    const recentlyBooked = await prisma.seat.findMany({
      where: { id: { in: idsToUpdate } },
      orderBy: { id: "asc" },
    });
    const seats = await prisma.seat.findMany({ orderBy: { id: "asc" } });
    const availableSeatsCount = await prisma.seat.count({
      where: { isBooked: false },
    });
    const bookedSeatsCount = await prisma.seat.count({
      where: { isBooked: true },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Seats booked successfully",
        recentlyBooked,
        seats,
        availableSeatsCount,
        bookedSeatsCount,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}

//for reseting the seats
export async function PUT() {
  try {
    await prisma.seat.updateMany({
      data: { isBooked: false },
    });
    const seats = await prisma.seat.findMany({ orderBy: { id: "asc" } });

    return NextResponse.json(
      {
        success: true,
        message: "Data Reset successfuly",
        seats: seats,
        availableSeatsCount: 80,
        bookedSeatsCount: 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message });
  }
}

export async function GET() {
  try {
    const seats = await prisma.seat.findMany({ orderBy: { id: "asc" } });
    const availableSeatsCount = await prisma.seat.count({
      where: { isBooked: false },
    });
    const bookedSeatsCount = await prisma.seat.count({
      where: { isBooked: true },
    });
    return NextResponse.json(
      {
        success: true,
        message: "Data fetched successfuly",
        seats: seats,
        availableSeatsCount,
        bookedSeatsCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
  }
}
