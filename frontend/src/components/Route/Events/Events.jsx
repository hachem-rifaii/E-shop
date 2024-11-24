import React, { useEffect } from "react";
import styles from "../../../style/style";
import EventCard from "./EventsCard.jsx";
import { useSelector } from "react-redux";
const Events = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);

  console.log(allEvents);
  return (
    <div>
      {!isLoading && (
        <div className={`${styles.section}`}>
          <div className={`${styles.heading}`}>
            <h1>Popular Events</h1>
          </div>
          <div className="w-full grid">
            {allEvents.length !== 0 && (
              <EventCard data={allEvents && allEvents[0]} />
            )}
            <h4 className={`ml-2  mb-4 font-[16px] `}>{
              allEvents?.length === 0 && (
                "No events found. Please check back later."
              )
              }</h4>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
