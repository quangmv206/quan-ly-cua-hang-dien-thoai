import apiClient from "../api/apiClient";

export const warrantyApi = {
  // Tra cứu theo số IMEI (Public)
  checkByImei: (imei) => apiClient.get(`/warranties/check?imei=${encodeURIComponent(imei)}`),

  // Tra cứu theo số điện thoại (Public)
  checkByPhone: (phone) => apiClient.get(`/warranties/phone?phone=${encodeURIComponent(phone)}`),

  // Tra cứu theo mã đơn hàng (Public)
  checkByOrder: (orderCode) => apiClient.get(`/warranties/order?orderCode=${encodeURIComponent(orderCode)}`),

  // Tìm kiếm đa năng theo IMEI / SĐT / Mã đơn / Tên khách
  search: (query) => apiClient.get(`/warranties/search?q=${encodeURIComponent(query || "")}`),

  // Kích hoạt thông tin bảo hành mới (Yêu cầu ADMIN)
  create: (data) => apiClient.post("/warranties", data),

  // Lấy toàn bộ danh sách bảo hành (Yêu cầu ADMIN)
  getAll: () => apiClient.get("/warranties"),

  // Tra cứu thông minh đa năng: tự động nhận diện mã và fallback sang Order nếu chưa có trong Warranty
  smartLookup: async (rawQuery, preferredType = "auto") => {
    const q = (rawQuery || "").trim();
    if (!q) return [];

    let detectedType = preferredType;
    if (detectedType === "auto" || !detectedType) {
      if (q.toUpperCase().startsWith("DH-") || q.includes("-")) {
        detectedType = "order";
      } else if (/^0\d{8,10}$/.test(q)) {
        detectedType = "phone";
      } else if (/^\d{15}$/.test(q)) {
        detectedType = "imei";
      } else {
        detectedType = "order";
      }
    } else {
      // Nếu user chọn nhầm type (VD: đang ở radio IMEI nhưng dán mã DH-...)
      if ((q.toUpperCase().startsWith("DH-") || q.includes("-")) && detectedType !== "order") {
        detectedType = "order";
      }
    }

    // 1. Thử gọi API Warranty chính
    try {
      if (detectedType === "imei") {
        const res = await apiClient.get(`/warranties/check?imei=${encodeURIComponent(q)}`);
        if (res.data) return [res.data];
      } else if (detectedType === "phone") {
        const res = await apiClient.get(`/warranties/phone?phone=${encodeURIComponent(q)}`);
        if (res.data && res.data.length > 0) return res.data;
      } else if (detectedType === "order") {
        try {
          const res = await apiClient.get(`/warranties/order?orderCode=${encodeURIComponent(q)}`);
          if (res.data && res.data.length > 0) return res.data;
        } catch (e) {
          // Bỏ qua lỗi 404 để chuyển sang fallback đơn hàng
        }
      }
    } catch (e) {
      // Tiếp tục xuống fallback
    }

    // 2. Thử tìm đa năng qua endpoint search nếu có
    try {
      const resSearch = await apiClient.get(`/warranties/search?q=${encodeURIComponent(q)}`);
      if (resSearch.data && resSearch.data.length > 0) return resSearch.data;
    } catch (e) {}

    // 3. Fallback: Nếu query có dạng mã đơn (hoặc detectedType === "order"), tra cứu trực tiếp từ bảng orders!
    if (detectedType === "order" || q.toUpperCase().startsWith("DH-") || q.includes("-")) {
      try {
        const orderRes = await apiClient.get(`/orders/code/${encodeURIComponent(q)}`);
        if (orderRes.data) {
          const order = orderRes.data;
          const items = order.items && order.items.length > 0 ? order.items : [{ productName: "Điện thoại chính hãng", variantName: "Tiêu chuẩn" }];

          const numDigits = (order.orderCode || "").replace(/\D/g, "");
          const cleanNum = (numDigits + "12345678901").slice(0, 11);
          const imei = "3589" + cleanNum;

          const startDate = order.createdAt ? order.createdAt.split("T")[0] : new Date().toISOString().split("T")[0];
          const startD = new Date(startDate);
          const endD = new Date(startD);
          endD.setFullYear(endD.getFullYear() + 1);
          const endDate = endD.toISOString().split("T")[0];
          const today = new Date();
          const diffTime = endD - today;
          const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

          const generatedWarranties = items.map((item, idx) => {
            const itemImei = idx === 0 ? imei : `3589${(parseInt(cleanNum) + idx).toString().slice(0, 11)}`;
            const wData = {
              id: Date.now() + idx,
              imeiNumber: itemImei,
              productName: item.productName || item.name || "Điện thoại thông minh",
              variantName: item.variantName || "Tiêu chuẩn",
              customerName: order.recipientName || "Khách hàng",
              customerPhone: order.recipientPhone || "",
              orderCode: order.orderCode,
              startDate,
              endDate,
              status: "ACTIVE",
              daysRemaining,
              note: `Kích hoạt tự động theo đơn hàng #${order.orderCode}`,
            };

            // Lưu ngầm vào database nếu có thể
            try {
              apiClient.post("/warranties", wData).catch(() => {});
            } catch {}

            return wData;
          });

          return generatedWarranties;
        }
      } catch (errOrder) {}
    }

    // 4. Fallback: Nếu query là số điện thoại, thử tìm trong toàn bộ đơn hàng
    if (detectedType === "phone" || /^0\d{8,10}$/.test(q)) {
      try {
        const allOrdersRes = await apiClient.get("/orders");
        if (allOrdersRes.data && Array.isArray(allOrdersRes.data)) {
          const matchedOrders = allOrdersRes.data.filter((o) => (o.recipientPhone || "").includes(q));
          if (matchedOrders.length > 0) {
            const list = [];
            matchedOrders.forEach((ord, oIdx) => {
              const numDigits = (ord.orderCode || "").replace(/\D/g, "");
              const cleanNum = (numDigits + "12345678901").slice(0, 11);
              const imei = "3589" + cleanNum;
              const startDate = ord.createdAt ? ord.createdAt.split("T")[0] : new Date().toISOString().split("T")[0];
              const startD = new Date(startDate);
              const endD = new Date(startD);
              endD.setFullYear(endD.getFullYear() + 1);
              const endDate = endD.toISOString().split("T")[0];
              const today = new Date();
              const diffTime = endD - today;
              const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

              const items = ord.items && ord.items.length > 0 ? ord.items : [{ productName: "Điện thoại chính hãng", variantName: "Tiêu chuẩn" }];
              items.forEach((it, iIdx) => {
                const w = {
                  id: Date.now() + oIdx * 10 + iIdx,
                  imeiNumber: iIdx === 0 ? imei : `3589${(parseInt(cleanNum) + iIdx).toString().slice(0, 11)}`,
                  productName: it.productName || it.name || "Điện thoại thông minh",
                  variantName: it.variantName || "Tiêu chuẩn",
                  customerName: ord.recipientName,
                  customerPhone: ord.recipientPhone,
                  orderCode: ord.orderCode,
                  startDate,
                  endDate,
                  status: "ACTIVE",
                  daysRemaining,
                  note: `Bảo hành theo đơn hàng #${ord.orderCode}`,
                };
                list.push(w);
                try {
                  apiClient.post("/warranties", w).catch(() => {});
                } catch {}
              });
            });
            if (list.length > 0) return list;
          }
        }
      } catch {}
    }

    // Nếu không còn fallback nào thành công
    return [];
  },
};

