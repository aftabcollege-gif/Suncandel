import Image from "next/image";

const stages = [
  {
    title: "ذوب موم",
    text: "موم زنبور آرام گرم می‌شود تا شفاف و یکدست شود.",
    image: "/heritage/stage-melt.jpg",
    alt: "ذوب موم در دیگ مسی",
  },
  {
    title: "قالب",
    text: "موم در قالب ریخته می‌شود. شکل شمع همین‌جا ثابت می‌شود.",
    image: "/heritage/stage-pour.jpg",
    alt: "ریختن موم در قالب",
  },
  {
    title: "رایحه",
    text: "روغن معطر به موم گرم اضافه می‌شود، نه روی شمع سرد.",
    image: "/heritage/stage-scent.jpg",
    alt: "افزودن رایحه به موم",
  },
  {
    title: "شعله",
    text: "فتیله میزان می‌شود. شمع آماده روشن شدن است.",
    image: "/heritage/stage-finish.jpg",
    alt: "شمع آماده با شعله",
  },
];

export function ChronicleScroll() {
  return (
    <section id="atelier" className="bg-[#0c1210] py-20">
      <div className="container-main">
        <h2 className="display text-4xl text-[#f4f1ea] md:text-5xl">ساخت شمع</h2>
        <p className="mt-3 max-w-[40ch] text-[1.05rem] leading-8 text-[#dce4dc]">
          چهار مرحله واقعی کارگاه. بدون تزئین اضافه.
        </p>
      </div>
      <div className="mt-12 space-y-16">
        {stages.map((stage) => (
          <article key={stage.title}>
            <div className="relative mx-auto aspect-[16/8] w-full max-w-[1120px] overflow-hidden">
              <Image src={stage.image} alt={stage.alt} fill sizes="1120px" className="object-cover" />
            </div>
            <div className="container-main mt-5 max-w-[40rem]">
              <h3 className="display text-3xl text-[#f4f1ea]">{stage.title}</h3>
              <p className="mt-2 text-[1.05rem] leading-8 text-[#dce4dc]">{stage.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
