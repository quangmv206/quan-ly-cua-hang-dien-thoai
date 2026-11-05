import React from "react";
import { ShieldCheck, Truck, RotateCcw, CreditCard } from "lucide-react";

export default function CommitmentEditorial() {
  const policies = [
    {
      icon: ShieldCheck,
      title: "Bảo hành 12 - 18 tháng chính hãng",
      desc: "Toàn bộ smartphone phân phối từ Apple, Samsung, Xiaomi, OPPO đều là hàng mới 100%, kích hoạt bảo hành điện tử chính hãng.",
    },
    {
      icon: Truck,
      title: "Giao hàng hỏa tốc 2 giờ & toàn quốc",
      desc: "Giao siêu tốc nội thành Hà Nội, TP.HCM và miễn phí vận chuyển tiêu chuẩn đến tận tay khách hàng trên 63 tỉnh thành.",
    },
    {
      icon: RotateCcw,
      title: "Đổi mới 1 - 1 trong 30 ngày",
      desc: "Nếu điện thoại gặp bất kỳ lỗi phần cứng nào từ nhà sản xuất, khách hàng được đổi ngay máy mới nguyên seal không mất phí.",
    },
    {
      icon: CreditCard,
      title: "Thanh toán & Trả góp 0% linh hoạt",
      desc: "Hỗ trợ đa dạng phương thức thanh toán: VNPAY, thẻ tín dụng, tiền mặt (COD), xét duyệt trả góp online nhanh chóng trong 15 phút.",
    },
  ];

  return (
    <section id="commitments" className="editorial-section" aria-label="Chính sách bán hàng và cam kết">
      <div className="editorial-container">
        {/* Left-aligned Storytelling Block */}
        <div>
          <span className="editorial-kicker">Chính sách & Cam kết uy tín</span>
          <h2 className="editorial-headline">
            Mua sắm an tâm tuyệt đối. Đặc quyền dịch vụ tận tâm tại [TÊN CỬA HÀNG].
          </h2>
          <p className="editorial-body">
            Chúng tôi cam kết 100% điện thoại phân phối là hàng chính hãng từ các tập đoàn công nghệ hàng đầu thế giới, đi kèm quy trình kiểm tra chất lượng nghiêm ngặt trước khi xuất kho.
          </p>

          {/* 4 Chính sách: Bảo hành, giao hàng, đổi trả, thanh toán */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "28px" }}>
            {policies.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Icon size={18} color="var(--color-ink)" aria-hidden="true" />
                    <strong style={{ fontSize: "14px", fontWeight: 600, color: "var(--color-ink)" }}>
                      {p.title}
                    </strong>
                  </div>
                  <p style={{ fontSize: "12px", color: "var(--color-slate)", margin: 0, lineHeight: 1.4 }}>
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: "32px" }}>
            <a href="tel:18006868" className="link-apple-blue">
              Tổng đài tư vấn & khiếu nại miễn phí: 1800 6868
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" style={{ marginLeft: "4px" }}>
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        {/* Oversized Hardware / Trust Badge Container */}
        <div className="editorial-media-wrapper" style={{ backgroundColor: "var(--color-studio-mist)" }}>
          <div style={{ textAlign: "center", padding: "28px" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
              <div style={{ padding: "8px 14px", backgroundColor: "var(--color-gallery-white)", borderRadius: "10px", border: "1px solid var(--color-hairline-silver)", fontSize: "11px", fontWeight: 600 }}>
                Apple Reseller
              </div>
              <div style={{ padding: "8px 14px", backgroundColor: "var(--color-gallery-white)", borderRadius: "10px", border: "1px solid var(--color-hairline-silver)", fontSize: "11px", fontWeight: 600 }}>
                Samsung Partner
              </div>
              <div style={{ padding: "8px 14px", backgroundColor: "var(--color-gallery-white)", borderRadius: "10px", border: "1px solid var(--color-hairline-silver)", fontSize: "11px", fontWeight: 600 }}>
                Xiaomi Official
              </div>
            </div>

            <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "var(--color-gallery-white)", border: "1px solid var(--color-hairline-silver)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px auto" }}>
              <ShieldCheck size={40} color="var(--color-pricing-blue)" aria-hidden="true" />
            </div>

            <p style={{ fontSize: "15px", fontWeight: 600, color: "var(--color-ink)", margin: "0 0 6px 0" }}>
              Chứng nhận Đại lý ủy quyền chính hãng
            </p>
            <span style={{ fontSize: "12px", color: "var(--color-slate)", display: "block" }}>
              Hệ thống trung tâm bảo hành và điểm tiếp nhận trên 63 tỉnh thành
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
