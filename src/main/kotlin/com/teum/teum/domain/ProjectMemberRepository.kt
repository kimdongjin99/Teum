package com.teum.teum.domain

import org.springframework.data.jpa.repository.JpaRepository

interface ProjectMemberRepository : JpaRepository<ProjectMember, Long> {
    // 특정 유저가 이미 방에 초대되어 있는지 중복 검사할 때 사용
    fun existsByUserIdAndProjectId(userId: Long, projectId: Long): Boolean

    // 특정 방에 속한 모든 멤버 목록을 가져올 때 사용
    fun findAllByProjectId(projectId: Long): List<ProjectMember>
}