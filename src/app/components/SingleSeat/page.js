import React from "react";

const SingleSeat = ({ seat }) => {
  const isBooked = seat?.isBooked || false;
  return (
    <div
      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
        isBooked ? "bg-orange-300 " : "bg-green-400"
      }`}
    >
      {seat.id}
    </div>
  );
};

export default SingleSeat;
