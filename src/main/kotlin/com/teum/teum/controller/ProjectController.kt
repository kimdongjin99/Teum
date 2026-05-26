package com.teum.teum.controller

import com.teum.teum.dto.CreateProjectRequest
import com.teum.teum.dto.InviteMemberRequest
import com.teum.teum.dto.ProjectResponse
import com.teum.teum.service.ProjectService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/projects")
class ProjectController(
    private val projectService: ProjectService
) {
    // 방 생성 API (POST /api/projects)
    @PostMapping
    fun createProject(@RequestBody request: CreateProjectRequest): ResponseEntity<ProjectResponse> {
        val response = projectService.createProject(request)
        return ResponseEntity.ok(response)
    }

    // 팀원 초대 API (POST /api/projects/{projectId}/invite)
    @PostMapping("/{projectId}/invite")
    fun inviteMember(
        @PathVariable projectId: Long,
        @RequestBody request: InviteMemberRequest
    ): ResponseEntity<String> {
        projectService.inviteMember(projectId, request)
        return ResponseEntity.ok("팀원 초대가 완료되었습니다.")
    }
}