package com.assiservice.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NotificationFiredRequest {
    private String sourceType;
    private Long sourceId;
    private String firedKey;
}
