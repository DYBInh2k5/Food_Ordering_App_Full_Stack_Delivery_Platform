# API Documentation - Food Ordering App

## Base URL
- **Development**: `http://localhost:5000/api/v1`
- **Production**: `https://api.foodapp.com/api/v1`

## Authentication
Sử dụng JWT Token trong header:
```
Authorization: Bearer <token>
```

---

## 1. AUTH ENDPOINTS

### 1.1 User Registration
**POST** `/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe",
  "phone_number": "+84123456789",
  "role": "customer"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "customer",
    "token": "jwt_token"
  }
}
```

### 1.2 User Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "customer"
    },
    "token": "jwt_token"
  }
}
```

### 1.3 Refresh Token
**POST** `/auth/refresh`

**Headers:**
```
Authorization: Bearer <refresh_token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "token": "new_jwt_token"
  }
}
```

### 1.4 Logout
**POST** `/auth/logout`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 2. CUSTOMER ENDPOINTS

### 2.1 Get Customer Profile
**GET** `/customers/profile`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "full_name": "John Doe",
    "email": "john@example.com",
    "phone_number": "+84123456789",
    "rating_average": 4.5,
    "total_orders": 15,
    "default_address_id": "uuid"
  }
}
```

### 2.2 Update Customer Profile
**PUT** `/customers/profile`

**Request Body:**
```json
{
  "full_name": "Jane Doe",
  "phone_number": "+84987654321"
}
```

**Response:** `200 OK`

### 2.3 Get Customer Addresses
**GET** `/customers/addresses`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "street_address": "123 Main St",
      "city": "Ho Chi Minh",
      "district": "District 1",
      "ward": "Ben Nghe",
      "address_type": "home",
      "is_default": true
    }
  ]
}
```

### 2.4 Add Address
**POST** `/customers/addresses`

**Request Body:**
```json
{
  "street_address": "456 Oak Ave",
  "city": "Ho Chi Minh",
  "district": "District 2",
  "ward": "An Phu",
  "latitude": 10.8031,
  "longitude": 106.7669,
  "address_type": "work"
}
```

### 2.5 Update Address
**PUT** `/customers/addresses/:id`

**Request Body:**
```json
{
  "street_address": "789 Pine Rd",
  "is_default": true
}
```

### 2.6 Delete Address
**DELETE** `/customers/addresses/:id`

---

## 3. RESTAURANT ENDPOINTS

### 3.1 Get Restaurant Profile
**GET** `/restaurants/:id`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "restaurant_name": "Pizza Palace",
    "description": "Best pizza in town",
    "logo_url": "url",
    "rating_average": 4.8,
    "delivery_fee": 2.99,
    "min_order_value": 15.00,
    "opening_time": "10:00",
    "closing_time": "23:00",
    "is_verified": true
  }
}
```

### 3.2 Update Restaurant Profile
**PUT** `/restaurants/profile`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "restaurant_name": "Pizza Paradise",
  "description": "Updated description",
  "opening_time": "09:00",
  "closing_time": "00:00"
}
```

### 3.3 Get Restaurant Menu
**GET** `/restaurants/:id/menu`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "restaurant_id": "uuid",
    "categories": [
      {
        "id": "uuid",
        "category_name": "Pizzas",
        "items": [
          {
            "id": "uuid",
            "item_name": "Margherita Pizza",
            "price": 12.99,
            "image_url": "url",
            "is_available": true
          }
        ]
      }
    ]
  }
}
```

### 3.4 Create Menu Item
**POST** `/restaurants/menu-items`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "category_id": "uuid",
  "item_name": "Pepperoni Pizza",
  "description": "Classic pepperoni pizza",
  "price": 13.99,
  "preparation_time": 15
}
```

### 3.5 Update Menu Item
**PUT** `/restaurants/menu-items/:id`

**Request Body:**
```json
{
  "price": 14.99,
  "is_available": false
}
```

### 3.6 Delete Menu Item
**DELETE** `/restaurants/menu-items/:id`

### 3.7 Get Restaurant Orders
**GET** `/restaurants/orders`

**Query Parameters:**
- `status=pending` - Filter by status
- `page=1` - Pagination
- `limit=10` - Items per page

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "uuid",
        "order_number": "ORD-001",
        "customer_name": "John Doe",
        "total_amount": 45.99,
        "status": "pending",
        "created_at": "2024-03-25T10:30:00Z"
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10
    }
  }
}
```

### 3.8 Update Order Status
**PUT** `/restaurants/orders/:id/status`

**Request Body:**
```json
{
  "status": "confirmed"
}
```

**Status Flow:**
- pending → confirmed → preparing → ready → (driver picks up) → on_the_way → delivered

---

## 4. ORDERS ENDPOINTS

### 4.1 Get All Restaurants (for browsing)
**GET** `/restaurants`

**Query Parameters:**
- `search=pizza` - Search by name
- `category=italian` - Filter by category
- `rating=4` - Filter by rating
- `sort=rating` - Sort options: rating, distance, delivery_time
- `page=1`
- `limit=10`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "restaurants": [
      {
        "id": "uuid",
        "name": "Pizza Palace",
        "rating": 4.8,
        "delivery_fee": 2.99,
        "min_order_value": 15.00,
        "is_open": true,
        "logo_url": "url"
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 10
    }
  }
}
```

### 4.2 Get Restaurant Menu Items
**GET** `/restaurants/:id/menu`

**Response:** (See 3.3)

### 4.3 Create Order
**POST** `/orders`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "restaurant_id": "uuid",
  "delivery_address_id": "uuid",
  "items": [
    {
      "menu_item_id": "uuid",
      "quantity": 2,
      "special_instructions": "Extra cheese"
    }
  ],
  "delivery_fee": 2.99,
  "notes": "Please ring the doorbell"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "order_number": "ORD-001",
    "status": "pending",
    "total_amount": 45.99,
    "created_at": "2024-03-25T10:30:00Z"
  }
}
```

### 4.4 Get Customer Orders
**GET** `/orders`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `status=pending` - Filter by status
- `page=1`
- `limit=10`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "uuid",
        "order_number": "ORD-001",
        "restaurant_name": "Pizza Palace",
        "status": "delivering",
        "total_amount": 45.99,
        "created_at": "2024-03-25T10:30:00Z",
        "estimated_delivery": "2024-03-25T11:15:00Z"
      }
    ]
  }
}
```

### 4.5 Get Order Details
**GET** `/orders/:id`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "order_number": "ORD-001",
    "status": "delivering",
    "customer": {
      "name": "John Doe",
      "phone": "+84123456789"
    },
    "restaurant": {
      "name": "Pizza Palace",
      "phone": "+84987654321"
    },
    "driver": {
      "name": "Driver Name",
      "phone": "+84555555555",
      "current_location": {
        "latitude": 10.8031,
        "longitude": 106.7669
      }
    },
    "items": [
      {
        "item_name": "Margherita Pizza",
        "quantity": 2,
        "unit_price": 12.99,
        "total_price": 25.98
      }
    ],
    "total_amount": 45.99,
    "delivery_fee": 2.99,
    "delivery_address": "123 Main St, District 1",
    "created_at": "2024-03-25T10:30:00Z",
    "estimated_delivery": "2024-03-25T11:15:00Z"
  }
}
```

### 4.6 Cancel Order
**POST** `/orders/:id/cancel`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "reason": "Changed my mind"
}
```

**Response:** `200 OK`

### 4.7 Track Order (Real-time)
**GET** `/orders/:id/track`

**WebSocket Event:** `order:location`
```json
{
  "order_id": "uuid",
  "driver_location": {
    "latitude": 10.8031,
    "longitude": 106.7669
  },
  "status": "on_the_way",
  "estimated_arrival": "2024-03-25T11:10:00Z"
}
```

---

## 5. PAYMENT ENDPOINTS

### 5.1 Create Payment Intent
**POST** `/payments/intent`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "order_id": "uuid",
  "amount": 45.99,
  "payment_method": "card"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "client_secret": "pi_1234567890",
    "amount": 4599
  }
}
```

### 5.2 Confirm Payment
**POST** `/payments/confirm`

**Request Body:**
```json
{
  "order_id": "uuid",
  "payment_intent_id": "pi_1234567890"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "payment_id": "uuid",
    "status": "completed",
    "transaction_id": "txn_123456"
  }
}
```

### 5.3 Get Payment Status
**GET** `/payments/:id`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "order_id": "uuid",
    "amount": 45.99,
    "status": "completed",
    "payment_method": "card",
    "transaction_id": "txn_123456",
    "paid_at": "2024-03-25T10:35:00Z"
  }
}
```

---

## 6. DRIVER ENDPOINTS

### 6.1 Get Available Orders
**GET** `/drivers/available-orders`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `latitude=10.8031`
- `longitude=106.7669`
- `radius=5` - km

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "uuid",
        "order_number": "ORD-001",
        "restaurant_name": "Pizza Palace",
        "customer_name": "John Doe",
        "pickup_address": "456 Oak Ave",
        "delivery_address": "123 Main St",
        "distance": 2.5,
        "estimated_time": 30,
        "total_amount": 45.99
      }
    ]
  }
}
```

### 6.2 Accept Order
**POST** `/drivers/orders/:id/accept`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Order accepted"
}
```

### 6.3 Reject Order
**POST** `/drivers/orders/:id/reject`

**Request Body:**
```json
{
  "reason": "Too far"
}
```

### 6.4 Update Delivery Location
**POST** `/drivers/deliveries/:id/location`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "latitude": 10.8040,
  "longitude": 106.7675
}
```

### 6.5 Complete Delivery
**POST** `/drivers/deliveries/:id/complete`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "photo_url": "url"
}
```

---

## 7. REVIEWS ENDPOINTS

### 7.1 Create Review
**POST** `/reviews`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "order_id": "uuid",
  "restaurant_id": "uuid",
  "rating": 5,
  "comment": "Excellent food and fast delivery!",
  "review_type": "restaurant"
}
```

**Response:** `201 Created`

### 7.2 Get Restaurant Reviews
**GET** `/restaurants/:id/reviews`

**Query Parameters:**
- `page=1`
- `limit=10`
- `sort=recent`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": "uuid",
        "customer_name": "John Doe",
        "rating": 5,
        "comment": "Excellent food!",
        "created_at": "2024-03-25T10:30:00Z"
      }
    ],
    "pagination": {
      "total": 156,
      "page": 1,
      "limit": 10
    }
  }
}
```

---

## 8. ERROR RESPONSES

### Standard Error Response
```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Invalid request body",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

### HTTP Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

---

**Ngày cập nhật**: 25/03/2026
**Phiên bản**: 1.0
