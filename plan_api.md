# Radius — Kontrak API Backend (plan_api.md)

Dokumen ini mendefinisikan seluruh endpoint, request, dan response API untuk mempermudah development backend. 

* **Status Implementasi di Frontend**:
  * `✅ Terimplementasi` — Layer service/API sudah terhubung di frontend.
  * `⬜ Belum Diimplementasi` — Frontend masih menggunakan data mock lokal.

---

## 1. Protokol Global & Envelope Standar

### 1.1 Headers
```http
Accept: application/json
Content-Type: application/json
Authorization: Bearer <access_token>
```

### 1.2 Format Response Sukses (`ApiEnvelope`)
```json
{
  "isSuccess": true,
  "data": null,
  "message": "Operasi berhasil."
}
```

### 1.3 Format Response Error (`ApiFailureResponse`)
```json
{
  "error": {
    "type": "ValidationError",
    "code": "INVALID_CREDENTIALS",
    "message": "Email atau password salah."
  }
}
```

---

## 2. Endpoint Referensi

### 2.1 Authentication & User Profile (`✅ Terimplementasi`)

#### `POST /auth/register`
* **Request**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "strongpassword123"
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "isSuccess": true,
    "data": {
      "accessToken": "jwt_token_here",
      "tokenType": "Bearer",
      "expiresIn": 3600,
      "user": {
        "id": "usr_1",
        "name": "John Doe",
        "email": "john@example.com",
        "avatarUrl": null
      }
    }
  }
  ```

#### `POST /auth/login`
* **Request**:
  ```json
  {
    "email": "john@example.com",
    "password": "strongpassword123"
  }
  ```
* **Response (200 OK)**: Sama dengan response `POST /auth/register` (Token + User detail).

#### `GET /auth/sso/google/url`
* **Query Params**: `redirect_uri=http://localhost:3000/auth/callback`
* **Response (200 OK)**:
  ```json
  {
    "isSuccess": true,
    "data": {
      "authUrl": "https://accounts.google.com/o/oauth2/v2/auth?...",
      "state": "random_secure_state"
    }
  }
  ```

#### `POST /auth/sso/google/callback`
* **Request**:
  ```json
  {
    "code": "oauth_code_here",
    "state": "random_secure_state"
  }
  ```
* **Response (200 OK)**: Sama dengan response `POST /auth/register` (Token + User detail).

#### `GET /auth/sso/github/url`
* **Query Params**: `redirect_uri=http://localhost:3000/auth/callback`
* **Response (200 OK)**:
  ```json
  {
    "isSuccess": true,
    "data": {
      "authUrl": "https://github.com/login/oauth/authorize?...",
      "state": "random_secure_state"
    }
  }
  ```

#### `POST /auth/sso/github/callback`
* **Request**:
  ```json
  {
    "code": "oauth_code_here",
    "state": "random_secure_state"
  }
  ```
* **Response (200 OK)**: Sama dengan response `POST /auth/register` (Token + User detail).

#### `GET /users/me`
* **Response (200 OK)**:
  ```json
  {
    "isSuccess": true,
    "data": {
      "id": "usr_1",
      "name": "John Doe",
      "email": "john@example.com",
      "emailVerifiedAt": "2026-06-01T12:00:00Z",
      "avatarUrl": "https://avatar.url/image.jpg",
      "lastLoginAt": "2026-06-02T10:00:00Z",
      "timezone": "Asia/Jakarta",
      "locale": "id",
      "createdAt": "2026-06-01T12:00:00Z",
      "updatedAt": "2026-06-02T10:00:00Z"
    }
  }
  ```

---

### 2.2 Workspaces (`⬜ Belum Diimplementasi`)

#### `GET /workspaces`
* **Response (200 OK)**:
  ```json
  {
    "isSuccess": true,
    "data": [
      {
        "id": "ws_1",
        "name": "Acme Workspace",
        "slug": "acme-workspace",
        "createdAt": "2026-06-01T12:00:00Z"
      }
    ]
  }
  ```

#### `POST /workspaces`
* **Request**:
  ```json
  {
    "name": "New Studio",
    "slug": "new-studio"
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "isSuccess": true,
    "data": {
      "id": "ws_2",
      "name": "New Studio",
      "slug": "new-studio",
      "createdAt": "2026-06-02T10:30:00Z"
    }
  }
  ```

#### `PATCH /workspaces/:workspaceId`
* **Request**:
  ```json
  {
    "name": "New Studio Ltd",
    "slug": "new-studio-ltd"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "isSuccess": true,
    "data": {
      "id": "ws_2",
      "name": "New Studio Ltd",
      "slug": "new-studio-ltd",
      "createdAt": "2026-06-02T10:30:00Z"
    }
  }
  ```

#### `GET /workspaces/:workspaceId/members`
* **Response (200 OK)**:
  ```json
  {
    "isSuccess": true,
    "data": [
      {
        "id": "mbr_1",
        "workspaceId": "ws_2",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "owner",
        "status": "active"
      }
    ]
  }
  ```

#### `POST /workspaces/:workspaceId/members`
* **Request**:
  ```json
  {
    "email": "colleague@example.com",
    "role": "member"
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "isSuccess": true,
    "data": {
      "id": "mbr_2",
      "workspaceId": "ws_2",
      "name": "Colleague",
      "email": "colleague@example.com",
      "role": "member",
      "status": "pending"
    }
  }
  ```

#### `PATCH /workspaces/:workspaceId/members/:memberId`
* **Request**:
  ```json
  {
    "role": "admin"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "isSuccess": true,
    "data": {
      "ok": true
    }
  }
  ```

#### `DELETE /workspaces/:workspaceId/members/:memberId`
* **Response (200 OK)**:
  ```json
  {
    "isSuccess": true,
    "data": {
      "ok": true
    }
  }
  ```

---

### 2.3 Projects (`⬜ Belum Diimplementasi`)

#### `GET /workspaces/:workspaceId/projects`
* **Response (200 OK)**:
  ```json
  {
    "isSuccess": true,
    "data": [
      {
        "id": "proj_1",
        "workspaceId": "ws_1",
        "name": "Design System",
        "description": "<p>UI project kit</p>",
        "icon": "🎨",
        "cover": "violet",
        "coverImageUrl": null,
        "status": "active",
        "isFavorite": false,
        "archivedAt": null,
        "openTasks": 12,
        "progress": 45,
        "createdAt": "2026-06-01T12:00:00Z",
        "updatedAt": "2026-06-02T10:00:00Z"
      }
    ]
  }
  ```

#### `POST /workspaces/:workspaceId/projects`
* **Request**:
  ```json
  {
    "name": "Product Launch",
    "description": "<p>GTM roadmap</p>",
    "icon": "🚀",
    "cover": "emerald",
    "coverImageUrl": null,
    "status": "active"
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "isSuccess": true,
    "data": {
      "id": "proj_2",
      "workspaceId": "ws_1",
      "name": "Product Launch",
      "description": "<p>GTM roadmap</p>",
      "icon": "🚀",
      "cover": "emerald",
      "coverImageUrl": null,
      "status": "active",
      "isFavorite": false,
      "archivedAt": null,
      "openTasks": 0,
      "progress": 0,
      "createdAt": "2026-06-02T10:30:00Z",
      "updatedAt": "2026-06-02T10:30:00Z"
    }
  }
  ```

#### `PATCH /projects/:projectId`
* **Request**:
  ```json
  {
    "name": "Product Launch v2",
    "isFavorite": true
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "isSuccess": true,
    "data": {
      "id": "proj_2",
      "workspaceId": "ws_1",
      "name": "Product Launch v2",
      "description": "<p>GTM roadmap</p>",
      "icon": "🚀",
      "cover": "emerald",
      "coverImageUrl": null,
      "status": "active",
      "isFavorite": true,
      "archivedAt": null,
      "openTasks": 0,
      "progress": 0,
      "createdAt": "2026-06-02T10:30:00Z",
      "updatedAt": "2026-06-02T10:35:00Z"
    }
  }
  ```

#### `PATCH /projects/:projectId/favorite`
* **Response (200 OK)**:
  ```json
  {
    "isSuccess": true,
    "data": {
      "id": "proj_2",
      "isFavorite": true
    }
  }
  ```

#### `PATCH /projects/:projectId/archive`
* **Response (200 OK)**:
  ```json
  {
    "isSuccess": true,
    "data": {
      "id": "proj_2",
      "archivedAt": "2026-06-02T10:36:00Z"
    }
  }
  ```

#### `PATCH /projects/:projectId/unarchive`
* **Response (200 OK)**:
  ```json
  {
    "isSuccess": true,
    "data": {
      "id": "proj_2",
      "archivedAt": null
    }
  }
  ```

#### `DELETE /projects/:projectId`
* **Response (200 OK)**:
  ```json
  {
    "isSuccess": true,
    "data": {
      "ok": true
    }
  }
  ```

---

### 2.4 Kanban Board Columns (`⬜ Belum Diimplementasi`)

#### `GET /projects/:projectId/board/columns`
* **Response (200 OK)**:
  ```json
  {
    "isSuccess": true,
    "data": [
      {
        "id": "col_1",
        "title": "To Do",
        "status": "todo",
        "wipLimit": 5,
        "order": 0
      }
    ]
  }
  ```

#### `POST /projects/:projectId/board/columns`
* **Request**:
  ```json
  {
    "title": "Quality Review",
    "status": "review",
    "wipLimit": 3
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "isSuccess": true,
    "data": {
      "id": "col_2",
      "title": "Quality Review",
      "status": "review",
      "wipLimit": 3,
      "order": 1
    }
  }
  ```

#### `PATCH /projects/:projectId/board/columns/:columnId`
* **Request**:
  ```json
  {
    "title": "QA Review",
    "wipLimit": 4
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "isSuccess": true,
    "data": {
      "id": "col_2",
      "title": "QA Review",
      "status": "review",
      "wipLimit": 4,
      "order": 1
    }
  }
  ```

#### `PUT /projects/:projectId/board/columns/reorder`
* **Request**:
  ```json
  {
    "columnIds": ["col_2", "col_1"]
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "isSuccess": true,
    "data": {
      "ok": true
    }
  }
  ```

#### `DELETE /projects/:projectId/board/columns/:columnId`
* **Response (200 OK)**:
  ```json
  {
    "isSuccess": true,
    "data": {
      "ok": true,
      "fallbackColumnId": "col_1"
    }
  }
  ```

---

### 2.5 Tasks (`⬜ Belum Diimplementasi`)

#### `GET /projects/:projectId/tasks`
* **Response (200 OK)**:
  ```json
  {
    "isSuccess": true,
    "data": [
      {
        "id": "tsk_1",
        "projectId": "proj_1",
        "workspaceId": "ws_1",
        "title": "Add color tokens",
        "description": "Establish Tailwind/semantic colors",
        "status": "todo",
        "columnId": "col_1",
        "priority": "high",
        "dueAt": "2026-06-10T12:00:00Z",
        "labelIds": ["lbl_red"],
        "assigneeId": "usr_1",
        "subtasks": [
          { "id": "sub_1", "title": "Define dark mode", "done": false }
        ],
        "checklist": [
          { "id": "chk_1", "text": "Colors approved", "checked": false }
        ],
        "attachments": [],
        "createdAt": "2026-06-01T12:00:00Z",
        "updatedAt": "2026-06-01T12:00:00Z"
      }
    ]
  }
  ```

#### `POST /projects/:projectId/tasks`
* **Request**:
  ```json
  {
    "title": "Configure ESLint",
    "description": "Add config matching template",
    "status": "todo",
    "columnId": "col_1",
    "priority": "medium",
    "dueAt": null,
    "labelIds": [],
    "assigneeId": null
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "isSuccess": true,
    "data": {
      "id": "tsk_2",
      "projectId": "proj_1",
      "workspaceId": "ws_1",
      "title": "Configure ESLint",
      "description": "Add config matching template",
      "status": "todo",
      "columnId": "col_1",
      "priority": "medium",
      "dueAt": null,
      "labelIds": [],
      "assigneeId": null,
      "subtasks": [],
      "checklist": [],
      "attachments": [],
      "createdAt": "2026-06-02T10:30:00Z",
      "updatedAt": "2026-06-02T10:30:00Z"
    }
  }
  ```

#### `PATCH /tasks/:taskId`
* **Request**:
  ```json
  {
    "status": "in_progress",
    "columnId": "col_2",
    "subtasks": [
      { "id": "sub_1", "title": "Define dark mode", "done": true }
    ]
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "isSuccess": true,
    "data": {
      "id": "tsk_1",
      "status": "in_progress",
      "columnId": "col_2",
      "subtasks": [
        { "id": "sub_1", "title": "Define dark mode", "done": true }
      ]
    }
  }
  ```

#### `DELETE /tasks/:taskId`
* **Response (200 OK)**:
  ```json
  {
    "isSuccess": true,
    "data": {
      "ok": true
    }
  }
  ```

#### `GET /tasks/:taskId/activities`
* **Response (200 OK)**:
  ```json
  {
    "isSuccess": true,
    "data": [
      {
        "id": "act_1",
        "taskId": "tsk_1",
        "title": "Task created",
        "description": "Add color tokens",
        "occurredAt": "2026-06-01T12:00:00Z",
        "icon": "i-lucide-plus-circle"
      }
    ]
  }
  ```

#### `POST /tasks/:taskId/attachments`
* **Request**: `multipart/form-data` (field: `file`)
* **Response (201 Created)**:
  ```json
  {
    "isSuccess": true,
    "data": {
      "id": "att_1",
      "name": "spec.pdf",
      "size": 512000,
      "mimeType": "application/pdf",
      "uploadedAt": "2026-06-02T10:40:00Z"
    }
  }
  ```

#### `DELETE /tasks/:taskId/attachments/:attachmentId`
* **Response (200 OK)**:
  ```json
  {
    "isSuccess": true,
    "data": {
      "ok": true
    }
  }
  ```

---

### 2.6 Task Comments (`⬜ Belum Diimplementasi`)

#### `GET /tasks/:taskId/comments`
* **Response (200 OK)**:
  ```json
  {
    "isSuccess": true,
    "data": [
      {
        "id": "cmt_1",
        "taskId": "tsk_1",
        "authorId": "usr_2",
        "authorName": "Jane Doe",
        "body": "Hi @[John Doe](usr_1), please review.",
        "mentionIds": ["usr_1"],
        "createdAt": "2026-06-02T10:00:00Z",
        "updatedAt": "2026-06-02T10:00:00Z"
      }
    ]
  }
  ```

#### `POST /tasks/:taskId/comments`
* **Request**:
  ```json
  {
    "body": "Hi @[John Doe](usr_1), please review.",
    "authorId": "usr_2",
    "authorName": "Jane Doe"
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "isSuccess": true,
    "data": {
      "id": "cmt_1",
      "taskId": "tsk_1",
      "authorId": "usr_2",
      "authorName": "Jane Doe",
      "body": "Hi @[John Doe](usr_1), please review.",
      "mentionIds": ["usr_1"],
      "createdAt": "2026-06-02T10:00:00Z",
      "updatedAt": "2026-06-02T10:00:00Z"
    }
  }
  ```

#### `PATCH /comments/:commentId`
* **Request**:
  ```json
  {
    "body": "Wait, I updated the review comments."
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "isSuccess": true,
    "data": {
      "id": "cmt_1",
      "body": "Wait, I updated the review comments.",
      "updatedAt": "2026-06-02T10:05:00Z"
    }
  }
  ```

#### `DELETE /comments/:commentId`
* **Response (200 OK)**:
  ```json
  {
    "isSuccess": true,
    "data": {
      "ok": true
    }
  }
  ```

---

### 2.7 Notifications (`⬜ Belum Diimplementasi`)

#### `GET /notifications`
* **Response (200 OK)**:
  ```json
  {
    "isSuccess": true,
    "data": [
      {
        "id": "not_1",
        "recipientEmail": "john@example.com",
        "workspaceId": "ws_1",
        "type": "mention",
        "title": "Jane Doe mentioned you",
        "body": "Add color tokens — Hi @[John Doe](usr_1), please review.",
        "icon": "i-lucide-at-sign",
        "readAt": null,
        "createdAt": "2026-06-02T10:00:00Z",
        "link": {
          "kind": "task",
          "taskId": "tsk_1",
          "projectId": "proj_1",
          "workspaceId": "ws_1"
        }
      }
    ]
  }
  ```

#### `PATCH /notifications/:notificationId/read`
* **Response (200 OK)**:
  ```json
  {
    "isSuccess": true,
    "data": {
      "ok": true
    }
  }
  ```

#### `POST /notifications/read-all`
* **Request**:
  ```json
  {
    "recipientEmail": "john@example.com"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "isSuccess": true,
    "data": {
      "ok": true
    }
  }
  ```

#### `DELETE /notifications/:notificationId`
* **Response (200 OK)**:
  ```json
  {
    "isSuccess": true,
    "data": {
      "ok": true
    }
  }
  ```
