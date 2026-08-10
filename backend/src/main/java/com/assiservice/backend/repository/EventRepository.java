package com.assiservice.backend.repository;

import com.assiservice.backend.entity.Event;
import com.assiservice.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByUserAndStartTimeBetween(User user, LocalDateTime start, LocalDateTime end);
    List<Event> findByUser(User user);
}