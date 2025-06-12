# Purush Salon Appointment System

A complete web-based appointment booking system for men's salons built with HTML, CSS, JavaScript, and Node.js.

## Features

### Customer Features
- **Modern, Responsive Design**: Clean and professional interface optimized for all devices
- **Service Showcase**: Display of all available services with images and pricing in Indian Rupees
- **Easy Booking**: Simple form to book appointments with date and time selection
- **Real-time Validation**: Form validation to ensure all required information is provided
- **Professional Images**: High-quality stock photos from Pexels featuring men's grooming

### Admin Features
- **Dashboard**: Overview of all appointments with statistics
- **Appointment Management**: View, confirm, or reject appointments
- **Real-time Updates**: Auto-refresh functionality to stay updated
- **Status Tracking**: Track appointment status (pending, confirmed, rejected)

### Services Offered
- Premium Haircut (₹350)
- Classic Shave (₹250)
- Deep Face Cleanse (₹200)
- Head & Shoulder Massage (₹300)
- Beard Styling (₹200)
- Premium Hair Wash (₹150)

## Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js with Express
- **Database**: SQLite for data persistence
- **Styling**: Custom CSS with modern design principles
- **Images**: Pexels stock photos featuring men's grooming

## Installation & Setup

1. **Prerequisites**: Node.js 14 or higher

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run the Application**:
   ```bash
   npm start
   ```

4. **Access the Application**:
   - Customer Interface: http://localhost:8000
   - Admin Panel: http://localhost:8000/admin

## File Structure

```
purush-salon-system/
├── server.js             # Node.js backend server
├── index.html            # Main customer interface
├── admin.html            # Admin panel
├── styles.css            # All styling
├── script.js             # Customer interface JavaScript
├── admin.js              # Admin panel JavaScript
├── package.json          # Project dependencies
├── README.md             # This file
└── salon.db              # SQLite database (created automatically)
```

## Database Schema

The system uses SQLite with the following table structure:

```sql
appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    service TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## API Endpoints

- `GET /api/appointments` - Retrieve all appointments
- `POST /api/book` - Book a new appointment
- `POST /api/confirm` - Confirm an appointment
- `POST /api/reject` - Reject an appointment

## Features in Detail

### Customer Booking Process
1. Browse available services with pricing in Indian Rupees
2. Fill out booking form with personal details
3. Select preferred service, date, and time
4. Submit appointment request
5. Receive confirmation message

### Admin Management
1. View dashboard with appointment statistics
2. Review all appointments with full details
3. Confirm or reject pending appointments
4. Track appointment status changes
5. Auto-refresh for real-time updates

## Design Features

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modern UI**: Clean, professional appearance with smooth animations
- **Color Scheme**: Professional blue and gray palette
- **Typography**: Clear, readable fonts with proper hierarchy
- **Interactive Elements**: Hover effects and smooth transitions
- **Loading States**: Visual feedback during operations

## Security Features

- Input validation on both client and server side
- SQL injection prevention through parameterized queries
- XSS protection through proper data handling
- CORS headers for secure API access

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## Future Enhancements

Potential features for future versions:
- Email notifications for appointment confirmations
- SMS reminders
- Online payment integration
- Staff scheduling
- Customer history tracking
- Loyalty program integration

## Support

For technical support or questions about the system, please refer to the code comments or contact the development team.

## License

This project is open source and available under the MIT License.