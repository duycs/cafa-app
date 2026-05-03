# CAFA App — Ứng dụng Điều phối Hàng hóa

Ứng dụng Angular quản lý và điều phối tồn kho hàng hóa giữa kho tổng và các modul bán hàng (Modul A/B/C/D/E, Shopee).

**Deploy:** [https://cafa-app.vercel.app](https://cafa-app.vercel.app)

---

## Yêu cầu môi trường

| Công cụ | Phiên bản |
|---|---|
| Node.js | `^22.12.0` hoặc `>=24.0.0` |
| npm | `>=8.0.0` |
| Angular CLI | `21.x` |

> Khuyến nghị dùng [nvm](https://github.com/nvm-sh/nvm) để quản lý phiên bản Node.js.

---

## Cài đặt môi trường

### 1. Cài Node.js v22 qua nvm

```bash
nvm install 22
nvm use 22
nvm alias default 22
```

Kiểm tra phiên bản:

```bash
node --version   # v22.x.x
npm --version    # 10.x.x
```

### 2. Cài Angular CLI

```bash
npm install -g @angular/cli@21
```

Kiểm tra:

```bash
ng version
```

---

## Cài đặt dự án

### Cài tất cả thư viện

```bash
npm install
```

### Cài thêm một thư viện

```bash
npm install <tên-thư-viện>
```

Ví dụ:

```bash
npm install xlsx
npm install html2pdf.js
```

---

## Chạy dự án

### Dev server

```bash
npm start
# hoặc
ng serve
```

Mở trình duyệt tại `http://localhost:4200/`. Ứng dụng tự reload khi thay đổi source.

### Build production

```bash
npm run build
# hoặc
ng build
```

Kết quả build xuất ra thư mục `dist/cafa-app/`.

### Build chế độ watch (tự build khi có thay đổi)

```bash
npm run watch
```

---

## Tạo component/service mới

```bash
ng generate component features/<tên>
ng generate service core/services/<tên>
ng generate pipe shared/pipes/<tên>
```

---

## Cấu trúc dự án

```
src/app/
├── core/
│   ├── models/          # Các interface: Product, Transaction, Session
│   └── services/        # AllocationService, AllocationStore, HistoryService, ExcelService, PdfService
├── features/
│   ├── dashboard/       # Trang chính (orchestrator)
│   ├── inventory/       # Toolbar + bảng so sánh tồn kho trước/sau
│   ├── allocation/      # Cảnh báo thông minh + nhật ký điều phối
│   ├── invoices/        # Phiếu nhập/xuất
│   └── history/         # Lịch sử điều phối
└── shared/
    ├── components/      # SectionTitle
    └── pipes/           # LowStockPipe
```

---

## Thư viện chính

| Thư viện | Mục đích |
|---|---|
| `@angular/core` v21 | Framework chính |
| `xlsx` | Import/Export file Excel |
| `html2pdf.js` | Xuất phiếu điều phối ra PDF |


## Commit push code lên nhánh main và sau đó Vercel sẽ build rồi deploy tự động(CI/CD)
