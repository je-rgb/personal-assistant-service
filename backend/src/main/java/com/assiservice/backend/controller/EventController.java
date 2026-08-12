package com.assiservice.backend.controller;

import com.assiservice.backend.dto.EventRequest;
import com.assiservice.backend.dto.EventResponse;
import com.assiservice.backend.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping
    public List<EventResponse> getEvents(
            Authentication auth,
            @RequestParam LocalDateTime start,
            @RequestParam LocalDateTime end
    ) {
        return eventService.getEventsInRange(auth, start, end);
    }

    @PostMapping
    public EventResponse createEvent(Authentication auth, @RequestBody EventRequest request) {
        return eventService.createEvent(auth, request);
    }

    @PutMapping("/{id}")
    public EventResponse updateEvent(Authentication auth, @PathVariable Long id, @RequestBody EventRequest request) {
        return eventService.updateEvent(auth, id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteEvent(Authentication auth, @PathVariable Long id) {
        eventService.deleteEvent(auth, id);
    }
}