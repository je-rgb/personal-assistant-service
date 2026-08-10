package com.assiservice.backend.service;

import com.assiservice.backend.dto.EventRequest;
import com.assiservice.backend.dto.EventResponse;
import com.assiservice.backend.entity.Event;
import com.assiservice.backend.entity.User;
import com.assiservice.backend.repository.EventRepository;
import com.assiservice.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    private User getCurrentUser(Authentication auth) {
        String username = auth.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
    }

    public List<EventResponse> getEventsInRange(Authentication auth, LocalDateTime start, LocalDateTime end) {
        User user = getCurrentUser(auth);
        return eventRepository.findByUserAndStartTimeBetween(user, start, end)
                .stream().map(EventResponse::new).collect(Collectors.toList());
    }

    public EventResponse createEvent(Authentication auth, EventRequest request) {
        User user = getCurrentUser(auth);
        Event event = new Event();
        event.setTitle(request.getTitle());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        event.setDescription(request.getDescription());
        if (request.getColor() != null) event.setColor(request.getColor());
        event.setUser(user);
        return new EventResponse(eventRepository.save(event));
    }

    public EventResponse updateEvent(Authentication auth, Long id, EventRequest request) {
        User user = getCurrentUser(auth);
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("일정을 찾을 수 없습니다."));
        if (!event.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("권한이 없습니다.");
        }
        event.setTitle(request.getTitle());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        event.setDescription(request.getDescription());
        if (request.getColor() != null) event.setColor(request.getColor());
        return new EventResponse(eventRepository.save(event));
    }

    public void deleteEvent(Authentication auth, Long id) {
        User user = getCurrentUser(auth);
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("일정을 찾을 수 없습니다."));
        if (!event.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("권한이 없습니다.");
        }
        eventRepository.delete(event);
    }
}