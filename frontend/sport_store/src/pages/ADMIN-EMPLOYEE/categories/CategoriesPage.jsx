import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import categoryApi from "../../../api/categoryApi";


export default function CategoryManagement() {
    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc muốn xóa loại hàng này?")) {
            console.log("Delete:", id);
        }
    };

    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get('page') || '1', 10);
    const size = parseInt(searchParams.get('size') || '8', 10);

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);

    const fetchCategories = (async () => {
        try {
            setLoading(true);
            const params = {
                page: page,
                size: size
            };

            const response = await categoryApi.getAllCategories(params);
            setCategories(response.content);
            setTotalElements(response.totalElements);
            setTotalPages(response.totalPages);

            console.log("Nhận dữ liệu Category thành công!!");
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu category!!", error);
        } finally {
            setLoading(false);
        }
    });

    useEffect(() => {
        fetchCategories();
    }, [page, size]);

    //======== PAGINATION =========
    /**
     * Hàm xử lý chuyển trang mới: Thay đổi currentPage => newPage
     * @param {*} newPage 
     * @returns 
     */
    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;

        const newURL = new URLSearchParams(searchParams);
        newURL.set("page", newPage.toString());

        setSearchParams(newURL);

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const getPaginationItems = () => {
        const items = [];

        items.push(1);

        if (page > 4) {
            items.push("leftDots");
        }

        for (let i = Math.max(2, page - 2); i <= Math.min(totalPages - 1, page + 2); i++) {
            items.push(i);
        }

        if (page < totalPages - 3) {
            items.push("rightDots");
        }

        items.push(totalPages);

        return items;
    };

    return (
        <div className="p-2">   {/* Giảm padding ngoài */}

            {/* PAGE HEADER */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Quản lý loại hàng
                    </h1>
                    <p className="text-gray-500 mt-1 text-sm">
                        Quản lý các danh mục sản phẩm trong hệ thống.
                    </p>
                </div>

                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition text-sm">
                    <span className="material-symbols-outlined text-lg">
                        add_circle
                    </span>
                    Thêm loại hàng mới
                </button>
            </div>

            {/* STATS - Nhỏ gọn hơn */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">

                <div className="bg-white border rounded-2xl p-4 flex justify-between items-center shadow-sm">
                    <div>
                        <p className="text-gray-500 text-xs">Tổng danh mục</p>
                        <h3 className="text-xl font-bold mt-1">24</h3>
                    </div>
                    <span className="material-symbols-outlined text-4xl text-blue-600">category</span>
                </div>

                <div className="bg-white border rounded-2xl p-4 flex justify-between items-center shadow-sm">
                    <div>
                        <p className="text-gray-500 text-xs">Loại hàng bán chạy</p>
                        <h3 className="text-xl font-bold mt-1">Chạy bộ</h3>
                    </div>
                    <span className="material-symbols-outlined text-4xl text-green-600">trending_up</span>
                </div>

                <div className="bg-white border rounded-2xl p-4 flex justify-between items-center shadow-sm">
                    <div>
                        <p className="text-gray-500 text-xs">Tổng sản phẩm</p>
                        <h3 className="text-xl font-bold mt-1">1,482</h3>
                    </div>
                    <span className="material-symbols-outlined text-4xl text-purple-600">inventory_2</span>
                </div>

                <div className="bg-white border rounded-2xl p-4 flex justify-between items-center shadow-sm">
                    <div>
                        <p className="text-gray-500 text-xs">Tình trạng</p>
                        <h3 className="text-xl font-bold text-green-600 mt-1">Ổn định</h3>
                    </div>
                    <span className="material-symbols-outlined text-4xl text-green-600">check_circle</span>
                </div>

            </div>

            <p className="text-gray-500 pb-2">
                Hiển thị <b>1 - 5</b> trên tổng số <b>24</b> loại hàng
            </p>

            {/* TABLE */}
            <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-blue-100 border-b">
                            <tr>
                                <th className="px-4 py-4 text-center text-gray-800 font-bold w-16">STT</th>
                                <th className="px-4 py-4 text-center text-gray-800 font-bold">ID</th>
                                <th className="px-4 py-4 text-center text-gray-800 font-bold">Tên loại hàng</th>
                                <th className="px-4 py-4 text-center text-gray-800 font-bold">Thao tác</th>
                            </tr>
                        </thead>

                        <tbody>
                            {categories.map((item, index) => (
                                <tr
                                    key={item.categoryID}
                                    className="border-b hover:bg-gray-50 transition"
                                >
                                    <td className="px-4 py-4 text-center text-gray-500">
                                        #{(page - 1) * size + index + 1}
                                    </td>
                                    <td className="px-4 py-4 text-center font-mono text-gray-500 text-xs">
                                        {item.categoryID}
                                    </td>

                                    <td className="px-4 py-4 ">
                                        <div className="flex items-center gap-3 justify-center">
                                            <span className="font-semibold text-gray-800 ">{item.categoryName}</span>
                                        </div>
                                    </td>

                                    <td className="px-4 py-4">
                                        <div className="flex justify-center gap-1">
                                            <button className="p-2 hover:bg-blue-100 hover:text-blue-600 rounded-lg transition">
                                                <span className="material-symbols-outlined text-xl">edit</span>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.categoryID)}
                                                className="p-2 hover:bg-red-100 hover:text-red-600 rounded-lg transition"
                                            >
                                                <span className="material-symbols-outlined text-xl">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION - Nhỏ gọn */}
                <div className="px-6 py-3 border-t flex flex-col md:flex-row items-center justify-center gap-4 text-sm">



                    {!loading && categories.length > 1 && totalElements > 0 && (

                        <div className="flex items-center gap-1">
                            <button onClick={() => handlePageChange(page - 1)} disabled={page === 1} className={`w-9 h-9 border rounded-xl flex items-center justify-center hover:bg-gray-50 ${page === 1 ? 'disabled: cursor-not-allowed disabled: opacity-50' : 'font-bold'}`}>
                                <span className="material-symbols-outlined text-xl">chevron_left</span>
                            </button>

                            {getPaginationItems().map((item, index) => {
                                if (item === "leftDots" || item === "rightDots") {
                                    return (
                                        <span key={item} className="px-2 text-gray-500 font-bold">...</span>
                                    );
                                }

                                const isActive = page === item;
                                return (
                                    <span
                                        onClick={() => handlePageChange(item)}
                                        className={`px-2 text-gray-500 w-10 cursor-pointer h-10 items-center rounded-lg font-black justify-center text-xs 
                                        transition-all flex ${isActive ? 'bg-primary text-white' : 'border border-outlined-variant'}`}>{item}</span>
                                );
                            })}
                            <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} className={`w-9 h-9 border rounded-xl flex items-center justify-center hover:bg-gray-50 ${page === totalPages ? 'disabled: cursor-not-allowed disabled: opacity-50' : 'font-bold'}`}>
                                <span className="material-symbols-outlined text-xl">chevron_right</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}