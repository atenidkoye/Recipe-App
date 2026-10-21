# Recipe App - Project and API documentation

## 1. Project Overview
**Recipe App** is a recipe and shopping-list application built with React Native and Expo. It
allows users to authenticate, browse recipes, manage recipes, organize ingredients and
categories, save favorites, and manage shopping lists.

The project is divided into two main applications:
*   **Frontend (app/)** — React Native mobile application built with Expo.
*   **Backend (src/)** — REST API built with Node.js, Express, TypeScript, and SQLite

> The backend is the primary source of persistent application data. The mobile application communicates with it through HTTP requests.

---

## 2. Technology Stack

| Component | Technology |
| :--- | :--- |
| **Mobile frontend** | React Native |
| **Mobile development** | Expo |
| **Navigation** | React Navigation |
| **Frontend language** | JavaScript (TypeScript used for local DB code) |
| **Backend runtime** | Node.js |
| **Backend framework** | Express |
| **Backend language** | TypeScript |
| **Backend database** | SQLite |
| **Database access** | SQLite library used by the backend |
| **Local mobile database**| Expo SQLite |
| **Authentication** | JWT-based token authentication |
| **API communication** | HTTP/REST |

---

## 3. Project Structure

The project root contains the frontend, backend, and a backup of the frontend.

```text
Recipe_App/
├── app/
│ ├── App.js
│ ├── index.js
│ ├── app.json
│ ├── package.json
│ ├── src/
│ │ ├── components/
│ │ │ ├── AuthContext.js
│ │ │ └── Navigation.js
│ │ ├── database/
│ │ │ └── database.ts
│ │ ├── screens/
│ │ │ ├── LoginScreen.js
│ │ │ ├── RegisterScreen.js
│ │ │ ├── RecipeList.js
│ │ │ ├── Recipe.js
│ │ │ ├── RecipeEditor.js
│ │ │ ├── Account.js
│ │ │ ├── Search.js
│ │ │ └── ShoppingList.js
│ │ ├── static/
│ │ │ └── styles.js
│ │ └── utils/
│ │ ├── auth.js
│ │ ├── db.js
│ │ └── types/
│ │ └── user.js
│ └── assets and other Expo files
│
├── src/
│ │
│ │ ├── app.ts
│ │ ├── server.ts
│ │ ├── config/
│ │ │ └── database.ts
│ │ ├── database/
│ │ │ ├── init.ts
│ │ │ └── schema.sql
│ │ ├── middleware/
│ │ │ └── authMiddleware.ts
│ │ └── features/
│ │ ├── auth/
│ │ ├── recipes/
│ │ ├── ingredients/
│ │ ├── categories/
│ │ ├── favorites/
│ │ ├── shopping_list/
│ │ └── users/
│ └── package.json
│
└── app-backup/
```

### Frontend Responsibilities
*   **`App.js`**
    *   Initializes application navigation.
    *   Loads stored user session information.
    *   Manages the authentication context.
    *   Directs users to the appropriate screen.
*   **`src/components/`**
    *   Contains shared components such as authentication context and navigation.
*   **`src/screens/`**
    *   Contains the screens for login, registration, recipe browsing, account management, search, and shopping lists.
*   **`src/database/database.ts`**
    *   Initializes the mobile SQLite database.
    *   Stores cached recipes and related offline application data.
*   **`src/utils/db.js`**
    *   Contains the existing local user/session database functions.
*   **`src/utils/auth.js`**
    *   Contains frontend authentication utilities, including token validation.

> **Note:** The exact contents of individual modules should be checked against the current repository before this directory tree is treated as an exhaustive file listing.

---

## 4. API Configuration

### Base URL
*   The API runs locally on port `4000`.
*   For requests from the Android emulator: `http://10.0.2.2:4000`
*   For requests from the development computer itself: `http://localhost:4000`

> The Android emulator uses `10.0.2.2` to reach the development computer's localhost. When deploying the backend, replace the development address with the deployed API URL.

### API Conventions
*   HTTP methods describe the requested operation.
*   JSON is used for request and response bodies where applicable.
*   Protected endpoints require a valid authentication token.
*   Resource identifiers are represented by path parameters such as `:id` and `:recipeId`.
*   Actual status codes and response formats depend on the corresponding route and controller implementation.

---

## 5. API Endpoint Reference 
The following documents the endpoint paths identified during project development. Routes mounted in the application are listed separately from endpoints whose exact current implementation still needs verification.

### 5.1 Health Check

| Method | Endpoint | Description | Authentication |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Confirms that the API is running. | Not required |
| `GET` | `/api/protected` | Protected endpoint used to test authentication. | Required |

**Example health-check request:**
```http
GET /
```

**Example response:**
```json
{
    "message": "Recipe API is running!"
}
```
### 5.2 Authentication
**Base path:** `/api/auth`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Registers a new user. |
| `POST` | `/api/auth/login` | Authenticates a user and returns authentication information. |

**Example registration request:**
```http
POST /api/auth/register
Content-Type: application/json
```
```json
{
  "name": "Example User",
  "email": "user@example.com",
  "password": "example-password"
}
```

**Example login request:**
```http
POST /api/auth/login
Content-Type: application/json
```
```json
{
  "email": "user@example.com",
  "password": "example-password"
}
```
> **Note:** The request fields above illustrate the expected authentication flow. Confirm the actual validation rules and response shape in the current authentication controller.

### 5.3 Recipes
**Base path:** `/api/recipes`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/recipes` | Retrieves recipes. |
| `GET` | `/api/recipes/:id` | Retrieves a recipe by ID. |
| `GET` | `/api/recipes/user/me` | Retrieves recipes associated with the authenticated user. |
| `POST` | `/api/recipes` | Creates a recipe. |
| `PUT` | `/api/recipes/:id` | Updates a recipe. |
| `DELETE` | `/api/recipes/:id` | Deletes a recipe. |

**Example request to retrieve recipes:**
```http
GET /api/recipes
```

**Example recipe body:**
```json
{
  "title": "Vegetable Pasta",
  "description": "A simple vegetable pasta recipe.",
  "instructions": "Cook the pasta and prepare the vegetables.",
  "cooking_time": 25,
  "servings": 2,
  "is_public": 1
}
```
> **Note:** The example represents the recipe fields in the backend schema. Confirm which fields are mandatory and whether the endpoint accepts additional fields by checking the recipe controller and service.

### 5.4 Ingredients
**Base path:** `/api/ingredients`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/ingredients/recipe/:recipeId`| Retrieves ingredients associated with a recipe. |
| `POST` | `/api/ingredients/recipe/:recipeId`| Adds an ingredient to a recipe. |
| `DELETE` | `/api/ingredients/:id` | Deletes an ingredient by ID. |

**Example retrieval:**
```http
GET /api/ingredients/recipe/1
```

**Example ingredient body:**
```json
{
  "name": "Tomato",
  "quantity": 2,
  "unit": "pieces"
}
```

### 5.5 Categories
**Base path:** `/api/categories`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/categories` | Retrieves categories. |
| `GET` | `/api/categories/:id` | Retrieves a category by ID. |
| `POST` | `/api/categories` | Creates a category. |

**Example category body:**
```json
{
  "name": "Vegetarian"
}
```
> **Note:** The category resource is separate from the relationship between a category and a recipe.

### 5.6 Recipe-Category Relationships
**Base path:** `/api/recipe-categories`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/recipe-categories/:recipeId`| Retrieves categories assigned to a recipe. |
| `POST` | `/api/recipe-categories/:recipeId/:categoryId`| Assigns a category to a recipe. |
| `DELETE` | `/api/recipe-categories/:recipeId/:categoryId`| Removes a category assignment from a recipe. |

**Example request:**
```http
POST /api/recipe-categories/1/2
```
*(This assigns category `2` to recipe `1`)*

> **Note:** The relationship is stored in `recipe_categories`, whose composite primary key prevents the same category from being assigned to the same recipe more than once. The POST and DELETE operations are intended to require authentication and authorization checks.

### 5.7 Favorites
**Base path:** `/api/favourites`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/favourites` | Retrieves the authenticated user's favorites. |
| `GET` | `/api/favourites/:recipeId`| Retrieves or checks favorite information for a recipe. |
| `POST` | `/api/favourites/:recipeId`| Adds a recipe to favorites. |
| `DELETE` | `/api/favourites/:recipeId`| Removes a recipe from favorites. |

> **Note:** The exact response for the GET endpoint containing `:recipeId` should be confirmed in the favorites controller. Favorites are stored in the backend `favourites` table. Its composite primary key consists of `user_id` and `recipe_id`.

### 5.8 Shopping Lists
**Base path:** `/api/shopping-list`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/shopping-list` | Retrieves the user's shopping list. |
| `POST` | `/api/shopping-list` | Creates a shopping list. |
| `PUT` | `/api/shopping-list/:id` | Updates a shopping list. |
| `DELETE` | `/api/shopping-list/:id` | Deletes a shopping list. |

> **Note:** These are the shopping-list resource routes identified during development. The item-specific route design was also discussed, but the current implementation of individual shopping-list item endpoints needs verification before additional paths are documented as implemented. The shopping-list router was configured to require authentication.

### 5.9 Users
**Base path:** `/api/users`

The users router is mounted in `src/app.ts`. The exact current methods and paths exposed by this router should be confirmed from `src/features/users/users.routes.ts` before documenting them as implemented endpoints.

---

## 6. Backend Database Schema

The backend schema defines the following tables:

| Table | Purpose |
| :--- | :--- |
| **users** | Stores user accounts, password hashes, and creation timestamps. |
| **recipes** | Stores recipes, their owners, instructions, and visibility. |
| **ingredients** | Stores ingredients associated with recipes. |
| **categories** | Stores available recipe categories. |
| **recipe_categories** | Connects recipes to categories through a many-to-many relationship. |
| **shopping_lists** | Stores shopping lists associated with users. |
| **shopping_list_items** | Stores individual shopping-list items. |
| **favourites** | Stores favorite recipes for individual users. |

### Important Relationships
*   A user can own multiple recipes.
*   A recipe can have multiple ingredients.
*   Recipes and categories have a many-to-many relationship.
*   Each user has at most one shopping list in the current schema because `shopping_lists.user_id` is unique.
*   A shopping list can contain multiple items.
*   Users can favorite multiple recipes, and a recipe can be favorited by multiple users.
*   Foreign keys use cascading deletion where specified in `schema.sql`. Foreign-key enforcement must be enabled on the SQLite connection performing the operation.

---

## 7. Authentication and Security

The frontend maintains authentication state through `AuthContext`. It also uses local storage functions to retrieve stored user data and validates the stored token before restoring a session.

For protected API calls, the client should send the token in the authorization header:
```http
Authorization: Bearer <token>
```

### Security Requirements:
*   Passwords **must** be hashed on the backend before storage.
*   The mobile app must **never** store the backend's `password_hash`.
*   Private recipe operations must verify recipe ownership.
*   Favorite and shopping-list operations must use the authenticated user's identity rather than trusting a user ID supplied by the client.
*   Authentication and authorization should be checked on the server, not only in the frontend.
*   Production API traffic should use **HTTPS**.

---

## 8. Local SQLite in the Mobile Application

The frontend has a separate SQLite database initialized through `src/database/database.ts`. Its intended purpose is to support local data access and offline use. It is not a direct connection to the backend database.

The current local database design includes:
*   `recipes`
*   `ingredients`
*   `categories`
*   `recipe_categories`
*   `favourites`
*   `shopping_lists`
*   `shopping_list_items`
*   `sync_queue`

The local schema has been initialized successfully during development. However, the existing column definitions still need to be compared with the current backend schema before the cache and synchronization behavior can be considered complete.

> **Note:** The `sync_queue` table is intended to record local changes that need to be sent to the server. A queue table alone does not implement synchronization; retry handling, conflict resolution, and server requests still need to be developed.

---

## 9. Running the Project
### Start the Backend
Open a terminal in the backend folder:
```bash
npm install
npm run dev
```
*(The backend should start on port `4000`)*

### Start the Frontend
Open another terminal:
```bash
cd app
npm install
npx expo start
```
*(Open the app in Expo Go or the Android emulator)*

### Development API URL
*   For the standard Android emulator: `http://10.0.2.2:4000`
*   If testing on a physical device, use the computer's reachable LAN address instead and ensure both devices can communicate over the network.

---

## 10. Testing the API
Endpoints can be tested using Postman or another HTTP client.

**Recommended test sequence:**
1. Check `GET /`.
2. Register a user using `POST /api/auth/register`.
3. Log in using `POST /api/auth/login`.
4. Copy the returned token.
5. Test `GET /api/protected` with the Bearer token.
6. Create and retrieve a recipe.
7. Add ingredients and categories.
8. Add and remove a favorite.
9. Create and retrieve a shopping list.
10. Test unauthorized requests to protected resources.

> For each endpoint, record the expected status code, response body, validation failures, and authentication requirements from the actual controller implementation.

---

## 11. Current Documentation Limitations
This document consolidates endpoint paths and project structure identified during development. **It is not yet a verified OpenAPI specification.**

Before treating it as the definitive API contract, verify the current implementations of:
*   `src/features/users/users.routes.ts`
*   `src/features/favorites/favorites.routes.ts`
*   `src/features/shopping_list/`
*   The recipe, ingredient, category, and recipe-category route files

This final verification is necessary to establish exact request schemas, response formats, status codes, and every currently implemented endpoint.

---

## 12. Summary
**Recipe_App** uses a React Native and Expo frontend connected to an Express and TypeScript backend. The backend manages authentication and persistent application data in SQLite, while the mobile application has its own local database for offline functionality.

The backend API is organized by feature modules, with authentication middleware protecting operations that require a signed-in user. The next documentation improvement should be to verify every current route file and generate an OpenAPI specification from the implemented API contract.