@echo off
echo ========================================
echo  Pushing FoodExpress to GitHub
echo  Branch: jasser
echo ========================================
echo.

cd /d C:\Users\jasse\OneDrive\Desktop\web_des

echo Initializing Git...
git init

echo Adding remote...
git remote remove origin 2>nul
git remote add origin https://github.com/brouri12/food-express.git

echo Creating jasser branch...
git checkout -b jasser 2>nul
git checkout jasser 2>nul

echo Adding all files...
git add .

echo Committing...
git commit -m "FoodExpress microservices: Config Server, Eureka, API Gateway, Commandes Service with QR code generation, Angular frontend, Docker support"

echo Pushing to GitHub...
git push -u origin jasser --force

echo.
echo ========================================
echo  Done!
echo ========================================
pause
