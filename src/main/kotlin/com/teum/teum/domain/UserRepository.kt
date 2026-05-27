package com.teum.teum.domain

import org.springframework.data.jpa.repository.JpaRepository

interface UserRepository : JpaRepository<User, Long> {
    // 회원가입 시 중복 아이디 체크용
    fun existsByUsername(username: String): Boolean

    // 로그인 시 아이디로 유저 정보 찾기용
    fun findByUsername(username: String): User?
}