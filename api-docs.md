# The Propertist API Documentation

Base URL: `http://localhost:5000/api/v1`

## Authentication

The API uses JWT for authentication. Access tokens are returned in the response body on login/register and should be provided as a Bearer token in the `Authorization` header.
Refresh tokens are stored in an HTTP-only cookie (`refreshToken`).

`Authorization: Bearer <access_token>`

---

## Auth Endpoints

### 1. Register User
- **URL**: `/auth/register`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body** (JSON):
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "1234567890",
    "role": "agent" // or "seeker"
  }
  ```
- **Success Response**: `201 Created`
- **Sample Response**:
  ```json
  {
    "success": true,
    "message": "Registration successful",
    "data": {
      "user": { "_id": "...", "name": "John Doe", "email": "john@example.com", "role": "agent" },
      "accessToken": "eyJ..."
    }
  }
  ```

### 2. Login User
- **URL**: `/auth/login`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body** (JSON):
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Success Response**: `200 OK`

### 3. Get Current User (Me)
- **URL**: `/auth/me`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer Token)
- **Success Response**: `200 OK`

### 4. Update Profile
- **URL**: `/auth/me`
- **Method**: `PUT`
- **Auth Required**: Yes (Bearer Token)
- **Request Format**: `multipart/form-data`
- **Parameters**:
  - `name` (string)
  - `phone` (string)
  - `avatar` (file - image, max 5MB)
- **Success Response**: `200 OK`

### 5. Refresh Token
- **URL**: `/auth/refresh`
- **Method**: `POST`
- **Auth Required**: No (Requires `refreshToken` cookie)
- **Success Response**: `200 OK`

### 6. Logout
- **URL**: `/auth/logout`
- **Method**: `POST`
- **Auth Required**: Yes
- **Success Response**: `200 OK`

---

## Property Endpoints

### 1. Get All Properties (Public)
- **URL**: `/properties`
- **Method**: `GET`
- **Auth Required**: No
- **Query Params**: `page`, `limit`, `city`, `bhk`, `type`, `status`, `minPrice`, `maxPrice`
- **Success Response**: `200 OK`

### 2. Get Property Details (Public)
- **URL**: `/properties/:id`
- **Method**: `GET`
- **Auth Required**: No
- **Success Response**: `200 OK`

### 3. Create Property
- **URL**: `/properties`
- **Method**: `POST`
- **Auth Required**: Yes (Agent only)
- **Request Format**: `multipart/form-data`
- **Parameters**:
  - `title`, `description`, `type`, `status`, `bhk`, `price`, `address`, `city`, `state`, `pincode`, `lat`, `lng`, `amenities`, `area`, `furnished`
  - `images` (array of files - max 5 images)
- **Success Response**: `201 Created`

### 4. Update Property
- **URL**: `/properties/:id`
- **Method**: `PUT`
- **Auth Required**: Yes (Agent owner only)
- **Request Format**: `multipart/form-data`
- **Parameters**: Same as Create Property
- **Success Response**: `200 OK`

### 5. Delete Property
- **URL**: `/properties/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes (Agent owner only)
- **Success Response**: `200 OK`

### 6. Get My Listings
- **URL**: `/properties/agent/my-listings`
- **Method**: `GET`
- **Auth Required**: Yes (Agent only)
- **Query Params**: `page`, `limit`
- **Success Response**: `200 OK`

---

## Enquiry Endpoints

### 1. Create Enquiry
- **URL**: `/enquiries`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body** (JSON):
  ```json
  {
    "property": "651a2b...",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "9876543210",
    "message": "I'm interested in this property."
  }
  ```
- **Success Response**: `201 Created`

### 2. Get My Enquiries
- **URL**: `/enquiries/my`
- **Method**: `GET`
- **Auth Required**: Yes (Agent only)
- **Query Params**: `page`, `limit`, `status`
- **Success Response**: `200 OK`

### 3. Update Enquiry Status
- **URL**: `/enquiries/:id/status`
- **Method**: `PUT`
- **Auth Required**: Yes (Agent owner only)
- **Request Body** (JSON):
  ```json
  {
    "status": "contacted" // or "closed"
  }
  ```
- **Success Response**: `200 OK`

---

## Error Handling
All errors follow the format:
```json
{
  "success": false,
  "message": "Error message description",
  "stack": "..." // Only in development mode
}
```
Standard status codes (400, 401, 403, 404, 500) are used appropriately.
