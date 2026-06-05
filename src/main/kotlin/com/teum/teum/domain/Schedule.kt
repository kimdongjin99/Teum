package com.teum.teum.domain

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "schedules")
open class Schedule(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    val title: String,
    val startTime: LocalDateTime,
    val endTime: LocalDateTime,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id") // 방 일정인 경우 (개인이면 null)
    val project: Project? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id") // 작성자
    val user: User
)