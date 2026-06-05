package com.teum.teum.dto

import java.time.LocalDateTime

data class ScheduleRequest(
    val title: String,
    val startTime: LocalDateTime,
    val endTime: LocalDateTime,
    val projectId: Long? = null // null이면 개인 일정
)

data class ScheduleResponse(
    val id: Long,
    val title: String,
    val startTime: LocalDateTime,
    val endTime: LocalDateTime
)