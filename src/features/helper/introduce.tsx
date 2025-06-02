import React, { useState } from "react";
import { Timeline } from "@/components/ui/timeline";
import Image from "next/image";
import { Lens } from "@/components/ui/lens";

export function Introduce() {

  const [hovering, setHovering] = useState(false);

  const data = [
    {
      title: "Đăng nhập",
      content: (
        <div id="Login">
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Cho phép người dùng (Quản trị viên hoặc Nhân viên) truy cập vào hệ
            thống bằng cách cung cấp tên đăng nhập và mật khẩu hợp lệ. Hệ thống sẽ
            xác thực thông tin và chuyển hướng người dùng đến giao diện chính phù
            hợp với quyền hạn của họ.
          </p>

          <div className="space-y-4">
            <div>🔸 Bước 1: Nhập tên đăng nhập vào ô tương ứng (ví dụ: admin).</div>
            <div>🔸 Bước 2: Nhập mật khẩu vào ô phía dưới. Mật khẩu sẽ được ẩn dưới dạng dấu chấm để đảm bảo bảo mật.</div>
            <div>🔸 Bước 3:

              Nhấn nút "Đăng nhập" để xác thực và vào hệ thống.
              Nếu thông tin đúng, bạn sẽ được chuyển đến giao diện chính.
              Nếu sai, hệ thống sẽ hiển thị thông báo lỗi.

              Hoặc nhấn "Hủy bỏ" nếu muốn xóa dữ liệu hoặc thoát khỏi màn hình này.</div></div>
          <div className="">
            <Lens hovering={hovering} setHovering={setHovering}>
              <Image
                src="/img/helper/Login.jpg"
                alt="startup template"
                width={1000}
                height={1000}
                className="h-auto w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] "
              />
            </Lens>
          </div>
        </div>
      ),
    },
    {
      title: "Quản lý bán hàng",
      content: (
        <div id="QLBanHang">
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Phần mềm quản lý bán hàng này có giao diện đơn giản, phù hợp cho quán cà phê hoặc cửa hàng nhỏ. Người dùng có thể chọn món bằng cách nhấn vào biểu tượng sản phẩm, thông tin đơn hàng sẽ hiển thị ở bảng bên phải gồm tên món, số lượng, đơn giá và thành tiền. Ngoài ra, phần mềm hỗ trợ nhập tên khách, chọn hình thức thanh toán, tính tổng tiền và in hóa đơn một cách nhanh chóng và tiện lợi.
          </p>

          <div className="space-y-4">
            <div> 🔹 Bước 1: Chọn bàn
              Nhấp vào một ô bàn trên sơ đồ (ví dụ: Lầu 1 Bàn 2). Bàn đang được chọn sẽ hiển thị ở góc trên phải.
            </div>

            <div> 🔹 Bước 2: Thêm món
              Chọn danh mục (ví dụ: Cà phê, Trà sữa...).
              <div> Chọn thức uống từ danh sách.</div>
              <div> Nhập số lượng (hoặc giữ mặc định là 1).</div>
              <div>
                Nhấn nút Thêm để đưa món vào bảng hóa đơn.</div>
            </div>

            <div> 🔹 Bước 3: Quản lý món
              <div> Muốn xóa món, chọn dòng cần xóa và nhấn Xóa.</div>

              <div>  Nhấn Lưu để cập nhật lại hóa đơn sau khi chỉnh sửa.</div>
            </div>

            <div> 🔹 Bước 4: Gộp / Chuyển bàn (nếu cần)
              <div>  Chọn bàn đang phục vụ và bàn cần gộp/chuyển tại 2 combobox.</div>

              <div>Nhấn Chuyển bàn hoặc Gộp bàn.</div>
            </div>

            <div>  🔹 Bước 5: Tính tiền
              <div> Nhập giảm giá nếu có (%).</div>

              <div> Hệ thống sẽ tự tính tổng tiền sau giảm giá.</div>
              <div>Nhấn TÍNH TIỀN để in hóa đơn và kết thúc.</div>
            </div>
          </div>

          <div className="">
            <Lens hovering={hovering} setHovering={setHovering}>
              <Image
                src="/img/helper/QLBanHang.jpg"
                alt="hero template"
                width={1000}
                height={1000}
                className="h-auto w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
              />
            </Lens>
          </div>
        </div>
      ),
    },

    {
      title: "Quản lý danh mục",
      content: (
        <div id="QLDanhMuc">
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Giao diện quản lý danh mục cho phép người dùng thêm, sửa, xóa và lưu các loại danh mục sản phẩm như cà phê, nước ngọt... Danh sách danh mục hiển thị ở giữa màn hình, còn bên phải là các ô nhập liệu và các nút chức năng như Thêm, Sửa, Xóa, Lưu, Hủy và Thoát. Giao diện trực quan, dễ thao tác, giúp quản lý loại sản phẩm nhanh chóng và hiệu quả.
          </p>

          <div className="space-y-4">
            <div> 🔹 Thêm danh mục mới
              <div> Bấm nút Thêm.</div>

              <div> Nhập tên danh mục vào ô “Tên danh mục”.</div>

              <div> Bấm Lưu để hoàn tất.</div>
            </div>

            <div> 🔹 Sửa danh mục
              <div>Chọn danh mục cần chỉnh sửa trong danh sách.</div>
              <div> Bấm nút Sửa.</div>

              <div> Chỉnh sửa tên trong ô nhập liệu.</div>

              <div>Nhấn Lưu để cập nhật.</div>
            </div>

            <div>  🔹 Xóa danh mục
              <div> Chọn danh mục cần xóa.</div>

              <div>Bấm nút Xóa.</div>

              <div> Xác nhận khi có hộp thoại hỏi bạn có chắc muốn xóa không.</div>
            </div>

            <div>
              <div> 🔹 Hủy thao tác
                Nếu bạn đang chỉnh sửa hoặc nhập sai, bấm Hủy để làm mới lại biểu mẫu.
              </div>

              <div> 🔹 Thoát
                Bấm Thoát để rời khỏi giao diện “Danh mục” và quay về menu chính.
              </div>
            </div>
          </div>

          <Lens hovering={hovering} setHovering={setHovering}>
            <Image
              src="/img/helper/QLDanhMuc.jpg"
              alt="hero template"
              width={1000}
              height={1000}
              className="h-auto w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </Lens>
        </div >
      ),
    },

    {
      title: "Quản lý kho",
      content: (
        <div id="QLKho">
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Giao diện quản lý kho giúp người dùng theo dõi và cập nhật thông tin các mặt hàng trong kho như tên hàng, số lượng, đơn vị tính... Người dùng có thể dễ dàng thêm mới, chỉnh sửa, xóa hoặc lưu thông tin hàng hóa thông qua các nút chức năng. Giao diện đơn giản, rõ ràng, hỗ trợ quản lý tồn kho hiệu quả và chính xác.
          </p>

          <div className="">
            <Lens hovering={hovering} setHovering={setHovering}>
              <Image
                src="/img/helper/QLKho.jpg"
                alt="hero template"
                width={1000}
                height={1000}
                className="h-auto w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
              />
            </Lens>

          </div>
        </div>
      ),
    },

    {
      title: "Quản lý bàn",
      content: (
        <div id="QLBan">
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Giao diện quản lý bàn cho phép người dùng tạo, sửa, xóa và lưu thông tin các bàn trong quán như số bàn, tên bàn hoặc trạng thái. Danh sách bàn được hiển thị rõ ràng, giúp dễ dàng sắp xếp và quản lý khu vực phục vụ. Giao diện thân thiện, thao tác nhanh chóng, hỗ trợ hiệu quả cho việc bố trí và theo dõi hoạt động tại từng bàn.
          </p>
          <div className="">
            <Lens hovering={hovering} setHovering={setHovering}>
              <Image
                src="/img/helper/QLBan.jpg"
                alt="hero template"
                width={1000}
                height={1000}
                className="h-auto w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
              />
            </Lens>

          </div>
        </div>
      ),
    },

    {
      title: "Quản lý nguyên liệu",
      content: (
        <div id="QLNguyenLieu">
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Giao diện quản lý nguyên liệu cho phép người dùng thêm, sửa, xóa và lưu thông tin các loại nguyên liệu như tên nguyên liệu, đơn vị tính, số lượng tồn kho... Chức năng này giúp kiểm soát nguồn nguyên liệu đầu vào, phục vụ cho việc pha chế và sản xuất. Giao diện đơn giản, dễ sử dụng, hỗ trợ quản lý nguyên vật liệu hiệu quả và chính xác.
          </p>

          <div className="">
            <Lens hovering={hovering} setHovering={setHovering}>
              <Image
                src="/img/helper/QLNguyenLieu.jpg"
                alt="hero template"
                width={1000}
                height={1000}
                className="h-auto w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
              />
            </Lens>

          </div>
        </div>
      ),
    },

    {
      title: "Thanh toán",
      content: (
        <div id="ThanhToan">
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Giao diện thanh toán hỗ trợ quét mã QR để khách hàng thanh toán nhanh chóng. Sau khi chọn món và tính tổng tiền, hệ thống sẽ tự động tạo mã QR chứa số tiền cần thanh toán. Khách chỉ cần dùng ứng dụng ngân hàng quét mã để chuyển khoản. Quá trình thanh toán trở nên hiện đại, tiện lợi và chính xác, phù hợp với xu hướng không dùng tiền mặt.
          </p>

          <div className="">
            <Lens hovering={hovering} setHovering={setHovering}>
              <Image
                src="/img/helper/ThanhToan.jpg"
                alt="hero template"
                width={1000}
                height={1000}
                className="h-auto w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
              />
            </Lens>

          </div>
        </div>
      ),
    },

    {
      title: "Quản lý tài khoản",
      content: (
        <div id="QLTK">
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Giao diện quản lý tài khoản cho phép người dùng thêm, sửa, xóa và phân quyền tài khoản đăng nhập hệ thống. Mỗi tài khoản bao gồm tên đăng nhập, mật khẩu, vai trò (quản lý, nhân viên...). Chức năng này giúp kiểm soát truy cập, đảm bảo bảo mật và phân quyền rõ ràng trong quá trình sử dụng phần mềm.
          </p>

          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            ss
          </p>
          <div className="">
            <Lens hovering={hovering} setHovering={setHovering}>
              <Image
                src="/img/helper/QLTK.jpg"
                alt="hero template"
                width={1000}
                height={1000}
                className="h-auto w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
              />
            </Lens>

          </div>
        </div>
      ),
    },

    {
      title: "Đổi mật khẩu",
      content: (
        <div id="DoiMK">
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Chức năng đổi mật khẩu cho phép người dùng cập nhật mật khẩu đăng nhập hiện tại sang mật khẩu mới nhằm tăng cường bảo mật tài khoản. Người dùng cần nhập mật khẩu cũ để xác thực, sau đó nhập mật khẩu mới và xác nhận lại để đảm bảo không bị sai sót. Khi hoàn tất, hệ thống sẽ lưu mật khẩu mới và thông báo đổi mật khẩu thành công.
          </p>

          <div className="">
            <Lens hovering={hovering} setHovering={setHovering}>
              <Image
                src="/img/helper/DoiMK.jpg"
                alt="hero template"
                width={1000}
                height={1000}
                className="h-auto w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
              />
            </Lens>

          </div>
        </div>
      ),
    },

    {
      title: "Thống kê doanh thu",
      content: (
        <div id="TKDoanhThu">
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Chức năng thống kê doanh thu giúp tổng hợp và hiển thị số liệu về doanh thu trong khoảng thời gian chọn lựa. Người dùng có thể xem báo cáo chi tiết theo ngày, tuần, tháng hoặc năm, từ đó dễ dàng theo dõi hiệu quả kinh doanh và đưa ra quyết định phù hợp.
          </p>

          <div className="">
            <Lens hovering={hovering} setHovering={setHovering}>
              <Image
                src="/img/helper/TKDoanhThu.jpg"
                alt="hero template"
                width={1000}
                height={1000}
                className="h-auto w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
              />
            </Lens>

          </div>
        </div>
      ),
    },

    {
      title: "Thống kê thức uống",
      content: (
        <div id="TKThucUong">
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Chức năng thống kê thức uống cung cấp báo cáo về số lượng và loại thức uống được bán trong một khoảng thời gian nhất định. Thống kê giúp nhận diện các sản phẩm bán chạy, xu hướng tiêu thụ, hỗ trợ quản lý kho và điều chỉnh menu hợp lý.
          </p>

          <div className="">
            <Lens hovering={hovering} setHovering={setHovering}>
              <Image
                src="/img/helper/TKThucUong.jpg"
                alt="hero template"
                width={1000}
                height={1000}
                className="h-auto w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
              />
            </Lens>

          </div>
        </div>
      ),
    },

    {
      title: "Hóa đơn",
      content: (
        <div id="HoaDon">
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Chức năng hiển thị giao diện, chi tiết hóa đơn gồm tổng tiền. giảm giá tông thanh toán và các thông tin cơ bản của hóa đơn
          </p>

          <div className="">
            <Lens hovering={hovering} setHovering={setHovering}>
              <Image
                src="/img/helper/HoaDon.jpg"
                alt="hero template"
                width={1000}
                height={1000}
                className="h-auto w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
              />
            </Lens>

          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="relative w-full overflow-clip bg-black">
      <Timeline data={data} />
    </div>
  );
}
