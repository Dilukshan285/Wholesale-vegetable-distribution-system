import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarWidget = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-96 mx-auto">

      <h3 className="text-2xl font-semibold mb-4 text-center text-gray-800">Calendar</h3>
      <Calendar 
        onChange={setDate} 
        value={date} 
        className="rounded-lg shadow-md" // Styling for the calendar
        tileClassName={({ date, view }) => {
          // Add custom styles to the calendar tiles
          if (view === 'month') {
            const isToday = date.toDateString() === new Date().toDateString();
            return isToday ? 'bg-blue-500 text-white rounded-full' : 'hover:bg-gray-200';
          }
          return null;
        }}
      />
      <div className="mt-4 text-center">
        <p className="text-gray-600">Selected Date: {date.toDateString()}</p>
      </div>
    </div>
  );
};

export default CalendarWidget;
