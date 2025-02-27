import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { ExperienceInfoItem } from "./components/experience-info-item";
import { CakeIcon } from "lucide-react";

export function HappyBrithday() {
  const testimonials = [
    {
      quote:
        "Happy Birthday! Chúc bạn tuổi mới tràn đầy năng lượng, thành công rực rỡ và luôn gặp nhiều may mắn!",
      name: "Huỳnh Đắc Vinh",
      designation: "27/2/2004",
      src: "/img/DV/DV1.JPG",
    },
    {
      quote:
        "Hôm nay là một ngày đặc biệt, vì có một “huyền thoại” ra đời! Chúc bạn sinh nhật vui vẻ, ăn nhiều mà không mập, tiền tiêu hoài không hết!",
      name: "Huỳnh Đắc Vinh",
      designation: "27/2/2004",
      src: "/img/DV/DV2.JPG",
    },
    {
      quote:
        "Chúc bạn một sinh nhật thật vui, cười nhiều hơn khóc, hạnh phúc hơn buồn, và đặc biệt là… quà nhiều hơn bánh!",
      name: "Huỳnh Đắc Vinh",
      designation: "27/2/2004",
      src: "/img/DV/DV3.JPG",
    },
    {
      quote:
        "Sinh nhật vui vẻ nhé! Chúc bạn luôn mạnh khỏe, bình an và đạt được những ước mơ mà bạn theo đuổi! Cùng nhau cố gắng!",
      name: "Huỳnh Đắc Vinh",
      designation: "27/2/2004",
      src: "/img/DV/DV4.JPG",
    },
  ];
  return (
    <div>
      <div className="my-2 flex items-center space-x-2 font-mono text-sm">
        <ExperienceInfoItem icon={<CakeIcon />} content="Gallery" />
        <div className="text-gray-400">
          | Happy Birthday Đắc Vinh - 27/2/2004
        </div>
      </div>
      <AnimatedTestimonials testimonials={testimonials} />
    </div>
  );
}
