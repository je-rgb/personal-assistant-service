package com.assiservice.backend.service;

import com.assiservice.backend.dto.NotificationFiredRequest;
import com.assiservice.backend.dto.NotificationFiredResponse;
import com.assiservice.backend.entity.NotificationFired;
import com.assiservice.backend.entity.User;
import com.assiservice.backend.repository.NotificationFiredRepository;
import com.assiservice.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationFiredService {

    private final NotificationFiredRepository notificationFiredRepository;
    private final UserRepository userRepository;

    private User getCurrentUser(Authentication auth) {
        String username = auth.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
    }

    public List<NotificationFiredResponse> getFired(Authentication auth) {
        User user = getCurrentUser(auth);
        return notificationFiredRepository.findByUser(user)
                .stream().map(NotificationFiredResponse::new).collect(Collectors.toList());
    }

    public NotificationFiredResponse markFired(Authentication auth, NotificationFiredRequest request) {
        User user = getCurrentUser(auth);
        NotificationFired existing = notificationFiredRepository
                .findByUserAndSourceTypeAndSourceIdAndFiredKey(
                        user, request.getSourceType(), request.getSourceId(), request.getFiredKey())
                .orElse(null);
        if (existing != null) {
            return new NotificationFiredResponse(existing);
        }

        NotificationFired fired = new NotificationFired();
        fired.setSourceType(request.getSourceType());
        fired.setSourceId(request.getSourceId());
        fired.setFiredKey(request.getFiredKey());
        fired.setUser(user);
        return new NotificationFiredResponse(notificationFiredRepository.save(fired));
    }

    public void clearFired(Authentication auth, String sourceType, Long sourceId, String firedKey) {
        User user = getCurrentUser(auth);
        notificationFiredRepository
                .findByUserAndSourceTypeAndSourceIdAndFiredKey(user, sourceType, sourceId, firedKey)
                .ifPresent(notificationFiredRepository::delete);
    }
}
