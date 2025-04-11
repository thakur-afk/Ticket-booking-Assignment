import React from "react";
import SingleSeat from "../SingleSeat/page";

const DisplaySeats = ({
  seats = [],
  availableSeatsCount = 80,
  bookedSeatsCount = 0,
}) => {
  return (
    <div className=" flex flex-col gap-2 ">
      <div className="grid grid-cols-7 gap-2 w-full max-w-3xl mx-auto">
        {seats.map((seat, i) => (
          <SingleSeat key={seat.id} seat={seat} />
        ))}
      </div>
      <div className=" flex justify-between">
        <h3 className=" bg-green-500 p-2 rounded-lg">
          Available Seat {availableSeatsCount}
        </h3>
        <h3 className="bg-orange-300 p-2 rounded-lg">
          Booked Seat {bookedSeatsCount}
        </h3>
      </div>
    </div>
  );
};

export default DisplaySeats;
