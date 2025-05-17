import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { ExperienceInfoItem } from "./components/experience-info-item";
import { ImageIcon } from "lucide-react";
import { Ping } from "@/components/ping";
import { Client } from "@/components/client";

export function PhotoListAnimate() {
  const testimonials = [
    {
      quote:
        "My photo album captures unforgettable moments, meaningful experiences, and cherished memories, reflecting joy, connection, and personal growth through various events and activities.",
      title: "My Album",
      time: "2023 - Present",
      src: "/img/photo-me/1.webp",
    },
    {
      quote:
        "With heart and unity, the IT Department brings a performance full of passion and teamwork. Together, we don’t just code — we create, connect, and shine.",
      title: "Ca Múa Nhạc AGU",
      time: "16/5/2025",
      src: "/img/photo-me/12.JPG",
    },
    {
      quote:
        "With burning passion and unbreakable teamwork, the IT Department delivered a stunning performance that earned high praise and a well-deserved award. More than a show — it was the spirit of unity and dedication brought to life on stage.",
      title: "Múa Nhạc AGU Công Nghệ Thông tin",
      time: "16/5/2025",
      src: "/img/photo-me/13.JPG",
    },
    {
      quote:
        "Welcoming the Lunar New Year with colorful performances, we filled the stage with music, dance, and festive spirit. It was a celebration of tradition, unity, and the joy of the new season and won first prize.",
      title: "Hội Xuân AGU",
      time: "19/2/2024",
      src: "/img/photo-me/3.webp",
    },

    {
      quote:
        "Celebrating Teachers’ Day with vibrant performances, our event was filled with gratitude and artistic expression. From heartfelt songs to energetic dances, every moment honored our beloved teachers.",
      title: "Văn Nghệ 20/11 AGU",
      time: "11/11/2023",
      src: "/img/photo-me/11.webp",
    },
    {
      quote:
        "Bringing joy to children during the Mid-Autumn Festival, we organized fun activities, gifted lanterns, and shared warm smiles. It was a night filled with laughter, love, and meaningful connections.",
      title: "Trung Thu Cho Em",
      time: "24/12/2023",
      src: "/img/photo-me/4.webp",
    },
    {
      quote:
        "Joining hands to clean and beautify our surroundings, we worked together with enthusiasm and dedication. This activity not only improved the environment but also strengthened our teamwork and responsibility",
      title: "Chủ nhật xanh",
      time: "3/11/2023",
      src: "/img/photo-me/5.webp",
    },
  ];
  return (
    <div className="space-y-8">
      <div className="my-2 flex items-center space-x-2 font-mono text-sm">
        <ExperienceInfoItem icon={<ImageIcon />} content="Gallery" />
        <div className="text-gray-400">| 2023 - Present</div> <Ping />
      </div>

      <Client>
        <AnimatedTestimonials testimonials={testimonials} />
      </Client>
    </div>
  );
}
