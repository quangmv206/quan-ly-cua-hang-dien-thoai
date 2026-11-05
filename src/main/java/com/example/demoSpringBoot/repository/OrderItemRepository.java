package com.example.demoSpringBoot.repository;

import com.example.demoSpringBoot.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByOrderId(Long orderId);

    List<OrderItem> findByVariantId(Long variantId);

    @Modifying
    @Query("UPDATE OrderItem oi SET oi.variant = null WHERE oi.variant.id = :variantId")
    void detachVariant(Long variantId);
}
