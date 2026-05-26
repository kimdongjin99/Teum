package com.teum.teum.dto

// 방 생성할 때 넘어오는 데이터
data class CreateProjectRequest(
    val name: String,
    val description: String?,
    val ownerId: Long // 방을 만드는 유저의 ID
)

// 팀원을 초대할 때 넘어오는 데이터
data class InviteMemberRequest(
    val userId: Long // 초대할 유저의 ID
)

// 방 생성 성공 시 돌려줄 데이터
data class ProjectResponse(
    val id: Long,
    val name: String,
    val description: String?,
    val ownerId: Long
)