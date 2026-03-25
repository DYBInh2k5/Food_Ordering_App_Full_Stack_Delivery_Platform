# Use Case Diagram - Ứng Dụng Gọi Món Ăn

## 1. Sơ Đồ Use Case (Mermaid)

```
graph TB
    subgraph Customers["👤 Khách Hàng"]
        C1["Đăng ký / Đăng nhập"]
        C2["Duyệt nhà hàng"]
        C3["Xem menu"]
        C4["Thêm vào giỏ hàng"]
        C5["Thanh toán"]
        C6["Theo dõi đơn hàng"]
        C7["Đánh giá nhà hàng"]
    end
    
    subgraph Restaurants["🏪 Nhà Hàng"]
        R1["Đăng ký / Đăng nhập"]
        R2["Quản lý menu"]
        R3["Xem đơn hàng"]
        R4["Cập nhật trạng thái"]
        R5["Xem báo cáo"]
    end
    
    subgraph Drivers["🚗 Tài Xế Giao Hàng"]
        D1["Đăng ký / Đăng nhập"]
        D2["Xem danh sách đơn hàng"]
        D3["Nhận đơn hàng"]
        D4["Cập nhật vị trí"]
        D5["Xác nhận giao hàng"]
    end
    
    subgraph System["⚙️ Hệ Thống"]
        S1["Quản lý thanh toán"]
        S2["Gửi thông báo"]
        S3["Theo dõi realtime"]
        S4["Quản lý tài khoản"]
    end
    
    C1 --> S4
    C2 --> S3
    C3 --> S3
    C4 --> S3
    C5 --> S1
    C6 --> S3
    C7 --> S4
    
    R1 --> S4
    R2 --> S4
    R3 --> S2
    R4 --> S3
    R5 --> S4
    
    D1 --> S4
    D2 --> S2
    D3 --> S2
    D4 --> S3
    D5 --> S3
    
    S1 --> S2
    S3 --> S2
```

## 2. Bảng Các Use Case

| Actor | Use Case | Mô Tả |
|-------|----------|-------|
| **Khách Hàng** | Đăng ký | Tạo tài khoản mới |
| | Đăng nhập | Xác thực tài khoản |
| | Duyệt nhà hàng | Xem danh sách nhà hàng có sẵn |
| | Xem menu | Chi tiết sản phẩm từ nhà hàng |
| | Thêm giỏ hàng | Lựa chọn sản phẩm và số lượng |
| | Thanh toán | Chọn phương thức thanh toán và hoàn tất |
| | Theo dõi đơn | Xem trạng thái đơn hàng realtime |
| | Đánh giá | Viết bình luận cho nhà hàng/sản phẩm |
| | Quản lý địa chỉ | Thêm/sửa/xóa địa chỉ giao hàng |
| **Nhà Hàng** | Đăng ký | Tạo tài khoản nhà hàng |
| | Quản lý menu | CRUD sản phẩm |
| | Xem đơn hàng | Danh sách đơn hàng mới |
| | Cập nhật trạng thái | Thay đổi tình trạng đơn hàng |
| | Xem báo cáo | Thống kê doanh thu, đơn hàng |
| | Quản lý giờ mở cửa | Cập nhật thời gian hoạt động |
| **Tài Xế** | Đăng ký | Tạo tài khoản giao hàng |
| | Duyệt đơn hàng | Xem danh sách đơn chờ giao |
| | Nhận đơn | Xác nhận nhận đơn hàng |
| | Cập nhật vị trí | Gửi GPS realtime |
| | Hoàn thành | Xác nhận đã giao |

## 3. Quy Trình Chính

### Quy Trình Đặt Hàng
```
1. Khách Hàng Đăng Nhập
   ↓
2. Duyệt Nhà Hàng / Tìm Kiếm
   ↓
3. Chọn Nhà Hàng → Xem Menu
   ↓
4. Lựa Chọn Sản Phẩm → Thêm Giỏ Hàng
   ↓
5. Xem Giỏ Hàng → Chỉnh Sửa (Tùy Chọn)
   ↓
6. Chọn Địa Chỉ Giao Hàng
   ↓
7. Chọn Phương Thức Thanh Toán
   ↓
8. Xác Nhận Đơn Hàng
   ↓
9. Chờ Nhà Hàng Xác Nhận
   ↓
10. Chờ Tài Xế Nhận + Giao Hàng
   ↓
11. Hoàn Thành & Review
```

---

**Ngày cập nhật**: 25/03/2026
**Phiên bản**: 1.0
