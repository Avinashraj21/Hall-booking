const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// In-memory data storage
let rooms = [];
let bookings = [];

// 1. Create a Room
app.post('/rooms', (req, res) => {
    const { seats, amenities, price } = req.body;
    const roomId = rooms.length + 1;
    const newRoom = { roomId, seats, amenities, price };
    rooms.push(newRoom);
    res.status(201).json(newRoom);
});

// 2. Booking a Room
app.post('/bookings', (req, res) => {
    const { customerName, date, startTime, endTime, roomId } = req.body;
    const bookingId = bookings.length + 1;
    const booking = { bookingId, customerName, date, startTime, endTime, roomId };
    bookings.push(booking);
    res.status(201).json(booking);
});

// 3. List all Rooms with Booked Data
app.get('/rooms', (req, res) => {
    const roomData = rooms.map(room => {
        const booking = bookings.find(b => b.roomId === room.roomId);
        return {
            roomId: room.roomId,
            seats: room.seats,
            amenities: room.amenities,
            price: room.price,
            booked: !!booking,
            customerName: booking ? booking.customerName : null,
            date: booking ? booking.date : null,
            startTime: booking ? booking.startTime : null,
            endTime: booking ? booking.endTime : null
        };
    });
    res.json(roomData);
});

// 4. List all Customers with Booked Data
app.get('/customers', (req, res) => {
    const customerData = bookings.map(booking => {
        const room = rooms.find(r => r.roomId === booking.roomId);
        return {
            customerName: booking.customerName,
            roomName: `Room ${room.roomId}`,
            date: booking.date,
            startTime: booking.startTime,
            endTime: booking.endTime,
        };
    });
    res.json(customerData);
});

// 5. List how many times a customer has booked a room
app.get('/customer-bookings/:customerName', (req, res) => {
    const customerName = req.params.customerName;
    const customerBookings = bookings.filter(b => b.customerName === customerName);
    const roomBookings = customerBookings.map(booking => {
        const room = rooms.find(r => r.roomId === booking.roomId);
        return {
            customerName: booking.customerName,
            roomName: `Room ${room.roomId}`,
            date: booking.date,
            startTime: booking.startTime,
            endTime: booking.endTime,
            bookingId: booking.bookingId,
            bookingDate: new Date()
        };
    });
    res.json({ count: roomBookings.length, bookings: roomBookings });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
