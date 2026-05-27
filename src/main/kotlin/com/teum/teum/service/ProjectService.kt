package com.teum.teum.service

import com.teum.teum.domain.Project
import com.teum.teum.domain.ProjectMember
import com.teum.teum.domain.ProjectMemberRepository
import com.teum.teum.domain.ProjectRepository
import com.teum.teum.domain.UserRepository
import com.teum.teum.dto.CreateProjectRequest
import com.teum.teum.dto.InviteMemberRequest
import com.teum.teum.dto.ProjectResponse
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ProjectService(
    private val projectRepository: ProjectRepository,
    private val userRepository: UserRepository,
    private val projectMemberRepository: ProjectMemberRepository
) {
    // 1. 방 생성 로직
    @Transactional
    fun createProject(request: CreateProjectRequest): ProjectResponse {
        // 누가 방을 만드는지 유저 정보 가져오기
        val owner = userRepository.findById(request.ownerId).orElseThrow {
            IllegalArgumentException("존재하지 않는 유저입니다.")
        }

        // 프로젝트 방 만들기
        val project = Project(
            name = request.name,
            description = request.description,
            owner = owner
        )
        val savedProject = projectRepository.save(project)

        // 방을 만든 사람(방장)도 방 멤버로 자동 추가
        val projectMember = ProjectMember(
            user = owner,
            project = savedProject
        )
        projectMemberRepository.save(projectMember)

        return ProjectResponse(
            id = savedProject.id!!,
            name = savedProject.name,
            description = savedProject.description,
            ownerId = savedProject.owner.id!!
        )
    }

    // 2. 팀원 초대 로직
    @Transactional
    fun inviteMember(projectId: Long, request: InviteMemberRequest) {
        val project = projectRepository.findById(projectId).orElseThrow {
            IllegalArgumentException("존재하지 않는 프로젝트입니다.")
        }

        val user = userRepository.findById(request.userId).orElseThrow {
            IllegalArgumentException("존재하지 않는 유저입니다.")
        }

        // 이미 방에 초대된 유저인지 중복 검사
        if (projectMemberRepository.existsByUserIdAndProjectId(user.id!!, project.id!!)) {
            throw IllegalArgumentException("이미 방에 초대된 유저입니다.")
        }

        // 멤버로 추가
        val projectMember = ProjectMember(
            user = user,
            project = project
        )
        projectMemberRepository.save(projectMember)
    }
}