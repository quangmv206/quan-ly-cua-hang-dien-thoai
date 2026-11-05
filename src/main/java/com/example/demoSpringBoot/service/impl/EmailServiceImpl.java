package com.example.demoSpringBoot.service.impl;

import com.example.demoSpringBoot.model.Order;
import com.example.demoSpringBoot.model.OrderItem;
import com.example.demoSpringBoot.service.EmailService;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.text.NumberFormat;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailServiceImpl.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:phonestore.notify@gmail.com}")
    private String fromEmail;

    public EmailServiceImpl(@Autowired(required = false) JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    private String formatCurrency(double amount) {
        NumberFormat nf = NumberFormat.getInstance(new Locale("vi", "VN"));
        return nf.format(amount) + " đ";
    }

    @Override
    public void sendOrderConfirmationEmail(Order order) {
        if (order == null) return;

        String recipientEmail = order.getRecipientEmail();
        if ((recipientEmail == null || recipientEmail.isBlank()) && order.getUser() != null) {
            recipientEmail = order.getUser().getEmail();
        }

        if (recipientEmail == null || recipientEmail.isBlank()) {
            log.warn("[EMAIL] Đơn hàng #{} không có địa chỉ email người nhận, bỏ qua gửi mail.", order.getOrderCode());
            return;
        }

        final String targetEmail = recipientEmail.trim();

        // Chạy bất đồng bộ trong thread riêng để không làm nghẽn phản hồi API đặt hàng
        new Thread(() -> {
            try {
                if (mailSender == null) {
                    log.info("[EMAIL DEMO] Đơn hàng #{} tạo thành công cho email {}. (JavaMailSender chưa kích hoạt)",
                            order.getOrderCode(), targetEmail);
                    return;
                }

                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                helper.setFrom(fromEmail, "PhoneStore Support");
                helper.setTo(targetEmail);
                helper.setSubject("Xác nhận đặt hàng thành công - Mã đơn hàng #" + order.getOrderCode());

                StringBuilder itemsHtml = new StringBuilder();
                if (order.getItems() != null && !order.getItems().isEmpty()) {
                    for (OrderItem item : order.getItems()) {
                        itemsHtml.append("<tr style='border-bottom: 1px solid #e5e7eb;'>")
                                .append("<td style='padding: 10px; font-weight: 500;'>")
                                .append(item.getProductName())
                                .append("<br><span style='font-size: 12px; color: #6b7280;'>Phân loại: ")
                                .append(item.getVariantName() != null ? item.getVariantName() : "Tiêu chuẩn")
                                .append("</span></td>")
                                .append("<td style='padding: 10px; text-align: center;'>").append(item.getQuantity()).append("</td>")
                                .append("<td style='padding: 10px; text-align: right;'>").append(formatCurrency(item.getPrice())).append("</td>")
                                .append("<td style='padding: 10px; text-align: right; font-weight: 600; color: #111827;'>")
                                .append(formatCurrency(item.getLineTotal())).append("</td>")
                                .append("</tr>");
                    }
                }

                String formattedDate = order.getCreatedAt() != null
                        ? order.getCreatedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))
                        : "Vừa xong";

                String htmlContent = "<div style='font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;'>"
                        + "<div style='background: linear-gradient(135deg, #1e40af, #3b82f6); padding: 24px; text-align: center; color: #ffffff;'>"
                        + "<h1 style='margin: 0; font-size: 24px; font-weight: bold;'>PHONESTORE</h1>"
                        + "<p style='margin: 6px 0 0; font-size: 15px; opacity: 0.9;'>Xác nhận đơn hàng #" + order.getOrderCode() + "</p>"
                        + "</div>"
                        + "<div style='padding: 24px;'>"
                        + "<p style='font-size: 15px; color: #374151;'>Xin chào <strong>" + order.getRecipientName() + "</strong>,</p>"
                        + "<p style='font-size: 14px; color: #4b5563; line-height: 1.5;'>Cảm ơn bạn đã tin tưởng và mua sắm tại PhoneStore. Đơn hàng của bạn đã được ghi nhận và đang được đóng gói chuẩn bị giao tới bạn.</p>"
                        + "<div style='background: #f9fafb; border-radius: 6px; padding: 16px; margin: 20px 0;'>"
                        + "<h3 style='margin: 0 0 12px; font-size: 14px; text-transform: uppercase; color: #6b7280;'>Thông tin giao hàng</h3>"
                        + "<p style='margin: 4px 0; font-size: 14px;'><strong>Người nhận:</strong> " + order.getRecipientName() + " (" + order.getRecipientPhone() + ")</p>"
                        + "<p style='margin: 4px 0; font-size: 14px;'><strong>Địa chỉ nhận:</strong> " + order.getShippingAddress() + "</p>"
                        + "<p style='margin: 4px 0; font-size: 14px;'><strong>Phương thức thanh toán:</strong> " + order.getPaymentMethod() + " (" + order.getPaymentStatus() + ")</p>"
                        + "<p style='margin: 4px 0; font-size: 14px;'><strong>Thời gian đặt:</strong> " + formattedDate + "</p>"
                        + "</div>"
                        + "<table style='width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;'>"
                        + "<thead>"
                        + "<tr style='background: #f3f4f6; color: #374151; text-align: left;'>"
                        + "<th style='padding: 10px;'>Sản phẩm</th>"
                        + "<th style='padding: 10px; text-align: center;'>Số lượng</th>"
                        + "<th style='padding: 10px; text-align: right;'>Đơn giá</th>"
                        + "<th style='padding: 10px; text-align: right;'>Tạm tính</th>"
                        + "</tr>"
                        + "</thead>"
                        + "<tbody>"
                        + itemsHtml.toString()
                        + "</tbody>"
                        + "</table>"
                        + "<div style='margin-left: auto; max-width: 280px; font-size: 14px;'>"
                        + "<div style='display: flex; justify-content: space-between; padding: 4px 0; color: #4b5563;'>"
                        + "<span>Giảm giá voucher:</span><span>-" + formatCurrency(order.getDiscountAmount()) + "</span>"
                        + "</div>"
                        + "<div style='display: flex; justify-content: space-between; padding: 4px 0; color: #4b5563;'>"
                        + "<span>Phí vận chuyển:</span><span>" + formatCurrency(order.getShippingFee()) + "</span>"
                        + "</div>"
                        + "<div style='display: flex; justify-content: space-between; padding: 8px 0; border-top: 2px solid #e5e7eb; font-size: 16px; font-weight: bold; color: #dc2626;'>"
                        + "<span>Tổng thanh toán:</span><span>" + formatCurrency(order.getTotalAmount()) + "</span>"
                        + "</div>"
                        + "</div>"
                        + "<hr style='border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;'>"
                        + "<p style='font-size: 13px; color: #6b7280; text-align: center; margin: 0;'>"
                        + "Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ hotline <strong>1900 6868</strong> hoặc trả lời trực tiếp email này.<br>"
                        + "Cảm ơn bạn đã lựa chọn PhoneStore!"
                        + "</p>"
                        + "</div>"
                        + "</div>";

                helper.setText(htmlContent, true);
                mailSender.send(message);
                log.info("[EMAIL] Đã gửi email xác nhận đơn hàng #{} thành công đến {}", order.getOrderCode(), targetEmail);
            } catch (Exception e) {
                log.error("[EMAIL ERROR] Không thể gửi email đơn hàng #{} tới {}: {}", order.getOrderCode(), targetEmail, e.getMessage());
            }
        }).start();
    }

    @Override
    public void sendForgotPasswordOtpEmail(String toEmail, String otp) {
        if (toEmail == null || toEmail.isBlank() || otp == null) return;

        final String targetEmail = toEmail.trim();

        new Thread(() -> {
            try {
                if (mailSender == null) {
                    log.info("=============================================================");
                    log.info("[OTP CONSOLE] Mã xác thực Quên mật khẩu của {}: [{}]", targetEmail, otp);
                    log.info("=============================================================");
                    return;
                }

                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                helper.setFrom(fromEmail, "PhoneStore Security");
                helper.setTo(targetEmail);
                helper.setSubject("Mã xác thực đặt lại mật khẩu - PhoneStore");

                String htmlContent = "<div style='font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;'>"
                        + "<div style='background: #1e40af; padding: 20px; text-align: center; color: #ffffff;'>"
                        + "<h2 style='margin: 0; font-size: 20px;'>PHONESTORE SECURITY</h2>"
                        + "<p style='margin: 4px 0 0; font-size: 13px; opacity: 0.9;'>Yêu cầu khôi phục mật khẩu</p>"
                        + "</div>"
                        + "<div style='padding: 24px; text-align: center;'>"
                        + "<p style='font-size: 15px; color: #374151; margin-bottom: 16px;'>Bạn vừa yêu cầu đặt lại mật khẩu cho tài khoản liên kết với email <strong>" + targetEmail + "</strong>.</p>"
                        + "<p style='font-size: 14px; color: #6b7280;'>Dưới đây là mã xác thực OTP của bạn:</p>"
                        + "<div style='background: #eff6ff; border: 2px dashed #3b82f6; border-radius: 8px; padding: 16px; margin: 20px auto; display: inline-block; min-width: 200px;'>"
                        + "<span style='font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #1d4ed8;'>" + otp + "</span>"
                        + "</div>"
                        + "<p style='font-size: 13px; color: #dc2626; font-weight: 500; margin: 12px 0;'>"
                        + "⚠️ Mã OTP này có hiệu lực trong vòng 15 phút. Tuyệt đối không chia sẻ mã này cho bất kỳ ai."
                        + "</p>"
                        + "<p style='font-size: 12px; color: #9ca3af; margin-top: 24px; line-height: 1.4;'>"
                        + "Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email hoặc đổi ngay mật khẩu hiện tại để bảo vệ tài khoản."
                        + "</p>"
                        + "</div>"
                        + "</div>";

                helper.setText(htmlContent, true);
                mailSender.send(message);
                log.info("[EMAIL] Đã gửi mã OTP khôi phục mật khẩu tới {}", targetEmail);
            } catch (Exception e) {
                log.error("[EMAIL ERROR] Gửi OTP thất bại tới {}: {}. OTP hiện tại là: [{}]", targetEmail, e.getMessage(), otp);
            }
        }).start();
    }
}

