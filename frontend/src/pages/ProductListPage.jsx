import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Smartphone,
  Layers,
  CheckCircle,
  AlertCircle,
  Filter,
  RotateCcw,
  Eye,
  Cpu,
  Tv
} from "lucide-react";
import { phoneApi } from "../services/phoneApi";
import { catalogApi } from "../services/catalogApi";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";
import ProductModal from "../components/ProductModal";
import VariantModal from "../components/VariantModal";
import ProductDetailModal from "../components/ProductDetailModal";

export default function ProductListPage({ user, onRequireLogin }) {
  // 1. Quản lý States
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Categories & Brands for dropdown in modal & filter
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  // Filters
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStock, setSelectedStock] = useState("");

  // Modal Thêm / Sửa
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Modal Biến thể
  const [variantModalOpen, setVariantModalOpen] = useState(false);
  const [variantPhone, setVariantPhone] = useState(null);

  // Modal Chi tiết thông số kỹ thuật (Full Specs)
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailPhone, setDetailPhone] = useState(null);

  // Toast Notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // 2. Fetch danh sách sản phẩm từ Spring Boot RESTful API
  const fetchPhones = useCallback(async (keyword = "") => {
    setLoading(true);
    setError(null);
    try {
      let res;
      if (keyword.trim()) {
        res = await phoneApi.search(keyword.trim());
      } else {
        res = await phoneApi.getAll();
      }
      setPhones(res.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Không thể tải danh sách sản phẩm."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch Brands và Categories ban đầu
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [brandRes, catRes] = await Promise.all([
          catalogApi.getBrands().catch(() => ({ data: [] })),
          catalogApi.getCategories().catch(() => ({ data: [] })),
        ]);
        setBrands(brandRes.data || []);
        setCategories(catRes.data || []);
      } catch (err) {
        console.error("Lỗi tải danh mục:", err);
      }
    };

    fetchPhones();
    fetchMetadata();
  }, [fetchPhones]);

  // Xử lý tìm kiếm
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPhones(searchTerm);
  };

  // 3. Xử lý Thêm / Sửa sản phẩm
  const handleOpenAdd = () => {
    if (!user || user.role !== "ROLE_ADMIN") {
      onRequireLogin();
      return;
    }
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (phone) => {
    if (!user || user.role !== "ROLE_ADMIN") {
      onRequireLogin();
      return;
    }
    setEditingProduct(phone);
    setModalOpen(true);
  };

  const handleOpenVariants = (phone) => {
    if (!user || user.role !== "ROLE_ADMIN") {
      onRequireLogin();
      return;
    }
    setVariantPhone(phone);
    setVariantModalOpen(true);
  };

  const handleOpenDetail = (phone) => {
    setDetailPhone(phone);
    setDetailModalOpen(true);
  };

  const handleSaveProduct = async (formData) => {
    if (editingProduct) {
      const res = await phoneApi.update(editingProduct.id, formData);
      setPhones((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? res.data : p))
      );
      showToast(`Đã cập nhật sản phẩm "${formData.name}" thành công!`);
    } else {
      const res = await phoneApi.create(formData);
      setPhones((prev) => [res.data, ...prev]);
      showToast(`Đã thêm sản phẩm "${formData.name}" thành công!`);
    }
  };

  // 4. Xử lý Xóa sản phẩm
  const handleDeleteProduct = async (phone) => {
    if (!user || user.role !== "ROLE_ADMIN") {
      onRequireLogin();
      return;
    }

    const confirmDelete = window.confirm(
      `Bạn có chắc chắn muốn xóa điện thoại "${phone.name}" không?`
    );
    if (!confirmDelete) return;

    try {
      await phoneApi.delete(phone.id);
      setPhones((prev) => prev.filter((p) => p.id !== phone.id));
      showToast(`Đã xóa sản phẩm "${phone.name}" khỏi hệ thống.`);
    } catch (err) {
      alert("Lỗi khi xóa sản phẩm: " + (err.response?.data?.message || err.message));
    }
  };

  const resetFilters = () => {
    setSelectedBrand("");
    setSelectedCategory("");
    setSelectedStock("");
    setSearchTerm("");
    fetchPhones("");
  };

  // Lọc sản phẩm ở client theo Brand, Category, Tồn kho
  const filteredPhones = phones.filter((p) => {
    const matchBrand =
      !selectedBrand || (p.brand && String(p.brand.id) === String(selectedBrand));
    const matchCat =
      !selectedCategory || (p.category && String(p.category.id) === String(selectedCategory));
    let matchStock = true;
    if (selectedStock === "in") matchStock = p.quantity > 5;
    else if (selectedStock === "low") matchStock = p.quantity > 0 && p.quantity <= 5;
    else if (selectedStock === "out") matchStock = p.quantity === 0;

    return matchBrand && matchCat && matchStock;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
      price || 0
    );
  };

  return (
    <div className="product-page">
      {/* Toast Alert */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-heading">Quản lý Sản phẩm & Cấu hình máy</h1>
          <p className="page-sub">
            Quản lý danh sách điện thoại, thông số kỹ thuật phần cứng, giá bán và tồn kho
          </p>
        </div>
        <button onClick={handleOpenAdd} className="btn btn-primary btn-add">
          <Plus size={18} /> Thêm điện thoại mới
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="filter-panel card p-4 mb-4">
        <form onSubmit={handleSearchSubmit} className="search-bar mb-3">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              className="search-input"
              placeholder="Tìm kiếm sản phẩm theo tên, vi xử lý..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <button type="submit" className="btn btn-secondary">
            Tìm kiếm
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter size={15} className="text-muted" />
            <span className="text-sm font-medium text-muted">Lọc theo:</span>
          </div>

          <select
            className="form-input text-sm py-1.5 px-3 min-w-[140px]"
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
          >
            <option value="">-- Tất cả Hãng --</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          <select
            className="form-input text-sm py-1.5 px-3 min-w-[150px]"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">-- Tất cả Danh mục --</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            className="form-input text-sm py-1.5 px-3 min-w-[140px]"
            value={selectedStock}
            onChange={(e) => setSelectedStock(e.target.value)}
          >
            <option value="">-- Tồn kho --</option>
            <option value="in">Còn nhiều (&gt;5)</option>
            <option value="low">Sắp hết (1-5)</option>
            <option value="out">Hết hàng (0)</option>
          </select>

          {(selectedBrand || selectedCategory || selectedStock || searchTerm) && (
            <button
              type="button"
              className="btn btn-ghost text-sm flex items-center gap-1"
              onClick={resetFilters}
            >
              <RotateCcw size={14} /> Xóa bộ lọc
            </button>
          )}

          <div className="ml-auto text-sm text-muted">
            Hiển thị <strong>{filteredPhones.length}</strong> / {phones.length} sản phẩm
          </div>
        </div>
      </div>

      {/* Body: Trạng thái giao diện */}
      {loading ? (
        <LoadingSpinner message="Đang kết nối Spring Boot và lấy danh sách sản phẩm..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => fetchPhones(searchTerm)} />
      ) : filteredPhones.length === 0 ? (
        <EmptyState
          message={
            searchTerm || selectedBrand || selectedCategory || selectedStock
              ? "Không tìm thấy sản phẩm nào khớp với bộ lọc hiện tại."
              : "Chưa có sản phẩm nào trong kho"
          }
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên sản phẩm & Cấu hình chính</th>
                <th>Hãng</th>
                <th>Danh mục</th>
                <th>Giá niêm yết</th>
                <th>Tồn kho</th>
                <th className="text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredPhones.map((phone, index) => (
                <tr key={phone.id}>
                  <td className="text-muted font-mono">{index + 1}</td>
                  <td>
                    <div className="product-cell">
                      <div className="product-icon-box">
                        <Smartphone size={20} />
                      </div>
                      <div>
                        <span
                          className="product-name bold block hover:text-primary cursor-pointer text-base"
                          onClick={() => handleOpenDetail(phone)}
                          title="Nhấn để xem bảng thông số chi tiết"
                        >
                          {phone.name}
                        </span>

                        {/* Huy hiệu thông số tóm tắt */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          {phone.cpu && (
                            <span className="badge-spec cpu">
                              <Cpu size={11} className="inline mr-0.5" />
                              {phone.cpu}
                            </span>
                          )}
                          {phone.screenSize && (
                            <span className="badge-spec screen">
                              <Tv size={11} className="inline mr-0.5" />
                              {phone.screenSize}
                            </span>
                          )}
                          {(phone.ram || phone.storage) && (
                            <span className="badge-spec ram">
                              {phone.ram ? `${phone.ram} RAM` : ""}{" "}
                              {phone.storage ? `• ${phone.storage}` : ""}
                            </span>
                          )}
                          {phone.battery && (
                            <span className="badge-spec battery">
                              Pin {phone.battery}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-brand">{phone.brand?.name || "N/A"}</span>
                  </td>
                  <td>
                    <span className="badge badge-cat">{phone.category?.name || "Smartphone"}</span>
                  </td>
                  <td className="product-price bold text-primary text-base">
                    {formatPrice(phone.price)}
                  </td>
                  <td>
                    <span
                      className={`stock-pill ${
                        phone.quantity > 5
                          ? "in-stock"
                          : phone.quantity > 0
                          ? "low-stock"
                          : "out-stock"
                      }`}
                    >
                      {phone.quantity > 0 ? `${phone.quantity} máy` : "Hết hàng"}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="actions-group justify-end">
                      {/* Xem chi tiết thông số */}
                      <button
                        onClick={() => handleOpenDetail(phone)}
                        className="btn-action edit"
                        title="Xem đầy đủ bảng thông số kỹ thuật (Spec Sheet)"
                      >
                        <Eye size={16} />
                      </button>

                      {/* Quản lý Biến thể */}
                      <button
                        onClick={() => handleOpenVariants(phone)}
                        className="btn-action-pill btn-variant"
                        title="Quản lý biến thể màu sắc, bộ nhớ RAM/ROM"
                      >
                        <Layers size={14} /> Biến thể
                      </button>

                      {/* Sửa thông số máy */}
                      <button
                        onClick={() => handleOpenEdit(phone)}
                        className="btn-action edit"
                        title="Chỉnh sửa thông số điện thoại"
                      >
                        <Edit2 size={16} />
                      </button>

                      {/* Xóa máy */}
                      <button
                        onClick={() => handleDeleteProduct(phone)}
                        className="btn-action delete"
                        title="Xóa sản phẩm"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Thêm / Sửa sản phẩm (Đầy đủ thuộc tính) */}
      <ProductModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSaveProduct}
        editingProduct={editingProduct}
        brands={brands}
        categories={categories}
      />

      {/* Modal Xem chi tiết Thông số kỹ thuật */}
      <ProductDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        phone={detailPhone}
        onEdit={handleOpenEdit}
        onManageVariants={handleOpenVariants}
      />

      {/* Modal Quản lý Biến thể */}
      <VariantModal
        isOpen={variantModalOpen}
        onClose={() => setVariantModalOpen(false)}
        phone={variantPhone}
        onVariantsUpdated={() => fetchPhones(searchTerm)}
      />
    </div>
  );
}
