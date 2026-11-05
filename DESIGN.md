# Hệ thiết kế — Website cửa hàng điện thoại [TÊN CỬA HÀNG]
> Phòng trưng bày trắng. Sản phẩm là sự kiện thị giác; chữ, màu xanh và chuyển động đều giữ ở mức "yên tĩnh" để không tranh sự chú ý với sản phẩm.

**Theme:** light · **Ngôn ngữ giao diện:** tiếng Việt · **Phiên bản:** 1.0

## 0. Cách đọc file này

File này được tái cấu trúc từ `DESIGN.md` gốc (phong cách trang sản phẩm Apple). Mỗi quy tắc được gắn nguồn gốc:

| Nhãn | Nghĩa |
|---|---|
| **(G)** | Lấy nguyên từ file gốc |
| **(G→M)** | Lấy từ file gốc nhưng đã điều chỉnh, kèm lý do |
| **(M)** | Mới, do bổ sung. File gốc không có |

**Quan trọng về chuyển động.** File gốc không có thông số chuyển động nào. Toàn bộ mục 7 là **(M)**: được xây theo các mẫu chuyển động phổ biến trên trang giới thiệu sản phẩm cao cấp và các nguyên tắc về hiệu năng, tiếp cận. Chúng **không được đo từ trang iPhone Duo thật**, nên đừng coi các con số là "chuẩn Apple". Hãy chỉnh bằng cảm nhận trên thiết bị thật.

Dùng `[...]` làm chỗ giữ chỗ cho nội dung chưa có (giá, tên máy, địa chỉ). Không tự bịa dữ liệu.

---

## 1. Nguyên lý thiết kế

1. **Sản phẩm là trung tâm (G).** Ảnh máy lớn, nền sạch; chữ gọn, đen; giao diện lùi ra sau.
2. **Một màu nhấn (G).** Xanh chỉ dùng cho liên kết và nút chuyển đổi nhỏ gọn.
3. **Phẳng, không đổ bóng, không gradient (G).** Độ sâu đến từ tương phản nền trắng/xám nhạt, góc bo 28px và viền 1px.
4. **Chuyển động phục vụ nội dung (M).** Mỗi chuyển động phải trả lời một câu hỏi: nó giúp khách hiểu gì, theo dõi gì, hay xác nhận gì? Không trả lời được thì bỏ.
5. **Chuyển động theo cuộn là "diễn viên chính" duy nhất (M).** Hero và 1–2 khối câu chuyện được phép có hiệu ứng theo cuộn nổi bật. Phần còn lại chỉ có phản hồi nhẹ.
6. **Luôn dùng được khi không có chuyển động (M).** Tắt hết animation thì trang vẫn đầy đủ nội dung và đúng bố cục.
7. **Dữ liệu thật (M).** Giá, khuyến mãi, "bán chạy", "mới về" phải khớp thực tế.

---

## 2. Màu sắc

### 2.1 Màu từ file gốc (G)

| Tên | Giá trị | Token | Vai trò |
|---|---|---|---|
| Gallery White | `#ffffff` | `--color-gallery-white` | Nền trang, hero, thẻ |
| Studio Mist | `#f5f5f7` | `--color-studio-mist` | Dải section xen kẽ, footer, khung giữ chỗ ảnh |
| Paper Frost | `#fafafc` | `--color-paper-frost` | Menu điều hướng đang mở |
| Hairline Silver | `#d6d6d6` | `--color-hairline-silver` | Đường kẻ 1px |
| Control Gray | `#e6e6e8` | `--color-control-gray` | Nút vô hiệu, viền nav |
| Ink | `#1d1d1f` | `--color-ink` | Tiêu đề, văn bản chính |
| Slate | `#707070` | `--color-slate` | Văn bản phụ, pháp lý |
| Steel | `#86868b` | `--color-steel` | Viền ô nhập, viền nút phụ. **Không dùng cho chữ** |
| Apple Blue | `#0066cc` | `--color-apple-blue` | Liên kết chữ |
| Pricing Blue | `#0071e3` | `--color-pricing-blue` | Nút nền đặc (CTA) |
| Launch Orange | `#b64400` | `--color-launch-orange` | Nhãn trạng thái dạng chữ trần |

### 2.2 Màu bổ sung (M)

| Tên | Giá trị | Token | Vai trò | Ghi chú |
|---|---|---|---|---|
| Pricing Blue Hover | `#0066cc` | `--color-pricing-blue-hover` | Nút CTA khi rê chuột | **Làm tối** thay vì làm sáng: làm sáng (`#0077ed`) khiến chữ trắng chỉ còn khoảng 4,3:1, không đạt AA |
| Pricing Blue Active | `#0058b0` | `--color-pricing-blue-active` | Nút CTA khi nhấn | |
| Focus Ring | `#0071e3` | `--color-focus` | Vòng focus 2px, offset 2px | Tương phản trên nền trắng khoảng 4,7:1 |
| Error | `#c62828` | `--color-error` | Lỗi biểu mẫu | Khoảng 5,6:1 trên trắng |
| Success | `#1e7a3c` | `--color-success` | Xác nhận thành công | Khoảng 5,4:1 trên trắng |

> Các tỷ lệ tương phản là ước tính của tôi; hãy kiểm tra lại bằng công cụ trước khi phát hành.

### 2.3 Quy tắc màu

- Nền mặc định `#ffffff`; `#f5f5f7` chỉ cho dải section toàn chiều rộng và footer (G).
- `#0071e3` chỉ cho nút nền đặc nhỏ gọn, chữ trắng ≥ 14px. Không dùng làm nền lớn (G→M: nâng cỡ chữ từ 12px lên 14px).
- `#0066cc` chỉ cho liên kết chữ; không tô xanh mọi mục điều hướng (G).
- Nhãn trạng thái ("Mới", "Giảm giá", "Bán chạy") là chữ `#b64400` trần, không nền (G).
- Không dùng gradient (G).
- Không truyền đạt thông tin chỉ bằng màu (M).

---

## 3. Chữ

### 3.1 Họ chữ

| Vai trò | Token | Stack |
|---|---|---|
| Hiển thị (≥ 19px) | `--font-display` | `"SF Pro Display", "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif` |
| Văn bản | `--font-text` | `"SF Pro Text", "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif` |

(G→M) File gốc dùng SF Pro, nhưng font này bị giới hạn bản quyền khi dùng trên web ngoài nền tảng Apple. Hãy **tự lưu trữ Inter** (hỗ trợ đủ glyph tiếng Việt) và đặt trước `-apple-system` như trên. Trên thiết bị Apple, `-apple-system` sẽ dùng chính font hệ thống. Inter có độ rộng chữ khác SF, nên cần kiểm tra mắt lại tracking.

### 3.2 Thang chữ

Letter-spacing đổi sang **em** để co giãn theo cỡ chữ (G→M; giá trị px của file gốc ghi trong ngoặc).

| Vai trò | Họ | Weight | Cỡ | Line-height | Tracking | Token |
|---|---|---|---|---|---|---|
| global-nav | text | 400 | 12px | 1 | -0.01em (-0.12px) | `--text-global-nav` |
| compact-control | text | 400 | 14px* | 1.43 | -0.016em | `--text-control` |
| body-small | text | 400 | 14px | 1.29 | -0.016em (-0.224px) | `--text-body-small` |
| body | text | 400 | 17px | 1.47 | -0.022em (-0.374px) | `--text-body` |
| feature-copy | text | 400 | 17px | 1.35* | -0.022em | `--text-feature-copy` |
| product-nav-title | display | 600 | 19px | 1.21 | +0.012em | `--text-nav-title` |
| product-kicker | display | 600 | 21px | 1.1* | +0.011em | `--text-kicker` |
| card-title | display | 600 | 24px | 1.2 | 0 | `--text-card-title` |
| feature-heading | display | 600 | clamp(28px, 4vw, 40px) | 1.12* | 0 | `--text-feature-heading` |
| hero-display | display | 600 | clamp(40px, 7vw, 80px) | 1.1* | -0.015em (-1.2px tại 80px) | `--text-hero` |

\* Khác file gốc. Lý do: file gốc dùng 12px cho nút (nhỏ hơn mức dễ chạm và dễ đọc) và line-height 1.0–1.05 cho tiêu đề. **Tiếng Việt có dấu chồng** (ví dụ "Ộ", "Ể") nên line-height quá chặt làm dấu của dòng dưới chạm dòng trên. Đã nới lên 1.1–1.12; hãy kiểm tra với chuỗi nhiều dấu. Cỡ 24px và 28px của file gốc chỉ xuất hiện ở component, nay được gom vào `card-title`.

### 3.3 Quy tắc chữ

- Hero luôn `font-weight: 600`, không dùng 700 (G).
- Tiêu đề dùng `text-wrap: balance` để tránh chữ lẻ ở dòng cuối (M).
- Giá tiền dùng `font-variant-numeric: tabular-nums`; định dạng bằng `Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })` (M).
- **Không** dùng OpenType `"numr"` của file gốc: đây là tính năng tử số phân số, có vẻ là lỗi trích xuất (M).
- Không đặt `overflow: hidden` sát khối chữ lớn, tránh cắt dấu tiếng Việt (M).

---

## 4. Khoảng cách, hình dạng, độ sâu

### 4.1 Khoảng cách

Đơn vị cơ sở 4px (G). **Đặt tên theo ngữ nghĩa** để không đụng thang `p-4 = 1rem` mặc định của Tailwind (G→M).

| Token | Giá trị | Dùng cho |
|---|---|---|
| `--space-xs` | 8px | Khoảng cách rất nhỏ |
| `--space-sm` | 12px | Giữa các pill |
| `--space-md` | 20px | Khoảng cách giữa các phần tử liên quan (G: "element gap") |
| `--space-lg` | 28px | Padding thẻ (G: "card padding") |
| `--space-xl` | 48px | Giữa tiêu đề section và nội dung |
| `--space-2xl` | 80px | Padding dọc dải section |
| `--space-section` | clamp(56px, 8vw, 88px) | Giữa các section (G→M: file gốc 90px, nằm ngoài thang 4px; đổi về 88px) |

### 4.2 Bo góc (đã rút gọn, G)

| Phần tử | Giá trị | Token |
|---|---|---|
| Thẻ, ảnh chứa | 28px | `--radius-card` |
| Liên kết | 10px | `--radius-link` |
| Điều hướng nổi | 20px | `--radius-nav` |
| Cụm điều khiển carousel | 36px | `--radius-control` |
| Nút, pill | 9999px | `--radius-pill` |
| Ô tìm kiếm | 980px | `--radius-input` |
| Nhãn trạng thái | 0 | — |

Các token bo tròn dư (120, 170, 999px...) trong file gốc đã bỏ.

### 4.3 Độ sâu (G)

- **Không đổ bóng** cho thẻ, khối biên tập hay khung giá nổi.
- Vòng viền: `--ring-subtle: 0 0 0 1px #e6e6e8` và `--ring-strong: 0 0 0 1px #86868b`. Đây là **viền**, không phải bóng.
- Phân tách bề mặt bằng tương phản `#ffffff` trên `#f5f5f7` và viền 1px `#d6d6d6`.

| Cấp | Bề mặt | Giá trị |
|---|---|---|
| 0 | Gallery White | `#ffffff` |
| 1 | Studio Mist | `#f5f5f7` |
| 2 | Paper Frost (menu mở) | `#fafafc` |
| 3 | Control Gray (vô hiệu) | `#e6e6e8` |

---

## 5. Bố cục và căn chỉnh (M, trừ ghi chú)

| Hạng mục | Giá trị |
|---|---|
| Chiều rộng nội dung tối đa | 1200px, căn giữa |
| Lề hai bên | 16px (< 640) · 24px (≥ 640) · 40px (≥ 1024) |
| Lưới | 12 cột, khoảng cách 20px |
| Breakpoint | 640 · 1024 · 1280 |
| Văn bản đoạn | Tối đa khoảng 60–70 ký tự mỗi dòng |

**Quy tắc căn chỉnh**

- Hero, ảnh sản phẩm, thẻ phương tiện: **căn giữa** (G).
- Khối biên tập và văn bản đọc: **căn trái**; ảnh lớn đi vào từ phía đối diện (G).
- Tiêu đề section trái, liên kết "Xem tất cả" phía đối diện, căn theo **baseline** (`align-items: baseline`), không căn giữa dọc.
- Thẻ sản phẩm là cột flex; phần giá và nút luôn dính đáy (`margin-top: auto`); tên sản phẩm giữ chỗ 2 dòng (`min-height: 2.4em`) để các thẻ cùng hàng thẳng nhau.
- Nhãn trạng thái luôn ở cùng một vị trí trong mọi thẻ (phía trên tên).
- Mép trái của tiêu đề, đoạn văn và thẻ đầu tiên nằm trên cùng một đường dọc.
- Trong bảng và giỏ hàng, cột giá **căn phải**.

---

## 6. Thành phần (components)

### 6.1 Điều hướng chung (Global Nav)
Cao 44px, nền trắng, chữ 12px/400, nhãn `rgba(0,0,0,0.8)`, điều khiển không có khung (G). Gồm: logo, danh mục, tìm kiếm, tài khoản, giỏ hàng có số lượng.
- Nền khi cuộn: `rgba(255,255,255,0.8)` kèm `backdrop-filter: saturate(180%) blur(20px)`; **chỉ dùng blur ở thanh này** vì rất tốn GPU (M).
- Menu mở: nền `#fafafc`, viền `#e6e6e8` 1px, blur 20px (G).
- Mobile: nút menu mở ngăn kéo; tìm kiếm và giỏ hàng nằm ngoài ngăn kéo (M).
- Chuyển động: xem 7.5.

### 6.2 Điều hướng cục bộ (Local Nav)
Tên mục 19px/600 bên trái; nhóm pill căn phải (G). Khi nổi trên trang, bo 20px, viền `#d6d6d6` (G). Dính đầu trang khi cuộn (M).

### 6.3 Nút
| Loại | Quy cách |
|---|---|
| **CTA (Pricing Blue)** | Nền `#0071e3`, chữ trắng 14px/400, bo 9999px, cao tối thiểu 44px. Hover → `--color-pricing-blue-hover`; active → `--color-pricing-blue-active` kèm `scale(0.98)` |
| **Phụ (Explore)** | Nền trong suốt, chữ Ink, viền 1px `#86868b`, bo 9999px, cao tối thiểu 44px. **Không tô nền màu** (G). Hover: nền `#f5f5f7` |
| **Liên kết** | Chữ `#0066cc` 17px, mũi tên `›` ở cuối. Hover: gạch chân |
| **Vô hiệu** | Nền `#e6e6e8`, chữ `#707070`, `cursor: not-allowed` |

Vòng focus: `outline: 2px solid var(--color-focus); outline-offset: 2px` cho mọi phần tử tương tác (M).

### 6.4 Hero (Product Stage)
Nền `#ffffff`, toàn chiều rộng. Nhãn 21px/600 căn giữa, tiêu đề hero căn giữa, ảnh sản phẩm đặt ngay dưới, **không có khung thẻ** (G). Có một nút chính và tối đa một liên kết phụ.
- Ảnh hero là ứng viên LCP: `fetchpriority="high"`, không lazy-load, đặt `width`/`height` hoặc `aspect-ratio` (M).

### 6.5 Khung giá nổi (Floating Pricing Callout)
Nền trắng, bo 28px, **không bóng**; chữ giá 14px/600; chứa một nút CTA (G). Dùng `--ring-subtle` để tách khỏi ảnh (G→M). Không đặt khối dày đặc đè lên sản phẩm (G).

### 6.6 Điều hướng neo trong trang (Section Anchor Nav)
Danh sách ngang, nhãn 17px/500, line-height 25px, padding dọc 28px, không gạch chân, không nền (G). Mục đang xem có chữ đậm hơn và thanh chỉ báo 2px dưới chân (M, xem 7.6).

### 6.7 Dải sản phẩm (Product Stage)
Dùng cho **Hàng mới về, Giảm giá, Bán chạy**. Nền `#f5f5f7` toàn chiều rộng; tiêu đề lớn bên trái, liên kết xanh phía đối diện (G). Mỗi dải 4–8 thẻ, dạng lưới hoặc carousel cuộn ngang.

| Dải | Dữ liệu bắt buộc | Nhãn |
|---|---|---|
| Hàng mới về | Ngày về hàng thật; tự gỡ nhãn sau 30–60 ngày | "Mới" |
| Giảm giá | Giá gốc đã áp dụng thật, giá mới, thời hạn | "Giảm [X]%" |
| Bán chạy | Doanh số thật theo kỳ cố định (ghi rõ "30 ngày qua") | "Bán chạy" |

Mỗi sản phẩm chỉ xuất hiện ở **một** dải trên trang chủ.

### 6.8 Thẻ sản phẩm (Feature Media Card, mở rộng)
Nền trắng, bo 28px, không viền, không bóng; padding 28px; ảnh căn giữa, được phép tràn khỏi mép thẻ (G).

Cấu trúc từ trên xuống: nhãn trạng thái → tên (24px/600, tối đa 2 dòng) → ảnh (tỷ lệ cố định) → giá (giá gốc `#707070` gạch ngang nếu có, giá mới Ink 17px/600) → dòng trả góp nếu có → nút CTA + liên kết "Chi tiết ›".

Trạng thái hết hàng: nhãn "Hết hàng" chữ trần, nút CTA chuyển thành "Báo khi có hàng", ảnh giảm độ mờ còn 0,6.

### 6.9 Điều khiển carousel (Playback Control)
Cụm pill bo 36px, nền `rgba(210,210,215,0.64)`, ký hiệu `rgba(0,0,0,0.56)`; gồm các chấm vị trí và nút tạm dừng, **không có khung thẻ** (G). Tự chạy phải có nút tạm dừng (M, xem 7.7).

### 6.10 Khối biên tập (Editorial Block)
Nhãn nhỏ Ink → tiêu đề hiển thị lớn căn trái → đoạn văn 17px/400, tracking -0.022em; ảnh lớn đi vào từ phía đối diện (G).

### 6.11 Ô tìm kiếm
Nền trắng, chữ Ink 13px Arial, padding trái 24px, phải 45px, viền 1px `#86868b`, bo 980px; **ẩn mặc định, mở rộng từ thanh điều hướng** (G). Có danh sách gợi ý thả xuống bên dưới (M); xử lý không dấu tiếng Việt (ví dụ gõ "dien thoai" vẫn ra kết quả).

### 6.12 Nhãn trạng thái
Chữ `#b64400` 12px/600, line-height 16px, không nền, không viền (G).

### 6.13 Thành phần thương mại bổ sung (M)

| Thành phần | Quy cách |
|---|---|
| **Bộ lọc** | Dạng pill chọn nhiều ở desktop; ngăn kéo từ dưới lên ở mobile. Hiện số kết quả |
| **Chọn biến thể** (màu, dung lượng) | Nhóm lựa chọn có viền 1px `#86868b`; mục chọn dùng `--ring-strong` dày 2px, không đổi nền |
| **Chọn số lượng** | Nút −/+ cao 44px, giá trị có `aria-live="polite"` |
| **Ngăn kéo giỏ hàng** | Trượt từ phải, nền trắng, viền trái 1px; khoá cuộn nền khi mở |
| **Thông báo (toast)** | Nền Ink, chữ trắng, bo 28px, tự đóng sau 4 giây, có nút đóng; `role="status"` |
| **Khối trả góp / thu cũ đổi mới** | Chỉ dựng nếu dịch vụ có thật; ghi rõ số tiền là ước tính |
| **Dải chính sách** | 3–4 mục: bảo hành, giao hàng, đổi trả, thanh toán; mỗi mục một dòng và liên kết |
| **Banner cookie** | Từ chối ngang hàng với chấp nhận; không chọn sẵn đồng ý |
| **Footer** | Nền `#f5f5f7`; cột liên kết; thông tin pháp lý, địa chỉ, giờ mở cửa; chữ pháp lý `#707070` |

---

## 7. Hệ thống chuyển động (M, toàn bộ mục)

### 7.1 Nguyên tắc

1. **Chỉ animate `transform` và `opacity`.** Không animate `width`, `height`, `top`, `left`, `margin` (gây reflow, giật trên máy yếu).
2. **Chuyển động theo cuộn "bám" vào thao tác của người dùng,** không tự chạy một mình, trừ carousel có nút tạm dừng.
3. **Vào chậm, ra nhanh.** Phần tử xuất hiện dùng easing giảm tốc; thoát nhanh hơn.
4. **Tiết chế.** Mỗi màn hình có tối đa một "điểm nhấn" chuyển động lớn.
5. **Không chặn tương tác.** Không có animation nào khiến nút bấm không được trong lúc chạy.
6. **Giữ nội dung hiển thị nếu JS hoặc animation lỗi.**

### 7.2 Token chuyển động

```css
:root {
  /* Thời lượng */
  --dur-instant: 100ms;   /* nhấn nút */
  --dur-fast:    200ms;   /* hover, đổi màu */
  --dur-base:    350ms;   /* mở/đóng menu, tìm kiếm, toast */
  --dur-slow:    700ms;   /* hiện dần khi cuộn */
  --dur-hero:   1000ms;   /* vào trang của hero */

  /* Đường cong */
  --ease-standard: cubic-bezier(0.25, 0.1, 0.25, 1);   /* mặc định */
  --ease-out:      cubic-bezier(0.16, 1, 0.3, 1);      /* vào: giảm tốc mạnh, êm */
  --ease-in:       cubic-bezier(0.4, 0, 1, 1);         /* ra */
  --ease-in-out:   cubic-bezier(0.65, 0, 0.35, 1);     /* trượt lớn */

  /* Khoảng dịch và so le */
  --reveal-distance: 24px;
  --stagger-step:    80ms;   /* tối đa 6 phần tử, vượt thì dùng chung một nhịp */
}
```

### 7.3 Danh mục chuyển động

| Vị trí | Hiệu ứng | Thời lượng · easing | Kích hoạt |
|---|---|---|---|
| Nút CTA | Đổi màu nền; nhấn thu nhỏ `scale(0.98)` | 200ms / 100ms · standard | hover, active |
| Liên kết | Gạch chân hiện | 200ms · standard | hover |
| Thẻ sản phẩm | Ảnh phóng `scale(1.03)` trong khung (khung giữ nguyên) | 350ms · out | hover (chỉ thiết bị có chuột) |
| Hero, lúc tải trang | Nhãn → tiêu đề → ảnh hiện dần và trượt lên 24px, so le | 1000ms · out | tải trang |
| Hero, khi cuộn | Ảnh sản phẩm thu nhỏ nhẹ và dịch lên; chữ mờ dần | theo cuộn · tuyến tính | cuộn |
| Section / thẻ | Hiện dần và trượt lên 24px | 700ms · out | vào khung nhìn |
| Điều hướng chung | Nền chuyển từ trong suốt sang mờ kính | 350ms · standard | cuộn quá 8px |
| Menu / mega menu | Nền mờ + nội dung trượt xuống 8px, mờ dần vào | 350ms · out (vào), 200ms · in (ra) | mở/đóng |
| Ô tìm kiếm | Mở rộng bằng `scaleX` từ icon + hiện dần | 350ms · in-out | bấm |
| Điều hướng neo | Thanh chỉ báo trượt tới mục đang xem | 350ms · in-out | cuộn |
| Carousel | Cuộn mượt có điểm dừng; chấm hiện tiến độ | 500ms · in-out | tự chạy / vuốt |
| Ngăn kéo giỏ hàng | Trượt từ phải; lớp phủ mờ dần | 350ms · out | mở/đóng |
| Thêm vào giỏ | Số trên icon giỏ nảy nhẹ; toast hiện | 350ms · out | thao tác |
| Chuyển trang | Chuyển mờ chéo giữa hai trang | 300ms · standard | điều hướng |

### 7.4 Hiệu ứng theo cuộn (cách làm)

**Cách 1 (ưu tiên): CSS scroll-driven animations.** Chạy trên luồng hợp thành, không cần JavaScript.

```css
@keyframes reveal {
  from { opacity: 0; transform: translateY(var(--reveal-distance)); }
  to   { opacity: 1; transform: none; }
}

@supports (animation-timeline: view()) {
  .reveal {
    animation: reveal linear both;
    animation-timeline: view();
    animation-range: entry 0% entry 55%;
  }
}
```

**Cách 2 (dự phòng cho trình duyệt chưa hỗ trợ): `IntersectionObserver`.**

```css
.js .reveal--io { opacity: 0; transform: translateY(var(--reveal-distance));
  transition: opacity var(--dur-slow) var(--ease-out),
              transform var(--dur-slow) var(--ease-out); }
.js .reveal--io.is-in { opacity: 1; transform: none; }
```

```js
if (!CSS.supports('animation-timeline: view()')) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll('.reveal--io').forEach((el) => io.observe(el));
}
```

Lớp `.js` chỉ được gắn bằng một dòng script trong `<head>`; nếu JS lỗi, nội dung vẫn hiển thị.

**Hero theo cuộn (scrub).**

```css
@supports (animation-timeline: view()) {
  .hero__media {
    animation: hero-shrink linear both;
    animation-timeline: view();
    animation-range: exit 0% exit 80%;
  }
}
@keyframes hero-shrink {
  to { transform: translateY(-4%) scale(0.92); opacity: 0.6; }
}
```

**Khối câu chuyện "ghim" (sticky).** Dùng tối đa 1–2 khối trên toàn trang: vùng chứa cao 200–300vh, phần ảnh `position: sticky; top: 0; height: 100vh`, các đoạn chữ cuộn qua và ảnh chuyển mờ chéo giữa các trạng thái. Hạn chế việc "tua" chuỗi ảnh hay video theo cuộn (nặng): nếu bạn cần, giới hạn một khối, dung lượng tổng ≤ 2MB và có ảnh tĩnh thay thế.

**Thư viện (tùy chọn).** Với kịch bản phức tạp, có thể dùng GSAP + ScrollTrigger; chỉ nạp ở trang cần và nạp sau (`defer`/import động). Không cần cho trang chủ ở giai đoạn đầu.

### 7.5 Chuyển trang

```css
@view-transition { navigation: auto; }
::view-transition-old(root) { animation: 200ms var(--ease-in) both fade-out; }
::view-transition-new(root) { animation: 300ms var(--ease-out) both fade-in; }
```

Trình duyệt chưa hỗ trợ sẽ chuyển trang bình thường. Kiểm tra mức hỗ trợ hiện hành trước khi dựa vào.

### 7.6 Điều hướng neo và thanh chỉ báo

Thanh chỉ báo dưới mục đang xem dùng `transform: translateX(...) scaleX(...)` trong 350ms `--ease-in-out`, không đổi `left`/`width`. Mục đang xem được xác định bằng `IntersectionObserver`.

### 7.7 Carousel

- Khung cuộn: `scroll-snap-type: x mandatory; scroll-behavior: smooth; overscroll-behavior-x: contain`.
- Tự chạy mỗi **6 giây**; **dừng khi** rê chuột, có focus bên trong, tab ẩn, hoặc người dùng bấm tạm dừng. **Không tự chạy** khi `prefers-reduced-motion: reduce`.
- Chấm đang xem có thanh tiến độ chạy bằng `transform: scaleX(0 → 1)` trong 6 giây.
- Nút Trước/Sau, tạm dừng và chấm đều là `<button>` có `aria-label`; vùng chạm ≥ 44px.
- Khi ở trạng thái tạm dừng, lưu lựa chọn trong phiên.

### 7.8 Tôn trọng người dùng giảm chuyển động

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  .reveal, .reveal--io { opacity: 1 !important; transform: none !important; animation: none !important; }
  .hero__media { animation: none !important; transform: none !important; opacity: 1 !important; }
}
```

Kèm theo: tắt tự chạy carousel, tắt chuyển trang bằng View Transitions, thay hiệu ứng trượt bằng hiện mờ nhanh (≤ 150ms) hoặc không có.

### 7.9 Ngân sách hiệu năng chuyển động

| Hạng mục | Giới hạn |
|---|---|
| Khung hình | Mục tiêu 60fps trên máy tầm trung |
| `will-change` | Chỉ đặt tạm khi animation sắp chạy, gỡ sau khi xong; không đặt cho hàng loạt phần tử |
| `backdrop-filter` | Chỉ cho thanh điều hướng, không cho vùng lớn |
| Số phần tử có hiệu ứng cuộn cùng lúc | Tối đa khoảng 6 trong một khung nhìn |
| Chuỗi ảnh/video theo cuộn | Tối đa 1 khối, tổng ≤ 2MB, có ảnh dự phòng |
| INP | ≤ 200ms; CLS ≤ 0,1; LCP ≤ 2,5s. Hiệu ứng không được làm xấu các chỉ số này |

---

## 8. Cấu trúc trang chủ (M)

| # | Khối | Ghi chú chuyển động |
|---|---|---|
| 1 | Điều hướng chung | Nền kính mờ khi cuộn |
| 2 | Tìm kiếm | Mở rộng từ icon |
| 3 | Hero | Vào trang so le; scrub nhẹ khi cuộn |
| 4 | Danh mục / mua theo hãng | Hiện dần |
| 5 | Hàng mới về | Hiện dần theo thẻ, so le tối đa 6 |
| 6 | Sản phẩm giảm giá | Hiện dần |
| 7 | Bán chạy / Hot trend | Hiện dần |
| 8 | Chính sách và cam kết | Hiện dần |
| 9 | Liên hệ và địa chỉ | Không hiệu ứng |
| 10 | Footer | Không hiệu ứng |

Khối khuyến mãi có đếm ngược chỉ thêm khi có thời hạn thật. Khối trả góp, thu cũ đổi mới thêm khi dịch vụ có thật.

---

## 9. Nội dung và pháp lý (M)

- Không bịa giá, tên sản phẩm, thông số, đánh giá, số liệu hay khuyến mãi. Dùng `[GIÁ]`, `[TÊN SẢN PHẨM]`.
- Giá gốc gạch ngang phải là mức đã bán thực tế; không thổi phồng để tạo cảm giác giảm sâu.
- Đồng hồ đếm ngược phải khớp thời điểm kết thúc thật; không "làm mới" khi khách quay lại.
- "Bán chạy", "Mới về" phải dựa trên số liệu thật, ghi rõ kỳ tính.
- Đánh giá khách hàng chỉ dùng đánh giá thật, không lọc bỏ toàn bộ đánh giá tiêu cực.
- Logo hãng chỉ dùng khi được phép và đúng tư cách (đại lý ủy quyền hay không).
- Cần có thông tin doanh nghiệp, chính sách bảo hành, đổi trả, bảo mật. Quy định thay đổi theo thời gian: hãy đối chiếu văn bản hiện hành hoặc hỏi luật sư.

---

## 10. Tiếp cận (M)

- Dùng phần tử ngữ nghĩa: `<button>`, `<a href>`, `<label>` + `<input>`, `<nav>`, `<main>`; không dùng `div` có `onClick`.
- Nút chỉ có icon phải có `aria-label`; ảnh trang trí `aria-hidden="true"`; mọi ảnh sản phẩm có `alt`.
- Tương phản chữ ≥ 4,5:1 (chữ ≥ 24px: ≥ 3:1). Viền và icon điều khiển ≥ 3:1.
- Vùng chạm ≥ 44×44px.
- Điều hướng hoàn toàn bằng bàn phím; thứ tự Tab theo thứ tự hiển thị; có liên kết "Bỏ qua tới nội dung chính".
- Mọi animation tự chạy trên 5 giây phải có cách tạm dừng (WCAG 2.2.2).

---

## 11. Điều nên và không nên

### Nên
- Giữ nền trắng làm mặc định; dùng `#f5f5f7` cho dải section toàn chiều rộng và footer (G).
- Bo 28px cho thẻ và ảnh chứa; không bóng (G).
- Dùng `#0071e3` chỉ cho nút CTA nhỏ gọn; `#0066cc` cho liên kết chữ (G).
- Animate `transform`/`opacity`; giữ chuyển động ngắn và có mục đích (M).
- Kiểm thử trên điện thoại tầm trung thật, không chỉ trên máy lập trình (M).

### Không nên
- Không dùng gradient, đổ bóng cho thẻ, khối biên tập, khung giá (G).
- Không đổi bo 28px thành 8px, 12px hay góc vuông (G).
- Không dùng `#0071e3` làm nền lớn hay làm màu nút phổ quát (G).
- Không đặt hero ở weight 700 hay tracking rộng hơn -0.015em tại 80px (G).
- Không dùng nhãn trạng thái dạng pill có nền màu (G).
- Không đặt khối UI dày đặc đè lên ảnh sản phẩm (G).
- Không làm nút CTA **sáng hơn** khi hover (làm tụt tương phản chữ trắng) (M).
- Không tự chạy carousel khi người dùng chọn giảm chuyển động (M).
- Không animate bố cục (`width`, `height`, `top`, `left`) (M).
- Không dùng nhiều hơn một "điểm nhấn" chuyển động lớn trong cùng khung nhìn (M).

---

## 12. Quick Start

### 12.1 CSS Custom Properties

```css
:root {
  /* Màu (G) */
  --color-gallery-white: #ffffff;
  --color-studio-mist: #f5f5f7;
  --color-paper-frost: #fafafc;
  --color-hairline-silver: #d6d6d6;
  --color-control-gray: #e6e6e8;
  --color-ink: #1d1d1f;
  --color-slate: #707070;
  --color-steel: #86868b;
  --color-apple-blue: #0066cc;
  --color-pricing-blue: #0071e3;
  --color-launch-orange: #b64400;
  /* Màu (M) */
  --color-pricing-blue-hover: #0066cc;
  --color-pricing-blue-active: #0058b0;
  --color-focus: #0071e3;
  --color-error: #c62828;
  --color-success: #1e7a3c;

  /* Chữ */
  --font-display: "SF Pro Display", "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --font-text: "SF Pro Text", "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;

  /* Khoảng cách */
  --space-xs: 8px;  --space-sm: 12px; --space-md: 20px; --space-lg: 28px;
  --space-xl: 48px; --space-2xl: 80px;
  --space-section: clamp(56px, 8vw, 88px);

  /* Bo góc */
  --radius-card: 28px;   --radius-link: 10px;   --radius-nav: 20px;
  --radius-control: 36px; --radius-pill: 9999px; --radius-input: 980px;

  /* Viền (không phải bóng) */
  --ring-subtle: 0 0 0 1px #e6e6e8;
  --ring-strong: 0 0 0 1px #86868b;

  /* Chuyển động (M) */
  --dur-instant: 100ms; --dur-fast: 200ms; --dur-base: 350ms;
  --dur-slow: 700ms;    --dur-hero: 1000ms;
  --ease-standard: cubic-bezier(0.25, 0.1, 0.25, 1);
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --reveal-distance: 24px;
  --stagger-step: 80ms;
}
```

### 12.2 Tailwind v4

Trong v4, kích thước chữ kèm line-height và tracking theo cú pháp `--text-*--line-height` và `--text-*--letter-spacing`. **Không** khai báo `--spacing-4: 4px` (sẽ đảo nghĩa `p-4`).

```css
@theme {
  --color-gallery-white: #ffffff;
  --color-studio-mist: #f5f5f7;
  --color-paper-frost: #fafafc;
  --color-hairline-silver: #d6d6d6;
  --color-control-gray: #e6e6e8;
  --color-ink: #1d1d1f;
  --color-slate: #707070;
  --color-steel: #86868b;
  --color-apple-blue: #0066cc;
  --color-pricing-blue: #0071e3;
  --color-launch-orange: #b64400;

  --font-display: "SF Pro Display", "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-text: "SF Pro Text", "Inter", ui-sans-serif, system-ui, sans-serif;

  --text-body: 17px;
  --text-body--line-height: 1.47;
  --text-body--letter-spacing: -0.022em;
  --text-hero: clamp(40px, 7vw, 80px);
  --text-hero--line-height: 1.1;
  --text-hero--letter-spacing: -0.015em;

  --radius-card: 28px;
  --radius-pill: 9999px;

  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
}
```

---

## 13. Hướng dẫn cho AI (Agent Prompt Guide)

> Khi dựng giao diện từ file này: (1) Tuân thủ mục 2, 3, 4 làm nguồn giá trị duy nhất; không hard-code hex hay px lặp lại, dùng token. (2) Chuyển động chỉ theo mục 7; không thêm hiệu ứng ngoài danh mục 7.3. (3) Luôn kèm `prefers-reduced-motion` và dự phòng cho `animation-timeline`. (4) Không bịa nội dung (mục 9). (5) Báo rõ mọi chỗ bạn tự quyết định vì file không quy định.

Mẫu yêu cầu:

- **Hero:** nền `#ffffff`, nhãn 21px/600 căn giữa, tiêu đề `--text-hero` căn giữa, ảnh đặt ngay dưới không khung; vào trang so le (nhãn → tiêu đề → ảnh) 1000ms `--ease-out`; ảnh thu nhỏ nhẹ khi cuộn bằng scroll-driven animation.
- **Dải sản phẩm:** nền `#f5f5f7`, tiêu đề 40px bên trái, liên kết `#0066cc` bên phải (baseline); 4–8 thẻ trắng bo 28px không bóng, cùng căn đáy; hiện dần khi cuộn, so le 80ms tối đa 6 thẻ.
- **Thẻ giá nổi:** nền trắng bo 28px, viền `--ring-subtle`, giá 14px/600, nút `#0071e3` cao 44px; hover chuyển sang `#0066cc`.
- **Carousel:** scroll-snap, tự chạy 6 giây, có nút tạm dừng, dừng khi hover/focus/tab ẩn, tắt khi giảm chuyển động.

---

## 14. Việc cần quyết định và kiểm tra trước khi phát hành

- [ ] Điền: tên cửa hàng, danh mục, hãng phân phối, chính sách thật, địa chỉ, giờ mở cửa.
- [ ] Có trả góp, thu cũ đổi mới, showroom không? Chỉ dựng khối tương ứng nếu có.
- [ ] Chọn và tự lưu trữ font Inter (kiểm tra glyph tiếng Việt).
- [ ] Kiểm tra tương phản bằng công cụ (đặc biệt `#0071e3` với chữ trắng 14px).
- [ ] Thử các chuỗi nhiều dấu tiếng Việt ở tiêu đề hero và feature.
- [ ] Thử trên điện thoại tầm trung thật: độ mượt cuộn, INP, LCP, CLS.
- [ ] Kiểm tra mức hỗ trợ trình duyệt hiện hành cho `animation-timeline`, View Transitions, `text-wrap: balance`.
- [ ] Thử với `prefers-reduced-motion: reduce` và chỉ dùng bàn phím.
- [ ] Đối chiếu quy định pháp lý hiện hành về website thương mại điện tử và quảng cáo giá.
