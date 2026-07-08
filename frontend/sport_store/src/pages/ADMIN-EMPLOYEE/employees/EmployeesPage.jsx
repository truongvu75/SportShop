import React, { useState } from "react";

const staffData = [
    {
        id: 1,
        code: "VEL-9041",
        name: "Jordan Davis",
        role: "ADMIN",
        email: "jordan.davis@velocity.energy",
        status: "ACTIVE",
        joinDate: "24/10/2023",
    },
    {
        id: 2,
        code: "VEL-8820",
        name: "Mina Nguyen",
        role: "STAFF",
        email: "mina.n@velocity.energy",
        status: "ACTIVE",
        joinDate: "12/01/2024",
    },
    {
        id: 3,
        code: "VEL-7651",
        name: "Tyler Kim",
        role: "STAFF",
        email: "tyler.kim@velocity.energy",
        status: "ABSENT",
        joinDate: "05/02/2024",
    },
    {
        id: 4,
        code: "VEL-9921",
        name: "Sarah Lee",
        role: "ADMIN",
        email: "sarah.lee@velocity.energy",
        status: "ACTIVE",
        joinDate: "18/11/2023",
    },
    {
        id: 5,
        code: "VEL-1111",
        name: "David Brown",
        role: "STAFF",
        email: "david@velocity.energy",
        status: "ACTIVE",
        joinDate: "10/03/2024",
    },
    {
        id: 6,
        code: "VEL-2222",
        name: "Emma Wilson",
        role: "STAFF",
        email: "emma@velocity.energy",
        status: "ACTIVE",
        joinDate: "15/03/2024",
    },
    {
        id: 7,
        code: "VEL-3333",
        name: "Alex Johnson",
        role: "ADMIN",
        email: "alex@velocity.energy",
        status: "ACTIVE",
        joinDate: "20/03/2024",
    },
];

export default function StaffManagement() {
    const [currentPage, setCurrentPage] = useState(1);

    const pageSize = 5;

    const totalPages = Math.ceil(staffData.length / pageSize);

    const currentData = staffData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const getRoleBadge = (role) => {
        if (role === "ADMIN") {
            return (
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                    Admin
                </span>
            );
        }

        return (
            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-bold">
                Staff
            </span>
        );
    };

    const getStatusBadge = (status) => {
        if (status === "ACTIVE") {
            return (
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="font-medium text-green-600">
                        Hoạt động
                    </span>
                </div>
            );
        }

        return (
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                <span className="font-medium text-gray-500">
                    Bị khóa
                </span>
            </div>
        );
    };

    return (
        <main className="p-2 space-y-2">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">
                        Quản lý nhân viên
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Quản lý nhân sự và phân quyền hệ thống
                    </p>
                </div>

                <button className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
                    <span className="material-symbols-outlined">
                        person_add
                    </span>
                    Thêm nhân viên
                </button>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-4 text-center">

                <div className="bg-white border rounded-xl p-2">
                    <p className="text-gray-500 text-sm">
                        Tổng nhân viên
                    </p>

                    <h3 className="text-xl font-bold mt-2">
                        124
                    </h3>
                </div>

                <div className="bg-white border rounded-xl p-3">
                    <p className="text-gray-500 text-sm">
                        Admin
                    </p>

                    <h3 className="text-xl font-bold mt-2">
                        12
                    </h3>
                </div>

                <div className="bg-white border rounded-xl p-3">
                    <p className="text-gray-500 text-sm">
                        Đang hoạt động
                    </p>

                    <h3 className="text-xl font-bold mt-2">
                        86
                    </h3>
                </div>

                <div className="bg-white border rounded-xl p-3">
                    <p className="text-gray-500 text-sm">
                        Chờ duyệt
                    </p>

                    <h3 className="text-xl font-bold mt-2">
                        03
                    </h3>
                </div>

            </div>

            {/* TABLE */}
            <div className="bg-white rounded-2xl border overflow-hidden">

                <div className="p-4 border-b flex justify-between items-center bg-gray-300">

                    <div className="flex gap-3">

                        <select className="px-4 py-2 border rounded-lg bg-gray-100">
                            <option>Tất cả vai trò</option>
                            <option>Admin</option>
                            <option>Staff</option>
                        </select>

                        <select className="px-4 py-2 border rounded-lg bg-gray-100">
                            <option>Tất cả trạng thái</option>
                            <option>Hoạt động</option>
                            <option>Vắng mặt</option>
                        </select>

                    </div>

                    <button className="text-blue-600 font-bold bg-gray-100 border rounded-xl px-4 py-2">
                        <span className="material-symbols-outlined">filter_list</span> Bộ lọc nâng cao
                    </button>

                </div>

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-blue-200 border-b">

                            <tr>
                                <th className="px-2 py-4 text-left">STT</th>
                                <th className="px-6 py-4 text-left">
                                    Nhân viên
                                </th>

                                <th className="px-6 py-4 text-left">
                                    Vai trò
                                </th>

                                <th className="px-6 py-4 text-left">
                                    Email
                                </th>

                                <th className="px-6 py-4 text-left">
                                    Trạng thái
                                </th>

                                <th className="px-6 py-4 text-left">
                                    Ngày gia nhập
                                </th>

                                <th className="px-6 py-4 text-center">
                                    Thao tác
                                </th>
                            </tr>

                        </thead>

                        <tbody>

                            {currentData.map((staff, index) => (
                                <tr
                                    key={staff.id}
                                    className={`border-b hover:bg-gray-400 ${staff.status === 'ACTIVE' ? 'bg-green-50' : 'bg-red-100'}`}
                                >
                                    <td className="px-4 py-2 ">#{index + 1}</td>
                                    <td className="px-6 py-2">

                                        <div className="flex items-center gap-3">

                                            <div>
                                                <p className="font-semibold">
                                                    {staff.name}
                                                </p>

                                                <p className="text-sm text-gray-500">
                                                    {staff.code}
                                                </p>
                                            </div>

                                        </div>

                                    </td>

                                    <td className="px-6 py-2">
                                        {getRoleBadge(staff.role)}
                                    </td>

                                    <td className="px-6 py-2">
                                        {staff.email}
                                    </td>

                                    <td className="px-6 py-2">
                                        {getStatusBadge(staff.status)}
                                    </td>

                                    <td className="px-6 py-2">
                                        {staff.joinDate}
                                    </td>

                                    <td className="px-6 py-2">
                                        <div className="flex justify-center gap-2">

                                            <button className="p-2 rounded-lg hover:bg-blue-100 hover:text-blue-600">
                                                <span className="material-symbols-outlined">
                                                    admin_panel_settings
                                                </span>
                                            </button>

                                            <button className="p-2 rounded-lg hover:bg-yellow-100 hover:text-yellow-600">
                                                <span className="material-symbols-outlined">
                                                    edit
                                                </span>
                                            </button>

                                            <button className="p-2 rounded-lg hover:bg-red-100 hover:text-red-600">
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

                {/* PAGINATION */}
                <div className="flex justify-between items-center p-4 border-t">

                    <p className="text-sm text-gray-500">
                        Hiển thị{" "}
                        {(currentPage - 1) * pageSize + 1}
                        {" - "}
                        {Math.min(
                            currentPage * pageSize,
                            staffData.length
                        )}
                        {" / "}
                        {staffData.length}
                        {" nhân viên"}
                    </p>

                    <div className="flex gap-2">

                        <button
                            disabled={currentPage === 1}
                            onClick={() =>
                                setCurrentPage(currentPage - 1)
                            }
                            className="w-10 h-10 border rounded-lg disabled:opacity-50"
                        >
                            ←
                        </button>

                        {[...Array(totalPages)].map((_, index) => (
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
                        ))}

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() =>
                                setCurrentPage(currentPage + 1)
                            }
                            className="w-10 h-10 border rounded-lg disabled:opacity-50"
                        >
                            →
                        </button>

                    </div>

                </div>

            </div>

        </main>
    );
}