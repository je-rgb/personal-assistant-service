package com.assiservice.backend.dto;

import com.assiservice.backend.entity.Todo;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
public class TodoResponse {
    private final Long id;
    private final String title;
    private final String description;
    private final LocalDateTime dueDate;
    private final boolean completed;

    public TodoResponse(Todo todo) {
        this.id = todo.getId();
        this.title = todo.getTitle();
        this.description = todo.getDescription();
        this.dueDate = todo.getDueDate();
        this.completed = todo.isCompleted();
    }
}
