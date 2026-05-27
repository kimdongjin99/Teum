package com.teum.teum.service

import com.teum.teum.domain.*
import com.teum.teum.dto.*
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ScheduleService(
    private val scheduleRepository: ScheduleRepository,
    private val userRepository: UserRepository,
    private val projectRepository: ProjectRepository,
    private val projectMemberRepository: ProjectMemberRepository
) {
    @Transactional
    fun addSchedule(userId: Long, request: ScheduleRequest): ScheduleResponse {
        val user = userRepository.findById(userId).orElseThrow()
        val project = request.projectId?.let { projectRepository.findById(it).orElse(null) }

        val schedule = Schedule(
            title = request.title,
            startTime = request.startTime,
            endTime = request.endTime,
            project = project,
            user = user
        )

        val saved = scheduleRepository.save(schedule)
        return ScheduleResponse(saved.id!!, saved.title, saved.startTime, saved.endTime)
    }

    @Transactional
    fun deleteSchedule(scheduleId: Long) {
        scheduleRepository.deleteById(scheduleId)
    }

    @Transactional(readOnly = true)
    fun getRoomSchedules(projectId: Long): List<ScheduleResponse> {
        // 1. 방 일정 조회
        val roomSchedules = scheduleRepository.findAllByProject_Id(projectId)

        // 2. 방에 속한 모든 멤버의 ID를 가져옴
        val memberIds = projectMemberRepository.findAllByProjectId(projectId).map { it.user.id!! }

        // 3. 해당 멤버들의 개인 일정(projectId가 null인 것)을 싹 다 가져옴
        val personalSchedules = scheduleRepository.findAllByUser_IdInAndProjectIsNull(memberIds)

        // 4. 두 리스트를 합쳐서 반환
        return (roomSchedules + personalSchedules).map {
            ScheduleResponse(it.id!!, it.title, it.startTime, it.endTime)
        }
    }

    @Transactional
    fun addPersonalSchedule(userId: Long, request: ScheduleRequest): ScheduleResponse {
        val user = userRepository.findById(userId).orElseThrow()

        // projectId를 null로 저장하여 개인 일정으로 생성
        val schedule = Schedule(
            title = request.title,
            startTime = request.startTime,
            endTime = request.endTime,
            project = null,
            user = user
        )
        val saved = scheduleRepository.save(schedule)
        return ScheduleResponse(saved.id!!, saved.title, saved.startTime, saved.endTime)
    }


}