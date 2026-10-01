import type { Metadata } from "next";
import Image from "next/image";
import type { Locale } from "@/lib/i18n/config";
import { isValidLocale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";

type Section = { heading: string; paragraphs: string[] };

type VisionContent = {
  vision: { title: string; quote: string; paragraphs: string[] };
  japan: {
    title: string;
    subtitle: string;
    intro: string[];
    sections: Section[];
    source: string;
  };
  sangha: { title: string; subtitle: string; paragraphs: string[] };
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const t = content[locale];
  return {
    title: `${t.vision.title} — MSB Japan`,
    description: t.vision.quote,
  };
}

// Text copied verbatim from docs/content-update/source-outline-v11.txt (sections 2 and 2-1).
const content = {
  ja: {
    vision: {
      title: "ビジョン",
      quote: "「物事に対する先入観に疑問を投げかけ、あらゆる体験を調べ上げる」",
      paragraphs: [
        "このような考察を通じて、私たちは「幸せを得たい。苦しみから逃れたい」という生きとし生けるものに共通する根源的な願いに気づくようになります。そして、生きとし生けるものに具わる仏性をあらわにすることが人生の目的となり、自他の利益のために悟りの道を歩むことが人生の最優先事項となっていく。マンガラ・シュリ・ブティでは、この理念に基づき、「生きとし生けるものが真の幸せを得て、苦しみから解放される支えとなること」を活動目的とします。",
      ],
    },
    japan: {
      title: "日本のビジョン",
      subtitle: "「日本仏教の再興」",
      intro: [
        "知性の高まった現代の日本において仏教が本当の意味で根付くには、信心だけに頼るのではなく、教えを論理的に理解し、自ら実践し、体験を通して確信を深めていくことが大切です。同時に、日本人が受け継いできた文化や徳性を、その背後にある智慧とともに次の世代へつなげていく道筋を示します。",
      ],
      sections: [
        {
          heading: "新しいアプローチ",
          paragraphs: [
            "日本では近年、教育水準とともに知的水準も高まり、信心だけに頼る従来のアプローチでは仏教を広めにくくなっています。仏教において信心は知性よりも尊い徳性とされますが、知的な心にとって、論理を欠いた信仰は危うく古めかしいものに映りがちです。しかし本来、仏教はきわめて論理的な教えです。恐らくこれまでの日本では、より多くの人を救うために、論理よりも信心を中心に教えが広められ、論理的な側面は読解力を備えた僧侶や一部の階層の人々の間でのみ学ばれてきたのでしょう。",
            "しかし時代は変わり、今では誰もが、かつての僧侶に匹敵する語学力・読解力を身につけています。これまで一部の人に限られていた教えを、誰もが学べる時代になったのです。だからこそ、過去の形をそのまま伝えるのではなく、今の時代に合わせてわかりやすく説き明かす必要があります。また、概念として理解するだけでなく、自ら実践し、体験を通してその恩恵を確かめることで信を深めていく――このプロセスこそが、確信に満ちた信心を養う道となるでしょう。",
          ],
        },
        {
          heading: "日本の課題",
          paragraphs: [
            "西洋の物質主義が押し寄せたことで、多くの日本人が自国の文化やルーツを見失いかけています。そのルーツを体現してきた戦前生まれの世代は高齢となり、あと何年かでこの世を去っていくでしょう。一方、若い世代の多くはそのルーツを受け継がず、西洋の物質主義に追従し、利己的な傾向を強めています。しかし、長年培われてきた日本人の美徳は、「利己心を減らし利他心を養うことで、自他ともに幸せになれる」という正しい因果に裏付けられたものです。若い世代は、しばらくの間はハリウッド映画に描かれるような一時的な幸せを追い求めるかもしれませんが、その先に待つ苦しみから、いずれ必ず道を探し始めるはずです。しかしその頃には、文化やルーツを伝えられる人がほとんど残っていない恐れがあります。そうなれば、何が正しく何が誤りかを見極める拠り所を失い、人々の心は大きな混乱に包まれてしまうでしょう。",
            "これは日本だけの問題ではありません。ユダヤ教社会も同様に、物質主義による文化喪失の危機に直面しています。チベットも例外ではなく、中国による侵攻以降、チベット国内でも亡命先のチベット人社会でも、特に若い世代が自国の文化やルーツを軽んじ、西洋の物質主義に追従し始めています。世界中で、独自の文化やルーツが失われつつあるのです。",
            "興味深いのは、西洋の科学者や心理学者といった知識人たちが、逆に仏教の智慧に目を向け始めていることです。研究を重ねる中で、仏教の教えが自分たちの分野にも役立つことに気づき、その論理性や哲学に意義を見出す知性派が増えています。一方で、東洋の知識人の多くは、いまだ西洋のスタイルを追いかける傾向にあります。なんとも興味深い現象ですが、この流れを見れば、東洋の人々もいつか自分たちのルーツへ目を向け始めるのではないでしょうか。",
          ],
        },
        {
          heading: "日本での仏教再興プロセス",
          paragraphs: [
            "日本人は、謙虚さ、忍耐、礼儀正しさ、思いやりといった仏教的な徳性をすでに数多く身につけており、寺院参拝や右遶、五体投地、供養といった仏教的な慣習も生活の中に息づいています。これらは修行を支える大きな土台となりますが、単なる道徳的な習わしとして行うだけでは、力を発揮しません。しかも、こうした行いに対する信も、以前ほど篤いものではなくなっています。だからこそ今、これらの文化や慣習が本当は何を意味し、どのような利益をもたらすのかを、正しく知る必要があるのです。",
            "きまりや道徳としてただ身につけるのではなく、何が幸せをもたらす正しい行いで、何が苦しみをもたらす誤った行いかを論理的に理解し、信を深めながら心を正しい方向へ導いていく――そうした心の取り組み方が求められています。喫煙や薬物への依存も同じで、その先に待つ結果への確信がなければ、人はついその習慣に手を伸ばしてしまいます。自分の心についても同様に、何が有益で何が有害かを学び、納得し、確信を得ない限り、苦しみをもたらす習慣的な行いに、なすすべなく流されてしまうのです。今の時代に求められているのは、教えを聞き、心から納得し、知性を高めることで、心を正しい方向へ導くこと。そうして幸せや心の平穏を体験できれば、その充足感から自然と正しい行いへ向かい、少しずつ心の闇を晴らしていけるでしょう。",
            "ただし、仏法の真髄は慣習や文化そのものの中にあるのではありません。それは瞑想を通じて知性と智慧を高め、心に直接向き合うことで覚られるものです。茶道、華道、武道など、日本には素晴らしい文化がありますが、これらの道を築いた祖師たちは皆、座禅にも精通していたはずです。今の時代も同じように、形骸化した慣習や文化だけを伝えるのではなく、その背後に息づく智慧を共に受け継いでいく必要があります。そうすれば文化と仏法は互いに支え合うものとなり、この混乱した社会の中でも、人々はより健全で意義深い人生を送れるようになるでしょう。",
          ],
        },
      ],
      source:
        "――ズィガー・コントゥル・リンポチェへのインタビュー（2001年11月25日）の抄訳",
    },
    sangha: {
      title: "サンガ",
      subtitle: "「仏法に調和した文化を築く」",
      paragraphs: [
        "サンガとは、仏教の理念に根ざした共同体を指し、その起源は釈尊の時代にまで遡ります。サンガの目的は、仏法に調和した文化を築くことにあります。そのためには、教えを聞き熟考しながら、自分の習慣的な思い込みや考え方、行動を見つめ直し、真理に即したものへと変えていく必要があります。サンガの一員になることは、仏法を共に学び、他者と関わりながら道の理解を深めていく大きな支えとなります。",
        "私たち日本のサンガは25年以上にわたり、仏法を学び、修行し、導師・法脈との結縁を深めながら、奉仕や組織運営に携わることを通じて、布が少しずつ染料に染まっていくように仏教文化を吸収してきました。",
        "コントゥル・リンポチェは、このアプローチを特に重視されています。喜びも困難も伴う他者との共同作業は、道の進み具合を測る目安であると同時に、修行者としての成長に欠かせない要素だからです。",
        "リンポチェは、「サンガにおける共同作業とは、目的地を同じとする者たちが1隻の船に乗り込み、共に輪廻の大海を航海するようなものだ」と述べています。",
      ],
    },
  },
  en: {
    vision: {
      title: "Vision",
      quote:
        "“The Buddhist teachings ask us to examine all aspects of our experience and to question our preconceptions and habitual beliefs.”",
      paragraphs: [
        "Through this examination we become aware of the fundamental wish for happiness which we and all beings share, and the desire to be free from suffering that accompanies it. Our life acquires a clarity of purpose: to uncover the buddhanature that is our natural inheritance as human beings. Following a path to liberation becomes our utmost priority, for our own and others' benefit. Mangala Shri Bhuti is founded upon these principles, and the evolution of our organization has had one core purpose: to bring beings liberation from suffering.",
      ],
    },
    japan: {
      title: "Vision for Japan",
      subtitle: "“The Revival of Buddhism in Japan”",
      intro: [
        "For Buddhism to truly take root in today's intellectually sophisticated Japan, it is not enough to rely on faith alone: the teachings must be both understood logically and put into practice, to deepen conviction through direct experience. This interview extract points toward a way of passing on the culture and virtues Japanese people have inherited—together with the wisdom behind them—to the next generation.",
      ],
      sections: [
        {
          heading: "A New Approach",
          paragraphs: [
            "In recent years, as education levels have risen in Japan, so has the general level of intellectual sophistication, making it harder to spread Buddhism through the conventional approach of relying on faith alone. In Buddhism, faith is considered a virtue even higher than intellect, but to an intellectual mind, faith that lacks logic can seem precarious and old-fashioned. Yet Buddhism is, in fact, an extremely logical teaching. Perhaps in Japan until now, in order to reach as many people as possible, the teachings were spread with an emphasis on faith rather than logic, while the logical dimension was studied only among literate monks and a limited stratum of society.",
            "But times have changed, and today everyone possesses language and reading ability comparable to that of monks in the past. Teachings once limited to a select few can now be learned by anyone. This is precisely why we must explain the teachings clearly, in ways suited to our times, rather than simply passing on their traditional form. It is also essential to deepen our faith not merely through conceptual understanding, but through putting the teachings into practice and confirming their benefit through direct experience—this process is the path to a faith filled with conviction.",
          ],
        },
        {
          heading: "Challenges Facing Japan",
          paragraphs: [
            "As Western materialism has swept in, many Japanese people are at risk of losing touch with their own culture and roots. The generation born before the war, who embodied these roots, has grown old and will pass away within a matter of years. Meanwhile, much of the younger generation has not inherited these roots, and instead follows Western materialism, growing increasingly self-centered. Yet the virtues Japanese people have cultivated over many generations are grounded in a sound principle of cause and effect: that by reducing self-centeredness and cultivating altruism, both oneself and others come to benefit. The younger generation may, for a time, chase the fleeting happiness portrayed in Hollywood films, but the suffering that inevitably follows will eventually lead them to search for a path once again. By then, however, there may be almost no one left who can pass on this culture and these roots. If that happens, people will lose the very reference point for discerning right from wrong, and society will be engulfed in great confusion.",
            "This is not a problem unique to Japan. Jewish communities face a similar crisis of cultural loss driven by materialism. In Tibet since the Chinese invasion, and among exiled Tibetan communities, as well, the younger generation has begun to disregard its own culture and roots and to follow Western materialism. Around the world, distinct cultures and roots are being lost.",
            "Many Western intellectuals—scientists and psychologists among them—have begun to turn with interest toward Buddhist wisdom. Through their research, a growing number of these intellectually-minded people are discovering that Buddhist teachings are useful in their own fields, and have begun to find meaning in Buddhist logic and philosophy, even as many Eastern intellectuals continue to follow Western styles of thought. It is a curious phenomenon, but if we follow the present trend, perhaps people in the East, too, will eventually turn their attention back to their own roots.",
          ],
        },
        {
          heading: "The Process of Reviving Buddhism in Japan",
          paragraphs: [
            "Japanese people already possess many Buddhist virtues, such as humility, patience, courtesy, and consideration for others, and Buddhist customs—temple visits, circumambulation, prostration, and offerings—remain part of everyday life. These provide a strong foundation for practice, but carried out merely as moral habit, they lose their power. Moreover, faith in these practices is not as strong as it once was. This is precisely why we now need to correctly understand what these customs and culture truly mean, and what benefit they actually bring.",
            "What is needed is not simply adopting Buddhist teachings as rules or morals, but logically understanding which actions bring happiness and which bring suffering, deepening our faith, and guiding our minds in the right direction. The same is true of addiction to smoking or drugs: without real conviction about the consequences that lie ahead, people keep reaching for the habit. Unless we learn what is truly beneficial and what is harmful to our own minds, and come to a genuine, convinced understanding of this, we will be swept along helplessly by habitual actions that bring suffering. What our era calls for is to hear the teachings, become genuinely convinced from the heart, and raise our intelligence so as to guide the mind in the right direction. Once we experience happiness and peace of mind as a result, that sense of fulfillment will naturally draw us toward right action, gradually clearing away the darkness in our minds.",
            "That said, the essence of the Dharma does not lie in customs or culture themselves. It is realized through meditation, by raising our intelligence and wisdom and engaging directly with the mind. Japan is home to wonderful traditions such as the tea ceremony, flower arranging, and the martial arts, and the founders of these paths must all have been well versed in zazen as well. In the same way, today we must not simply hand down hollowed-out customs and culture, but pass on together the wisdom that lives behind them. If we do so, culture and the Dharma will support one another, and even amid this confused society, people will be able to live healthier, more meaningful lives.",
          ],
        },
      ],
      source: "",
    },
    sangha: {
      title: "Sangha",
      subtitle: "“Building a culture in harmony with the Dharma.”",
      paragraphs: [
        "A sangha is a community rooted in Buddhist principles, tracing its origin back to the time of the Buddha. The purpose of a sangha is to build a culture in harmony with the Dharma. To cultivate such a culture, we must listen to and reflect on the teachings, reexamine our habitual assumptions, views, and behavior, and transform them so that they gradually come to align with the truth. Becoming part of a sangha is a great support for learning the Dharma together and deepening our understanding of the path through our connections with others.",
        "For more than 25 years, our sangha in Japan has absorbed Buddhist culture little by little—much as cloth is gradually dyed—through studying and practicing the Dharma, deepening our connection with our teacher and lineage, and taking part in service and the running of our organization.",
        "Kongtrul Rinpoche places particular emphasis on this approach, because working together with others—with all its joys and difficulties—serves both as a measure of our progress on the path and as an essential element of our growth as practitioners.",
        "Rinpoche has said that “working together within the sangha is like a group of people bound for the same destination boarding a single boat and sailing together across the great ocean of samsara.”",
      ],
    },
  },
} satisfies Record<Locale, VisionContent>;

export default async function VisionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const t = content[locale];

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero image */}
      <div className="relative mb-8 aspect-[3/2] overflow-hidden rounded-lg">
        <Image
          src="/images/legacy/113185928.webp"
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Vision */}
      <h1
        id="vision"
        className="text-charcoal-900 scroll-mt-48 text-center text-4xl font-bold tracking-tight"
      >
        {t.vision.title}
      </h1>
      <blockquote className="border-burgundy-500 text-charcoal-700 mt-8 border-l-4 pl-6 text-xl leading-relaxed italic">
        {t.vision.quote}
      </blockquote>
      {t.vision.paragraphs.map((p) => (
        <p key={p} className="text-charcoal-600 mt-6 leading-relaxed">
          {p}
        </p>
      ))}

      {/* Vision for Japan */}
      <section
        id="japan"
        className="border-charcoal-200 mt-16 scroll-mt-48 border-t pt-12"
      >
        <div className="relative mb-8 aspect-[3/2] overflow-hidden rounded-lg">
          <Image
            src="/images/legacy/113185931.webp"
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <h2 className="text-charcoal-900 text-center text-3xl font-bold">
          {t.japan.title}
        </h2>
        <p className="text-burgundy-600 mt-2 text-center text-lg font-medium">
          {t.japan.subtitle}
        </p>
        {t.japan.intro.map((p) => (
          <p key={p} className="text-charcoal-600 mt-6 leading-relaxed">
            {p}
          </p>
        ))}

        {t.japan.sections.map((section) => (
          <div key={section.heading} className="mt-10">
            <h3 className="text-charcoal-900 text-center text-xl font-semibold">
              {section.heading}
            </h3>
            {section.paragraphs.map((p) => (
              <p key={p} className="text-charcoal-600 mt-4 leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        ))}

        {t.japan.source && (
          <p className="text-charcoal-400 mt-6 text-sm italic">
            {t.japan.source}
          </p>
        )}
      </section>

      {/* Sangha */}
      <section
        id="sangha"
        className="border-charcoal-200 mt-16 scroll-mt-48 border-t pt-12"
      >
        <div className="relative mb-8 aspect-[3/2] overflow-hidden rounded-lg">
          <Image
            src="/images/legacy/monksResting.png"
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <h2 className="text-charcoal-900 text-center text-3xl font-bold">
          {t.sangha.title}
        </h2>
        <p className="text-burgundy-600 mt-2 text-center text-lg font-medium">
          {t.sangha.subtitle}
        </p>
        {t.sangha.paragraphs.map((p) => (
          <p
            key={p}
            className="text-charcoal-600 mt-4 leading-relaxed first:mt-6"
          >
            {p}
          </p>
        ))}
      </section>
    </div>
  );
}
