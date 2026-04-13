#!/bin/bash
# ============================================================
# FoodExpress — Script de démarrage complet
# Usage : ./start.sh [infra|all|stop|clean|logs]
# ============================================================

set -e
COMPOSE="docker-compose"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'

print_header() {
  echo -e "\n${BLUE}╔══════════════════════════════════════════╗${NC}"
  echo -e "${BLUE}║     🍕 FoodExpress — $1${NC}"
  echo -e "${BLUE}╚══════════════════════════════════════════╝${NC}\n"
}

wait_for_service() {
  local name=$1; local url=$2; local max=30; local count=0
  echo -n "  ⏳ Attente de $name"
  until curl -sf "$url" > /dev/null 2>&1; do
    sleep 3; count=$((count+1))
    echo -n "."
    if [ $count -ge $max ]; then echo -e " ${RED}TIMEOUT${NC}"; return 1; fi
  done
  echo -e " ${GREEN}✓${NC}"
}

case "${1:-all}" in

  infra)
    print_header "Infrastructure seulement"
    $COMPOSE up -d postgres postgres-keycloak rabbitmq
    echo -e "\n${YELLOW}Attente des bases de données...${NC}"
    sleep 10
    $COMPOSE up -d keycloak
    echo -e "\n${YELLOW}Attente de Keycloak (peut prendre 60s)...${NC}"
    wait_for_service "Keycloak" "http://localhost:8180/health/ready"
    $COMPOSE up -d eureka-server
    wait_for_service "Eureka" "http://localhost:8761/actuator/health"
    $COMPOSE up -d config-server
    wait_for_service "Config Server" "http://localhost:8888/actuator/health"
    $COMPOSE up -d api-gateway
    echo -e "\n${GREEN}✅ Infrastructure démarrée !${NC}"
    ;;

  all)
    print_header "Démarrage complet"
    echo -e "${YELLOW}Étape 1/4 — Bases de données...${NC}"
    $COMPOSE up -d postgres postgres-keycloak rabbitmq pgadmin
    sleep 15

    echo -e "${YELLOW}Étape 2/4 — Keycloak...${NC}"
    $COMPOSE up -d keycloak
    wait_for_service "Keycloak" "http://localhost:8180/health/ready"

    echo -e "${YELLOW}Étape 3/4 — Spring Cloud Infrastructure...${NC}"
    $COMPOSE up -d eureka-server
    wait_for_service "Eureka" "http://localhost:8761/actuator/health"
    $COMPOSE up -d config-server
    wait_for_service "Config Server" "http://localhost:8888/actuator/health"
    $COMPOSE up -d api-gateway

    echo -e "${YELLOW}Étape 4/4 — Micro-services métiers...${NC}"
    $COMPOSE up -d user-service restaurant-service menu-service promotion-service delivery-service

    echo -e "${YELLOW}Monitoring...${NC}"
    $COMPOSE up -d prometheus grafana

    echo -e "\n${GREEN}╔══════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║  ✅ FoodExpress est prêt !               ║${NC}"
    echo -e "${GREEN}╠══════════════════════════════════════════╣${NC}"
    echo -e "${GREEN}║  API Gateway  → http://localhost:8080    ║${NC}"
    echo -e "${GREEN}║  Swagger UI   → http://localhost:8080/swagger-ui.html ║${NC}"
    echo -e "${GREEN}║  Eureka       → http://localhost:8761    ║${NC}"
    echo -e "${GREEN}║  Keycloak     → http://localhost:8180    ║${NC}"
    echo -e "${GREEN}║  RabbitMQ     → http://localhost:15672   ║${NC}"
    echo -e "${GREEN}║  Grafana      → http://localhost:3000    ║${NC}"
    echo -e "${GREEN}║  pgAdmin      → http://localhost:5050    ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════╝${NC}\n"
    ;;

  stop)
    print_header "Arrêt"
    $COMPOSE stop
    echo -e "${GREEN}✅ Services arrêtés${NC}"
    ;;

  clean)
    print_header "Nettoyage complet"
    echo -e "${RED}⚠️  Suppression de tous les conteneurs et volumes...${NC}"
    read -p "Confirmer ? (y/N) " -n 1 -r; echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      $COMPOSE down -v --remove-orphans
      docker image prune -f
      echo -e "${GREEN}✅ Nettoyage terminé${NC}"
    fi
    ;;

  logs)
    $COMPOSE logs -f --tail=50 "${2:-}"
    ;;

  status)
    print_header "Statut des services"
    $COMPOSE ps
    ;;

  *)
    echo "Usage: ./start.sh [infra|all|stop|clean|logs|status]"
    ;;
esac
