import React, { useEffect, useState } from "react";
import productApi from "../../../api/productApi";
import categoryApi from "../../../api/categoryApi";
import { Link, useSearchParams } from "react-router-dom";

const products1 = [
    {
        id: 1,
        image: "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=600",
        name: "Velocity Nitro Pro-X",
        sku: "VN-PX-001",
        category: "Giày chạy bộ",
        price: 3250000,
        stock: 142,
        status: "IN_STOCK",
    },
    {
        id: 2,
        image: "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=600",
        name: "Aero-Cool Training Tee",
        sku: "AC-TT-204",
        category: "Quần áo tập",
        price: 850000,
        stock: 58,
        status: "LOW_STOCK",
    },
    {
        id: 3,
        image: "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=600",
        name: "NovaTrack Smart Watch V2",
        sku: "NT-SW-V2",
        category: "Thiết bị đeo",
        price: 5400000,
        stock: 0,
        status: "OUT_OF_STOCK",
    },
];



export default function ProductManagement() {

    /**
     * Set màu cho trạng thái sản phẩm
     * @param {*} status 
     * @returns 
     */
    const getStatusBadge = (status) => {
        switch (status) {
            case "IN_STOCK":
                return (
                    <span className="flex items-center gap-2 text-green-600 font-medium">
                        <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                        Còn hàng
                    </span>
                );

            case "LOW_STOCK":
                return (
                    <span className="flex items-center gap-2 text-yellow-600 font-medium">
                        <span className="w-2 h-2 bg-yellow-600 rounded-full"></span>
                        Sắp hết
                    </span>
                );

            default:
                return (
                    <span className="flex items-center gap-2 text-red-600 font-medium">
                        <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                        Hết hàng
                    </span>
                );
        }
    };

    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get('page') || '1', 10);
    const size = parseInt(searchParams.get('size') || '8', 10);
    const selectedCategoryId = searchParams.get('categoryId') ? parseInt(searchParams.get('categoryId', 10)) : null;

    // ====== STATES ======
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [indexProduct, setIndexProduct] = useState({
        first: 1,
        last: 8
    });

    const [categories, setCategories] = useState([]);

    const fetchProducts = (async () => {
        try {
            setLoading(true);

            const params = {
                page: page,
                size: size,
                categoryId: selectedCategoryId
            };

            const response = await productApi.getAllProducts(params);
            const categoryData = await categoryApi.getAll();

            console.log("CategoryID: " + selectedCategoryId);
            setProducts(response.content);
            setTotalElements(response.totalElements);
            setTotalPages(response.totalPages);
            setIndexProduct({
                first: (page - 1) * size + 1,
                last: page * size
            });
            setCategories(categoryData);
            console.log("Nhận dữ liệu thành công!!");
            console.log(`Tổng số phần tử: ${response.totalElements}`);

        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu!!', error);
        } finally {
            setLoading(false);
        }

    });

    useEffect(() => {
        fetchProducts();
    }, [page, size, selectedCategoryId]);

    /**
     * Khởi tạo danh sách các trang trong pagination(Trang đầu&cuối, các trang lân cận page: +- 2)
     */
    const getPaginationItems = () => {
        const items = [];

        items.push(1);

        if (page > 4) {
            items.push("leftDots");
        }

        //Danh sách các trang lân cận
        for (let i = Math.max(2, page - 2); i <= Math.min(totalPages - 1, page + 2); i++) {
            items.push(i);
        }

        if (page < totalPages - 3) {
            items.push("rightDots");
        }

        items.push(totalPages);

        return items;
    };

    /**
     * Hàm xử lý khi click phân trang
     * @param {} newPage 
     * @returns 
     */
    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;

        const newParams = new URLSearchParams(searchParams);
        newParams.set("page", newPage.toString());
        setSearchParams(newParams);

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCategoryChange = (categoryID) => {
        //TODO: Xử lý thêm check categoryID

        const newParams = new URLSearchParams(searchParams);
        newParams.set("categoryId", categoryID.toString());
        newParams.set("page", "1");
        setSearchParams(newParams);

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <main className="p-2 space-y-2">

            {/* Tiêu đề */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Quản lý sản phẩm
                    </h1>

                    <p className="text-gray-500">
                        Hiển thị <b>{indexProduct.first} - {indexProduct.last}</b> trên tổng số <b>{totalElements}</b> sản phẩm
                    </p>
                </div>

                <div className="flex items-center justify-between gap-4">
                    {/* Phần lọc */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase text-[#434656] ml-0.5">
                            Lọc theo loại hàng
                        </label>
                        <select onChange={(e) => handleCategoryChange(e.target.value)} className="bg-white border border-[#c3c5d9] text-xs rounded-lg px-3 py-1 text-[#191c1d] outline-none text-center uppercase">
                            <option value={""}>Tất cả</option>
                            {categories.map(c => (
                                <option key={c.categoryID} value={c.categoryID}>{c.categoryName}</option>
                            ))}
                        </select>
                    </div>

                    {/* Nút Thêm sản phẩm */}
                    <Link to={"/employee/products/add-product"} className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                        <span className="material-symbols-outlined">add_circle</span>
                        Thêm sản phẩm
                    </Link>
                </div>

            </div>

            {/* Bảng sản phẩm */}
            <div className="bg-white rounded-2xl border overflow-hidden shadow-sm">

                <div className="overflow-x-auto">
                    <table className="w-full">

                        <thead className="bg-blue-50 border-b">
                            <tr>
                                <th className="px-2 py-2 text-left">STT</th>
                                <th className="px-6 py-2 text-left">
                                    Hình ảnh
                                </th>

                                <th className="px-6 py-2 text-left">
                                    Sản phẩm
                                </th>

                                <th className="px-6 py-2 text-left">
                                    Danh mục
                                </th>

                                <th className="px-6 py-2 text-left">
                                    Giá
                                </th>

                                <th className="px-6 py-2 text-left">
                                    Đang bán
                                </th>
                                {/* 
                                <th className="px-6 py-2 text-left">
                                    Trạng thái
                                </th> */}

                                <th className="px-6 py-2 text-center">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {products.map((product, index) => (
                                <tr
                                    key={product.productID}
                                    className={`border-b hover:bg-gray-50 ${index % 2 !== 0 ? 'bg-gray-50' : ''}`}
                                >
                                    <td className="px-2 py-2 text-center font-bold">#{(page - 1) * size + index + 1}</td>
                                    <td className="px-6 py-2">
                                        <img
                                            src={product.photo}
                                            alt={product.productName}
                                            className="w-16 h-16 rounded-lg object-cover"
                                        />
                                    </td>

                                    <td className="px-6 py-2">
                                        <p className="font-semibold">
                                            {product.productName}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            Hãng: {product.brand}
                                        </p>
                                    </td>

                                    <td className="px-6 py-2">
                                        {product.category}
                                    </td>

                                    <td className="px-6 py-2 font-semibold text-blue-600">
                                        {product.basePrice.toLocaleString("vi-VN")}₫
                                    </td>

                                    <td className="px-3 py-2">
                                        <p className={`border border-gray-300 rounded-full px-3 py-2 text-white font-bold text-center text-xs shadow-sm ${product.isSelling ? 'bg-green-600' : 'bg-red-600'} `}>{product.isSelling ? 'Đang bán' : 'Tạm ngưng'}</p>
                                    </td>

                                    {/* <td className="px-6 py-2">
                                        {getStatusBadge(product.status)}
                                    </td> */}

                                    <td className="px-6 py-2">
                                        <div className="flex justify-center gap-2">

                                            <button className="p-2 rounded-lg hover:bg-blue-100 hover:text-blue-600 cursor-pointer bg-blue-300">
                                                <span className="material-symbols-outlined">
                                                    edit
                                                </span>
                                            </button>

                                            <button className="p-2 rounded-lg hover:bg-red-700 hover:text-red-600 cursor-pointer bg-red-300" onClick={() => (window.confirm('Bạn có muốn xóa sản phẩm này??'))}>
                                                <span className="material-symbols-outlined">
                                                    delete
                                                </span>
                                            </button>

                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>

            </div>

            <div className="px-6 py-4 border-t flex flex-col md:flex-row items-center justify-center gap-4">

                {console.log(`Loading: ${loading}, Số phần tử: ${totalElements}, Tổng số trang: ${totalPages}`)}

                {!loading && products.length > 0 && totalPages > 1 && (
                    <div className="flex items-center gap-2">

                        <button onClick={() => handlePageChange(page - 1)} disabled={page === 1} className={`w-10 h-10 border rounded-lg flex items-center justify-center ${page === 1 ? 'disabled:opacity-50 text-gray-400 disabled:cursor-not-allowed' : 'font-bold'}`}>
                            <span className="material-symbols-outlined">
                                chevron_left
                            </span>
                        </button>

                        {getPaginationItems().map((item, index) => {
                            if (item === "leftDots" || item === "rightDots") {
                                return (
                                    <span key={item} className="px-2 text-gray-500 font-bold">...</span>
                                );
                            }

                            const isActive = page === item;

                            return (
                                <span key={item}
                                    onClick={() => handlePageChange(item)}
                                    className={`px-2 text-gray-500 w-10 cursor-pointer h-10 items-center rounded-lg font-black justify-center text-xs 
                                        transition-all flex ${isActive ? 'bg-primary text-white' : 'border border-outlined-variant'}`}>{item}</span>
                            );
                        })}

                        <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} className={`w-10 h-10 border rounded-lg flex items-center justify-center ${page === totalPages ? 'disabled:opacity-50 disabled:cursor-not-allowed text-gray-400' : 'font-bold'}`}>
                            <span className="material-symbols-outlined">
                                chevron_right
                            </span>
                        </button>

                    </div>)}
            </div>
        </main>
    );
}