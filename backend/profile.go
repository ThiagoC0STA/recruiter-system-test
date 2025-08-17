package main

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func getProfileHandler(c *gin.Context) {
	userID := c.GetInt("user_id")

	var user User
	err := db.QueryRow(`
		SELECT id, email, name, created_at, updated_at FROM users WHERE id = ?`, userID).Scan(
		&user.ID, &user.Email, &user.Name, &user.CreatedAt, &user.UpdatedAt)
	
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuário não encontrado"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user": gin.H{
			"id":         user.ID,
			"email":      user.Email,
			"name":       user.Name,
			"created_at": user.CreatedAt,
			"updated_at": user.UpdatedAt,
		},
	})
}

func updateProfileHandler(c *gin.Context) {
	userID := c.GetInt("user_id")

	var req struct {
		Name string `json:"name" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := db.Exec("UPDATE users SET name = ?, updated_at = ? WHERE id = ?", req.Name, time.Now(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao atualizar perfil"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Perfil atualizado com sucesso"})
}
