import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import VariantModal from './VariantModal';
import productApi from '../../../api/productApi';
import categoryApi from '../../../api/categoryApi';
import brandApi from '../../../api/brandApi';

export default function AddProductForm() {
    const [formData, setFormData] = useState({
        productName: '',
        brandId: '',
        categoryId: '',
        basePrice: '',
        photo: '',
        isSelling: true,
        description: '',
        variants: []
    });

    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [color, setColor] = useState([]);

    const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        console.log('Số lượng variants: ' + formData.variants.length);
        fetchHelper();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    /**
     * Hàm dành riêng cho toggle Selling
     */
    const handleToggleSelling = () => {
        setFormData(prev => ({ ...prev, isSelling: !prev.isSelling, }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.variants.length === 0) {
            alert("Vui lòng thêm ít nhất 1 biến thể!!!");
            return;
        }

        setIsSubmitting(true);

        try {
            // === CLONE và loại bỏ trường thừa ===
            const dataToSend = {
                ...formData,
                variants: formData.variants.map(({ colorName, sizeName, ...rest }) => ({
                    ...rest,                    // Giữ lại tất cả trừ colorName và sizeName
                }))
            };

            console.log("Dữ liệu gốc (formData):", formData);
            console.log("Dữ liệu gửi API (đã loại bỏ colorName, sizeName):", dataToSend);

            // Gọi API
            const response = await productApi.createProduct(dataToSend);

            alert("✅ Tạo sản phẩm thành công!");
            setTimeout(() => navigate('/employee/products'), 800);

        } catch (error) {
            console.error(error);
            alert("❌ " + (error.response?.data?.message || "Có lỗi xảy ra khi tạo sản phẩm!"));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddVariant = (newVariant) => {
        setFormData(prev => ({ ...prev, variants: [...prev.variants, newVariant] }));
        console.log('Thêm biến thể thành công!!')
    }

    const fetchHelper = (async () => {
        try {
            setIsLoading(true);
            const categoryData = await categoryApi.getAll();
            const brandData = await brandApi.getAll();
            const sizeData = await productApi.getAllSizes();
            const colorData = await productApi.getAllColors();

            setCategories(categoryData);
            setBrands(brandData);
            setSizes(sizeData);
            setColor(colorData);

            console.log('Lấy dữ liệu Category và Brand thành công!');
        } catch (error) {
            console.error('Lỗi ở lấy loại hàng: ' + error);
        } finally {
            setIsLoading(false);
        }

    });

    const removeVariant = (VariantSKU) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.filter(variant => variant.sku !== VariantSKU)
        }));
    };

    return (
        <main className="flex-1 flex flex-col min-h-screen">
            {/* Breadcrumb & Title */}
            <div className="px-4 py-2">
                <nav className="flex items-center gap-2 text-on-surface-variant mb-2">
                    <Link to="/employee/products" className="hover:text-primary transition-colors uppercase">Quản lý sản phẩm</Link>
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                    <span className="text-primary font-bold uppercase">Thêm Sản Phẩm Mới</span>
                </nav>
            </div>

            <div className="pl-4 pr-2 pb-32 max-w-7xl mx-auto w-full grid grid-cols-12 gap-8">
                {/* Left Column */}
                <div className="col-span-12 lg:col-span-8 space-y-8">
                    {/* Thông tin cơ bản */}
                    <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-6 text-primary">
                            <span className="material-symbols-outlined">info</span>
                            <h3 className="text-lg font-bold">Thông tin cơ bản</h3>
                        </div>

                        <div className="space-y-8">
                            {/* Nhóm 1: Thông tin chính */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-label-bold block">Tên sản phẩm <span className="text-error">*</span></label>
                                    <input
                                        type="text"
                                        name="productName"
                                        value={formData.productName}
                                        onChange={handleChange}
                                        className="w-full border border-outline-variant rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                                        placeholder="Ví dụ: Giày Chạy Velocity Pro X1"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-label-bold block">Thương hiệu</label>
                                    <select
                                        name="brandId"
                                        value={formData.brandId}
                                        onChange={handleChange}
                                        className="w-full border border-outline-variant rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                                        placeholder="VELOCITY Core"
                                    >
                                        <option value="">Chọn thương hiệu</option>
                                        {!isLoading && brands.length > 0 && (
                                            brands.map((item) => (
                                                <option key={item.brandID} value={item.brandID}>{item.brandName}</option>
                                            ))
                                        )}

                                    </select>
                                </div>
                            </div>

                            {/* Nhóm 2: Danh mục & Giá */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-label-bold block">Danh mục <span className="text-error">*</span></label>
                                    <select
                                        name="categoryId"
                                        value={formData.categoryId}
                                        onChange={handleChange}
                                        className="w-full border border-outline-variant rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                                    >
                                        <option value="">Chọn danh mục</option>
                                        {!isLoading && categories.length > 0 && (
                                            categories.map((item) => (
                                                <option key={item.categoryID} value={item.categoryID}>{item.categoryName}</option>
                                            ))
                                        )}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-label-bold block">Giá cơ bản (VNĐ) <span className="text-error">*</span></label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            name="basePrice"
                                            value={formData.basePrice}
                                            onChange={handleChange}
                                            className="w-full pl-4 pr-12 border border-outline-variant rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                                            placeholder="0"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-semibold">đ</span>
                                    </div>
                                </div>
                            </div>

                            {/* Nhóm 3: Ảnh, Thương hiệu chọn, Trạng thái */}
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                <div className="md:col-span-6 space-y-2">
                                    <label className="text-label-bold block">Link ảnh đại diện</label>
                                    <input
                                        type="text"
                                        name="photo"
                                        value={formData.photo}
                                        onChange={handleChange}
                                        className="w-full border border-outline-variant rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>


                                {/* Toggle trạng thái */}
                                <div className="md:col-span-6 space-y-3">
                                    <label className="text-label-bold block">Trạng thái</label>
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={handleToggleSelling}
                                            className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${formData.isSelling
                                                ? "bg-green-500 hover:bg-green-600"
                                                : "bg-gray-300 hover:bg-gray-400"
                                                }`}
                                            aria-checked={formData.isSelling}
                                            role="switch"
                                        >
                                            <span
                                                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-all duration-300 ${formData.isSelling ? "translate-x-7" : "translate-x-1"
                                                    }`}
                                            />
                                        </button>

                                        <span
                                            className={`text-sm font-medium transition-colors ${formData.isSelling ? "text-green-600 font-semibold" : "text-gray-500"
                                                }`}
                                        >
                                            {formData.isSelling ? "Đang bán" : "Ngừng bán"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Mô tả */}
                            <div className="space-y-2">
                                <label className="text-label-bold block">Mô tả sản phẩm</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="5"
                                    className="w-full border border-outline-variant rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all resize-none"
                                    placeholder="Nhập mô tả chi tiết về tính năng, chất liệu, công nghệ..."
                                />
                            </div>
                        </div>
                    </section>

                    {/* Sản phẩm biến thể */}
                    <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-2 text-primary">
                                <span className="material-symbols-outlined">layers</span>
                                <h3 className="text-lg font-bold">Sản phẩm biến thể</h3>
                            </div>
                            <button onClick={() => setIsVariantModalOpen(true)} className="flex items-center gap-2 text-primary font-bold hover:bg-primary-container/10 px-4 py-2 rounded-lg transition-colors border border-primary">
                                <span className="material-symbols-outlined text-sm">add</span>
                                Thêm biến thể
                            </button>
                        </div>

                        {/* Table Variants - Bạn có thể tách thành component riêng sau */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-surface-container text-on-surface-variant text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-4 py-3 rounded-l-lg">STT</th>
                                        <th className="px-4 py-3">SKU</th>
                                        <th className="px-4 py-3">Size/Màu</th>
                                        <th className="px-4 py-3">Giá</th>
                                        <th className="px-4 py-3">Tồn kho</th>

                                        <th className="px-4 py-3 rounded-r-lg text-center">Tác vụ</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant">

                                    {formData.variants.length > 0 ? (formData.variants.map((item, index) => (
                                        <tr key={item.sku || index}>
                                            <td className="px-4 py-4">
                                                <div className="text-sm">#{index + 1}</div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <p className="text-xs font-bold border-outline-variant rounded-md w-32 focus:ring-primary py-1 px-2" type="text" >{item.sku}</p>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex gap-1">
                                                    <span className="px-2 py-0.5 bg-primary-container text-on-primary-container text-[10px] rounded font-bold">{item.sizeName !== null ? item.sizeName : ''}</span>
                                                    <span className="px-2 py-0.5 bg-surface-container text-on-surface-variant text-[10px] rounded font-bold">{item.colorName !== null ? item.colorName : ''}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-sm">
                                                <div className="relative w-24">
                                                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs">+</span>
                                                    <p className="pl-5 pr-2 py-1 w-full text-xs border-outline-variant rounded-md focus:ring-primary" defaultValue="0">{item.price.toLocaleString("vi-VN")}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <p className="py-1 w-20 text-xs border-outline-variant rounded-md focus:ring-primary text-center" type="number" defaultValue="45" >{item.stock}</p>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <button onClick={() => removeVariant(item.sku || index)} className="text-error hover:bg-error-container/20 p-1 rounded transition-colors">
                                                    <span className="material-symbols-outlined text-sm">delete</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))) : (<tr>
                                        <td colSpan="6" className="px-4 py-12 text-center text-on-surface-variant">
                                            Chưa có biến thể nào. Hãy thêm biến thể để tiếp tục.
                                        </td>
                                    </tr>)}

                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>

                {/* Right Column */}
                <div className="col-span-12 lg:col-span-4 space-y-8">
                    {/* Hình ảnh */}
                    <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-6 text-primary">
                            <span className="material-symbols-outlined">image</span>
                            <h3 className="text-lg font-bold">Hình ảnh sản phẩm</h3>
                        </div>

                        <div className="border-2 border-dashed border-outline-variant rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group">
                            <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4 group-hover:bg-primary-container transition-colors">
                                <span className="material-symbols-outlined text-primary text-3xl">upload_file</span>
                            </div>
                            <p className="text-body-md font-bold mb-1">Click để tải lên</p>
                            <p className="text-caption text-on-surface-variant">Hỗ trợ JPG, PNG, WEBP (Tối đa 10MB)</p>
                            <input type="file" className="hidden" multiple />
                        </div>

                        <div className="grid grid-cols-3 gap-2 mt-4">
                            {/* Ảnh đã upload */}
                            <div className="aspect-square bg-surface-container rounded-lg border border-outline-variant overflow-hidden relative group">
                                <img
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAje2rWT1EgR7ebEBa8IhOZIOXoeRzMx3BcTU3pwWqfExrlXc9SDHGfOMi6G3Eq5td2LvE9qyAAetIyz3LQrEbhxPCBdU2N5HuXyTDMgIYvDiZSrZYK_wJudX3netBcIvCqzZaLWg_EhoQzy0mWxn1qdlVN8-RZ-sCK_N9yMTt5N8ynq3nbc35IKIXqFBDoiVnkjpndEsMvex5Hti-FCz0QpArygmcKF7yFv_CB6cIcFI1lBcYN1dz"
                                    alt="product"
                                    className="w-full h-full object-cover"
                                />
                                <button className="absolute top-1 right-1 bg-error text-white rounded-full p-0.5 hidden group-hover:block transition-all">
                                    <span className="material-symbols-outlined text-xs">close</span>
                                </button>
                            </div>
                            {/* Thêm ảnh */}
                            <div className="aspect-square bg-surface-container rounded-lg border border-dashed border-outline-variant flex items-center justify-center cursor-pointer hover:bg-primary/5 transition-all">
                                <span className="material-symbols-outlined text-outline text-3xl">add</span>
                            </div>
                            <div className="aspect-square bg-surface-container rounded-lg border border-dashed border-outline-variant flex items-center justify-center cursor-pointer hover:bg-primary/5 transition-all">
                                <span className="material-symbols-outlined text-outline text-3xl">add</span>
                            </div>
                        </div>
                    </section>

                    {/* Cài đặt nhanh */}
                    <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-6 text-primary">
                            <span className="material-symbols-outlined">settings_suggest</span>
                            <h3 className="text-lg font-bold">Cài đặt nhanh</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary">visibility</span>
                                    <span className="text-sm font-bold">Hiển thị website</span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-secondary">new_releases</span>
                                    <span className="text-sm font-bold">Gắn nhãn "Mới"</span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                                </label>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* Sticky Footer Actions */}
            <footer className="fixed bottom-0 left-64 right-0 bg-surface-container-lowest border-t border-outline-variant px-8 py-4 flex justify-between items-center z-50">
                <div className="flex items-center gap-2 text-on-surface-variant italic text-sm">
                    <span className="material-symbols-outlined text-sm">sync</span>
                    Đang lưu bản nháp...
                </div>

                <div className="flex items-center gap-4">
                    <button onClick={() => { navigate(-1) }} className="px-8 py-3 rounded-xl border border-outline-variant font-bold text-on-surface hover:bg-surface-container transition-all active:scale-95">
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-10 py-3 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 disabled: cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                                Đang lưu...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined">save</span>
                                Lưu sản phẩm
                            </>
                        )}
                    </button>
                </div>
            </footer>

            <VariantModal isOpen={isVariantModalOpen}
                onClose={() => setIsVariantModalOpen(false)}
                onAddVariant={handleAddVariant}
                dataSize={sizes}
                dataColor={color}
            />

        </main>

    );
};

