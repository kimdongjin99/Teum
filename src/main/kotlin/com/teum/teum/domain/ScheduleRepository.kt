package com.teum.teum.domain

import org.springframework.data.jpa.repository.JpaRepository

interface ScheduleRepository : JpaRepository<Schedule, Long> {
    // 개인 일정 조회
    fun findAllByUser_IdAndProjectIsNull(userId: Long): List<Schedule>

    // 특정 방 일정 조회
    fun findAllByProject_Id(projectId: Long): List<Schedule>

    // ScheduleRepository.kt에 추가
    fun findAllByUser_IdInAndProjectIsNull(userIds: List<Long>): List<Schedule>
}