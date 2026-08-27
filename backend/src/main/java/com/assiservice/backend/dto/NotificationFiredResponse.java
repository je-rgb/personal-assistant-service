package com.assiservice.backend.dto;

import com.assiservice.backend.entity.NotificationFired;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
public class NotificationFiredResponse {
    private final Long id;
    private final String sourceType;
    private final Long sourceId;
    private final String firedKey;
    private final LocalDateTime firedAt;

    public NotificationFiredResponse(NotificationFired fired) {
        this.id = fired.getId();
        this.sourceType = fired.getSourceType();
        this.sourceId = fired.getSourceId();
        this.firedKey = fired.getFiredKey();
        this.firedAt = fired.getFiredAt();
    }
}
