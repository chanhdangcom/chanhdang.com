import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { ExperienceInfoItem } from "./components/experience-info-item";
import { ImageIcon } from "lucide-react";
import { Ping } from "@/components/ping";

export function PhotoListAnimate() {
  const testimonials = [
    {
      quote:
        "My photo album captures unforgettable moments, meaningful experiences, and cherished memories, reflecting joy, connection, and personal growth through various events and activities.",
      name: "My Album",
      designation: "2023 - Present",
      src: "/img/photo-me/1.webp",
    },
    {
      quote:
        "Welcoming the Lunar New Year with colorful performances, we filled the stage with music, dance, and festive spirit. It was a celebration of tradition, unity, and the joy of the new season and won first prize.",
      name: "Hội Xuân AGU",
      designation: "19/2/2024",
      src: "/img/photo-me/3.webp",
    },

    {
      quote:
        "Celebrating Teachers’ Day with vibrant performances, our event was filled with gratitude and artistic expression. From heartfelt songs to energetic dances, every moment honored our beloved teachers.",
      name: "Văn Nghệ 20/11 AGU",
      designation: "11/11/2023",
      src: "/img/photo-me/11.webp",
    },
    {
      quote:
        "Bringing joy to children during the Mid-Autumn Festival, we organized fun activities, gifted lanterns, and shared warm smiles. It was a night filled with laughter, love, and meaningful connections.",
      name: "Trung Thu Cho Em",
      designation: "24/12/202",
      src: "/img/photo-me/4.webp",
    },
    {
      quote:
        "Joining hands to clean and beautify our surroundings, we worked together with enthusiasm and dedication. This activity not only improved the environment but also strengthened our teamwork and responsibility",
      name: "Chủ nhật xanh",
      designation: "3/11/2023",
      src: "/img/photo-me/5.webp",
    },
  ];
  return (
    <div className="space-y-8">
      <div className="my-2 flex items-center space-x-2 font-mono text-sm">
        <ExperienceInfoItem icon={<ImageIcon />} content="Gallery" />
        <div className="text-gray-400">| 2023 - Present</div> <Ping />
      </div>
      <AnimatedTestimonials testimonials={testimonials} />
    </div>
  );
}
