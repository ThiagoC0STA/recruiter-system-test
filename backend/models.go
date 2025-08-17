package main

import (
	"time"
)

type User struct {
	ID        int       `json:"id" db:"id"`
	Email     string    `json:"email" db:"email"`
	Password  string    `json:"-" db:"password"`
	Name      string    `json:"name" db:"name"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}

type Job struct {
	ID          int       `json:"id" db:"id"`
	Title       string    `json:"title" db:"title"`
	Description string    `json:"description" db:"description"`
	Company     string    `json:"company" db:"company"`
	Location    string    `json:"location" db:"location"`
	Salary      string    `json:"salary" db:"salary"`
	Type        string    `json:"type" db:"type"` // full-time, part-time, contract
	UserID      int       `json:"user_id" db:"user_id"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time `json:"updated_at" db:"updated_at"`
}

type Application struct {
	ID        int       `json:"id" db:"id"`
	JobID     int       `json:"job_id" db:"job_id"`
	UserID    int       `json:"user_id" db:"user_id"`
	Status    string    `json:"status" db:"status"` // pending, accepted, rejected
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type RegisterRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
	Name     string `json:"name" binding:"required"`
}

type JobRequest struct {
	Title       string `json:"title" binding:"required"`
	Description string `json:"description" binding:"required"`
	Company     string `json:"company" binding:"required"`
	Location    string `json:"location" binding:"required"`
	Salary      string `json:"salary"`
	Type        string `json:"type" binding:"required"`
}

type ApplicationRequest struct {
	JobID int `json:"job_id" binding:"required"`
}
