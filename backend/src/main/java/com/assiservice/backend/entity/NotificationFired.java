package com.assiservice.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "notification_fired")
@Getter
@Setter
@NoArgsConstructor
public class NotificationFired {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 알림 종류: ALARM / REMINDER / TODO
    @Column(name = "source_type", nullable = false, length = 20)
    private String sourceType;

    // 알람/이벤트/할 일의 id
    @Column(name = "source_id", nullable = false)
    private Long sourceId;

    // 같은 source가 여러 시점에 발동할 수 있을 때 구분용 보조 키
    @Column(name = "fired_key", length = 50)
    private String firedKey;

    @Column(name = "fired_at", nullable = false)
    private LocalDateTime firedAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
