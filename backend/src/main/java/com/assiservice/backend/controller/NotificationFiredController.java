package com.assiservice.backend.controller;

import com.assiservice.backend.dto.NotificationFiredRequest;
import com.assiservice.backend.dto.NotificationFiredResponse;
import com.assiservice.backend.service.NotificationFiredService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications/fired")
@RequiredArgsConstructor
public class NotificationFiredController {

    private final NotificationFiredService notificationFiredService;

    @GetMapping
    public List<NotificationFiredResponse> getFired(Authentication auth) {
        return notificationFiredService.getFired(auth);
    }

    @PostMapping
    public NotificationFiredResponse markFired(Authentication auth, @RequestBody NotificationFiredRequest request) {
        return notificationFiredService.markFired(auth, request);
    }

    @DeleteMapping
    public void clearFired(
            Authentication auth,
            @RequestParam String sourceType,
            @RequestParam Long sourceId,
            @RequestParam String firedKey
    ) {
        notificationFiredService.clearFired(auth, sourceType, sourceId, firedKey);
    }
}
