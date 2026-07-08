import React, { useState } from "react";

const customers = [
    {
        id: 1,
        name: "Nguyen My Linh",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuByRrLh_e7D-sKGK0Oyzmedd9_eJJ9PXt9NI4L0eKzpmoSZB8nPAtZZcwRmmikSLDS0u6ulNJ54l2aHy9oD8VabtTlmFBrAPQdo3k3pQU1fE2hxbxjVMXcQRwjlomdiopfdmq7SKrY7X4DHCj5Gb0Ltn5jjOmbwv2H7XuustjtgdI-TMRK4qEAt1VAtVXLnPNrT7P0r9Ec4GrmTct6C3iFfYAcVXw0-AjFHu88jToMRt9UsO035HzM6",
        tier: "Elite Athlete",
        email: "mylinh.n@gmail.com",
        phone: "+84 901 234 567",
        status: "ACTIVE",
        orders: 14,
        spending: "24,500,000 VND",
        joinedDate: "12/10/2023",
    },
    {
        id: 2,
        name: "Tran Hoang Long",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDd5VpcLQ4xNWRi96cDL0IaR40TlB-DEee9KH1vKuOfmVBXLB141rzC6qOOxXixR1moBJF3SPoHUjp6pNOiezNpGeqMzSZlNa-BVEWlybOwWdE3QrRTsl3MEQUAX6_tLPeiutM0ZYNLOxiZh-X4P0GOhfcsdqA6PJ760nabFF0AI5H5Gk53QZ6HGXv9Hcrs5-Pxd3bejYsBwkRwWyARpJ48f2vVZNPBu2ZOAeYtCjYsRfoXHYqj89cW",
        tier: "Pro Member",
        email: "hoanglong.tr@velocity.vn",
        phone: "+84 987 654 321",
        status: "ACTIVE",
        orders: 5,
        spending: "8,200,000 VND",
        joinedDate: "05/01/2024",
    },
    {
        id: 3,
        name: "Le Thuy Chi",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCcfes7KSorKP5fdDf0keYvfmHjLtA-nY8GiB-GLjDBSmglxmg1Y1uazEz2ZgiaGLuSar8BhdtbVSR-JHw5D1J9Qj9dkwVSCpgSuN82tVur9CYsUMqt0NKhj426R2wc19SpLvUqpaDdOtY246ZiuAiWccQgrli4TvzAmxGYo5qpcmEfJB0TyzRVYwG3nKyU3Xh6ZcNVp27lCpikfmFWlAWUnmmt8ecjWsgVeoQaKfi4cJuZ4sF8dSUn",
        tier: "Elite Athlete",
        email: "thuychi.yoga@live.com",
        phone: "+84 912 345 678",
        status: "LOCKED",
        orders: 32,
        spending: "54,000,000 VND",
        joinedDate: "22/08/2022",
    },
    {
        id: 4,
        name: "Pham Duc Anh",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDDclVSDHsRNGTFT7gufu38nqfyadoscgbu3_51bE4qphHF_kup7zkA8XnJBAH988lRiRxrKUBDjrEwsPQlJt-DeIBt4vOilBQGqp-ED3V7BILdMNjEIIHnPSim64kx708z_65-ImWt6vtRQl8C3JIeu3EIy3RtNLpxaVLw3iTWyB7ABnho5BFca6ujEaWtWEB1huz-0mkVzsyDllWKzH_Q9xFD-cxxb-WYsTBGQUKEjFNNwIQMHD2l",
        tier: "Standard",
        email: "ducanh.pham@gmail.com",
        phone: "+84 905 555 999",
        status: "OFFLINE",
        orders: 2,
        spending: "1,450,000 VND",
        joinedDate: "14/02/2024",
    },
    {
        id: 5,
        name: "Pham Duc Anh",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDDclVSDHsRNGTFT7gufu38nqfyadoscgbu3_51bE4qphHF_kup7zkA8XnJBAH988lRiRxrKUBDjrEwsPQlJt-DeIBt4vOilBQGqp-ED3V7BILdMNjEIIHnPSim64kx708z_65-ImWt6vtRQl8C3JIeu3EIy3RtNLpxaVLw3iTWyB7ABnho5BFca6ujEaWtWEB1huz-0mkVzsyDllWKzH_Q9xFD-cxxb-WYsTBGQUKEjFNNwIQMHD2l",
        tier: "Standard",
        email: "ducanh.pham@gmail.com",
        phone: "+84 905 555 999",
        status: "OFFLINE",
        orders: 2,
        spending: "1,450,000 VND",
        joinedDate: "14/02/2024",
    },
    {
        id: 6,
        name: "Pham Duc Anh",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDDclVSDHsRNGTFT7gufu38nqfyadoscgbu3_51bE4qphHF_kup7zkA8XnJBAH988lRiRxrKUBDjrEwsPQlJt-DeIBt4vOilBQGqp-ED3V7BILdMNjEIIHnPSim64kx708z_65-ImWt6vtRQl8C3JIeu3EIy3RtNLpxaVLw3iTWyB7ABnho5BFca6ujEaWtWEB1huz-0mkVzsyDllWKzH_Q9xFD-cxxb-WYsTBGQUKEjFNNwIQMHD2l",
        tier: "Standard",
        email: "ducanh.pham@gmail.com",
        phone: "+84 905 555 999",
        status: "LOCKED",
        orders: 2,
        spending: "1,450,000 VND",
        joinedDate: "14/02/2024",
    },
];

export default function CustomerManagement() {
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 10;

    const totalPages = Math.ceil(
        customers.length / itemsPerPage
    );

    const paginatedCustomers = customers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getStatus = (status) => {
        switch (status) {
            case "ACTIVE":
                return (
                    <span className="flex items-center gap-2 text-green-600 font-medium">
                        <span className="w-2 h-2 rounded-full bg-green-600"></span>
                        Active
                    </span>
                );

            case "LOCKED":
                return (
                    <span className="flex items-center gap-2 text-red-600 font-medium">
                        <span className="w-2 h-2 rounded-full bg-red-600"></span>
                        Locked
                    </span>
                );

            default:
                return (
                    <span className="flex items-center gap-2 text-gray-500 font-medium">
                        <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                        Offline
                    </span>
                );
        }
    };

    return (
        <main className="p-2 space-y-2">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">
                        Customer Database
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Quản lý khách hàng và trạng thái tài khoản
                    </p>
                </div>

                <button className="flex items-center px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
                    <span className="material-symbols-outlined">
                        person_add
                    </span>
                    Thêm khách hàng
                </button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">

                <div className="bg-white border rounded-xl p-3.5">
                    <p className="text-gray-500 text-[10px]">Tổng số khách hàng</p>
                    <h3 className="text-xl font-bold mt-1">12,842</h3>
                </div>

                <div className="bg-white border rounded-xl p-3.5">
                    <p className="text-gray-500 text-[10px]">Hoạt động</p>
                    <h3 className="text-xl font-bold text-green-600 mt-1">3,421</h3>
                </div>

                <div className="bg-white border rounded-xl p-3.5">
                    <p className="text-gray-500 text-[10px]">Thành viên VIP</p>
                    <h3 className="text-xl font-bold mt-1">1,204</h3>
                </div>

                <div className="bg-blue-600 text-white rounded-xl p-3.5">
                    <p className="text-[10px] opacity-90">Đăng ký mới</p>
                    <h3 className="text-xl font-bold mt-1">482</h3>
                </div>

            </div>

            {/* Table */}
            <div className="bg-white border rounded-2xl overflow-hidden mt-4">

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-blue-100 border-b">
                            <tr>
                                <th className="px-2 py-2 text-left">STT</th>
                                <th className="px-6 py-2 text-left">
                                    Khách hàng
                                </th>

                                <th className="px-6 py-2 text-left">
                                    Liên hệ
                                </th>

                                <th className="px-6 py-2 text-left">
                                    Trạng thái
                                </th>

                                <th className="px-6 py-2 text-left">
                                    Đơn hàng
                                </th>

                                <th className="px-3 py-2 text-left">
                                    Ngày tham gia
                                </th>

                                <th className="px-6 py-2 text-center">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedCustomers.map((customer, index) => (
                                <tr
                                    key={customer.id}
                                    className={`border-b hover:bg-gray-100 ${customer.status === 'LOCKED' ? 'bg-red-100' : 'bg-green-50'}`}
                                >
                                    <td className="px-2 py-4 font-bold">#{index + 1}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">

                                            <img
                                                src={customer.avatar}
                                                alt={customer.name}
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />

                                            <div>
                                                <p className="font-semibold">
                                                    {customer.name}
                                                </p>

                                                <span className="text-xs px-2 py-1 rounded bg-gray-100">
                                                    {customer.tier}
                                                </span>
                                            </div>

                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <p>{customer.email}</p>
                                        <p className="text-sm text-gray-500">
                                            {customer.phone}
                                        </p>
                                    </td>

                                    <td className="px-6 py-4">
                                        {getStatus(customer.status)}
                                    </td>

                                    <td className="px-6 py-4">
                                        <p className="font-semibold">
                                            {customer.orders} Orders
                                        </p>

                                        <p className="text-blue-600 text-sm">
                                            {customer.spending}
                                        </p>
                                    </td>

                                    <td className="px-6 py-4">
                                        {customer.joinedDate}
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-2">

                                            <button className="p-2 rounded-lg hover:bg-blue-100 hover:text-blue-600">
                                                <span className="material-symbols-outlined">
                                                    edit
                                                </span>
                                            </button>

                                            <button className="p-2 rounded-lg hover:bg-red-100 hover:text-red-600">
                                                <span className="material-symbols-outlined">
                                                    block
                                                </span>
                                            </button>

                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>

                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">

                    <div className="text-sm text-gray-500">
                        Hiển thị {((currentPage - 1) * itemsPerPage) + 1}
                        -
                        {Math.min(
                            currentPage * itemsPerPage,
                            customers.length
                        )}
                        trên {customers.length} khách hàng
                    </div>

                    <div className="flex gap-2">

                        <button
                            disabled={currentPage === 1}
                            onClick={() =>
                                setCurrentPage((prev) => prev - 1)
                            }
                            className="w-10 h-10 border rounded-lg disabled:opacity-50"
                        >
                            <span className="material-symbols-outlined">
                                chevron_left
                            </span>
                        </button>

                        {Array.from(
                            { length: totalPages },
                            (_, index) => (
                                <button
                                    key={index}
                                    onClick={() =>
                                        setCurrentPage(index + 1)
                                    }
                                    className={`w-10 h-10 rounded-lg ${currentPage === index + 1
                                        ? "bg-blue-600 text-white"
                                        : "border"
                                        }`}
                                >
                                    {index + 1}
                                </button>
                            )
                        )}

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() =>
                                setCurrentPage((prev) => prev + 1)
                            }
                            className="w-10 h-10 border rounded-lg disabled:opacity-50"
                        >
                            <span className="material-symbols-outlined">
                                chevron_right
                            </span>
                        </button>

                    </div>

                </div>

            </div>

        </main>
    );
}