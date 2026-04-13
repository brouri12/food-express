# 🗺️ Navigation - FoodExpress

## 🏠 Pages Principales

### Publiques (Accessible sans connexion)
- **/** - Page d'accueil avec hero, promotions, restaurants
- **/login** - Connexion utilisateur
- **/signup** - Inscription (client/livreur/restaurateur)

### Authentifiées (Nécessite connexion)
- **/profile** - Dashboard utilisateur
- **/restaurants** - Liste complète des restaurants
- **/restaurant/rest-1** - Menu du Bistrot Parisien
- **/restaurant/rest-2** - Menu Sushi Master
- **/restaurant/rest-3** - Menu Pizza Napoli
- **/cart** - Panier et validation de commande
- **/delivery/order-2** - Suivi de livraison en cours
- **/ratings** - Évaluer vos commandes
- **/notifications** - Centre de notifications

---

## 🎯 Parcours Utilisateur Types

### 🛍️ Parcours Client Standard

1. **/** → Découvrir les restaurants
2. **/restaurants** → Filtrer par catégorie/note
3. **/restaurant/rest-1** → Consulter le menu
4. Ajouter des plats au panier
5. **/cart** → Appliquer code promo "BIENVENUE20"
6. Valider la commande
7. **/delivery/order-2** → Suivre la livraison
8. **/ratings** → Évaluer après livraison

### 🔍 Parcours Découverte

1. **/** → Cliquer sur une catégorie (ex: Japonaise 🍣)
2. **/restaurants?category=Japonaise** → Voir tous les restaurants japonais
3. **/restaurant/rest-2** → Ouvrir Sushi Master
4. Explorer le menu par catégories
5. Consulter les avis en bas de page

### 🎟️ Parcours Promotion

1. **/** → Voir les bannières promotionnelles
2. Cliquer sur "-20% chez Le Bistrot"
3. **/restaurant/rest-1** → Voir le menu avec réduction
4. Ajouter au panier
5. **/cart** → Code promo déjà appliqué

### 👤 Parcours Profil

1. **/profile** → Dashboard avec stats
2. Onglet "Informations" → Modifier nom/email
3. Onglet "Adresses" → Ajouter bureau
4. Onglet "Paiements" → Ajouter carte
5. Onglet "Paramètres" → Gérer notifications

---

## 🔔 Notifications Types

Rendez-vous sur **/notifications** pour voir :

- 🚚 **Commande en route** (Type: order)
- 🎉 **Nouvelle offre** (Type: promotion)
- ✅ **Commande livrée** (Type: delivery)
- ⭐ **Demande d'avis** (Type: rating)

---

## 🍽️ Restaurants Disponibles

### Le Bistrot Parisien (rest-1)
- **Cuisine** : Française
- **Note** : 4.8/5 ⭐
- **Promotion** : -20%
- **Spécialités** : Bœuf Bourguignon, Coq au vin

### Sushi Master (rest-2)
- **Cuisine** : Japonaise
- **Note** : 4.9/5 ⭐
- **Spécialités** : Assortiment sushi, Sashimi saumon

### Pizza Napoli (rest-3)
- **Cuisine** : Italienne
- **Note** : 4.6/5 ⭐
- **Promotion** : -15%
- **Spécialités** : Margherita, Quattro Formaggi

### Le Burger King (rest-4)
- **Cuisine** : Américaine
- **Note** : 4.5/5 ⭐
- **Livraison** : La plus rapide (15-25min)

### Saigon Street (rest-5)
- **Cuisine** : Vietnamienne
- **Note** : 4.7/5 ⭐

### Taj Mahal (rest-6)
- **Cuisine** : Indienne
- **Note** : 4.4/5 ⭐
- **Promotion** : -25%

---

## 🎟️ Codes Promo Actifs

À utiliser dans **/cart** :

1. **BIENVENUE20**
   - Type : -20% sur total
   - Première commande uniquement

2. **LIVRAISON0**
   - Type : Livraison gratuite
   - Minimum : 25€

3. **Offres restaurant**
   - Pizza Napoli : 1 pizza achetée = 1 offerte
   - Le Bistrot : -20% automatique
   - Taj Mahal : -25% automatique

---

## 🗂️ Catégories de Cuisine

Disponibles sur **/** et **/restaurants** :

- 🥖 **Française** (125 restaurants)
- 🍕 **Italienne** (98 restaurants)
- 🍜 **Asiatique** (156 restaurants)
- 🍔 **Américaine** (87 restaurants)
- 🍛 **Indienne** (42 restaurants)
- 🍣 **Japonaise** (63 restaurants)
- 🥗 **Healthy** (54 restaurants)
- 🍰 **Desserts** (71 restaurants)

---

## 📱 Navigation Mobile

### Bottom Bar (Mobile uniquement)
- 🏠 **Accueil** → /
- 🏪 **Restaurants** → /restaurants
- 🛒 **Panier** → /cart (avec badge si items)
- 👤 **Profil** → /profile

### Header (Desktop + Mobile)
- 🔔 **Notifications** → Badge avec nombre non lues
- 🛒 **Panier** → Badge avec nombre d'items
- 👤 **Profil** → Accès rapide

---

## 🎬 Scénarios de Démonstration

### Démo 1 : Commande Rapide (2 min)
```
/ → /restaurants → /restaurant/rest-3 
→ Ajouter 2 pizzas → /cart → Commander
```

### Démo 2 : Découverte & Filtres (3 min)
```
/ → Catégorie Japonaise → /restaurants?category=Japonaise
→ Filtrer note 4.5+ → Trier par temps
→ /restaurant/rest-2
```

### Démo 3 : Profil Complet (2 min)
```
/profile → Dashboard (voir stats)
→ Adresses (ajouter)
→ Paiements (gérer)
→ Commandes récentes (voir)
```

### Démo 4 : Suivi Livraison (1 min)
```
/delivery/order-2 → Voir carte
→ Voir timeline → Position livreur
→ Contacter livreur
```

### Démo 5 : Notifications (1 min)
```
/notifications → Filtrer par type
→ Marquer comme lu
→ Gérer préférences
```

---

## 🔍 Easter Eggs & Détails

### Animations
- **Cards** : Hover effect avec élévation
- **Buttons** : Scale effect au clic
- **Promotions** : Rotation automatique (bannières)
- **Loading** : Skeleton screens
- **Notifications** : Badge pulsant si non lues

### Micro-interactions
- **Ajout panier** : Toast notification verte
- **Suppression item** : Animation de sortie
- **Scroll** : Sticky navigation
- **Mobile swipe** : Catégories horizontales

### États Visuels
- **Plat indisponible** : Grayed out, bouton désactivé
- **Restaurant fermé** : Badge "Fermé"
- **Livraison en cours** : Animation du livreur
- **Note non lue** : Border orange

---

## 🎨 Thème & Style

### Couleurs Principales
- **Orange** : #f97316
- **Rouge** : #dc2626
- **Vert** : #10b981 (success)
- **Gris** : #f9fafb (background)

### Typographie
- **Font** : System fonts (optimisé)
- **Tailles** : Responsive (16px base)
- **Poids** : 400 (normal), 500 (medium), 700 (bold)

---

## 🚀 Quick Links

### Pages Clés
- [Accueil](/) - Découvrir
- [Restaurants](/restaurants) - Explorer
- [Profil](/profile) - Gérer
- [Notifications](/notifications) - Rester informé

### Actions Rapides
- [Commander maintenant](/restaurants)
- [Voir mes commandes](/profile)
- [Codes promo](/cart)
- [Support](/help)

---

**Navigation optimisée pour tous les appareils** 📱💻🖥️
