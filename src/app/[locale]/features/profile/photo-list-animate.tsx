import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
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
      src: "/img/photo-me/12.jpeg",
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
    <div className="mt-2">
      <Client>
        <AnimatedTestimonials testimonials={testimonials} />
      </Client>
    </div>
  );
}
