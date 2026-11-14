# Theo dõi khách mời bằng Google Sheets

1. Tạo Google Sheet, mở **Extensions → Apps Script**, rồi dán nội dung file `Code.gs` vào trình soạn thảo.
2. Chọn **Deploy → New deployment → Web app**, chạy dưới tài khoản của bạn và cho phép truy cập **Anyone** để ghi nhận lượt xem. Deploy, cấp quyền khi Google hỏi, rồi sao chép URL kết thúc bằng `/exec`.
3. Trong `index.html`, dán URL vào `APPS_SCRIPT_URL`.
4. Đưa thư mục `guest-tracker` lên cùng website với thư mục `cd`. Mở trang quản lý, nhập mỗi tên khách trên một dòng để thêm nhiều khách cùng lúc, rồi sao chép link riêng.

Link riêng có dạng `cd/?guest=Tên+khách`; khi mở, tên khách sẽ hiện trên thiệp và lượt xem được ghi theo tên. URL Web app `/exec` trong trang này và đoạn theo dõi ở cuối `cd/index.html` phải giống hệt nhau. Nếu thay mã `Code.gs`, cần **Deploy → Manage deployments → Edit → New version → Deploy**; kiểm tra quyền truy cập là **Anyone/Bất kỳ ai**. Mở URL `/exec?action=list` trực tiếp để xác nhận web app đang chạy; nếu đúng, trang sẽ trả JSON. Nếu có nhiều khách trùng tên, nên phân biệt tên trong danh sách để lượt xem được ghi đúng người.

Lưu ý: không có token nên bất kỳ ai có URL Apps Script đều có thể xem danh sách khách, thêm khách và ghi lượt xem. Chỉ chia sẻ URL trang quản lý với người bạn tin cậy.
