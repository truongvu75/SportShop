# Task: Register Account & Customer Co-creation

This task implements a unified registration process where registering a new user account also automatically creates a corresponding Customer profile.

---

## 🧠 Socratic Gate — Clarifying Questions

To ensure the implementation aligns perfectly with your requirements, please clarify the following points:

1. **Required Fields for Registration**:
   What fields should be required when a new user registers? Currently, only `username` and `password` are sent. To create a `Customer`, we should probably accept:
   - `customerName` (Full Name)
   - `phone`
   - `email`
   - `address` (Optional)
   - `provinceName` (Optional)
   
   Should we make all these fields mandatory, or should we allow registration with just a `username`, `password`, and `customerName`/`email`, leaving others null?

2. **Role Restrictions**:
   Should this registration flow apply exclusively to the `"ROLE_CUSTOMER"` role? What happens if someone registers with `"ROLE_EMPLOYEE"`? Should we restrict public registration to `ROLE_CUSTOMER` only?

3. **Transaction Management & Architecture**:
   To comply with the project guidelines (Layered Architecture: Controller -> Service -> Repository), we should not perform database operations directly inside the `AuthController`.
   Would you like us to create a dedicated `AuthService` class that handles the registration logic inside a `@Transactional` block to ensure both `Account` and `Customer` are saved together atomically?

4. **Input Validation**:
   Would you like to use Java Bean Validation (`@Valid` and annotations like `@NotBlank`, `@Email`, etc.) on the registration request DTO at the controller layer?

---

## 📁 Proposed File List

We plan to create or modify the following files:

### 1. New Files:
- `com.example.demo.dto.request.auth.RegisterRequestDTO.java`: Request DTO capturing the registration parameters (username, password, customerName, email, phone, etc.).
- `com.example.demo.service.AuthService.java`: Service interface for authentication/registration business logic.
- `com.example.demo.service.impl.AuthServiceImpl.java`: Service implementation executing the co-creation within a `@Transactional` boundary.

### 2. Modified Files:
- `com.example.demo.controller.AuthController.java`: Update to use `RegisterRequestDTO`, delegate logic to `AuthService`, and return structured responses.

---

## 🛠️ Step-by-Step Implementation Plan

### Step 1: Create `RegisterRequestDTO.java`
Define a class carrying:
- `username` (NotBlank)
- `password` (NotBlank)
- `customerName` (NotBlank)
- `phone`
- `email` (Email format)
- `address`
- `provinceName`

### Step 2: Create `AuthService` Interface & Implementation
Define a method `void registerCustomer(RegisterRequestDTO request)` in `AuthService`.
In `AuthServiceImpl`:
1. Check if `username` already exists using `AccountRepository.existsByUsername()`. If yes, throw a custom exception or a runtime exception.
2. If `provinceName` is provided, find the `Province` entity using `ProvinceRepository.findById()`.
3. Create and save the `Account` entity:
   - Set `username`, encode `password`, set `isActive = true`, set `role = "CUSTOMER"`.
   - Save the `Account` entity to get the generated `accountId`.
4. Create and save the `Customer` entity:
   - Set `customerName`, `phone`, `email`, `address`, `province`, `isLocked = false`.
   - Set `account = savedAccount`.
   - Save the `Customer` entity.
5. Annotate this method with `@Transactional` so that if saving the Customer fails (e.g., database constraint error), the Account creation is rolled back.

### Step 3: Modify `AuthController.java`
- Inject `AuthService`.
- Refactor the `@PostMapping("/register")` endpoint to accept `@Valid @RequestBody RegisterRequestDTO request`.
- Call `authService.registerCustomer(request)`.
- Return `ResponseEntity.ok("Đăng ký tài khoản thành công!")`.

---

Please review this plan and let us know your feedback!
