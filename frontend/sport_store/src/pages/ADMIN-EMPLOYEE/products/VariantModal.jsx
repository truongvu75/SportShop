import React, { useState, useEffect } from 'react';

const VariantModal = ({ isOpen, onClose, onAddVariant, dataSize, dataColor }) => {
    const [variantData, setVariantData] = useState({
        sku: '',
        price: 0,
        stock: 0,
        sizeId: 0,
        sizeName: '',
        colorId: 0,
        colorName: '',
    });

    const [errors, setErrors] = useState({});

    // Reset form khi modal mở
    useEffect(() => {
        if (isOpen) {
            setVariantData({
                sku: '',
                price: 0,
                stock: 0,
                sizeId: 0,
                sizeName: '',
                colorId: 0,
                colorName: '',
            });
            setErrors({});
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "sizeID") {
            const selectedSize = dataSize.find(s => s.sizeID === Number(value));
            setVariantData(prev => ({
                ...prev,
                sizeId: Number(value),
                sizeName: selectedSize ? selectedSize.sizeName : ''
            }));
        }
        else if (name === "colorID") {
            const selectedColor = dataColor.find(c => c.colorID === Number(value));
            setVariantData(prev => ({
                ...prev,
                colorId: Number(value),
                colorName: selectedColor ? selectedColor.colorName : ''
            }));
        }
        else {
            setVariantData(prev => ({ ...prev, [name]: value }));
        }

        // Xóa lỗi khi người dùng sửa
        if (errors[name]) {
            setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!variantData.sku?.trim()) newErrors.sku = "Vui lòng nhập mã SKU!";
        if (!variantData.price || variantData.price <= 0) newErrors.price = "Giá phải lớn hơn 0!";
        if (!variantData.stock || variantData.stock <= 0) newErrors.stock = "Số lượng phải lớn hơn 0!";
        if (!variantData.colorId) newErrors.colorID = "Vui lòng chọn màu!";
        if (!variantData.sizeId) newErrors.sizeID = "Vui lòng chọn size!";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const isValid = validateForm();
        if (!isValid) return;

        onAddVariant(variantData);
        onClose();
    };

    const handleCancel = () => {
        setErrors({});
        setVariantData({
            sku: '',
            price: 0,
            stock: 0,
            sizeId: 0,
            sizeName: '',
            colorId: 0,
            colorName: '',
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm ">
            <div className="bg-surface-container-lowest w-full max-w-[480px] md:max-w-2xl rounded-2xl shadow-xl overflow-hidden border border-outline-variant">

                {/* Header */}
                <div className="px-6 py-5 border-b border-outline-variant flex justify-between items-center">
                    <h3 className="text-lg font-bold text-on-surface">Thêm biến thể sản phẩm</h3>
                    <button
                        onClick={handleCancel}
                        className="text-on-surface-variant hover:bg-surface-container-high p-2 rounded-full transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    <div className='grid grid-cols-3 gap-4'>
                        <div className="space-y-2">
                            <label className="text-label-bold block text-on-surface">SKU <span className="text-error">*</span></label>
                            <input
                                type="text"
                                name="sku"
                                value={variantData.sku}
                                onChange={handleChange}
                                className={`w-full border ${errors.sku ? 'border-red-500' : 'border-outline-variant'} rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all`}
                                placeholder="VELO-X1-BLU-XL"
                            />
                            {errors.sku && <p className='text-red-500 text-sm mt-1'>{errors.sku}</p>}
                        </div>

                        <div className='space-y-2'>
                            <label className="text-label-bold block text-on-surface">Màu</label>
                            <select
                                name="colorID"
                                value={variantData.colorId}
                                onChange={handleChange}
                                className={`w-full border ${errors.colorID ? 'border-red-500' : 'border-outline-variant'} rounded-xl px-4 py-3`}
                            >
                                <option value="0">--- Chọn màu ---</option>
                                {dataColor.map((c) => (
                                    <option key={c.colorID} value={c.colorID}>
                                        {c.colorName}
                                    </option>
                                ))}
                            </select>
                            {errors.colorID && <p className='text-red-500 text-sm mt-1'>{errors.colorID}</p>}
                        </div>

                        <div className='space-y-2'>
                            <label className="text-label-bold block text-on-surface">Size</label>
                            <select
                                name="sizeID"
                                value={variantData.sizeId}
                                onChange={handleChange}
                                className={`w-full border ${errors.sizeID ? 'border-red-500' : 'border-outline-variant'} rounded-xl px-4 py-3`}
                            >
                                <option value="0">--- Chọn size ---</option>
                                {dataSize.map((s) => (
                                    <option key={s.sizeID} value={s.sizeID}>
                                        {s.sizeName}
                                    </option>
                                ))}
                            </select>
                            {errors.sizeID && <p className='text-red-500 text-sm mt-1'>{errors.sizeID}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-label-bold block text-on-surface">Giá (VNĐ)</label>
                            <input
                                type="number"
                                name="price"
                                value={variantData.price}
                                onChange={handleChange}
                                className={`w-full border ${errors.price ? 'border-red-500' : 'border-outline-variant'} rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/30`}
                            />
                            {errors.price && <p className='text-red-500 text-sm mt-1'>{errors.price}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-label-bold block text-on-surface">Số lượng</label>
                            <input
                                type="number"
                                name="stock"
                                value={variantData.stock}
                                onChange={handleChange}
                                className={`w-full border ${errors.stock ? 'border-red-500' : 'border-outline-variant'} rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/30`}
                            />
                            {errors.stock && <p className='text-red-500 text-sm mt-1'>{errors.stock}</p>}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-5 bg-surface-container border-t border-outline-variant flex justify-end gap-3">
                    <button
                        onClick={handleCancel}
                        className="px-6 py-3 rounded-xl border border-outline-variant font-bold text-on-surface hover:bg-surface-container-high transition-all"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-3 bg-primary text-on-primary font-bold rounded-xl hover:brightness-105 transition-all"
                    >
                        Thêm biến thể
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VariantModal;