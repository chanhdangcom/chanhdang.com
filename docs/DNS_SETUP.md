# 🌐 Hướng dẫn cấu hình DNS cho chanhdang.com trên Vercel

## 📋 Tổng quan

Domain `chanhdang.com` đang được quản lý bởi **Cloudflare** và cần được cấu hình DNS để trỏ đến Vercel hosting.

---

## 🔧 Các bước cấu hình

### Bước 1: Thêm Domain vào Vercel

1. Đăng nhập vào [Vercel Dashboard](https://vercel.com/dashboard)
2. Chọn project `chanhdang` (hoặc project tương ứng)
3. Vào **Settings** → **Domains**
4. Thêm các domain sau:
   - `chanhdang.com`
   - `www.chanhdang.com`
5. Vercel sẽ hiển thị các DNS records cần cấu hình (thường là A record với IP `76.76.21.21`)

### Bước 2: Cấu hình DNS trên Cloudflare

1. Đăng nhập vào [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Chọn domain `chanhdang.com`
3. Vào **DNS** → **Records**
4. **Xóa** các records parking/không cần thiết (nếu có)

#### Cấu hình Records trên Cloudflare

**⚠️ QUAN TRỌNG:** Khi sử dụng Cloudflare với Vercel, bạn cần **TẮT PROXY** (grey cloud) để Vercel có thể cấp SSL certificate.

**Record 1: A Record cho root domain**

1. Click **Add record**
2. Cấu hình:
   - **Type:** `A`
   - **Name:** `@` (hoặc `chanhdang.com`)
   - **IPv4 address:** `76.76.21.21`
   - **Proxy status:** ⚠️ **DNS only** (grey cloud - TẮT proxy)
   - **TTL:** Auto
3. Click **Save**

**Record 2: CNAME cho www subdomain**

1. Click **Add record**
2. Cấu hình:
   - **Type:** `CNAME`
   - **Name:** `www`
   - **Target:** `cname.vercel-dns.com`
   - **Proxy status:** ⚠️ **DNS only** (grey cloud - TẮT proxy)
   - **TTL:** Auto
3. Click **Save**

**Lưu ý về Proxy:**

- Nếu bạn bật proxy (orange cloud), Vercel sẽ không thể cấp SSL certificate
- Cloudflare proxy sẽ che giấu IP thật và có thể gây xung đột với Vercel
- Để Vercel tự quản lý SSL, cần tắt Cloudflare proxy (grey cloud)

### Bước 3: Chờ DNS Propagate

- ⏱️ Thời gian: **5-30 phút** (có thể lâu hơn, tối đa 48 giờ)
- ✅ Kiểm tra bằng:
  - `nslookup chanhdang.com` trong terminal
  - [DNS Checker](https://dnschecker.org/#A/chanhdang.com)
  - [What's My DNS](https://www.whatsmydns.net/#A/chanhdang.com)

### Bước 4: Kiểm tra SSL Certificate

- Vercel sẽ tự động cấp SSL certificate (Let's Encrypt) sau khi DNS đã propagate
- Thời gian: **Vài phút đến vài giờ**
- Kiểm tra trong Vercel Dashboard → Domains → xem trạng thái SSL

---

## 🔍 Troubleshooting

### Vấn đề: Vẫn thấy trang parking hoặc lỗi SSL

**Giải pháp:**

1. Kiểm tra lại DNS records trên Cloudflare
2. **Đảm bảo proxy đã TẮT** (grey cloud, không phải orange cloud)
3. Đảm bảo đã xóa các records parking cũ
4. Chờ thêm thời gian (có thể cần 24-48 giờ)
5. Clear DNS cache:

   ```bash
   # macOS
   sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder

   # Windows
   ipconfig /flushdns
   ```

### Vấn đề: Cloudflare Proxy đang bật (orange cloud)

**Giải pháp:**

1. Vào Cloudflare → DNS → Records
2. Click vào icon cloud (orange) để chuyển sang grey (DNS only)
3. Chờ vài phút để thay đổi có hiệu lực
4. Vercel sẽ có thể cấp SSL certificate sau khi proxy được tắt

### Vấn đề: SSL Certificate Error

**Giải pháp:**

1. Đảm bảo DNS đã propagate hoàn toàn
2. Kiểm tra trong Vercel Dashboard → Domains → SSL status
3. Nếu cần, xóa và thêm lại domain trong Vercel
4. Chờ Vercel tự động cấp lại certificate

### Vấn đề: Website không load

**Giải pháp:**

1. Kiểm tra deployment trên Vercel có thành công không
2. Kiểm tra DNS records có đúng không
3. Thử truy cập bằng IP trực tiếp (nếu có)
4. Kiểm tra Vercel logs để xem lỗi

---

## 📝 Lưu ý quan trọng

1. **DNS Propagation**: Có thể mất đến 48 giờ để DNS propagate hoàn toàn trên toàn cầu
2. **SSL Certificate**: Vercel tự động cấp SSL, không cần cấu hình thêm
3. **HTTPS Redirect**: Vercel tự động redirect HTTP → HTTPS
4. **www vs non-www**: Cấu hình cả hai để đảm bảo hoạt động tốt

---

## 🔗 Links hữu ích

- [Vercel DNS Documentation](https://vercel.com/docs/concepts/projects/domains)
- [Cloudflare DNS Management](https://developers.cloudflare.com/dns/manage-dns-records/)
- [Vercel + Cloudflare Integration](https://vercel.com/docs/concepts/projects/domains/cloudflare)
- [DNS Checker](https://dnschecker.org/)

---

## ✅ Checklist

- [ ] Đã thêm domain vào Vercel Dashboard
- [ ] Đã cấu hình A record cho `@` trên Cloudflare với IP `76.76.21.21`
- [ ] Đã cấu hình CNAME record cho `www` trên Cloudflare
- [ ] **Đã TẮT Cloudflare Proxy** (grey cloud, không phải orange cloud)
- [ ] Đã xóa các records parking cũ
- [ ] Đã chờ DNS propagate (kiểm tra bằng DNS checker)
- [ ] Đã kiểm tra SSL certificate được cấp trên Vercel
- [ ] Website đã hoạt động với HTTPS

---

**Cập nhật lần cuối:** 2025-01-01
