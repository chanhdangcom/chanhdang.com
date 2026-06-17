import {
  Marquee,
  MarqueeContent,
  MarqueeFade,
  MarqueeItem,
} from "@/components/kibo-ui/marquee";
import {
  Testimonial,
  TestimonialAuthor,
  TestimonialAuthorName,
  TestimonialAuthorTagline,
  TestimonialAvatar,
  TestimonialAvatarImg,
  TestimonialAvatarRing,
  TestimonialQuote,
} from "@/components/testimonial";

export function MarqueeList() {
  return (
    <div className="[&_.rfm-initial-child-container]:items-stretch! [&_.rfm-marquee]:items-stretch! w-full space-y-4 bg-background">
      {[TESTIMONIALS_1, TESTIMONIALS_2].map((list, index) => (
        <Marquee
          key={index}
          className="border-line border-y dark:border-zinc-800"
        >
          <MarqueeFade side="left" />
          <MarqueeFade side="right" />

          <MarqueeContent direction={index % 2 === 1 ? "right" : "left"}>
            {list.map((item) => (
              <MarqueeItem
                key={item.url}
                className="w-xs border-line mx-0 h-full border-r dark:border-zinc-800"
              >
                <a
                  className="hover:bg-accent/20 block h-full transition-[background-color] ease-out"
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Testimonial>
                    <TestimonialQuote className="font-mono text-sm">
                      <p>{item.quote}</p>
                    </TestimonialQuote>

                    <TestimonialAuthor>
                      <TestimonialAvatar>
                        <TestimonialAvatarImg src={item.authorAvatar} />
                        <TestimonialAvatarRing />
                      </TestimonialAvatar>

                      <TestimonialAuthorName>
                        {item.authorName}
                      </TestimonialAuthorName>

                      <TestimonialAuthorTagline>
                        {item.authorTagline}
                      </TestimonialAuthorTagline>
                    </TestimonialAuthor>
                  </Testimonial>
                </a>
              </MarqueeItem>
            ))}
          </MarqueeContent>
        </Marquee>
      ))}
    </div>
  );
}

const TESTIMONIALS_1 = [
  {
    authorAvatar: "https://github.com/fluidicon.png",
    authorName: "Git Activity",
    authorTagline: "chanhdang.com/pulse",
    url: "https://github.com/chanhdangcom/chanhdang.com/pulse",
    quote:
      "Active Development: 66 files changed and optimized in the last 7 days!",
  },
  {
    authorAvatar: "https://github.com/fluidicon.png",
    authorName: "Code Additions",
    authorTagline: "Weekly Summary",
    url: "https://github.com/chanhdangcom/chanhdang.com/pulse",
    quote: "Shipped 7,364 lines of code (++) with pure passion this week.",
  },
  {
    authorAvatar: "https://github.com/fluidicon.png",
    authorName: "Code Deletions",
    authorTagline: "Refactoring Velocity",
    url: "https://github.com/chanhdangcom/chanhdang.com/pulse",
    quote:
      "Cleaned up 140 lines of redundant code (--) for better performance.",
  },
  {
    authorAvatar: "https://github.com/fluidicon.png",
    authorName: "Project Health",
    authorTagline: "Repository Status",
    url: "https://github.com/chanhdangcom/chanhdang.com/pulse",
    quote:
      "0 Active Issues & 0 Pull Requests open — Everything is perfectly optimized.",
  },
];

const TESTIMONIALS_2 = [
  {
    authorAvatar: "https://unavatar.io/github/chanhdangcom",
    authorName: "Total Contributions",
    authorTagline: "Sole Maintainer",
    url: "https://github.com/chanhdangcom/chanhdang.com/graphs/contributors",
    quote:
      "Crafted a total of 25,528++ lines of high-quality code on production.",
  },
  {
    authorAvatar: "https://unavatar.io/github/chanhdangcom",
    authorName: "Commit Frequency",
    authorTagline: "Consistency Over Time",
    url: "https://github.com/chanhdangcom/chanhdang.com/graphs/contributors",
    quote:
      "Shipped 44 high-impact commits directly to main branch in the last 3 months.",
  },
  {
    authorAvatar: "https://unavatar.io/github/chanhdangcom",
    authorName: "Author Impact",
    authorTagline: "Rank #1 Contributor",
    url: "https://github.com/chanhdangcom/chanhdang.com/graphs/contributors",
    quote:
      "Independently designing, architecting, and building the entire ecosystem.",
  },
  {
    authorAvatar: "https://github.com/fluidicon.png",
    authorName: "Git Pulse",
    authorTagline: "Repository Velocity",
    url: "https://github.com/chanhdangcom/chanhdang.com",
    quote:
      "Consistent weekly contributions – Building the web block by block, commit by commit.",
  },
];
