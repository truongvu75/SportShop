# API ENDPOINTS

## AUTH

* POST /auth/register
* POST /auth/login
* POST /auth/change-password
* POST /auth/logout
* GET /auth/profile
* POST /auth/refresh-token
* POST /auth/forgot-password
* POST /auth/reset-password

---

## PRODUCT

* GET /products
* GET /products/{id}
* POST /products
* PUT /products/{id}
* DELETE /products/{id}
* PUT /products/{id}/status

---

## PRODUCT VARIANT

* GET /variants/product/{productId}
* GET /variants/{id}
* POST /variants
* PUT /variants/{id}
* DELETE /variants/{id}

---

## CATEGORY

* GET /categories
* GET /categories/{id}
* POST /categories
* PUT /categories/{id}
* DELETE /categories/{id}

---

## BRAND

* GET /brands
* GET /brands/{id}
* POST /brands
* PUT /brands/{id}
* DELETE /brands/{id}

---

## CUSTOMER

* GET /customers

* GET /customers/{id}

* POST /customers

* PUT /customers/{id}

* DELETE /customers/{id}

* GET /customers/profile

* PUT /customers/profile

* GET /customers/addresses

* POST /customers/addresses

* PUT /customers/addresses/{id}

* DELETE /customers/addresses/{id}

---

## EMPLOYEE

* GET /employees
* GET /employees/{id}
* POST /employees
* PUT /employees/{id}
* DELETE /employees/{id}
* PUT /employees/{id}/role

---

## CART

* GET /cart
* GET /cart/count
* POST /cart/items
* PUT /cart/items/{id}
* DELETE /cart/items/{id}
* DELETE /cart/clear
* POST /cart/apply-coupon

---

## ORDER

* POST /orders

* GET /orders

* GET /orders/my-orders

* GET /orders/{id}

* GET /orders/{id}/items

* PUT /orders/{id}/status

* PUT /orders/{id}/confirm

* PUT /orders/{id}/ship

* PUT /orders/{id}/complete

* PUT /orders/{id}/cancel

---

## COUPON

* GET /coupons
* GET /coupons/validate
* POST /coupons
* PUT /coupons/{id}
* DELETE /coupons/{id}

---

## WISHLIST

* GET /wishlist
* POST /wishlist/{productId}
* DELETE /wishlist/{productId}

---

## RATING

* GET /ratings/product/{productId}
* GET /ratings/{id}
* POST /ratings
* PUT /ratings/{id}
* DELETE /ratings/{id}
* POST /ratings/{id}/reply

---

## SHIPPER

* GET /shippers
* GET /shippers/{id}
* POST /shippers
* PUT /shippers/{id}
* DELETE /shippers/{id}

---

## REPORT

* GET /reports/revenue
* GET /reports/orders
* GET /reports/top-products
* GET /reports/customers

---

## PAYMENT

* POST /payment/vnpay/create
* GET /payment/vnpay/callback
* GET /payment/{orderId}/status

---

## UPLOAD

* POST /upload/image
* POST /upload/images

---

## ROLE

* GET /roles
* POST /roles
* PUT /roles/{id}
* DELETE /roles/{id}

---

## NOTIFICATION

* GET /notifications
* PUT /notifications/{id}/read

---

## AI

* POST /ai/cart-reminder
* POST /ai/recommend-products
