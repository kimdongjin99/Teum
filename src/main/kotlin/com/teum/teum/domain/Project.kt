package com.teum.teum.domain

import jakarta.persistence.*

@Entity
@Table(name = "projects")
class Project(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false)
    var name: String, // 방 이름

    @Column(nullable = true)
    var description: String? = null, // 방 설명

    // 방을 만든 사람
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    val owner: User
)