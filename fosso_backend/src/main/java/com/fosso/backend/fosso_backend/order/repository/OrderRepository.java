package com.fosso.backend.fosso_backend.order.repository;

import com.fosso.backend.fosso_backend.common.enums.OrderStatus;
import com.fosso.backend.fosso_backend.order.model.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {

    @Query("{'customerId': ?0}")
    Page<Order> findByCustomerId(String customerId, Pageable pageable);

    List<Order> findByCustomerId(String customerId);

    Optional<Order> findByOrderTrackingNumber(String trackingNumber);

    @Query("{'$or': [{'orderTrackingNumber': {$regex: ?0, $options: 'i'}}, {'shippingAddress.addressLine1': {$regex: ?0, $options: 'i'}}, {'shippingAddress.addressLine2': {$regex: ?0, $options: 'i'}}, {'shippingAddress.city': {$regex: ?0, $options: 'i'}}, {'shippingAddress.state': {$regex: ?0, $options: 'i'}}, {'shippingAddress.postalCode': {$regex: ?0, $options: 'i'}}, {'shippingAddress.country': {$regex: ?0, $options: 'i'}}]}")
    Page<Order> findByKeyword(String keyword, Pageable pageable);

    @Query("{'status': ?0}")
    Page<Order> findByStatus(OrderStatus status, Pageable pageable);

    @Query("{'orderDateTime': {$gte: ?0, $lte: ?1}}")
    List<Order> findByOrderTimeBetween(LocalDateTime startDate, LocalDateTime  endDate);

    @Query("{'orderDetails.merchantId': ?0}")
    Page<Order> findByMerchantIdInOrderDetails(String merchantId, Pageable pageable);}