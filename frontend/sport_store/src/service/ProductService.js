// src/services/ProductService.js

import productApi from "../api/productApi";

export const ProductService = {

    /**
     * Lấy danh sách sản phẩm
     */
    getAll: async (params) => {

        const response = await productApi.getAllProducts(params);

        // Format dữ liệu trước khi trả cho UI
        response.content = response.content.map(product => ({

            ...product,

            formattedPrice:
                new Intl.NumberFormat("vi-VN").format(
                    product.basePrice
                ) + " đ"

        }));

        return response;
    },

    /**
     * Lấy chi tiết sản phẩm
     */
    getById: async (id) => {

        const product = await productApi.getProductById(id);

        return {

            ...product,

            formattedPrice:
                new Intl.NumberFormat("vi-VN").format(
                    product.basePrice
                ) + " đ"
        };
    },

    /**
     * Thêm sản phẩm
     */
    create: async (productData) => {

        return await productApi.createProduct(productData);
    },

    /**
     * Cập nhật sản phẩm
     */
    update: async (id, productData) => {

        return await productApi.updateProduct(id, productData);
    },

    /**
     * Xóa sản phẩm
     */
    delete: async (id) => {

        return await productApi.deleteProduct(id);
    },

    /**
     * Sản phẩm nổi bật
     */
    getFeatured: async () => {

        return await productApi.getFeaturedProducts();
    }
};