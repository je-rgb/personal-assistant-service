package com.assiservice.backend.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class TodoRequest {
    private String title;
    private String description;
    private LocalDateTime dueDate;
}
