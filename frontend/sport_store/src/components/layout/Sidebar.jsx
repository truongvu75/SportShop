import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import productApi from '../../api/productApi';

const FILTER_RULES = {
  '23': ['size', 'color', 'price'], // Giày
  '24': ['size', 'price', 'color'],  // Áo quần
  '25': ['color'],
  '26': ['color'],
  '27': ['color'],
  '28': ['color'],
  '29': ['color'],
  '30': ['color']
};

// Component hiển thị các khoảng giá cố định
const PriceOption = ({ label, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`text-left w-full py-1.5 px-3 rounded text-xs font-medium transition-all ${isSelected ? 'bg-primary text-white font-bold shadow-sm' : 'text-on-surface-variant hover:bg-surface-variant/50'
      }`}
  >
    {label}
  </button>
);

// Component Checkbox động dành cho Size và Color từ Database
const FilterCheckbox = ({ label, isChecked, onChange }) => (
  <label className="flex items-center gap-2.5 py-1 px-1 cursor-pointer text-xs font-medium text-on-surface-variant hover:text-primary transition-colors">
    <input
      type="checkbox"
      checked={isChecked}
      onChange={onChange}
      className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer transition-all"
    />
    <span className={isChecked ? "font-bold text-primary" : ""}>{label}</span>
  </label>
);

const FilterItem = ({ icon, label, children, disabled = false }) => (
  <div className={`p-2 mx-2 rounded-lg border border-transparent ${disabled ? 'opacity-20 pointer-events-none' : ''}`}>
    <div className="flex items-center gap-3 py-2 px-2 text-on-surface-variant">
      <span className="material-symbols-outlined text-[20px]">{icon}</span>
      <span className="font-bold text-[13px] uppercase tracking-wider">{label}</span>
    </div>
    {!disabled && <div className="pl-8 pr-2 flex flex-col gap-1 mt-1 max-h-48 overflow-y-auto custom-scrollbar">{children}</div>}
  </div>
);

export default function Sidebar({ isOpenOnMobile = false, onCloseMobile = null }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get('categoryId') || '';

  // --- STATES LƯU DỮ LIỆU ĐỘNG TỪ BACKEND ---
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);

  // --- LẤY DỮ LIỆU SIZE/COLOR TỪ BACKEND KHI KHỞI CHẠY ---
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const [sizeRes, colorRes] = await Promise.all([
          productApi.getAllSizes(),
          productApi.getAllColors()
        ]);

        const extractData = (res) => { //Giải nén, bóc tách dữ liệu ra
          if (!res) return [];
          if (Array.isArray(res)) return res; //Nếu res là mảng thì lấy luôn
          if (res.content && Array.isArray(res.content)) return res.content;
          if (res.data && Array.isArray(res.data)) return res.data;

          if (res.data) {
            if (res.data.content && Array.isArray(res.data.content)) return res.data.content;
            if (res.data.data && Array.isArray(res.data.data)) return res.data.data;
            if (Array.isArray(res.data)) return res.data;
          }
          return [];
        };

        setSizes(extractData(sizeRes));
        setColors(extractData(colorRes));

      } catch (err) {
        console.error("Lỗi lấy danh mục bộ lọc:", err);
      }
    };
    fetchFilterData();
  }, []);

  //Nếu có chuỗi URL size thì tách thành arr
  const selectedSizeIds = searchParams.get('sizeIds') ? searchParams.get('sizeIds').split(',').map(Number) : [];
  const selectedColorIds = searchParams.get('colorIds') ? searchParams.get('colorIds').split(',').map(Number) : [];
  const currentPriceRange = searchParams.get('priceRange') || '';

  const hasAnyFilter = selectedSizeIds.length > 0 || selectedColorIds.length > 0 || currentPriceRange !== '';

  const handleCheckboxChange = (paramKey, id, currentList) => {
    const newParams = new URLSearchParams(searchParams);
    let updatedList;

    if (currentList.includes(id)) {
      updatedList = currentList.filter(item => item !== id);
    } else {
      updatedList = [...currentList, id];
    }

    if (updatedList.length > 0) {
      newParams.set(paramKey, updatedList.join(','));
    } else {
      newParams.delete(paramKey);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePriceChange = (value) => {
    const newParams = new URLSearchParams(searchParams);
    if (newParams.get('priceRange') === value) {
      newParams.delete('priceRange');
    } else {
      newParams.set('priceRange', value);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleClearAllFilters = () => {
    const newParams = new URLSearchParams();
    if (categoryId) newParams.set('categoryId', categoryId);

    const brandId = searchParams.get('brandId');
    if (brandId) newParams.set('brandId', brandId);

    const searchValue = searchParams.get('searchValue');
    if (searchValue) newParams.set('searchValue', searchValue);

    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const isFilterAllowed = (filterKey) => {
    if (!categoryId) return true;
    return FILTER_RULES[categoryId]?.includes(filterKey) || false;
  };

  // --- LOGIC TỰ ĐỘNG PHÂN LOẠI SIZE SỐ VÀ SIZE CHỮ ---
  // DùngisNaN để kiểm tra xem một chuỗi có phải là Số hay không
  const filteredSizes = sizes.filter(s => {
    const isNumberSize = !isNaN(s.sizeName);

    if (categoryId === '23') {
      return isNumberSize; // Nếu đang ở danh mục Giày (23) -> Chỉ giữ lại size số
    }
    if (categoryId === '24') {
      return !isNumberSize; // Nếu đang ở danh mục Áo quần (24) -> Chỉ giữ lại size chữ
    }
    return true; // Các trường hợp bộ sưu tập chung khác -> Hiện tất cả
  });

  const asideContent = (
    <div className="flex flex-col h-full bg-surface-container-low pt-6 overflow-y-auto">
      <div className="px-6 mb-4 flex justify-between items-center">
        <div>
          <h2 className="font-display text-[24px] font-bold text-primary tracking-tight">BỘ LỌC</h2>
          <p className="text-on-surface-variant text-[12px]">Tối ưu hóa tìm kiếm</p>
        </div>

        <div className="flex items-center gap-2">
          {hasAnyFilter && (
            <button
              onClick={handleClearAllFilters}
              className="flex items-center gap-0.5 text-xs font-bold text-error hover:bg-error/10 px-2 py-1.5 rounded-lg transition-all active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">filter_alt_off</span>
              Xóa lọc
            </button>
          )}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-full bg-surface-variant text-on-surface-variant hover:bg-surface-variant/80 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>
      </div>

      <nav className="flex flex-col gap-2 px-2 flex-grow mb-6">

        {/* MAP SIZE SAU KHI ĐÃ ĐƯỢC LỌC ĐỘNG THEO DANH MỤC */}
        <FilterItem icon="straighten" label="Kích cỡ" disabled={!isFilterAllowed('size')}>
          {filteredSizes.map(s => (
            <FilterCheckbox
              key={s.sizeID}
              label={isNaN(s.sizeName) ? `Size ${s.sizeName}` : s.sizeName} // Nếu là số thì chỉ hiện số (ví dụ: 39), nếu là chữ thì thêm chữ Size (ví dụ: Size M)
              isChecked={selectedSizeIds.includes(s.sizeID)}
              onChange={() => handleCheckboxChange('sizeIds', s.sizeID, selectedSizeIds)}
            />
          ))}
          {filteredSizes.length === 0 && (
            <span className="text-[11px] text-on-surface-variant/60 pl-2 italic">Không có size phù hợp</span>
          )}
        </FilterItem>

        {/* MAP MÀU SẮC ĐỘNG TỪ BACKEND */}
        <FilterItem icon="palette" label="Màu sắc" disabled={!isFilterAllowed('color')}>
          {colors.map(c => (
            <FilterCheckbox
              key={c.colorID}
              label={c.colorName}
              isChecked={selectedColorIds.includes(c.colorID)}
              onChange={() => handleCheckboxChange('colorIds', c.colorID, selectedColorIds)}
            />
          ))}
        </FilterItem>

        {/* KHOẢNG GIÁ */}
        <FilterItem icon="payments" label="Khoảng giá" disabled={!isFilterAllowed('price')}>
          <PriceOption label="Dưới 500k" isSelected={currentPriceRange === 'under500'} onClick={() => handlePriceChange('under500')} />
          <PriceOption label="500k - 1.5 triệu" isSelected={currentPriceRange === '500-1500'} onClick={() => handlePriceChange('500-1500')} />
          <PriceOption label="Trên 1.5 triệu" isSelected={currentPriceRange === 'above1500'} onClick={() => handlePriceChange('above1500')} />
        </FilterItem>

      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-[calc(100vh-80px)] sticky top-20 border-r border-outline-variant z-40 bg-surface-container-low">
        {asideContent}
      </aside>

      {/* Mobile Sidebar Drawer */}
      {isOpenOnMobile && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
            onClick={onCloseMobile}
          />
          {/* Drawer Content */}
          <div className="relative w-80 max-w-[85vw] h-full bg-white shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-300">
            {asideContent}
          </div>
        </div>
      )}
    </>
  );
}