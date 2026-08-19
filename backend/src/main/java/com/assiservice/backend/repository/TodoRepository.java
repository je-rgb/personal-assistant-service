package com.assiservice.backend.repository;

import com.assiservice.backend.entity.Todo;
import com.assiservice.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface TodoRepository extends JpaRepository<Todo, Long> {
    List<Todo> findByUserOrderByCompletedAscDueDateAsc(User user);
    List<Todo> findByUserAndDueDateBetween(User user, LocalDateTime start, LocalDateTime end);
}
