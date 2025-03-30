# Deploy Server

1. Xác định công nghệ sử dụng

- NodeJS
- Database: Postgres, mysql,...

2. Cài đặt

- WebServer: Nginx
- NodeJS, Postgres

3. Cấu hình tên miền

- Cấu hình DNS từ nhà cung cấp tên miền về Server
- Thêm tên miền vào webserver (Dùng webserver gì --> Cách thêm sẽ khác)
  Lưu ý: Có thể dùng địa chỉ IP thay cho tên miền, nếu deploy nhiều dự án thì phải tạo ra các port khác nhau

## Nginx

- Kiểm tra xem service nginx có đang chạy không?

service nginx status

- File cấu hình của nginx: /etc/nginx

## Tên miền

- Tên miền --> DNS Server --> Trả về IP cho trình duyệt
- Trình duyệt --> Gửi yêu cầu tới Server --> Trả về nội dung

1. Tên miền quốc tế: .com, .net, .org --> Mua ở đâu cũng được

2. Tên miền quốc gia: Mua ở quốc gia đó

Nhà cung cấp: tenten, inet, matbao,...

Tên miền:

-ten.phanmorong --> Tên miền chính
-a.ten.phanmorong --> Tên miền con (subdomain)

Để cài đặt SSL cho tên miền trên server --> Cài thông qua certbot

Trên hệ thống Linux --> Phần mềm lập lịch chạy tự động theo thời gian thiết lập trình --> Cronjob

Cấu tạo của cronjob

thoigian tenungdung command

```
* * * * * node /home/abc/app.js
```

Quy trình khi thay đổi code

Bước 1: Local code và push lên nhánh riêng của feature

Bước 2: Tạo pull request --> Chạy test (Unit, Intergrate) --> Lead reviews --> Merge code vào develope

Bước 3: Auto Deploy --> Server test

Bước 4: Lead Merge code vào main --> Auto Deploy lên Server Production

Quá trình Auto Deploy

- Pull code từ git về Server
- Cài đặt các service: npm,
- Cập nhật .env
- Migrate database (Nếu là back-end)
- Khởi động lại trình giám sát nếu cần (pm2)
