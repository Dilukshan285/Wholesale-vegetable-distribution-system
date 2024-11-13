import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';

export default function InventoryDashboard() {
    const [staffCount, setStaffCount] = useState(0);
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        // Fetch staff count
        const fetchStaffCount = async () => {
            try {
                const response = await axios.get('http://localhost:3001/staff/all-staff');
                setStaffCount(response.data.staffMembers.length);
            } catch (error) {
                console.error('Error fetching staff count:', error);
            }
        };

        fetchStaffCount();
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
            {/* Left div with double width */}
            <div className="bg-white p-4 rounded shadow h-full md:col-span-2 md:row-span-2">
                <h2 className="text-2xl font-bold mb-4 text-green-600">Notifications</h2>
                <p>Notifications for the manager will appear here.</p>
            </div>

            {/* Right side divs */}
            <div className="bg-white p-4 rounded shadow">
                <h2 className="text-xl font-bold mb-4 text-blue-600">Registered Staff Members</h2>
                <p className="text-2xl">{staffCount}</p>
            </div>
            <div className="bg-white p-4 rounded shadow col-span-1 md:col-span-1">
                <h2 className="text-2xl font-bold mb-4">Calendar</h2>
                <Calendar onChange={setDate} value={date} />
            </div>
        </div>
    );
};

