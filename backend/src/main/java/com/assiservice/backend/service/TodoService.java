package com.assiservice.backend.service;

import com.assiservice.backend.dto.TodoRequest;
import com.assiservice.backend.dto.TodoResponse;
import com.assiservice.backend.entity.Todo;
import com.assiservice.backend.entity.User;
import com.assiservice.backend.repository.TodoRepository;
import com.assiservice.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TodoService {

    private final TodoRepository todoRepository;
    private final UserRepository userRepository;

    private User getCurrentUser(Authentication auth) {
        String username = auth.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
    }

    public List<TodoResponse> getTodos(Authentication auth) {
        User user = getCurrentUser(auth);
        return todoRepository.findByUserOrderByCompletedAscDueDateAsc(user)
                .stream().map(TodoResponse::new).collect(Collectors.toList());
    }

    public TodoResponse createTodo(Authentication auth, TodoRequest request) {
        User user = getCurrentUser(auth);
        Todo todo = new Todo();
        todo.setTitle(request.getTitle());
        todo.setDescription(request.getDescription());
        todo.setDueDate(request.getDueDate());
        todo.setUser(user);
        return new TodoResponse(todoRepository.save(todo));
    }

    private Todo getOwnedTodo(Authentication auth, Long id) {
        User user = getCurrentUser(auth);
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("할 일을 찾을 수 없습니다."));
        if (!todo.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("권한이 없습니다.");
        }
        return todo;
    }

    public TodoResponse updateTodo(Authentication auth, Long id, TodoRequest request) {
        Todo todo = getOwnedTodo(auth, id);
        todo.setTitle(request.getTitle());
        todo.setDescription(request.getDescription());
        todo.setDueDate(request.getDueDate());
        return new TodoResponse(todoRepository.save(todo));
    }

    public TodoResponse completeTodo(Authentication auth, Long id, boolean completed) {
        Todo todo = getOwnedTodo(auth, id);
        todo.setCompleted(completed);
        return new TodoResponse(todoRepository.save(todo));
    }

    public void deleteTodo(Authentication auth, Long id) {
        Todo todo = getOwnedTodo(auth, id);
        todoRepository.delete(todo);
    }
}
