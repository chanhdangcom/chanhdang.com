# 🎵 Music API System - Hướng dẫn sử dụng

## 📋 Tổng quan

Hệ thống API Music đã được tích hợp hoàn chỉnh với các tính năng:

- ✅ Quản lý ca sĩ (thêm/sửa/xóa)
- ✅ Thêm nhạc vào ca sĩ
- ✅ Tích hợp với database MongoDB
- ✅ Giao diện quản lý admin

## 🚀 API Endpoints

### 1. **Singers API**

#### `GET /api/singers`

Lấy danh sách tất cả ca sĩ

```javascript
const response = await fetch("/api/singers");
const singers = await response.json();
```

#### `POST /api/singers`

Thêm ca sĩ mới

```javascript
const response = await fetch("/api/singers", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    singer: "Sơn Tùng M-TP",
    cover: "https://example.com/avatar.jpg",
  }),
});
```

#### `GET /api/singers/[id]`

Lấy thông tin ca sĩ theo ID

```javascript
const response = await fetch("/api/singers/64f1a2b3c4d5e6f7g8h9i0j1");
const singer = await response.json();
```

#### `PUT /api/singers/[id]`

Cập nhật thông tin ca sĩ

```javascript
const response = await fetch("/api/singers/64f1a2b3c4d5e6f7g8h9i0j1", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    singer: "Sơn Tùng M-TP (Updated)",
    cover: "https://example.com/new-avatar.jpg",
  }),
});
```

#### `DELETE /api/singers/[id]`

Xóa ca sĩ

```javascript
const response = await fetch("/api/singers/64f1a2b3c4d5e6f7g8h9i0j1", {
  method: "DELETE",
});
```

### 2. **Singer Musics API**

#### `GET /api/singers/[id]/musics`

Lấy danh sách nhạc của ca sĩ

```javascript
const response = await fetch("/api/singers/64f1a2b3c4d5e6f7g8h9i0j1/musics");
const musics = await response.json();
```

#### `POST /api/singers/[id]/musics`

Thêm nhạc vào ca sĩ

```javascript
const response = await fetch("/api/singers/64f1a2b3c4d5e6f7g8h9i0j1/musics", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    title: "Chúng Ta Của Hiện Tại",
    audio: "https://example.com/music.mp3",
    cover: "https://example.com/cover.jpg",
    youtube: "https://youtube.com/watch?v=...",
    content: "Lời bài hát...",
  }),
});
```

#### `DELETE /api/singers/[id]/musics/[musicId]`

Xóa nhạc khỏi ca sĩ

```javascript
const response = await fetch(
  "/api/singers/64f1a2b3c4d5e6f7g8h9i0j1/musics/music123",
  {
    method: "DELETE",
  }
);
```

## 🎨 Components đã cập nhật

### 1. **SingerList Component**

- ✅ Tích hợp API `/api/singers`
- ✅ Loading state
- ✅ Error handling
- ✅ Hỗ trợ MongoDB ObjectId

### 2. **SingerPage Component**

- ✅ Load data từ API theo ID
- ✅ Hiển thị thông tin ca sĩ
- ✅ Hiển thị danh sách nhạc của ca sĩ

### 3. **SingerManagement Component**

- ✅ Quản lý ca sĩ (CRUD)
- ✅ Giao diện admin thân thiện
- ✅ Form validation

### 4. **AddMusicToSinger Component**

- ✅ Thêm nhạc vào ca sĩ
- ✅ Dropdown chọn ca sĩ
- ✅ Form đầy đủ thông tin

## 🛠️ Cách sử dụng

### 1. **Truy cập Admin Panel**

```
http://localhost:3000/music/admin
```

### 2. **Thêm Nhạc với Ca sĩ**

```
http://localhost:3000/music/add
```

- ✅ **Chọn ca sĩ có sẵn**: Nhạc sẽ được thêm vào danh sách của ca sĩ đó
- ✅ **Nhập ca sĩ mới**: Nhạc sẽ được thêm vào collection musics chung

### 3. **Quản lý Ca sĩ**

- Tab "Quản lý Ca sĩ": Thêm/sửa/xóa ca sĩ
- Tab "Thêm Nhạc": Thêm nhạc vào ca sĩ

### 4. **Tích hợp vào Component**

```javascript
import { SingerManagement } from "@/features/music/singer-management";
import { AddMusicToSinger } from "@/features/music/add-music-to-singer";

// Sử dụng trong component
<SingerManagement />
<AddMusicToSinger singerId="optional-singer-id" />
```

## 📊 Database Schema

### **Singers Collection**

```javascript
{
  _id: ObjectId,
  singer: String,
  cover: String,
  musics: [IMusic],
  createdAt: Date,
  updatedAt: Date
}
```

### **Musics Collection**

```javascript
{
  _id: ObjectId,
  id: String,
  title: String,
  singer: String,
  cover: String,
  audio: String,
  youtube: String,
  content: String,
  type: String,
  createdAt: Date
}
```

## 🔧 Type Definitions

### **ISingerItem**

```typescript
export type ISingerItem = {
  id?: string;
  _id?: string;
  singer: string;
  cover: string;
  musics?: IMusic[];
  createdAt?: Date;
  updatedAt?: Date;
};
```

### **IMusic**

```typescript
export type IMusic = {
  id: string;
  title: string;
  singer: string;
  cover: string;
  audio: string;
  youtube: string;
  content: string;
  type?: string;
};
```

## 🎯 Tính năng chính

1. **✅ CRUD Singers**: Thêm/sửa/xóa ca sĩ
2. **✅ Add Music to Singer**: Thêm nhạc vào ca sĩ
3. **✅ Real-time Updates**: Cập nhật real-time
4. **✅ Error Handling**: Xử lý lỗi toàn diện
5. **✅ Loading States**: UI loading states
6. **✅ Form Validation**: Validation đầy đủ
7. **✅ MongoDB Integration**: Tích hợp MongoDB
8. **✅ TypeScript Support**: Hỗ trợ TypeScript

## 🚀 Next Steps

1. **Authentication**: Thêm xác thực cho admin
2. **File Upload**: Upload ảnh và nhạc
3. **Search & Filter**: Tìm kiếm và lọc
4. **Pagination**: Phân trang
5. **Analytics**: Thống kê

---

**🎉 Hệ thống Music API đã sẵn sàng sử dụng!**
