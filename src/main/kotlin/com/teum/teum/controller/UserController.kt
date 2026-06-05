package com.teum.teum.controller

import com.teum.teum.dto.LoginRequest
import com.teum.teum.dto.SignUpRequest
import com.teum.teum.dto.UserResponse
import com.teum.teum.service.UserService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/users")
class UserController(
    private val userService: UserService
) {
    // POST /api/users/signup
    @PostMapping("/signup")
    fun signUp(@RequestBody request: SignUpRequest): ResponseEntity<UserResponse> {
        val response = userService.signUp(request)
        return ResponseEntity.ok(response)
    }

    // POST /api/users/login
    @PostMapping("/login")
    fun login(@RequestBody request: LoginRequest): ResponseEntity<UserResponse> {
        val response = userService.login(request)
        return ResponseEntity.ok(response)
    }
}