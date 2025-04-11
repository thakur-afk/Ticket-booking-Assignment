"use client";
import axios from "axios";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import DisplaySeats from "../DisplaySeats/page";
import SingleSeat from "../SingleSeat/page";

const TicketBookingForm = () => {
  const [numOfSeat, setNumOfSeat] = React.useState(0);
  const [seats, setSeats] = React.useState([]);
  const [availableSeatsCount, setAvailableSeatsCount] = React.useState(80);
  const [bookedSeatsCount, setBookedSeatsCount] = React.useState(0);
  const [recentlyBookedSeats, setRecentlyBookedSeats] = React.useState([]);

  const HandleTicketBooking = async () => {
    const toastId = toast.loading("Ticket booking in progress....");

    try {
      const data = await axios.post("/api/booking", numOfSeat);

      if (data) {
        toast.success(data.data.message || "Seats booked successfully...", {
          id: toastId,
        });
        console.log(data);
        if (data.data.seats) setSeats(data.data.seats);
        setAvailableSeatsCount(data.data.availableSeatsCount);
        setBookedSeatsCount(data.data.bookedSeatsCount);
        setRecentlyBookedSeats(data.data.recentlyBooked);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Can not book the seats", {
        id: toastId,
      });
    }
  };
  const HandleResetData = async () => {
    const toastId = toast.loading("Reseting data in progress....");

    try {
      const data = await axios.put("/api/booking", numOfSeat);

      if (data) {
        toast.success(data.data.message || "Seats reset successfully...", {
          id: toastId,
        });
        console.log(data);
        if (data.data.seats) setSeats(data.data.seats);
        setAvailableSeatsCount(data.data.availableSeatsCount);
        setBookedSeatsCount(data.data.bookedSeatsCount);
        setRecentlyBookedSeats([]);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Can reset the seats", {
        id: toastId,
      });
    }
  };

  const FetchSeatsData = async () => {
    try {
      const data = await axios.get("/api/booking");
      setSeats(data.data.seats);
      setAvailableSeatsCount(data.data.availableSeatsCount);
      setBookedSeatsCount(data.data.bookedSeatsCount);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    FetchSeatsData();
  }, []);

  return (
    <div className="flex  justify-between px-10 py-5 mt-5 gap-10 items-center min-w-[1000px] min-h-[90vh] bg-gray-200 rounded-2xl">
      <DisplaySeats
        seats={seats}
        availableSeatsCount={availableSeatsCount}
        bookedSeatsCount={bookedSeatsCount}
      />

      <div className=" flex flex-col gap-2">
        <div className=" flex  items-center gap-2">
          <p>Book Seats</p>
          <div className=" flex gap-1">
            {recentlyBookedSeats.map((seat) => (
              <SingleSeat key={seat.id} seat={seat} />
            ))}
          </div>
        </div>

        <div className=" flex gap-2 justify-between">
          <input
            className=" border-2 p-1"
            type="number"
            placeholder="enter number"
            // value={numOfSeat}
            onChange={(e) => setNumOfSeat(e.target.value)}
          />
          <button
            onClick={HandleTicketBooking}
            className=" text-sm p-1 text-white bg-green-600  rounded-sm hover:bg-green-500 cursor-pointer"
          >
            Submit
          </button>
        </div>
        <button
          onClick={HandleResetData}
          className=" bg-orange-400 text-white p-1 rounded-lg"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default TicketBookingForm;
