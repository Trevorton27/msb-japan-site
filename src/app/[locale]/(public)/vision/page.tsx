import type { Metadata } from "next";
import Image from "next/image";
import { isValidLocale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title:
      locale === "en"
        ? "Vision — MSB Japan"
        : "ビジョン — MSB Japan",
  };
}

const content = {
  ja: {
    pageTitle: "ビジョン",
    quote:
      "「物事に対する先入観に疑問を投げかけ、あらゆる体験を調べ上げる。」",
    introParagraph:
      "このような考察を通じて、私たちは「幸せを得たい。苦しみから逃れたい」という生きとし生けるものに共通する根源的な願いに気づくようになります。そして、生きとし生けるものに具わる仏性をあらわにすることが人生の目的となり、自他の利益のために覚りの道を歩むことが人生の最優先事項となっていく。マンガラ・シュリ・ブティでは、この理念に基づき、「生きとし生けるものが真の幸せを得て、苦しみから解放される支えとなること」を活動目的とします。",

    lineageTitle: "ロンチェン・ニンティクとケン・コン・チョリンの法脈",
    lineageParagraph:
      "私たちが属する金剛乗のロンチェン・ニンティクとケン・コン・チョ・スムの系譜では伝統的に、解脱の旅は師弟関係を通じて示されます。私たちのサンガもこれまでズィガー・コントゥル・リンポチェの緊密な指導の下、一歩ずつ発展してきました。導師（ラマ）の智慧と弟子の切望が触れ合う、言い換えると、弟子の誠実な想いやインスピレーションに応える形で、師がさらなる教えや指導を授けるという有機的な形でサンガと個人は成長してきました。このような相互理解を基盤にすることで、道を歩むための、高潔で明瞭な信頼の置ける環境を築くことができると信じます。",

    studyTitle: "学習、修行、奉仕",
    studyParagraph1:
      "マンガラ・シュリ・ブティ・サンガは、リトリート（隠遁修行）で伝授されるゾクチェンの教えを頂点とする道を歩みます。その準備として、様々な「学習」コースを修習しながら、ロジョン（心の訓練）や一連の「修行」階梯を実践していくことになります。また、サンガの活動に参加する「奉仕」も、個人の資質を高める重要な要素です。",
    studyParagraph2:
      "これらの「学習」「修行」「奉仕」により育まれるカルチャーを通じて、弟子は利己心を減らし、利他の人間へと成長することができます。",
    studyParagraph3:
      "私たちのサンガに活動理念があるとすれば、「生まれながらに具わる覚りの本性につながる、その支えになること」です。",

    japanVisionTitle: "日本のビジョン",
    japanVisionSubtitle: "「日本仏教の再興」",

    newApproachTitle: "新しいアプローチ",
    newApproachParagraph:
      "日本では近年、教育水準の高まりとともに、知的水準も向上しました。そのため、信心のみで仏教を普及させる従来のアプローチとは異なる手法が求められているように思えます。仏教では、信心は知性よりも優れた徳性だと言われます。しかし、知能の向上にともない、従来のように信心のみでは、疑心が深まるばかりで、確信を持って道を歩むことが難しくなっています。また、知的な心には、非論理的な信仰や宗教は危険なもの、劣った、古くさいものとして映ります。しかし、本来、仏教は極めて論理的な教えです。恐らく、日本ではこれまで、できる限り多くの人の救いとなるように、論理的な教えはさておかれ、信心を中心に教えが広められたのだと思われます。一方、仏教の論理的な側面は、読解力を身につけた僧侶や高い階級の一部の人たちの間で学ばれてきました。\n\nしかし、時代は変わり、現在は一般の人も、当時の僧侶と同等の語学力や読解力を身に付けており、これまで一部の人に限定されていた教えを、皆が学べる状況になりました。その際、過去の形でそのまま紹介するのでなく、現在の状況に合わせてわかりやすく説き明かす必要もあります。また、概念だけの理解にとどめず、自ら実践し、体験に根差してその恩恵を理解することで、信を深めていくことが極めて重要となります。このようなプロセスを通ることで、確信に満ちた信心を養うことができるでしょう。",

    japanChallengesTitle: "日本の課題",
    japanChallengesParagraph:
      "西洋の物質主義が押し寄せたことで、多くの日本人が自国の文化やルーツを見失いかけています。恐らく戦前生まれの人には、このルーツが根付いていたのではないでしょうか。しかし、現在、その多くは高齢となり、あと何年もすれば日本の文化やルーツを体現する人がこの世から去ります。一方、そのルーツの多くは若い世代に受け継がれていません。彼らは、西洋の物質主義に追従し、利己的な傾向を強めています。しかし、長年かけて培われた日本人の美徳は、正しい理性に裏付けられています。それは「利己心を減らし、利他心を養うことで、結果的に、自他ともに幸せになれる」という正しい因果関係に根差したものなのです。若い世代は恐らく、ある一定期間、ハリウッド映画で見られるような一時的な幸せを追い求めるかもしれません。しかし、その結果として受ける苦しみから、必ず、再度、道を探し始めるはずです。ですが、その時には残念ながら、文化やルーツを保持している人がほとんどいなくなっている可能性があります。そうなると、人々の心は、何が正しくて、何が誤りかが分からなくなり、大きな混乱の闇に包まれます。\n\nこれは何も日本だけの話ではありません。ユダヤ教などでも、同じように物質主義から文化喪失の危機に直面しています。チベットも同じ状況です。中国によるチベット侵攻以来、チベット内でも、またインドに亡命してきたチベット人社会においても、特に若い世代の多くがそれまで受け継がれてきた自国の文化やルーツを軽視し、西洋の物質主義に追従し始めています。このように世界中で独自の文化やルーツを失う危機に直面しているのです。\n\nしかし、興味深い点は、西洋の科学者や心理学者などの知識人と呼ばれる人たちが、逆に仏教の智慧に目を向け始めていることです。彼らは研究を進めるうちに、仏教の教えが実は自分の分野にも役立つことに気づき始めています。彼らのような知性に長けた人たちが、仏教の論理性や哲学に意義を見出しています。一方、東洋の知識人の多くはいまだ西洋のスタイルを追い掛ける傾向にあります。とても興味深い現象です。この点から見れば、東洋の人たちも、いつかは自分たちのルーツに目を向け始めると思われます。",

    revivalTitle: "日本での仏教再興プロセス",
    revivalParagraph:
      "日本人は、謙虚さ、忍耐、礼儀正しさ、思いやりなど、仏教的な徳性を多く身につけており、寺院参拝や右遶、五体投地、供養など、仏教的慣習も既に存在します。これらの慣習や徳性は修行の大きな支えとなる一方、単なる道徳的な行為として行うのなら、あまり力となりません。また、以前と違い、これらの行為に対する信も失われています。そのため、これらの文化や慣習の本当の意味や利益について正しく知る必要があります。単にきまりや道徳として身につけるのではなく、何が幸せをもたらす正しい行いで、何が苦しみをもたらす誤った行いかを論理的に理解することで、信を深め、心を正しい方向に導いていく、このような心の取り組み方を身に付ける必要があります。タバコやドラッグに中毒の人の場合も、後に肺ガンになるなど、その行為の結果に確信を持てなければ、ついついそれらに手が伸びてしまいます。同じように自分の心に対しても、何が有益で、何が有害かを学び、そのことに納得し、確信を得られない限り、苦しみをもたらす習慣的な行為になすすべなく流されます。このように今の時代に求められるのは、教えを聞き、心から納得し、知性を高めることで、心を正しい方向へ導くことなのです。そして、結果として幸せや心の平穏を体験できれば、その後は、その充足感から、自然と正しい行為に向かい、少しずつ心の闇を晴らしていけるでしょう。\n\nまた、仏法の真髄は、単なる慣習や文化の中にはありません。それは、瞑想の中で知性と智慧を高め、心に直接関わることで覚られるものです。茶道や華道、武道など日本には素晴らしい文化が存在しますが、これらの道の祖師達は皆、座禅にも精通していたはずです。今の時代も同じように、単に形骸化した慣習や文化だけを伝承するのでなく、その背後に潜む智慧を共に受け継いでいかねばなりません。そうすれば、文化と仏法は互いに支え合うものとなり、この混乱した社会の中でも、人々はより健全で有意義な人生を送れるようになると思います。",
    revivalSource:
      "ズィガー・コントゥル・リンポチェへのインタビュー（2001年11月25日）の抄訳",

    sanghaTitle: "サンガ",
    sanghaSubtitle: "「仏法に調和した文化を築く」",
    sanghaParagraph1:
      "サンガとは、仏教理念に根ざした共同体のことを指し、その始まりは釈尊の時代に遡ります。サンガの目的は、仏法に調和した文化を築くことにあります。このような文化を育むには、教えを聞き、熟考することで、私たちの習慣的な思い込みや、考え方、行動を見つめ直し、それらを真理に即したものへと変容させていかねばなりません。サンガの一員になることは、仏法を共に学び、他者と関わりながら道の理解を深める大きな支えとなります。",
    sanghaParagraph2:
      "15年以上にわたって、私たち日本のサンガは、仏法を学び、修行し、導師・法脈との結縁を深めながら、奉仕や組織を支える活動に参加することによって、まるで染料に布を浸すように、少しずつ仏教文化を吸収してきました。",
    sanghaParagraph3:
      "コントゥル・リンポチェはこのアプローチに、特に重点を置かれています。なぜなら喜びや困難を伴う他者との共同作業は、道の進み具合を測る目安となるだけでなく、修行者としての成長に欠かせない要素だからです。",
    sanghaQuote:
      "「サンガにおける共同作業とは、目的地を同じとする者たちが1隻の船に乗り込み、共に輪廻の大海を航海するようなものだ」",
    sanghaQuoteAttr: "— コントゥル・リンポチェ",

    aboutTitle: "MSBJについて",
    aboutSubtitle:
      "一般社団法人マンガラ・シュリ・ブティ・ジャパンについて",
    aboutParagraph1:
      "マンガラ・シュリ・ブティ・ジャパン（MSBJ）は、ズィガー・コントゥル・リンポチェの指導の下、ニンマ派ロンチェン・ニンティクの系譜を学ぶサンガ（僧伽：仏の道を共に学ぶ集合体）です。",
    aboutParagraph2:
      "リンポチェが初来日された2001年4月に、米国 Mangala Shri Bhutiの日本支部（任意団体）として設立されました。その後、毎年リンポチェをお迎えし、伝統的な仏典を題材にしながら、継続して法話会を開催しています。",
    aboutParagraph3:
      "また法話を聞いて終わるのではなく、日常生活でその教えを実践し、個人の体験に基づいて理解を深められるよう毎月、勉強会と座禅会を開催しています。",
    aboutParagraph4:
      "2015年11月2日、サンガの公益性をより高め、その活動を将来に継承していくために一般社団法人化しました。",

    centresTitle: "活動拠点",

    tashiGachilName: "タシ・ガチル",
    tashiGachilRoman: "Tashi Gachil",
    tashiGachilDesc:
      "京都府亀岡市の田園風景が残る地域に位置する、築100年を超える古民家。MSBJのメイン・センターとして、年に一度リンポチェをお迎えしての法話会や、月一回の勉強会・座禅会を開催しています。",
    tashiGachilMeaning: "タシ・ガチル（\u201cAuspicious Coil of Joy\u201d）は、「吉祥なる歓喜の円環」を意味します。",
    exteriorLabel: "外観",
    zendoLabel: "座禅会場",

    tashiCholingName: "タシ・チョリン",
    tashiCholingRoman: "Tashi Choling",
    tashiCholingDesc:
      "南伊豆の海近くの高台に位置する、自然豊かな山荘。敷地内の能舞台にて、座禅会やドゥルプチュ（集中的な供養行）を行っています。",
    tashiCholingMeaning:
      "タシ・チョリン、「Auspicious Place of Dharma」は、吉祥なる仏法の地を意味します。",
    gardenLabel: "庭",
  },

  en: {
    pageTitle: "Vision",
    quote:
      '"Question your assumptions about things, and examine all experiences."',
    introParagraph:
      "Through this kind of reflection, we come to recognize the fundamental aspiration shared by all living beings: to be happy and free from suffering. It becomes the purpose of life to reveal the buddha-nature inherent in all beings, and the pursuit of the path to awakening—for the benefit of self and others—becomes life's highest priority. At Mangala Shri Bhuti, based on this principle, our purpose is to be a support for all living beings in finding true happiness and freedom from suffering.",

    lineageTitle: "The Longchen Nyingtik and Ken Kong Choling Lineage",
    lineageParagraph:
      "In our Vajrayana lineage of Longchen Nyingtik and Ken Kong Cho Sum, liberation is traditionally revealed through the teacher-student relationship. Our sangha has developed step by step under the close guidance of Dzigar Kongtrul Rinpoche. The sangha and individuals grow in an organic way—where the wisdom of the teacher and the aspiration of the student meet, where the teacher offers further teachings and guidance in response to the student's sincere intention and inspiration. We believe that by basing ourselves on this mutual understanding, we can build a noble, clear, and trustworthy environment for walking the path.",

    studyTitle: "Study, Practice, and Service",
    studyParagraph1:
      "The Mangala Shri Bhuti Sangha walks a path with Dzogchen teachings—transmitted during retreat—as the pinnacle. In preparation, practitioners study various Study courses while practicing Lojong (mind training) and a series of Practice stages. Participation in sangha activities through Service is also an important element for cultivating individual qualities.",
    studyParagraph2:
      "Through the culture nurtured by Study, Practice, and Service, students can reduce self-centeredness and grow into altruistic human beings.",
    studyParagraph3:
      "If there is a guiding principle for our sangha, it is: to be a support for connecting with the innate awakened nature we were all born with.",

    japanVisionTitle: "Vision for Japan",
    japanVisionSubtitle: '"Revival of Buddhism in Japan"',

    newApproachTitle: "A New Approach",
    newApproachParagraph:
      "In recent years in Japan, as educational standards have risen, so too has the level of intellectual engagement. As a result, a different approach seems to be needed from the traditional method of spreading Buddhism through faith alone. Buddhism teaches that faith is a virtue superior to intellect. However, as intelligence grows, relying on faith alone only deepens doubt, making it difficult to walk the path with conviction. Moreover, to an intellectual mind, illogical faith or religion appears dangerous, inferior, or outdated. Yet in essence, Buddhism is an extremely logical teaching. Perhaps in Japan, in order to reach as many people as possible, the logical aspects of the teaching were set aside and Buddhism was spread with faith at its center, while its logical dimensions were studied among literate monks and certain members of the upper classes.\n\nTimes have changed. Now ordinary people have the same level of language ability and literacy as the monks of that era, and everyone can study teachings that were once limited to a few. In presenting them, rather than introducing them in their past form, it is necessary to explain them clearly and in a way suited to current circumstances. Furthermore, it is extremely important not to stop at conceptual understanding, but to practice personally and understand the benefits through direct experience, thereby deepening one's faith. Through this process, one can cultivate a faith filled with conviction.",

    japanChallengesTitle: "Japan's Challenges",
    japanChallengesParagraph:
      "With the advance of Western materialism, many Japanese people are losing touch with their own culture and roots. Those born before the war perhaps had these roots deeply embedded. However, many of them are now elderly, and within a few years, the people who embody Japanese culture and roots will pass from this world. Meanwhile, those roots have not been passed on to younger generations, who are following Western materialism and growing increasingly self-centered. Yet the virtues cultivated by Japanese people over many years are grounded in sound reasoning—rooted in the correct understanding of cause and effect: by reducing self-centeredness and cultivating altruism, both oneself and others ultimately become happy. Younger generations may for a time pursue the fleeting happiness depicted in Hollywood films, but through the suffering that results, they will inevitably begin searching for the path once again. By then, unfortunately, there may be almost no one left who holds the culture and roots. People's minds will become unable to distinguish right from wrong, enveloped in great confusion and darkness.\n\nThis is not a problem unique to Japan. In Judaism and other traditions, there is the same crisis of cultural loss from materialism. Tibet faces the same situation. Since China's invasion, many young Tibetans—both within Tibet and in exile communities in India—have begun to look down on their inherited culture and roots, following Western materialism. Throughout the world, unique cultures and roots are at risk of being lost.\n\nWhat is interesting, however, is that intellectuals in the West—scientists, psychologists and others—have begun to turn their attention to Buddhist wisdom. As they advance their research, they are discovering that Buddhist teachings are also applicable to their own fields. These highly intelligent people are finding value in the logic and philosophy of Buddhism. Meanwhile, many intellectuals in the East still tend to chase the Western style—a very interesting phenomenon. From this perspective, it seems that people in the East will someday also begin to look toward their own roots.",

    revivalTitle: "The Process of Buddhist Revival in Japan",
    revivalParagraph:
      "Japanese people possess many Buddhist virtues—humility, patience, courtesy, compassion—and Buddhist practices such as temple visits, circumambulation, prostrations, and offerings already exist. While these customs and virtues are a great support for practice, if performed merely as moral acts, they hold little power. Moreover, the faith behind these acts has been lost. Therefore, we need to properly understand the true meaning and benefit of these cultural customs. Rather than simply adopting them as rules or morality, we need to logically understand what is right action that brings happiness and what is wrong action that brings suffering—thereby deepening faith and guiding the mind in the right direction. Those addicted to tobacco or drugs, unless they have conviction in the consequences—such as developing lung cancer—will reach for them again and again. In the same way, with our own minds, unless we learn what is beneficial and what is harmful, become convinced of it and gain confidence, we will be helplessly swept along by habitual actions that bring suffering. What is needed in this age is to listen to the teachings, be genuinely convinced, and elevate our intelligence—thereby guiding the mind in the right direction. And if, as a result, we experience happiness and peace of mind, we will then naturally move toward right action from that sense of fulfillment, gradually clearing the darkness from our minds.\n\nFurthermore, the essence of the Dharma is not found in mere customs and culture. It is realized by elevating intelligence and wisdom in meditation and engaging directly with the mind. Japan has wonderful cultures such as the tea ceremony, flower arrangement, and martial arts, but the founders of these paths were all undoubtedly well-versed in zazen. In the same way today, rather than simply inheriting hollow customs and culture, we must also transmit the wisdom that lies behind them. If we do, culture and Dharma will become mutually supportive, and people will be able to live healthier and more meaningful lives even in this confused society.",
    revivalSource:
      "Excerpt from an interview with Dzigar Kongtrul Rinpoche (November 25, 2001)",

    sanghaTitle: "Sangha",
    sanghaSubtitle: '"Building a Culture in Harmony with the Dharma"',
    sanghaParagraph1:
      "The sangha refers to a community rooted in Buddhist principles, tracing its origins back to the time of Shakyamuni Buddha. The purpose of the sangha is to build a culture in harmony with the Dharma. To cultivate such a culture, we must listen to and reflect on the teachings, examining our habitual assumptions, ways of thinking and acting, and transforming them toward the truth. Becoming a member of the sangha is a great support for studying the Dharma together and deepening one's understanding of the path through relating with others.",
    sanghaParagraph2:
      "Over more than 15 years, our Japanese sangha—by studying and practicing the Dharma, deepening connections with teachers and lineage, and participating in service and activities that support the organization—has gradually absorbed Buddhist culture, like fabric immersed in dye.",
    sanghaParagraph3:
      "Kongtrul Rinpoche places particular emphasis on this approach, because working together with others—with both its joys and difficulties—is not only a measure of one's progress on the path but also an essential element for growth as a practitioner.",
    sanghaQuote:
      '"Working together in the sangha is like those sharing the same destination boarding one ship and navigating together across the great ocean of samsara."',
    sanghaQuoteAttr: "— Kongtrul Rinpoche",

    aboutTitle: "About MSBJ",
    aboutSubtitle:
      "About the General Incorporated Association Mangala Shri Bhuti Japan",
    aboutParagraph1:
      "Mangala Shri Bhuti Japan (MSBJ) is a sangha studying in the Nyingma Longchen Nyingtik lineage under the guidance of Dzigar Kongtrul Rinpoche—a sangha being a community of people studying the Buddhist path together.",
    aboutParagraph2:
      "It was established in April 2001, when Rinpoche first visited Japan, as the Japan branch of Mangala Shri Bhuti USA. Since then, Rinpoche has been welcomed every year, and dharma talks have been continuously held using traditional Buddhist texts as their basis.",
    aboutParagraph3:
      "Rather than simply listening to dharma talks, monthly study groups and zazen sessions are also held so that participants can practice the teachings in daily life and deepen understanding based on personal experience.",
    aboutParagraph4:
      "On November 2, 2015, the organization was incorporated as a General Incorporated Association to further enhance its public benefit and carry forward its activities into the future.",

    centresTitle: "Activity Bases",

    tashiGachilName: "Tashi Gachil",
    tashiGachilRoman: "Tashi Gachil",
    tashiGachilDesc:
      "A traditional farmhouse over 100 years old, located in a rural area of Kameoka City, Kyoto Prefecture. As MSBJ's main center, an annual dharma talk welcoming Rinpoche and monthly study and zazen sessions are held here.",
    tashiGachilMeaning:
      'Tashi Gachil — "Auspicious Coil of Joy" — means auspicious coil of delight.',
    exteriorLabel: "Exterior",
    zendoLabel: "Zazen Hall",

    tashiCholingName: "Tashi Choling",
    tashiCholingRoman: "Tashi Choling",
    tashiCholingDesc:
      "A mountain lodge rich in nature, situated on a hillside near the sea in the southern Izu Peninsula. Zazen sessions and Drupchö (intensive offering practices) are held on the Noh stage within the grounds.",
    tashiCholingMeaning:
      'Tashi Choling — "Auspicious Place of Dharma" — means auspicious place of the Dharma.',
    gardenLabel: "Garden",
  },
};

export default async function VisionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const t = locale === "en" ? content.en : content.ja;

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

      {/* Page title */}
      <h1 className="text-charcoal-900 text-4xl font-bold tracking-tight text-center">
        {t.pageTitle}
      </h1>

      {/* Opening quote */}
      <blockquote className="border-burgundy-500 text-charcoal-700 mt-8 border-l-4 pl-6 text-xl italic leading-relaxed">
        {t.quote}
      </blockquote>

      <p className="text-charcoal-600 mt-6 leading-relaxed whitespace-pre-line">
        {t.introParagraph}
      </p>

      {/* Lineage */}
      <section className="mt-12">
        <h2 className="text-charcoal-900 text-2xl font-bold text-center">{t.lineageTitle}</h2>
        <p className="text-charcoal-600 mt-4 leading-relaxed">{t.lineageParagraph}</p>
      </section>

      {/* Study, Practice, Service */}
      <section className="mt-12">
        <h2 className="text-charcoal-900 text-2xl font-bold text-center">{t.studyTitle}</h2>
        <p className="text-charcoal-600 mt-4 leading-relaxed">{t.studyParagraph1}</p>
        <p className="text-charcoal-600 mt-4 leading-relaxed">{t.studyParagraph2}</p>
        <p className="text-charcoal-600 mt-4 leading-relaxed">{t.studyParagraph3}</p>
      </section>

      {/* Vision for Japan */}
      <section className="mt-16 border-t border-charcoal-200 pt-12">
        <div className="relative mb-8 aspect-[3/2] overflow-hidden rounded-lg">
          <Image
            src="/images/legacy/113185931.webp"
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <h2 className="text-charcoal-900 text-3xl font-bold text-center">{t.japanVisionTitle}</h2>
        <p className="text-burgundy-600 mt-2 text-lg font-medium text-center">{t.japanVisionSubtitle}</p>

        <div className="mt-8">
          <h3 className="text-charcoal-900 text-xl font-semibold text-center">{t.newApproachTitle}</h3>
          <p className="text-charcoal-600 mt-4 leading-relaxed whitespace-pre-line">
            {t.newApproachParagraph}
          </p>
        </div>

        <div className="mt-10">
          <h3 className="text-charcoal-900 text-xl font-semibold text-center">{t.japanChallengesTitle}</h3>
          <p className="text-charcoal-600 mt-4 leading-relaxed whitespace-pre-line">
            {t.japanChallengesParagraph}
          </p>
        </div>

        <div className="mt-10">
          <h3 className="text-charcoal-900 text-xl font-semibold text-center">{t.revivalTitle}</h3>
          <p className="text-charcoal-600 mt-4 leading-relaxed whitespace-pre-line">
            {t.revivalParagraph}
          </p>
          <p className="text-charcoal-400 mt-6 text-sm italic">{t.revivalSource}</p>
        </div>
      </section>

      {/* Sangha */}
      <section className="mt-16 border-t border-charcoal-200 pt-12">
        <div className="relative mb-8 aspect-[3/2] overflow-hidden rounded-lg">
          <Image
            src="/images/legacy/monksResting.png"
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <h2 className="text-charcoal-900 text-3xl font-bold text-center">{t.sanghaTitle}</h2>
        <p className="text-burgundy-600 mt-2 text-lg font-medium text-center">{t.sanghaSubtitle}</p>
        <p className="text-charcoal-600 mt-6 leading-relaxed">{t.sanghaParagraph1}</p>
        <p className="text-charcoal-600 mt-4 leading-relaxed">{t.sanghaParagraph2}</p>
        <p className="text-charcoal-600 mt-4 leading-relaxed">{t.sanghaParagraph3}</p>
        <blockquote className="border-burgundy-500 text-charcoal-700 mt-8 border-l-4 pl-6 italic leading-relaxed">
          {t.sanghaQuote}
          <footer className="mt-2 text-sm not-italic text-charcoal-500">{t.sanghaQuoteAttr}</footer>
        </blockquote>
      </section>

      {/* About MSBJ */}
      <section className="mt-16 border-t border-charcoal-200 pt-12">
        <div className="relative mb-8 aspect-[3/2] overflow-hidden rounded-lg">
          <Image
            src="/images/legacy/rinpocheInRepose.png"
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <h2 className="text-charcoal-900 text-3xl font-bold text-center">{t.aboutTitle}</h2>
        <p className="text-charcoal-500 mt-1 text-sm text-center">{t.aboutSubtitle}</p>
        <p className="text-charcoal-600 mt-6 leading-relaxed">{t.aboutParagraph1}</p>
        <p className="text-charcoal-600 mt-4 leading-relaxed">{t.aboutParagraph2}</p>
        <p className="text-charcoal-600 mt-4 leading-relaxed">{t.aboutParagraph3}</p>
        <p className="text-charcoal-600 mt-4 leading-relaxed">{t.aboutParagraph4}</p>
      </section>

      {/* Activity Bases */}
      <section className="mt-16 border-t border-charcoal-200 pt-12">
        <h2 className="text-charcoal-900 text-3xl font-bold text-center">{t.centresTitle}</h2>

        {/* Tashi Gachil */}
        <div className="mt-10">
          <h3 className="text-charcoal-900 text-2xl font-bold text-center">{t.tashiGachilName}</h3>
          <p className="text-charcoal-400 text-sm text-center">{t.tashiGachilRoman}</p>
          <p className="text-charcoal-600 mt-4 leading-relaxed">{t.tashiGachilDesc}</p>
          <p className="text-charcoal-500 mt-2 text-sm italic">{t.tashiGachilMeaning}</p>

          {/* Images — update src paths once the correct files are identified in /public/images/legacy/ */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <figure>
              <div className="relative aspect-[3/2] overflow-hidden rounded-lg">
                <Image
                  src="/images/legacy/外観tashiGachil.png"
                  alt={t.exteriorLabel}
                  fill
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-1 text-center text-xs text-charcoal-400">
                {t.exteriorLabel}
              </figcaption>
            </figure>
            <figure>
              <div className="relative aspect-[3/2] overflow-hidden rounded-lg">
                <Image
                  src="/images/legacy/座禅会場tashiGachil.png"
                  alt={t.zendoLabel}
                  fill
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-1 text-center text-xs text-charcoal-400">
                {t.zendoLabel}
              </figcaption>
            </figure>
          </div>
        </div>

        {/* Tashi Choling */}
        <div className="mt-12">
          <h3 className="text-charcoal-900 text-2xl font-bold text-center">{t.tashiCholingName}</h3>
          <p className="text-charcoal-400 text-sm text-center">{t.tashiCholingRoman}</p>
          <p className="text-charcoal-600 mt-4 leading-relaxed">{t.tashiCholingDesc}</p>
          <p className="text-charcoal-500 mt-2 text-sm italic">{t.tashiCholingMeaning}</p>

          {/* Images — update src paths once the correct files are identified in /public/images/legacy/ */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <figure>
              <div className="relative aspect-[3/2] overflow-hidden rounded-lg">
                <Image
                  src="/images/legacy/座禅会場tashiCholing.png"
                  alt={t.zendoLabel}
                  fill
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-1 text-center text-xs text-charcoal-400">
                {t.zendoLabel}
              </figcaption>
            </figure>
            <figure>
              <div className="relative aspect-[3/2] overflow-hidden rounded-lg">
                <Image
                  src="/images/legacy/庭tachiCholing.png"
                  alt={t.gardenLabel}
                  fill
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-1 text-center text-xs text-charcoal-400">
                {t.gardenLabel}
              </figcaption>
            </figure>
          </div>
        </div>
      </section>
    </div>
  );
}
