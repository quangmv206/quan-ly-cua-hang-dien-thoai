package com.example.demoSpringBoot.service;

import com.example.demoSpringBoot.model.Order;
import java.util.Map;

public interface PayOSService {
    Map<String, Object> createPaymentLink(Order order, String returnUrl, String cancelUrl);
    boolean verifyWebhook(Map<String, Object> webhookBody);
    void handleWebhook(Map<String, Object> webhookBody);
}

