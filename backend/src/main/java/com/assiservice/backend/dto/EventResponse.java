package com.assiservice.backend.dto;

import com.assiservice.backend.entity.Event;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
public class EventResponse {
    private final Long id;
    private final String title;
    private final LocalDateTime startTime;
    private final LocalDateTime endTime;
    private final String description;
    private final String color;

    public EventResponse(Event event) {
        this.id = event.getId();
        this.title = event.getTitle();
        this.startTime = event.getStartTime();
        this.endTime = event.getEndTime();
        this.description = event.getDescription();
        this.color = event.getColor();
    }
}