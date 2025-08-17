package main

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

func getApplicationsHandler(c *gin.Context) {
	userID := c.GetInt("user_id")

	rows, err := db.Query(`
		SELECT a.id, a.job_id, a.user_id, a.status, a.created_at, a.updated_at,
		       j.title as job_title, j.company as job_company, j.location as job_location,
		       u.name as user_name
		FROM applications a
		JOIN jobs j ON a.job_id = j.id
		JOIN users u ON a.user_id = u.id
		WHERE a.user_id = ?
		ORDER BY a.created_at DESC`, userID)
	
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar candidaturas"})
		return
	}
	defer rows.Close()

	var applications []gin.H
	for rows.Next() {
		var app Application
		var jobTitle, jobCompany, jobLocation, userName string
		err := rows.Scan(
			&app.ID, &app.JobID, &app.UserID, &app.Status, &app.CreatedAt, &app.UpdatedAt,
			&jobTitle, &jobCompany, &jobLocation, &userName)
		
		if err != nil {
			continue
		}

		applications = append(applications, gin.H{
			"id":           app.ID,
			"job_id":       app.JobID,
			"user_id":      app.UserID,
			"status":       app.Status,
			"created_at":   app.CreatedAt,
			"updated_at":   app.UpdatedAt,
			"job_title":    jobTitle,
			"job_company":  jobCompany,
			"job_location": jobLocation,
			"user_name":    userName,
		})
	}

	c.JSON(http.StatusOK, gin.H{"applications": applications})
}

func createApplicationHandler(c *gin.Context) {
	var req ApplicationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID := c.GetInt("user_id")

	// Verificar se a vaga existe
	var job Job
	err := db.QueryRow("SELECT id FROM jobs WHERE id = ?", req.JobID).Scan(&job.ID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Vaga não encontrada"})
		return
	}

	// Verificar se já existe uma candidatura
	var existingApp Application
	err = db.QueryRow("SELECT id FROM applications WHERE job_id = ? AND user_id = ?", req.JobID, userID).Scan(&existingApp.ID)
	if err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Você já se candidatou para esta vaga"})
		return
	}

	// Verificar se não é a própria vaga do usuário
	if job.UserID == userID {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Você não pode se candidatar para sua própria vaga"})
		return
	}

	now := time.Now()
	result, err := db.Exec(`
		INSERT INTO applications (job_id, user_id, status, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?)`,
		req.JobID, userID, "pending", now, now)
	
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao criar candidatura"})
		return
	}

	appID, _ := result.LastInsertId()
	
	c.JSON(http.StatusCreated, gin.H{
		"message": "Candidatura realizada com sucesso",
		"application_id": appID,
	})
}

func getApplicationHandler(c *gin.Context) {
	appID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	userID := c.GetInt("user_id")

	var app Application
	var jobTitle, jobCompany, jobLocation, userName string
	err = db.QueryRow(`
		SELECT a.id, a.job_id, a.user_id, a.status, a.created_at, a.updated_at,
		       j.title as job_title, j.company as job_company, j.location as job_location,
		       u.name as user_name
		FROM applications a
		JOIN jobs j ON a.job_id = j.id
		JOIN users u ON a.user_id = u.id
		WHERE a.id = ? AND a.user_id = ?`, appID, userID).Scan(
		&app.ID, &app.JobID, &app.UserID, &app.Status, &app.CreatedAt, &app.UpdatedAt,
		&jobTitle, &jobCompany, &jobLocation, &userName)
	
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Candidatura não encontrada"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"application": gin.H{
			"id":           app.ID,
			"job_id":       app.JobID,
			"user_id":      app.UserID,
			"status":       app.Status,
			"created_at":   app.CreatedAt,
			"updated_at":   app.UpdatedAt,
			"job_title":    jobTitle,
			"job_company":  jobCompany,
			"job_location": jobLocation,
			"user_name":    userName,
		},
	})
}

func updateApplicationHandler(c *gin.Context) {
	appID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	var req struct {
		Status string `json:"status" binding:"required,oneof=pending accepted rejected"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID := c.GetInt("user_id")

	// Verificar se a candidatura existe e pertence ao usuário
	var existingApp Application
	err = db.QueryRow("SELECT user_id FROM applications WHERE id = ?", appID).Scan(&existingApp.UserID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Candidatura não encontrada"})
		return
	}

	if existingApp.UserID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Você não tem permissão para editar esta candidatura"})
		return
	}

	_, err = db.Exec("UPDATE applications SET status = ?, updated_at = ? WHERE id = ?", req.Status, time.Now(), appID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao atualizar candidatura"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Candidatura atualizada com sucesso"})
}

func deleteApplicationHandler(c *gin.Context) {
	appID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	userID := c.GetInt("user_id")

	// Verificar se a candidatura existe e pertence ao usuário
	var existingApp Application
	err = db.QueryRow("SELECT user_id FROM applications WHERE id = ?", appID).Scan(&existingApp.UserID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Candidatura não encontrada"})
		return
	}

	if existingApp.UserID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Você não tem permissão para excluir esta candidatura"})
		return
	}

	_, err = db.Exec("DELETE FROM applications WHERE id = ?", appID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao excluir candidatura"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Candidatura excluída com sucesso"})
}
