package com.fosso.backend.fosso_backend.cart.repository;

import com.fosso.backend.fosso_backend.cart.model.CartItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends MongoRepository<CartItem, String> {

    @Query("{'customerId': ?0}")
    List<CartItem> findByCustomerId(String customerId);

    @Query(value = "{'customerId': ?0}", delete = true)
    void deleteByCustomerId(String customerId);

    @Query(value = "{'$and': [{'customerId': ?0}, {'productId': ?1}, {'color': ?2}, {'size': ?3}]}")
    Optional<CartItem> findByCustomerIdAndProductIdAndColorAndSize(String customerId, String productId, String color, String size);
}