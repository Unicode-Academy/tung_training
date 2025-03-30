## Realtime

1. HTTP

- Không liên tục --> Không có realtime
- 2 cách giả realtime (Trải nghiệm thời gian thực)

* HTTP Short Polling: Client gửi request liên tục sau 1 khoảng thời gian (interval)
* HTTP Long Polling: Client sẽ gửi request lên server, server treo request, khi nào có sự thay đổi --> Trả về response. Client nhận được response --> đệ quy để khởi tạo request mới

2. Websocket

- Liên tục --> Realtime
