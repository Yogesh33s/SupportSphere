package com.supportsphere.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.supportsphere.model.HelpRequest;

// MongoRepository gives ready-made methods like save(), findAll(), and findById().
public interface HelpRequestRepository extends MongoRepository<HelpRequest, String> {
}
