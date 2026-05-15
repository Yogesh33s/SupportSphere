package com.supportsphere.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.supportsphere.model.HelpRequest;
import com.supportsphere.repository.HelpRequestRepository;

// REST controller exposes APIs used by the future frontend.
@RestController
@RequestMapping("/api/requests")
public class HelpRequestController {

    private final HelpRequestRepository helpRequestRepository;

    public HelpRequestController(HelpRequestRepository helpRequestRepository) {
        this.helpRequestRepository = helpRequestRepository;
    }

    // Creates a new community help request.
    @PostMapping
    public HelpRequest createHelpRequest(@RequestBody HelpRequest helpRequest) {
        helpRequest.setStatus("ACTIVE");
        helpRequest.setCreatedAt(LocalDateTime.now());
        helpRequest.setCompletedAt(null);
        helpRequest.setCompletedBy(null);

        return helpRequestRepository.save(helpRequest);
    }

    // Returns all help requests stored in MongoDB.
    @GetMapping
    public List<HelpRequest> getAllHelpRequests() {
        return helpRequestRepository.findAll();
    }

    // Marks a help request as completed and stores completion details.
    @PutMapping("/{id}/complete")
    public ResponseEntity<HelpRequest> completeHelpRequest(
            @PathVariable String id,
            @RequestParam String completedBy) {

        return helpRequestRepository.findById(id)
                .map(helpRequest -> {
                    helpRequest.setStatus("COMPLETED");
                    helpRequest.setCompletedAt(LocalDateTime.now());
                    helpRequest.setCompletedBy(completedBy);

                    HelpRequest updatedRequest = helpRequestRepository.save(helpRequest);
                    return ResponseEntity.ok(updatedRequest);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
