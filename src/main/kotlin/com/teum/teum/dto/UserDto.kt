package com.teum.teum.dto

// 회원가입할 때 프론트엔드에서 넘어오는 데이터
data class SignUpRequest(
    val username: String,
    val password: String,
    val name: String
)

// 로그인할 때 프론트엔드에서 넘어오는 데이터
data class LoginRequest(
    val username: String,
    val password: String
)

// 가입/로그인 성공 시 프론트엔드로 돌려줄 데이터
data class UserResponse(
    val id: Long,
    val username: String,
    val name: String
)