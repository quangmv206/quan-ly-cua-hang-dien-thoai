package com.example.demoSpringBoot.repository;

import com.example.demoSpringBoot.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCartIdAndVariantId(Long cartId, Long variantId);

    @Modifying
    @Query("DELETE FROM CartItem ci WHERE ci.variant.id = :variantId")
    void deleteByVariantId(Long variantId);
}
