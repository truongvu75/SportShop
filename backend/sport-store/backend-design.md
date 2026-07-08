sport-store-backend/
│
├── src/main/java/com/sportstore
│
│   ├── SportStoreApplication.java
│   │
│   ├── controller/
│   │   ├── AuthController.java
│   │   ├── ProductController.java
│   │   ├── CategoryController.java
│   │   ├── BrandController.java
│   │   ├── CartController.java
│   │   ├── OrderController.java
│   │   ├── CouponController.java
│   │   ├── WishlistController.java
│   │   ├── RatingController.java
│   │   ├── EmployeeController.java
│   │   ├── CustomerController.java
│   │   ├── ShipperController.java
│   │   ├── ReportController.java
│   │   └── UploadController.java
│   │
│   ├── service/
│   │   ├── AuthService.java
│   │   ├── ProductService.java
│   │   ├── CategoryService.java
│   │   ├── BrandService.java
│   │   ├── CartService.java
│   │   ├── OrderService.java
│   │   ├── CouponService.java
│   │   ├── WishlistService.java
│   │   ├── RatingService.java
│   │   ├── EmployeeService.java
│   │   ├── CustomerService.java
│   │   ├── ShipperService.java
│   │   ├── ReportService.java
│   │   ├── VNPayService.java
│   │   └── EmailService.java
│   │
│   ├── repository/
│   │   ├── AccountRepository.java
│   │   ├── ProductRepository.java
│   │   ├── ProductVariantRepository.java
│   │   ├── CategoryRepository.java
│   │   ├── BrandRepository.java
│   │   ├── CartRepository.java
│   │   ├── OrderRepository.java
│   │   ├── CouponRepository.java
│   │   ├── WishlistRepository.java
│   │   ├── RatingRepository.java
│   │   ├── EmployeeRepository.java
│   │   ├── CustomerRepository.java
│   │   └── ShipperRepository.java
│   │
│   ├── entity/
│   │   ├── Account.java
│   │   ├── Customer.java
│   │   ├── Employee.java
│   │   ├── Product.java
│   │   ├── ProductVariant.java
│   │   ├── Category.java
│   │   ├── Brand.java
│   │   ├── Cart.java
│   │   ├── CartItem.java
│   │   ├── Order.java
│   │   ├── OrderDetail.java
│   │   ├── Coupon.java
│   │   ├── Wishlist.java
│   │   ├── Rating.java
│   │   ├── Shipper.java
│   │   ├── Province.java
│   │   ├── Size.java
│   │   └── Color.java
│   │
│   ├── dto/
│   │   ├── request/
│   │   ├── response/
│   │   └── auth/
│   │
│   ├── security/
│   │   ├── JwtFilter.java
│   │   ├── JwtUtil.java
│   │   ├── SecurityConfig.java
│   │   └── CustomUserDetailsService.java
│   │
│   ├── config/
│   │   ├── SwaggerConfig.java
│   │   ├── CorsConfig.java
│   │   └── VNPayConfig.java
│   │
│   ├── exception/
│   │   ├── GlobalExceptionHandler.java
│   │   ├── ResourceNotFoundException.java
│   │   └── BadRequestException.java
│   │
│   ├── util/
│   │   ├── FileUploadUtil.java
│   │   ├── DateUtil.java
│   │   └── SlugUtil.java
│   │
│   ├── scheduler/
│   │   └── CartReminderScheduler.java
│   │
│   └── constant/
│       ├── RoleConstant.java
│       └── OrderStatusConstant.java
│
├── src/main/resources/
│   ├── application.properties
│   ├── uploads/
│   └── static/
│
├── pom.xml
│
└── README.md