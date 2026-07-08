# Kế hoạch triển khai Module Order - Sport Store Backend

Hệ thống quản lý đặt hàng (Order) bao gồm các API:
- `POST   /orders` (Tạo đơn đặt hàng từ giỏ hàng hiện tại)
- `GET    /orders` (Danh sách đơn hàng cho admin, có phân trang)
- `GET    /orders/my-orders` (Danh sách đơn hàng của khách hàng hiện tại)
- `GET    /orders/{id}` (Chi tiết đơn hàng)
- `PUT    /orders/{id}/status` (Cập nhật trạng thái đơn hàng - Admin)
- `PUT    /orders/{id}/cancel` (Hủy đơn hàng - Khách hàng)

---

## 🛠️ Danh sách các file cần tạo & sửa đổi

### 1. Model / Constant (Mới)
- `com.example.demo.model.OrderStatusEnum.java` (Enum để quản lý trạng thái đơn hàng: PENDING(1), SHIPPED(2), FINISHED(3), CANCELLED(4))

### 2. Data Transfer Objects (DTO) (Mới)
- `com.example.demo.dto.request.CreateOrderRequestDTO.java` (Thông tin người nhận hàng từ client gửi lên)
- `com.example.demo.dto.request.UpdateOrderStatusRequestDTO.java` (Admin cập nhật trạng thái đơn hàng)
- `com.example.demo.dto.response.OrderDetailResponseDTO.java` (Dữ liệu chi tiết mặt hàng trong đơn hàng trả về)
- `com.example.demo.dto.response.OrderResponseDTO.java` (Dữ liệu đơn hàng trả về cho Client)

### 3. Repository (Cập nhật / Tạo mới)
- `com.example.demo.repository.OrderRepository.java` (Thêm các phương thức truy vấn như `findByCustomerCustomerIDOrderByOrderTimeDesc`)
- `com.example.demo.repository.OrderStatusRepository.java` (Tạo mới để hỗ trợ load thực thể OrderStatus từ DB)

### 4. Service (Mới)
- `com.example.demo.service.OrderService.java` (Interface / Class chứa các nghiệp vụ Order: tạo đơn, trừ kho, xóa giỏ hàng, cập nhật trạng thái)

### 5. Controller (Mới)
- `com.example.demo.controller.OrderController.java` (Cung cấp các REST endpoints cho Order)

---

## 📅 Thứ tự các bước thực hiện

1. **Bước 1**: Tạo Enum `OrderStatusEnum` để đồng bộ các mã trạng thái đơn hàng.
2. **Bước 2**: Tạo mới `OrderStatusRepository` để có thể load đối tượng `OrderStatus` từ DB.
3. **Bước 3**: Tạo các DTO cho Request và Response.
4. **Bước 4**: Thêm query method vào `OrderRepository`.
5. **Bước 5**: Triển khai `OrderService` chứa toàn bộ business logic (bao gồm transactional createOrder trừ stock & clear cart).
6. **Bước 6**: Triển khai `OrderController` để expose các REST API.
7. **Bước 7**: Kiểm tra tính đúng đắn của logic.
