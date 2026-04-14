#!/bin/bash
# ============================================================
# Script d'initialisation de toutes les bases FoodExpress
# Exécuté automatiquement par le conteneur postgres-all
# ============================================================
set -e

PGPASSWORD="$POSTGRES_PASSWORD"
PGUSER="$POSTGRES_USER"

echo "🗄️  Création des bases de données FoodExpress..."

# Créer les bases si elles n'existent pas
for DB in userdb restaurantdb menudb promotiondb deliverydb ratingdb; do
    psql -v ON_ERROR_STOP=1 --username "$PGUSER" --dbname "postgres" <<-EOSQL
        SELECT 'CREATE DATABASE $DB'
        WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB')\gexec
EOSQL
    echo "✅ Base '$DB' prête"
done

echo ""
echo "📋 Initialisation des schémas et données..."

# userdb
psql -v ON_ERROR_STOP=1 --username "$PGUSER" --dbname "userdb" -f /docker-entrypoint-initdb.d/01-init-userdb.sql
echo "✅ userdb initialisée"

# restaurantdb
psql -v ON_ERROR_STOP=1 --username "$PGUSER" --dbname "restaurantdb" -f /docker-entrypoint-initdb.d/02-init-restaurantdb.sql
echo "✅ restaurantdb initialisée"

# menudb
psql -v ON_ERROR_STOP=1 --username "$PGUSER" --dbname "menudb" -f /docker-entrypoint-initdb.d/03-init-menudb.sql
echo "✅ menudb initialisée"

# promotiondb
psql -v ON_ERROR_STOP=1 --username "$PGUSER" --dbname "promotiondb" -f /docker-entrypoint-initdb.d/04-init-promotiondb.sql
echo "✅ promotiondb initialisée"

# deliverydb
psql -v ON_ERROR_STOP=1 --username "$PGUSER" --dbname "deliverydb" -f /docker-entrypoint-initdb.d/05-init-deliverydb.sql
echo "✅ deliverydb initialisée"

# ratingdb
psql -v ON_ERROR_STOP=1 --username "$PGUSER" --dbname "ratingdb" -f /docker-entrypoint-initdb.d/06-init-ratingdb.sql
echo "✅ ratingdb initialisée"

echo ""
echo "🎉 Toutes les bases FoodExpress sont prêtes !"
