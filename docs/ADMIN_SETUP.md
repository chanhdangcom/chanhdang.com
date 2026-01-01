# 🔐 Hướng dẫn tạo tài khoản Admin

Có 3 cách để tạo tài khoản admin:

## Cách 1: Sử dụng Script (Khuyến nghị)

### Bằng Email:

```bash
npx tsx scripts/set-admin.ts your-email@example.com
```

### Bằng Username:

```bash
npx tsx scripts/set-admin-by-username.ts your-username
```

## Cách 2: Trực tiếp trong MongoDB

1. Kết nối MongoDB của bạn (MongoDB Compass, MongoDB Shell, hoặc MongoDB Atlas)
2. Chọn database: `musicdb`
3. Chọn collection: `users`
4. Tìm user cần set admin (theo email hoặc username)
5. Update document:

```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin", updatedAt: new Date() } }
);
```

Hoặc bằng username:

```javascript
db.users.updateOne(
  { username: "your-username" },
  { $set: { role: "admin", updatedAt: new Date() } }
);
```

## Cách 3: Qua Admin Panel (Nếu đã có admin)

1. Đăng nhập với tài khoản admin hiện có
2. Vào Admin Panel: `/music/admin`
3. Tab "Quản lý Users"
4. Click "Thêm Admin" cho user cần set admin

## Kiểm tra

Sau khi set admin, đăng nhập lại và kiểm tra:

- Vào `/music/admin` - phải thấy Admin Panel
- Menu bar phải có "Admin Panel"
- Có thể thêm ca sĩ tự do
- Có thể quản lý users

## Lưu ý

- User đầu tiên cần set admin bằng cách 1 hoặc 2
- Sau khi có admin đầu tiên, có thể dùng cách 3 để set admin cho users khác
- Role mặc định khi đăng ký là `user`
- Google login users mặc định là `user` (cần set admin thủ công)
