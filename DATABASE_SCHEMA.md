# Lược Đồ Cơ Sở Dữ Liệu (Database Schema)

## 1. ER Diagram

```
Users
├── Customers
├── Restaurants
└── Drivers

Restaurants
├── Menu Items
├── Categories
└── Orders

Orders
├── Order Items
├── Payments
├── Deliveries
└── Reviews

Addresses
Categories
Ratings
```

## 2. Chi Tiết Các Bảng

### Users (Người Dùng - Bảng Cơ Sở)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  phone_number VARCHAR(20),
  profile_image_url TEXT,
  role ENUM('customer', 'restaurant', 'driver', 'admin'),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Customers (Khách Hàng)
```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY,
  user_id UUID UNIQUE NOT NULL,
  default_address_id UUID,
  rating_average DECIMAL(3,2),
  total_orders INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (default_address_id) REFERENCES addresses(id)
);
```

### Restaurants (Nhà Hàng)
```sql
CREATE TABLE restaurants (
  id UUID PRIMARY KEY,
  user_id UUID UNIQUE NOT NULL,
  restaurant_name VARCHAR(255) NOT NULL,
  description TEXT,
  logo_url TEXT,
  banner_image_url TEXT,
  address_id UUID NOT NULL,
  phone_number VARCHAR(20),
  rating_average DECIMAL(3,2),
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  opening_time TIME,
  closing_time TIME,
  delivery_fee DECIMAL(10,2),
  min_order_value DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (address_id) REFERENCES addresses(id)
);
```

### Drivers (Tài Xế Giao Hàng)
```sql
CREATE TABLE drivers (
  id UUID PRIMARY KEY,
  user_id UUID UNIQUE NOT NULL,
  license_plate VARCHAR(20),
  vehicle_type VARCHAR(50),
  license_image_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  status ENUM('available', 'busy', 'offline'),
  current_location POINT,
  rating_average DECIMAL(3,2),
  total_deliveries INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Addresses (Địa Chỉ)
```sql
CREATE TABLE addresses (
  id UUID PRIMARY KEY,
  user_id UUID,
  street_address VARCHAR(255) NOT NULL,
  city VARCHAR(100),
  district VARCHAR(100),
  ward VARCHAR(100),
  postal_code VARCHAR(20),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  address_type ENUM('home', 'work', 'other'),
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Categories (Danh Mục Sản Phẩm)
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY,
  restaurant_id UUID NOT NULL,
  category_name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  display_order INT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);
```

### Menu Items (Mục Menu)
```sql
CREATE TABLE menu_items (
  id UUID PRIMARY KEY,
  restaurant_id UUID NOT NULL,
  category_id UUID NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  preparation_time INT,
  display_order INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);
```

### Orders (Đơn Hàng)
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  customer_id UUID NOT NULL,
  restaurant_id UUID NOT NULL,
  driver_id UUID,
  delivery_address_id UUID NOT NULL,
  order_number VARCHAR(50) UNIQUE,
  status ENUM('pending', 'confirmed', 'preparing', 'ready', 'on_the_way', 'delivered', 'cancelled'),
  total_amount DECIMAL(10,2),
  delivery_fee DECIMAL(10,2),
  discount_amount DECIMAL(10,2) DEFAULT 0,
  final_amount DECIMAL(10,2),
  payment_method VARCHAR(50),
  notes TEXT,
  expected_delivery_time TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
  FOREIGN KEY (driver_id) REFERENCES drivers(id),
  FOREIGN KEY (delivery_address_id) REFERENCES addresses(id)
);
```

### Order Items (Chi Tiết Đơn Hàng)
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY,
  order_id UUID NOT NULL,
  menu_item_id UUID NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2),
  total_price DECIMAL(10,2),
  special_instructions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);
```

### Payments (Thanh Toán)
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY,
  order_id UUID UNIQUE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50),
  transaction_id VARCHAR(255),
  status ENUM('pending', 'completed', 'failed', 'refunded'),
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
```

### Deliveries (Giao Hàng)
```sql
CREATE TABLE deliveries (
  id UUID PRIMARY KEY,
  order_id UUID UNIQUE NOT NULL,
  driver_id UUID NOT NULL,
  pickup_time TIMESTAMP,
  delivery_time TIMESTAMP,
  current_latitude DECIMAL(10,8),
  current_longitude DECIMAL(11,8),
  status ENUM('accepted', 'picked_up', 'on_the_way', 'delivered', 'failed'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (driver_id) REFERENCES drivers(id)
);
```

### Reviews (Đánh Giá)
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY,
  order_id UUID,
  customer_id UUID NOT NULL,
  restaurant_id UUID,
  menu_item_id UUID,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  review_type ENUM('restaurant', 'food', 'delivery'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
);
```

## 3. Indexes (Chỉ Mục Hiệu Năng)

```sql
-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Orders
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_restaurant_id ON orders(restaurant_id);
CREATE INDEX idx_orders_driver_id ON orders(driver_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- Menu Items
CREATE INDEX idx_menu_items_restaurant_id ON menu_items(restaurant_id);
CREATE INDEX idx_menu_items_category_id ON menu_items(category_id);

-- Addresses
CREATE INDEX idx_addresses_user_id ON addresses(user_id);

-- Reviews
CREATE INDEX idx_reviews_restaurant_id ON reviews(restaurant_id);
CREATE INDEX idx_reviews_customer_id ON reviews(customer_id);
```

---

**Ngày cập nhật**: 25/03/2026
**Phiên bản**: 1.0
