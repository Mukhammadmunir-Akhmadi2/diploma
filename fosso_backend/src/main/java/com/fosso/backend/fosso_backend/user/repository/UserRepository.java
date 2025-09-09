package com.fosso.backend.fosso_backend.user.repository;

import com.fosso.backend.fosso_backend.user.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {

    @Query("{'email': ?0}")
    Optional<User> findByEmail(String email);

    @Query(value = "{'email': ?0}", exists = true)
    boolean existsByEmail(String email);

    @Query("{'$or': [{'firstName': {$regex: ?0, $options: 'i'}}, {'lastName': {$regex: ?0, $options: 'i'}}, {'email': {$regex: ?0, $options: 'i'}}]}")
    Page<User> findByKeyword(String keyword, Pageable pageable);

    @Query("{'$or': [{'firstName': {$regex: ?0, $options: 'i'}}, {'lastName': {$regex: ?0, $options: 'i'}}, {'email': {$regex: ?0, $options: 'i'}}], 'isDeleted': false}")
    Page<User> findByKeywordAndIsDeletedFalse(String keyword, Pageable pageable);

    @Query("{'email': ?0, 'isDeleted': false}")
    Optional<User> findByEmailAndNotDeleted(String email);

    @Query("{'roles.name': ?0, 'isDeleted': false}")
    Page<User> findByIsDeletedFalse(Pageable pageable);
}