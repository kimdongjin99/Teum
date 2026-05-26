package com.teum.teum.domain

import jakarta.persistence.*

@Entity
@Table(name = "users") // 'user'는 DB 예약어인 경우가 많아 'users'로 테이블명을 지정합니다.
class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false, unique = true)
    val username: String, // 로그인 아이디

    @Column(nullable = false)
    var password: String, // 비밀번호

    @Column(nullable = false)
    var name: String // 이름
)