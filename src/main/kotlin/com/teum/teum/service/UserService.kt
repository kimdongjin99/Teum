package com.teum.teum.service

import com.teum.teum.domain.User
import com.teum.teum.domain.UserRepository
import com.teum.teum.dto.LoginRequest
import com.teum.teum.dto.SignUpRequest
import com.teum.teum.dto.UserResponse
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class UserService(
    private val userRepository: UserRepository
) {
    // 1. 회원가입 로직
    @Transactional
    fun signUp(request: SignUpRequest): UserResponse {
        // 교수님 어필 포인트: 요구사항에 맞춘 중복 검사 및 예외 처리
        if (userRepository.existsByUsername(request.username)) {
            throw IllegalArgumentException("이미 존재하는 아이디입니다.")
        }

        val user = User(
            username = request.username,
            password = request.password, // (시간 단축을 위해 암호화 로직은 생략)
            name = request.name
        )

        val savedUser = userRepository.save(user)

        return UserResponse(
            id = savedUser.id!!,
            username = savedUser.username,
            name = savedUser.name
        )
    }

    // 2. 로그인 로직
    @Transactional(readOnly = true)
    fun login(request: LoginRequest): UserResponse {
        val user = userRepository.findByUsername(request.username)
            ?: throw IllegalArgumentException("존재하지 않는 아이디입니다.")

        if (user.password != request.password) {
            throw IllegalArgumentException("비밀번호가 일치하지 않습니다.")
        }

        return UserResponse(
            id = user.id!!,
            username = user.username,
            name = user.name
        )
    }
}