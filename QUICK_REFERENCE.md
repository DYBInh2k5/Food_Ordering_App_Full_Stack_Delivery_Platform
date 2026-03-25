# Quick Reference Guide for Developers

## Getting Started

### 1. Clone the Project
```bash
cd d:\okkkk
```

### 2. Setup Backend
```bash
cd backend
cp .env.example .env
# Edit .env and add your configuration
npm install
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
cp .env.example .env.local
# Edit .env.local and add your configuration
npm install
npm start
```

## Common Commands

### Backend
```bash
npm install          # Install dependencies
npm run dev         # Start development server
npm test            # Run tests
npm run lint        # Check code quality
npm run migrate     # Run database migrations
```

### Frontend
```bash
npm install         # Install dependencies
npm start           # Start development server
npm run build       # Build for production
npm test            # Run tests
npm run eject       # Eject from Create React App (irreversible)
```

## API Endpoints (Blueprint for SPRINT 2)

### Authentication
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Logout user

### Restaurants  
- `GET /api/v1/restaurants` - Get all restaurants
- `GET /api/v1/restaurants/:id` - Get restaurant details
- `GET /api/v1/restaurants/:id/menu` - Get menu items

### Orders
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders` - Get user orders
- `GET /api/v1/orders/:id` - Get order details
- `PUT /api/v1/orders/:id/status` - Update order status
- `POST /api/v1/orders/:id/cancel` - Cancel order

### Payments
- `POST /api/v1/payments/intent` - Create payment intent
- `POST /api/v1/payments/confirm` - Confirm payment
- `GET /api/v1/payments/:id` - Get payment status

### Customers
- `GET /api/v1/customers/profile` - Get profile
- `PUT /api/v1/customers/profile` - Update profile
- `GET /api/v1/customers/addresses` - Get addresses
- `POST /api/v1/customers/addresses` - Add address

### Reviews
- `POST /api/v1/reviews` - Create review
- `GET /api/v1/reviews/restaurants/:id` - Get restaurant reviews

## Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/food-ordering-app
JWT_SECRET=your_secret_key
STRIPE_SECRET_KEY=sk_test_xxx
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)
```env
REACT_APP_API_BASE_URL=http://localhost:5000/api/v1
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_xxx
```

## Database Models (To Implement SPRINT 2)

1. **User** - Authentication & profiles
2. **Customer** - Customer-specific data
3. **Restaurant** - Restaurant profiles
4. **Driver** - Driver profiles
5. **MenuItem** - Menu items
6. **Category** - Food categories
7. **Order** - Customer orders
8. **OrderItem** - Items in orders
9. **Payment** - Payment records
10. **Delivery** - Delivery tracking
11. **Address** - Delivery addresses
12. **Review** - Ratings & reviews

## Project Structure

```
okkkk/
├── backend/
│   ├── src/
│   │   ├── models/       [TODO: Mongoose schemas]
│   │   ├── controllers/  [TODO: Route handlers]
│   │   ├── routes/       [DONE: Stub routes]
│   │   ├── middleware/   [TODO: Custom middleware]
│   │   ├── services/     [TODO: Business logic]
│   │   ├── utils/        [DONE: Helpers]
│   │   ├── database/     [DONE: Connection]
│   │   └── server.js     [DONE: Main server]
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/   [DONE: Header, Footer]
│   │   ├── pages/        [TODO: Page components]
│   │   ├── redux/        [DONE: Store setup]
│   │   ├── services/     [TODO: API calls]
│   │   ├── hooks/        [TODO: Custom hooks]
│   │   ├── utils/        [TODO: Utilities]
│   │   ├── styles/       [DONE: CSS]
│   │   ├── App.jsx       [DONE: Main app]
│   │   └── index.jsx     [DONE: Entry point]
│   ├── .env.example
│   └── package.json
├── docs/
│   └── API_DOCUMENTATION.md
├── REQUIREMENTS.md
├── USE_CASE_DIAGRAM.md
├── DATABASE_SCHEMA.md
├── SETUP_GUIDE.md
├── SPRINT_TRACKER.md
├── SPRINT_1_COMPLETION.md
└── README.md
```

## Key Technologies

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18 | UI Framework |
| State | Redux Toolkit | State Management |
| Styling | Tailwind CSS | CSS Framework |
| Backend | Express.js | Web Framework |
| Database | MongoDB | NoSQL Database |
| Auth | JWT | Authentication |
| Payment | Stripe | Payment Processing |
| Real-time | Socket.io | WebSocket Communication |

## Development Workflow

### For Backend Development
1. Create Mongoose schema in `src/models/`
2. Create controller method in `src/controllers/`
3. Create route in `src/routes/`
4. Test with Postman/Thunder Client
5. Update documentation

### For Frontend Development
1. Create component in `src/components/` or `src/pages/`
2. Add Redux slices if needed in `src/redux/`
3. Create API service in `src/services/`
4. Use Redux hooks for state
5. Add Tailwind CSS classes

## Testing Checklist for SPRINT 2

### Backend Tests
- [ ] User registration
- [ ] User login & JWT generation
- [ ] Protected routes
- [ ] Restaurant CRUD
- [ ] Menu CRUD
- [ ] Order creation
- [ ] Payment intent
- [ ] Error handling

### Frontend Tests
- [ ] Component rendering
- [ ] Redux state management
- [ ] API integration
- [ ] Form validation
- [ ] Navigation
- [ ] Responsive design

## Useful Links

- **API Docs**: [API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)
- **Database Design**: [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md)
- **Setup Guide**: [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **Sprint Progress**: [SPRINT_TRACKER.md](SPRINT_TRACKER.md)

## Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000 | grep LISTEN
kill -9 <PID>
```

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### MongoDB Connection Error
- Check MongoDB is running
- Verify connection string in .env
- Check firewall settings

## Code Standards

### Backend
- Use async/await for async operations
- Wrap routes with asyncHandler
- Return standardized responses
- Use meaningful variable names
- Comment complex logic

### Frontend
- Use functional components
- Use Redux hooks (useSelector, useDispatch)
- Use custom hooks for logic reuse
- Follow component naming conventions
- Document component props

## Performance Tips

### Backend
- Index frequently queried fields
- Use pagination for list endpoints
- Cache static data
- Optimize database queries

### Frontend
- Lazy load components
- Memoize expensive computations
- Optimize bundle size
- Use React DevTools Profiler

---

**Created**: 25 March 2026  
**Version**: 1.0  
**Status**: Ready for SPRINT 2
