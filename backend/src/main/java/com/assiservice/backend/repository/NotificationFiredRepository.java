package com.assiservice.backend.repository;

import com.assiservice.backend.entity.NotificationFired;
import com.assiservice.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface NotificationFiredRepository extends JpaRepository<NotificationFired, Long> {
    List<NotificationFired> findByUser(User user);
    Optional<NotificationFired> findByUserAndSourceTypeAndSourceIdAndFiredKey(
            User user, String sourceType, Long sourceId, String firedKey);
}
