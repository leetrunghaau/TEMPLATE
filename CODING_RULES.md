# Quy tắc và Quy ước Viết mã

Tài liệu này định nghĩa các quy tắc, quy ước và kiến trúc cho dự án này. Mục tiêu là để duy trì mã nguồn nhất quán, dễ đọc, dễ bảo trì và giúp các nhà phát triển (bao gồm cả AI) tuân thủ đúng các mẫu thiết kế đã định sẵn.

## 1. Kiến trúc Tổng quan

Dự án tuân theo kiến trúc phân lớp (Layered Architecture) để phân tách rõ ràng các mối quan tâm (Separation of Concerns).

Luồng xử lý một yêu cầu (request) sẽ đi theo thứ tự sau:

`Route` → `Middleware(s)` → `Controller` → `Service` → `Repository`

-   **Routes**: Tiếp nhận yêu cầu HTTP và chuyển đến Controller tương ứng.
-   **Middlewares**: Xử lý các tác vụ chung như xác thực (authentication), phân trang (pagination), và kiểm tra dữ liệu đầu vào (validation).
-   **Controllers**: Điều phối yêu cầu. Chịu trách nhiệm lấy dữ liệu từ `req`, gọi `Service` phù hợp, và gửi phản hồi (response) về cho client.
-   **Services**: Chứa logic nghiệp vụ chính của ứng dụng. Nơi xử lý, tính toán và điều phối dữ liệu từ các `Repository`.
-   **Repositories**: Lớp truy cập dữ liệu. Đây là nơi duy nhất tương tác trực tiếp với cơ sở dữ liệu (sử dụng Prisma).

## 2. Quy ước Đặt tên

-   **Tên tệp**: Sử dụng định dạng `resource.type.js`. Ví dụ: `cat.controller.js`, `user.service.js`.
-   **Biến và Hàm (Variables, Functions)**: Sử dụng `camelCase`. Ví dụ: `getAllCats`, `catData`.
-   **Lớp (Classes)**: Sử dụng `PascalCase`. Ví dụ: `CatController`, `CatService`.
-   **Hằng số (Constants)**: Sử dụng `UPPER_SNAKE_CASE` cho các hằng số toàn cục hoặc cấu hình. Ví dụ: `PORT`, `DATABASE_URL`.

## 3. Quy tắc cho từng Lớp

### Routes (`src/api/v1/routes/`)

-   Mỗi tài nguyên (resource) phải có một tệp route riêng (ví dụ: `cat.route.js`).
-   Sử dụng `express.Router()` để định nghĩa các điểm cuối (endpoints).
-   Gắn các middleware cần thiết (validation, auth, pagination) trước khi gọi đến phương thức của controller.
-   **Ví dụ**:
    ```javascript
    // src/api/v1/routes/cat.route.js
    const express = require("express");
    const router = express.Router();
    const CatController = require("../controllers/cat.controller");
    const validate = require("../middlewares/validation.middleware");
    const { catSchema } = require("../validations/cat.validation");

    router.post("/", validate(catSchema), CatController.create);
    ```

### Controllers (`src/api/v1/controllers/`)

-   **Không chứa logic nghiệp vụ**.
-   Chỉ chịu trách nhiệm điều phối: nhận `req`, gọi `Service`, và trả về `res`.
-   Sử dụng `try...catch` để bắt lỗi từ lớp Service và chuyển cho `next(error)`.
-   Sử dụng hàm `res.ok(data, pagination, message)` từ `responseEnhancer` để trả về các phản hồi thành công.
-   Lấy dữ liệu từ `req.body`, `req.params`, `req.query` và `req.pagination` để truyền xuống lớp Service.
-   **Ví dụ**:
    ```javascript
    // src/api/v1/controllers/cat.controller.js
    const CatService = require("../services/cat-service");

    class CatController {
      async create(req, res, next) {
        try {
          const newCat = await CatService.create(req.body);
          res.ok(newCat); // Sử dụng helper để trả về response
        } catch (error) {
          next(error); // Chuyển lỗi cho error middleware
        }
      }
    }
    module.exports = new CatController();
    ```

### Services (`src/api/v1/services/`)

-   **Nơi chứa toàn bộ logic nghiệp vụ** (business logic).
-   Được gọi bởi Controller và gọi đến Repository để tương tác với dữ liệu.
-   Có thể gọi các Service khác nếu cần thiết.
-   Thực hiện các phép tính, xử lý dữ liệu phức tạp trước khi trả về cho Controller.
-   **Ví dụ**:
    ```javascript
    // src/api/v1/services/cat-service.js
    const CatRepository = require("../repositories/cat.repository");

    class CatService {
      async create(catData) {
        // Ví dụ về logic nghiệp vụ: kiểm tra tên mèo có hợp lệ không
        if (catData.name === "admin") {
          throw new Error("Invalid cat name");
        }
        return await CatRepository.create(catData);
      }
    }
    module.exports = new CatService();
    ```

### Repositories (`src/api/v1/repositories/`)

-   **Lớp duy nhất được phép truy cập cơ sở dữ liệu**.
-   Tất cả các truy vấn Prisma phải được đặt ở đây.
-   Nhập (import) `prisma` client từ `src/config/prisma.js`.
-   Các phương thức nên trả về dữ liệu thô từ cơ sở dữ liệu.
-   **Ví dụ**:
    ```javascript
    // src/api/v1/repositories/cat.repository.js
    const prisma = require("../../../config/prisma");

    class CatRepository {
      async create(cat) {
        return await prisma.cat.create({ data: cat });
      }

      async findById(id) {
        return await prisma.cat.findUnique({ where: { id } });
      }
    }
    module.exports = new CatRepository();
    ```

## 4. Các Quy ước khác

-   **Xử lý lỗi (Error Handling)**: Luôn sử dụng `try...catch` trong Controllers và gọi `next(error)` để `errorMiddleware` xử lý tập trung.
-   **Mã bất đồng bộ (Async Code)**: Sử dụng `async/await` cho tất cả các hoạt động bất đồng bộ (đặc biệt là các cuộc gọi service và repository).
-   **Module và Import**: Sử dụng CommonJS (`require`/`module.exports`). Sử dụng alias (`@/`, `@v1/`) đã được định nghĩa trong `package.json` cho các đường dẫn nội bộ để tránh các đường dẫn tương đối phức tạp (`../../...`).
-   **Xác thực dữ liệu (Validation)**: Sử dụng `Joi` để định nghĩa schema trong thư mục `validations`. Áp dụng schema này thông qua `validation.middleware` ở lớp Route.
-   **Singleton Pattern**: Các lớp Controller, Service, Repository được khởi tạo một lần và export dưới dạng instance. Hãy tuân thủ mẫu này.
    ```javascript
    // Cuối tệp
    module.exports = new MyClass();
    ```
