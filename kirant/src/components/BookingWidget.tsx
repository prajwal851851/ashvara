import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "./Button";
import "./BookingWidget.css";

export function BookingWidget() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const checkIn = String(data.get("checkIn") || "");
    const checkOut = String(data.get("checkOut") || "");
    const guests = String(data.get("guests") || "");

    if (!checkIn || !checkOut || !guests) {
      setStatus("error");
      setError("Please complete all fields.");
      return;
    }

    if (checkOut <= checkIn) {
      setStatus("error");
      setError("Check-out must be after check-in.");
      return;
    }

    setError("");
    setStatus("loading");
    window.setTimeout(() => setStatus("success"), 800);
  }

  return (
    <form className="booking" onSubmit={onSubmit} noValidate>
      <div className="booking__field">
        <label htmlFor="checkIn">Check In</label>
        <input id="checkIn" name="checkIn" type="date" required />
      </div>
      <div className="booking__field">
        <label htmlFor="checkOut">Check Out</label>
        <input id="checkOut" name="checkOut" type="date" required />
      </div>
      <div className="booking__field">
        <label htmlFor="guests">Guests</label>
        <select id="guests" name="guests" required defaultValue="">
          <option value="" disabled>
            Select
          </option>
          <option value="1">1 Guest</option>
          <option value="2">2 Guests</option>
          <option value="3">3 Guests</option>
          <option value="4">4 Guests</option>
        </select>
      </div>
      <Button type="submit" variant="filled-strong" loading={status === "loading"}>
        Check Availability
      </Button>
      {status === "error" ? (
        <p className="booking__msg booking__msg--error" role="alert">
          {error}
        </p>
      ) : null}
      {status === "success" ? (
        <p className="booking__msg booking__msg--ok" role="status">
          Rooms available for your dates.
        </p>
      ) : null}
    </form>
  );
}
