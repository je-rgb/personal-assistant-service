package com.assiservice.backend.controller;

import com.assiservice.backend.dto.TodoRequest;
import com.assiservice.backend.dto.TodoResponse;
import com.assiservice.backend.service.TodoService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/todos")
@RequiredArgsConstructor
public class TodoController {

    private final TodoService todoService;

    @GetMapping
    public List<TodoResponse> getTodos(Authentication auth) {
        return todoService.getTodos(auth);
    }

    @GetMapping("/range")
    public List<TodoResponse> getTodosInRange(
            Authentication auth,
            @RequestParam LocalDateTime start,
            @RequestParam LocalDateTime end
    ) {
        return todoService.getTodosInRange(auth, start, end);
    }

    @PostMapping
    public TodoResponse createTodo(Authentication auth, @RequestBody TodoRequest request) {
        return todoService.createTodo(auth, request);
    }

    @PutMapping("/{id}")
    public TodoResponse updateTodo(Authentication auth, @PathVariable Long id, @RequestBody TodoRequest request) {
        return todoService.updateTodo(auth, id, request);
    }

    @PatchMapping("/{id}/complete")
    public TodoResponse completeTodo(Authentication auth, @PathVariable Long id, @RequestBody Map<String, Boolean> body) {
        boolean completed = body.getOrDefault("completed", true);
        return todoService.completeTodo(auth, id, completed);
    }

    @DeleteMapping("/{id}")
    public void deleteTodo(Authentication auth, @PathVariable Long id) {
        todoService.deleteTodo(auth, id);
    }
}
