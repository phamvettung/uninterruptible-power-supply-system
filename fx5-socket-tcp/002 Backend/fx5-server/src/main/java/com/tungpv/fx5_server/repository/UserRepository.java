package com.tungpv.fx5_server.repository;

import com.tungpv.fx5_server.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<Users, Integer> {

    @Query(value = "SELECT * FROM users u WHERE u.username = ?1", nativeQuery = true)
    Users findByUserName(String username);

    @Query(value = "SELECT * FROM users u WHERE u.email = ?1", nativeQuery = true)
    Users findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}
