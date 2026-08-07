package com.assiservice.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SignupRequest {

	@NotBlank(message = "username은 필수입니다.")
	@Size(min = 4, max = 20, message = "username은 4~20자여야 합니다.")
	private String username;

	@NotBlank(message = "password는 필수입니다.")
	@Size(min = 8, max = 100, message = "password는 8자 이상이어야 합니다.")
	private String password;

	@NotBlank(message = "name은 필수입니다.")
	@Size(max = 50, message = "name은 50자 이하여야 합니다.")
	private String name;

}
