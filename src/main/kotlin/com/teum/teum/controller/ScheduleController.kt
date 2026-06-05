package com.teum.teum.controller

import com.teum.teum.dto.*
import com.teum.teum.service.ScheduleService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/schedules") // value 속성 이름 생략 가능
class ScheduleController(private val scheduleService: ScheduleService) {

    @PostMapping("/{userId}")
    fun addSchedule(@PathVariable userId: Long, @RequestBody request: ScheduleRequest): ResponseEntity<ScheduleResponse> {
        return ResponseEntity.ok(scheduleService.addSchedule(userId, request))
    }

    @GetMapping("/project/{projectId}")
    fun getRoomSchedules(@PathVariable projectId: Long): ResponseEntity<List<ScheduleResponse>> {
        return ResponseEntity.ok(scheduleService.getRoomSchedules(projectId))
    }

    @DeleteMapping("/{scheduleId}")
    fun deleteSchedule(@PathVariable scheduleId: Long): ResponseEntity<Unit> {
        scheduleService.deleteSchedule(scheduleId)
        return ResponseEntity.noContent().build()
    }
}