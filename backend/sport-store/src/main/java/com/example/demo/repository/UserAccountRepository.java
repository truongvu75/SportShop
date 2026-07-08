package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Account;

/**
 * Lớp Repository liên quan đến xử lý, làm việc với Database của Account
 */
@Repository
public interface UserAccountRepository extends JpaRepository<Account, Integer>{

}
