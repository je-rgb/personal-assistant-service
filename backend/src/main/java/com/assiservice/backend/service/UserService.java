package com.assiservice.backend.service;

import com.assiservice.backend.dto.LoginRequest;
import com.assiservice.backend.dto.SignupRequest;
import com.assiservice.backend.entity.User;
import com.assiservice.backend.repository.UserRepository;
import com.assiservice.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtUtil jwtUtil;

	@Transactional
	public void signup(SignupRequest request) {
		if (userRepository.existsByUsername(request.getUsername())) {
			throw new IllegalArgumentException("이미 사용 중인 username입니다.");
		}

		User user = new User();
		user.setUsername(request.getUsername());
		user.setPassword(passwordEncoder.encode(request.getPassword()));
		user.setName(request.getName());
		userRepository.save(user);
	}

	@Transactional(readOnly = true)
	public String login(LoginRequest request) {
		User user = userRepository.findByUsername(request.getUsername())
				.orElseThrow(() -> new IllegalArgumentException("username 또는 password가 올바르지 않습니다."));

		if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
			throw new IllegalArgumentException("username 또는 password가 올바르지 않습니다.");
		}

		return jwtUtil.generateToken(user.getUsername());
	}

}
