# Yêu Cầu Chức Năng - Ứng Dụng Gọi Món Ăn

## 1. Tổng Quan Hệ Thống

Ứng dụng gọi món ăn là nền tảng kết nối giữa khách hàng, nhà hàng, và dịch vụ giao hàng. Hệ thống cho phép người dùng duyệt menu, đặt hàng, thanh toán và theo dõi đơn hàng.

## 2. Các Tính Năng Chính

### 2.1 Phía Khách Hàng (Customer)
- Đăng nhập / Đăng ký
- Duyệt danh sách nhà hàng
- Xem chi tiết menu và sản phẩm
- Thêm sản phẩm vào giỏ hàng
- Quản lý giỏ hàng (cập nhật, xóa)
- Thanh toán (hỗ trợ nhiều phương thức)
- Xem lịch sử đơn hàng
- Theo dõi trạng thái đơn hàng realtime
- Đánh giá và bình luận nhà hàng / sản phẩm
- Quản lý địa chỉ giao hàng

### 2.2 Phía Nhà Hàng (Restaurant)
- Đăng nhập / Đăng ký
- Quản lý menu (thêm, sửa, xóa sản phẩm)
- Xem đơn hàng mới
- Cập nhật trạng thái đơn hàng
- Xem báo cáo doanh thu
- Quản lý giờ hoạt động
- Quản lý thông tin cửa hàng

### 2.3 Phía Giao Hàng (Driver)
- Đăng nhập / Đăng ký
- Xem danh sách đơn hàng cần giao
- Nhận / Từ chối đơn hàng
- Cập nhật vị trí realtime
- Xem chi tiết sản phẩm cần giao
- Xác nhận giao hàng

### 2.4 Chức Năng Chung
- Hỗ trợ thanh toán online (Stripe, PayPal, ...)
- Thông báo realtime (socket.io)
- Tìm kiếm và lọc nhà hàng / sản phẩm
- Hệ thống xếp hạng và review
- Chat hỗ trợ khách hàng

## 3. Yêu Cầu Kỹ Thuật

### Frontend
- **Framework**: React.js
- **State Management**: Redux / Context API
- **Styling**: Tailwind CSS
- **Real-time**: Socket.io Client
- **Payment**: Stripe.js

### Backend
- **Framework**: Express.js (Node.js)
- **Database**: MongoDB / PostgreSQL
- **Authentication**: JWT
- **Real-time**: Socket.io
- **File Upload**: Multer
- **Email**: Nodemailer

### Deployment
- Frontend: Vercel / Netlify
- Backend: Heroku / Railway / AWS

## 4. Quy Trình Xử Lý Đơn Hàng

```
1. Khách hàng tạo đơn hàng
2. Nhà hàng nhận và xác nhận
3. Nhà hàng chuẩn bị đơn hàng
4. Driver nhận đơn hàng
5. Driver cập nhật vị trí realtime
6. Driver giao hàng
7. Hoàn thành đơn hàng
```

## 5. Mô Hình Dữ Liệu (ERD)

Xem file: `DATABASE_SCHEMA.md`

## 6. API Endpoints

Xem file: `API_DOCUMENTATION.md`

---

**Ngày cập nhật**: 25/03/2026
**Phiên bản**: 1.0
