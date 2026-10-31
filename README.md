# mobile-adaptive-design

Bộ công cụ cho Claude làm việc với thiết kế mobile trong Figma: dựng design system, làm bản Android (điện thoại / gập / tablet), bản iPhone Duo, chuyển iOS sang Android và kiểm tra khả năng tiếp cận (accessibility).

**Yêu cầu:** đã kết nối **Figma connector**; với bản Android, file Figma cần thêm thư viện **Material 3 Design Kit** (Assets → Libraries).

## Các skill

| Skill | Dùng khi | Ví dụ câu nhắn |
|---|---|---|
| `design-system-setup` | Lần đầu làm với một sản phẩm / file, hoặc đổi màu brand, font, icon | "setup system cho file này", "tạo theme từ màu #0096D6" |
| `android-adaptive-design` | Làm bản Android Compact / Medium / Expanded | "làm bản tablet cho màn này <link>" |
| `iphone-duo-design` | Làm bản iPhone Duo (màn ngoài / màn trong) | "làm bản Duo cho màn này <link>" |
| `ios-to-android` | Chỉ chuyển màn iPhone sang Android điện thoại | "chuyển màn iOS này sang Android <link>" |
| `accessibility-check` | Kiểm tra tương phản, chữ phóng to, vùng chạm, màu/chữ chưa gắn biến | "kiểm tra accessibility <link>" |

Có thể gõ tên skill (ví dụ `/accessibility-check <link>`) hoặc nhắn bình thường — Claude tự chọn skill.

## Cách dùng

1. **Lần đầu cho mỗi sản phẩm:** `design-system-setup` hỏi 3 câu — **platform** → **theme** (màu brand, font tiêu đề / nội dung) → **icon**. Claude dựng màu Light/Dark, thang chữ (có chế độ chữ to), bộ icon, rồi **lưu vào file Figma** (kèm frame `_Design system · <Sản phẩm>` để team xem).
2. **Các lần sau:** mọi skill tự đọc system đã lưu, **không hỏi lại**. Muốn đổi thì nhắn "đổi màu brand…", "đổi font…".
3. Mỗi lần build xong, Claude tự chạy kiểm tra tương phản và chữ to.

## Mẹo tiết kiệm token

- Mỗi file / tính năng một **session mới**.
- Gửi link đúng **màn hoặc section**, không gửi cả page.
- Không cần gửi ảnh chụp nếu đã có link.
- Nhắn "**chỉ trả lời, chưa làm**" khi chỉ cần tư vấn.


## Cách sửa plugin (cho người bảo trì)

1. Script dùng chung chỉ sửa trong `shared/scripts/` (không sửa bản chép trong `skills/*/scripts/`).
2. Chạy `tools/sync-shared.sh` để chép sang các skill.
3. Tăng `version` trong `.claude-plugin/plugin.json` (ví dụ 0.1.0 → 0.1.1).
4. Mở pull request → merge.

Cấu trúc: mỗi skill có `SKILL.md` (quy trình ngắn), `references/` (đọc khi cần), `scripts/` (đoạn code Figma dùng lại, chỉ điền PARAMS). Không có giá trị riêng của sản phẩm nào trong plugin — màu, font, icon luôn lấy từ system đã lưu trong từng file.
