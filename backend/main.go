package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
)

func main() {
	r := gin.Default()

	// Configuração CORS
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:5173"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
	config.AllowCredentials = true
	r.Use(cors.New(config))

	// Rotas de autenticação
	auth := r.Group("/auth")
	{
		auth.POST("/register", registerHandler)
		auth.POST("/login", loginHandler)
	}

	// Rotas protegidas
	protected := r.Group("/api")
	protected.Use(authMiddleware())
	{
		protected.GET("/jobs", getJobsHandler)
		protected.POST("/jobs", createJobHandler)
		protected.GET("/jobs/:id", getJobHandler)
		protected.PUT("/jobs/:id", updateJobHandler)
		protected.DELETE("/jobs/:id", deleteJobHandler)
		
		protected.GET("/applications", getApplicationsHandler)
		protected.POST("/applications", createApplicationHandler)
		protected.GET("/applications/:id", getApplicationHandler)
		protected.PUT("/applications/:id", updateApplicationHandler)
		protected.DELETE("/applications/:id", deleteApplicationHandler)
		
		protected.GET("/profile", getProfileHandler)
		protected.PUT("/profile", updateProfileHandler)
	}

	// Inicializar banco de dados
	initDB()

	log.Println("Servidor rodando na porta :8080")
	r.Run(":8080")
}
