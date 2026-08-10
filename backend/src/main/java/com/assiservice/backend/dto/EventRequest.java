package com.assiservice.backend.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class EventRequest {
    private String title;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String description;
    private String color;
}