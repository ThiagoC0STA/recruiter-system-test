package main

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

func getJobsHandler(c *gin.Context) {
	rows, err := db.Query(`
		SELECT j.id, j.title, j.description, j.company, j.location, j.salary, j.type, j.user_id, j.created_at, j.updated_at,
		       u.name as user_name
		FROM jobs j
		JOIN users u ON j.user_id = u.id
		ORDER BY j.created_at DESC`)
	
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar vagas"})
		return
	}
	defer rows.Close()

	var jobs []gin.H
	for rows.Next() {
		var job Job
		var userName string
		err := rows.Scan(
			&job.ID, &job.Title, &job.Description, &job.Company, &job.Location,
			&job.Salary, &job.Type, &job.UserID, &job.CreatedAt, &job.UpdatedAt, &userName)
		
		if err != nil {
			continue
		}

		jobs = append(jobs, gin.H{
			"id":          job.ID,
			"title":       job.Title,
			"description": job.Description,
			"company":     job.Company,
			"location":    job.Location,
			"salary":      job.Salary,
			"type":        job.Type,
			"user_id":     job.UserID,
			"user_name":   userName,
			"created_at":  job.CreatedAt,
			"updated_at":  job.UpdatedAt,
		})
	}

	c.JSON(http.StatusOK, gin.H{"jobs": jobs})
}

func createJobHandler(c *gin.Context) {
	var req JobRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID := c.GetInt("user_id")
	now := time.Now()

	result, err := db.Exec(`
		INSERT INTO jobs (title, description, company, location, salary, type, user_id, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		req.Title, req.Description, req.Company, req.Location, req.Salary, req.Type, userID, now, now)
	
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao criar vaga"})
		return
	}

	jobID, _ := result.LastInsertId()
	
	c.JSON(http.StatusCreated, gin.H{
		"message": "Vaga criada com sucesso",
		"job_id":  jobID,
	})
}

func getJobHandler(c *gin.Context) {
	jobID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	var job Job
	var userName string
	err = db.QueryRow(`
		SELECT j.id, j.title, j.description, j.company, j.location, j.salary, j.type, j.user_id, j.created_at, j.updated_at,
		       u.name as user_name
		FROM jobs j
		JOIN users u ON j.user_id = u.id
		WHERE j.id = ?`, jobID).Scan(
		&job.ID, &job.Title, &job.Description, &job.Company, &job.Location,
		&job.Salary, &job.Type, &job.UserID, &job.CreatedAt, &job.UpdatedAt, &userName)
	
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Vaga não encontrada"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"job": gin.H{
			"id":          job.ID,
			"title":       job.Title,
			"description": job.Description,
			"company":     job.Company,
			"location":    job.Location,
			"salary":      job.Salary,
			"type":        job.Type,
			"user_id":     job.UserID,
			"user_name":   userName,
			"created_at":  job.CreatedAt,
			"updated_at":  job.UpdatedAt,
		},
	})
}

func updateJobHandler(c *gin.Context) {
	jobID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	var req JobRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID := c.GetInt("user_id")

	// Verificar se a vaga pertence ao usuário
	var existingJob Job
	err = db.QueryRow("SELECT user_id FROM jobs WHERE id = ?", jobID).Scan(&existingJob.UserID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Vaga não encontrada"})
		return
	}

	if existingJob.UserID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Você não tem permissão para editar esta vaga"})
		return
	}

	_, err = db.Exec(`
		UPDATE jobs SET title = ?, description = ?, company = ?, location = ?, salary = ?, type = ?, updated_at = ?
		WHERE id = ?`,
		req.Title, req.Description, req.Company, req.Location, req.Salary, req.Type, time.Now(), jobID)
	
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao atualizar vaga"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Vaga atualizada com sucesso"})
}

func deleteJobHandler(c *gin.Context) {
	jobID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	userID := c.GetInt("user_id")

	// Verificar se a vaga pertence ao usuário
	var existingJob Job
	err = db.QueryRow("SELECT user_id FROM jobs WHERE id = ?", jobID).Scan(&existingJob.UserID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Vaga não encontrada"})
		return
	}

	if existingJob.UserID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Você não tem permissão para excluir esta vaga"})
		return
	}

	// Excluir candidaturas primeiro
	_, err = db.Exec("DELETE FROM applications WHERE job_id = ?", jobID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao excluir candidaturas"})
		return
	}

	// Excluir a vaga
	_, err = db.Exec("DELETE FROM jobs WHERE id = ?", jobID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao excluir vaga"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Vaga excluída com sucesso"})
}
