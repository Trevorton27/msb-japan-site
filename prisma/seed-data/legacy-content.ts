// Content migrated from the old msbjapan.org BiND site export
// (bdsite281836_20260728163109.zip). Japanese text is the original site
// content; English text is a translation prepared during migration.
// Images referenced here were copied to /public/images/legacy/.

export interface LegacyVenue {
  key: string;
  nameJa: string;
  nameEn: string;
  addressJa: string;
  addressEn: string;
}

export const legacyVenues: LegacyVenue[] = [
  {
    key: "tashi-gachil",
    nameJa: "タシ・ガチル（京都修学センター）",
    nameEn: "Tashi Gachil (Kyoto Study Centre)",
    addressJa: "京都府京都市左京区 東山鹿ヶ谷（法然院隣）",
    addressEn: "Higashiyama Shishigatani, Sakyo-ku, Kyoto (next to Honen-in)",
  },
  {
    key: "tashi-choling",
    nameJa: "タシ・チョリン（南伊豆リトリート・センター）",
    nameEn: "Tashi Choling (Minami-Izu Retreat Centre)",
    addressJa: "静岡県賀茂郡南伊豆町",
    addressEn: "Minami-Izu, Kamo District, Shizuoka",
  },
];

export interface LegacyTeacher {
  slugJa: string;
  slugEn: string;
  nameJa: string;
  nameEn: string;
  bioJa: string;
  bioEn: string;
  imageUrl: string;
  sortOrder: number;
}

export const legacyTeachers: LegacyTeacher[] = [
  {
    slugJa: "dzigar-kongtrul-rinpoche",
    slugEn: "dzigar-kongtrul-rinpoche-en",
    nameJa: "ズィガー・コントゥル・リンポチェ",
    nameEn: "Dzigar Kongtrul Rinpoche",
    bioJa:
      "ズィガー・コントゥル・リンポチェは1964年、北インドのヒマチェル・プラデッシュ州でチベット人の両親のもとに生まれる。幼少時にジャムグン・コントゥル・ロドゥ・タイェの化身（トゥルク）として認定され、その後、僧院で仏教教義全般を修習、とりわけ、ニンマ派の教え、特にロンチェン・ニンティクの教えを彼の根本ラマ（導師）、ディルゴ・ケンツェ・リンポチェから伝授される。1989年、妻子と共に米国に移住、1990年からコロラド州ボールダーのナロパ大学で仏教哲学の教師として5年間教壇に立つ。この時期に、ケンツェ・リンポチェのサンスクリット名を冠したマンガラ・シュリ・ブティ・サンガを設立。コントゥル・リンポチェは、米国コロラド州を中心に、北米、南米、欧州、アジアなど、世界各地で精力的に仏法を説いている。",
    bioEn:
      "Dzigar Kongtrul Rinpoche was born in 1964 in Himachal Pradesh, northern India, to Tibetan parents. Recognized in childhood as the incarnation (tulku) of Jamgön Kongtrul Lodrö Thayé, he trained in the full range of Buddhist doctrine in a monastic setting, receiving the Nyingma teachings — in particular the Longchen Nyingtik — from his root lama, Dilgo Khyentse Rinpoche. In 1989 he moved to the United States with his family, and from 1990 taught Buddhist philosophy for five years at Naropa University in Boulder, Colorado. During this period he founded the Mangala Shri Bhuti sangha, named after Khyentse Rinpoche's Sanskrit name. Based in Colorado, Kongtrul Rinpoche teaches the Dharma energetically throughout North and South America, Europe, and Asia.",
    imageUrl: "/images/legacy/113185957.webp",
    sortOrder: 1,
  },
  {
    slugJa: "dilgo-khyentse-rinpoche",
    slugEn: "dilgo-khyentse-rinpoche-en",
    nameJa: "ディルゴ・ケンツェ・リンポチェ",
    nameEn: "Dilgo Khyentse Rinpoche",
    bioJa:
      "コントゥル・リンポチェの精神の父で根本ラマであるディルゴ・ケンツェ・リンポチェは、リメ（チベット仏教の超宗派）運動の偉大な指導者であるジャムヤン・ケンツェ・ワンポの化身でした。ディルゴ・ケンツェ・リンポチェの学識、理解、不断の慈愛、そして威厳ある風貌は、いまだ多くの人々の心に鮮明に記憶されています。コントゥル・リンポチェのサンガ「マンガラ・シュリ・ブティ」は、ケンツェ・リンポチェのサンスクリット名を冠しています。",
    bioEn:
      "Dilgo Khyentse Rinpoche, Kongtrul Rinpoche's spiritual father and root lama, was the incarnation of Jamyang Khyentse Wangpo, the great leader of the Rimé (non-sectarian) movement of Tibetan Buddhism. His learning, understanding, unceasing loving-kindness, and dignified presence remain vividly remembered by many. Kongtrul Rinpoche's sangha, Mangala Shri Bhuti, bears Khyentse Rinpoche's Sanskrit name.",
    imageUrl: "/images/legacy/113185958.webp",
    sortOrder: 2,
  },
  {
    slugJa: "dungse-jampal-norbu",
    slugEn: "dungse-jampal-norbu-en",
    nameJa: "ドゥンセ・ジャンポール・ノルブ",
    nameEn: "Dungse Jampal Norbu",
    bioJa:
      "ズィガー・コントゥル・リンポチェのご子息であり米国MSBの後継者であるドゥンセ・ジャンポール・ノルブ氏（ドゥンセラ）は、その人生のほとんどを米国コロラドで過ごしています。父コントゥル・リンポチェから様々な教えや伝授を授かり、インドや米国におけるシェダ（伝統的な学習課程）など様々な導きを受け、現在は、コロラド州にあるリトリートセンター『ロンチェン・ジグメ・サムテン・リン』にて毎年百日間のリトリートを行いながら、世界各地にて法話を説いています。彼のテーマは「仏教の教えがいかに日常生活に役立つのか」であり、その法話は智慧とユーモアに満ち溢れています。",
    bioEn:
      "Dungse Jampal Norbu (Dungse-la), son of Dzigar Kongtrul Rinpoche and his successor at MSB in the United States, has spent most of his life in Colorado. Having received teachings and transmissions from his father — including traditional shedra study in India and the US — he now undertakes a hundred-day retreat each year at the Longchen Jigme Samten Ling retreat centre in Colorado while teaching around the world. His theme is how the Buddhist teachings serve everyday life, and his talks are full of wisdom and humor.",
    imageUrl: "/images/legacy/113185959.webp",
    sortOrder: 3,
  },
  {
    slugJa: "elizabeth-mattis-namgyel",
    slugEn: "elizabeth-mattis-namgyel-en",
    nameJa: "エリザベス・マティス・ナムゲル",
    nameEn: "Elizabeth Mattis Namgyel",
    bioJa:
      "アメリカ人の仏教指導者・著述家。1985年よりズィガー・コントゥル・リンポチェのもとで仏教を学び、修行を続ける。6年以上のリトリートを修了し、コロラド州にあるMSBのサムテン・リン・リトリートセンターのリトリート・マスターに任命される。文化人類学の学士号と仏教学の修士号を取得。ミドル・ウェイ・イニシアティブの創設者・代表。著書に『The Power of an Open Question』『The Logic of Faith』があり、コントゥル・リンポチェの著書2冊の編集を手がけ、仏教哲学と瞑想実践について世界各地で教えている。",
    bioEn:
      "American Buddhist teacher and author. She has studied and practiced Buddhism under Dzigar Kongtrul Rinpoche since 1985, completed more than six years in retreat, and was appointed Retreat Master at MSB's Samten Ling retreat centre in Colorado. She holds a B.A. in Anthropology and an M.A. in Buddhist Studies, and is founder and president of The Middle Way Initiative. Author of The Power of an Open Question and The Logic of Faith, she edited two of Dzigar Kongtrul Rinpoche's books and teaches internationally on Buddhist philosophy and contemplative practice.",
    imageUrl: "",
    sortOrder: 4,
  },
];

export interface LegacyPost {
  slugJa: string;
  slugEn: string;
  titleJa: string;
  titleEn: string;
  excerptJa: string;
  excerptEn: string;
  bodyJa: string;
  bodyEn: string;
  type: "BLOG" | "TEACHING" | "ARTICLE" | "AUDIO" | "VIDEO";
  imageUrl?: string;
  teacherSlug?: string;
  publishedAt: string;
}

export const legacyPosts: LegacyPost[] = [
  {
    slugJa: "vision",
    slugEn: "vision-en",
    titleJa: "ビジョン",
    titleEn: "Our vision",
    excerptJa:
      "「物事に対する先入観に疑問を投げかけ、あらゆる体験を調べ上げる」— マンガラ・シュリ・ブティの理念、日本のビジョン、サンガについて。",
    excerptEn:
      '"Question your assumptions and examine every experience" — the vision of Mangala Shri Bhuti, our vision for Japan, and the sangha.',
    type: "ARTICLE",
    imageUrl: "/images/legacy/113185928.webp",
    publishedAt: "2023-03-19",
    bodyJa: `<h3>「物事に対する先入観に疑問を投げかけ、あらゆる体験を調べ上げる。」</h3>
<p>このような考察を通じて、私たちは「幸せを得たい。苦しみから逃れたい」という生きとし生けるものに共通する根源的な願いに気づくようになります。そして、生きとし生けるものに具わる仏性をあらわにすることが人生の目的となり、自他の利益のために覚りの道を歩むことが人生の最優先事項となっていく。マンガラ・シュリ・ブティでは、この理念に基づき、「生きとし生けるものが真の幸せを得て、苦しみから解放される支えとなること」を活動目的とします。</p>
<h4>ロンチェン・ニンティクとケン・コン・チョリンの法脈</h4>
<p>私たちが属する金剛乗のロンチェン・ニンティクとケン・コン・チョ・スムの系譜では伝統的に、解脱の旅は師弟関係を通じて示されます。私たちのサンガもこれまでズィガー・コントゥル・リンポチェの緊密な指導の下、一歩ずつ発展してきました。導師（ラマ）の智慧と弟子の切望が触れ合う、言い換えると、弟子の誠実な想いやインスピレーションに応える形で、師がさらなる教えや指導を授けるという有機的な形でサンガと個人は成長してきました。このような相互理解を基盤にすることで、道を歩むための、高潔で明瞭な信頼の置ける環境を築くことができると信じます。</p>
<h4>学習、修行、奉仕</h4>
<p>マンガラ・シュリ・ブティ・サンガは、リトリート（隠遁修行）で伝授されるゾクチェンの教えを頂点とする道を歩みます。その準備として、様々な「学習」コースを修習しながら、ロジョン（心の訓練）や一連の「修行」階梯を実践していくことになります。また、サンガの活動に参加する「奉仕」も、個人の資質を高める重要な要素です。<br />これらの「学習」「修行」「奉仕」により育まれるカルチャーを通じて、弟子は利己心を減らし、利他の人間へと成長することができます。<br />私たちのサンガに活動理念があるとすれば、「生まれながらに具わる覚りの本性につながる、その支えになること」です。</p>
<h2>日本のビジョン</h2>
<h3>「日本仏教の再興」</h3>
<h4>新しいアプローチ</h4>
<p>日本では近年、教育水準の高まりとともに、知的水準も向上しました。そのため、信心のみで仏教を普及させる従来のアプローチとは異なる手法が求められているように思えます。仏教では、信心は知性よりも優れた徳性だと言われます。しかし、知能の向上にともない、従来のように信心のみでは、疑心が深まるばかりで、確信を持って道を歩むことが難しくなっています。また、知的な心には、非論理的な信仰や宗教は危険なもの、劣った、古くさいものとして映ります。しかし、本来、仏教は極めて論理的な教えです。恐らく、日本ではこれまで、できる限り多くの人の救いとなるように、論理的な教えはさておかれ、信心を中心に教えが広められたのだと思われます。一方、仏教の論理的な側面は、読解力を身につけた僧侶や高い階級の一部の人たちの間で学ばれてきました。</p>
<p>しかし、時代は変わり、現在は一般の人も、当時の僧侶と同等の語学力や読解力を身に付けており、これまで一部の人に限定されていた教えを、皆が学べる状況になりました。その際、過去の形でそのまま紹介するのでなく、現在の状況に合わせてわかりやすく説き明かす必要もあります。また、概念だけの理解にとどめず、自ら実践し、体験に根差してその恩恵を理解することで、信を深めていくことが極めて重要となります。このようなプロセスを通ることで、確信に満ちた信心を養うことができるでしょう。</p>
<h4>日本の課題</h4>
<p>西洋の物質主義が押し寄せたことで、多くの日本人が自国の文化やルーツを見失いかけています。恐らく戦前生まれの人には、このルーツが根付いていたのではないでしょうか。しかし、現在、その多くは高齢となり、あと何年もすれば日本の文化やルーツを体現する人がこの世から去ります。一方、そのルーツの多くは若い世代に受け継がれていません。彼らは、西洋の物質主義に追従し、利己的な傾向を強めています。しかし、長年かけて培われた日本人の美徳は、正しい理性に裏付けられています。それは「利己心を減らし、利他心を養うことで、結果的に、自他ともに幸せになれる」という正しい因果関係に根差したものなのです。</p>
<p>これは何も日本だけの話ではありません。ユダヤ教などでも、同じように物質主義から文化喪失の危機に直面しています。チベットも同じ状況です。しかし、興味深い点は、西洋の科学者や心理学者などの知識人と呼ばれる人たちが、逆に仏教の智慧に目を向け始めていることです。彼らのような知性に長けた人たちが、仏教の論理性や哲学に意義を見出しています。この点から見れば、東洋の人たちも、いつかは自分たちのルーツに目を向け始めると思われます。</p>
<h4>日本での仏教再興プロセス</h4>
<p>日本人は、謙虚さ、忍耐、礼儀正しさ、思いやりなど、仏教的な徳性を多く身につけており、寺院参拝や右遶、五体投地、供養など、仏教的慣習も既に存在します。これらの慣習や徳性は修行の大きな支えとなる一方、単なる道徳的な行為として行うのなら、あまり力となりません。そのため、これらの文化や慣習の本当の意味や利益について正しく知る必要があります。何が幸せをもたらす正しい行いで、何が苦しみをもたらす誤った行いかを論理的に理解することで、信を深め、心を正しい方向に導いていく、このような心の取り組み方を身に付ける必要があります。今の時代に求められるのは、教えを聞き、心から納得し、知性を高めることで、心を正しい方向へ導くことなのです。</p>
<p>また、仏法の真髄は、単なる慣習や文化の中にはありません。それは、瞑想の中で知性と智慧を高め、心に直接関わることで覚られるものです。茶道や華道、武道など日本には素晴らしい文化が存在しますが、これらの道の祖師達は皆、座禅にも精通していたはずです。今の時代も同じように、単に形骸化した慣習や文化だけを伝承するのでなく、その背後に潜む智慧を共に受け継いでいかねばなりません。そうすれば、文化と仏法は互いに支え合うものとなり、この混乱した社会の中でも、人々はより健全で有意義な人生を送れるようになると思います。</p>
<p><em>ズィガー・コントゥル・リンポチェへのインタビュー（2001年11月25日）の抄訳</em></p>
<h2>サンガ</h2>
<h4>「仏法に調和した文化を築く」</h4>
<p>サンガとは、仏教理念に根ざした共同体のことを指し、その始まりは釈尊の時代に遡ります。サンガの目的は、仏法に調和した文化を築くことにあります。このような文化を育むには、教えを聞き、熟考することで、私たちの習慣的な思い込みや、考え方、行動を見つめ直し、それらを真理に即したものへと変容させていかねばなりません。サンガの一員になることは、仏法を共に学び、他者と関わりながら道の理解を深める大きな支えとなります。<br />15年以上にわたって、私たち日本のサンガは、仏法を学び、修行し、導師・法脈との結縁を深めながら、奉仕や組織を支える活動に参加することによって、まるで染料に布を浸すように、少しずつ仏教文化を吸収してきました。</p>
<p>コントゥル・リンポチェはこのアプローチに、特に重点を置かれています。なぜなら喜びや困難を伴う他者との共同作業は、道の進み具合を測る目安となるだけでなく、修行者としての成長に欠かせない要素だからです。</p>
<p>リンポチェは、「サンガにおける共同作業とは、目的地を同じとする者たちが1隻の船に乗り込み、共に輪廻の大海を航海するようなものだ」と述べています。</p>`,
    bodyEn: `<h3>"Question your assumptions about things, and examine every experience."</h3>
<p>Through this kind of inquiry we come to recognize the fundamental wish shared by all living beings: to find happiness and be free from suffering. Revealing the buddha nature inherent in all beings becomes the purpose of life, and walking the path of awakening for the benefit of ourselves and others becomes life's highest priority. Based on this principle, Mangala Shri Bhuti's purpose is to support all living beings in finding true happiness and freedom from suffering.</p>
<h4>The Longchen Nyingtik and Khyen-Kong-Chok lineages</h4>
<p>In the Vajrayana lineages to which we belong — the Longchen Nyingtik and Khyen-Kong-Chok Sum — the journey to liberation is traditionally shown through the teacher-student relationship. Our sangha has developed step by step under the close guidance of Dzigar Kongtrul Rinpoche. Sangha and individuals alike have grown organically, with the teacher offering further teachings and guidance in response to the sincere aspiration and inspiration of students — the meeting of the lama's wisdom and the students' longing. We believe this mutual understanding provides a noble, clear, and trustworthy environment for walking the path.</p>
<h4>Study, practice, and service</h4>
<p>The Mangala Shri Bhuti sangha follows a path that culminates in the Dzogchen teachings, transmitted in retreat. In preparation, students take up various courses of study while practicing lojong (mind training) and a graduated series of practices. Service — taking part in the sangha's activities — is also an essential element in developing one's character.<br />Through the culture nurtured by study, practice, and service, students wear down self-centeredness and grow into altruistic human beings.<br />If our sangha has a guiding principle, it is this: to support each person in connecting with the awakened nature they were born with.</p>
<h2>Our vision for Japan</h2>
<h3>"A revival of Japanese Buddhism"</h3>
<h4>A new approach</h4>
<p>In recent years education levels in Japan have risen, and with them intellectual standards. It seems a different method is now needed from the traditional approach of spreading Buddhism through faith alone. In Buddhism, faith is said to be a virtue superior to intellect. Yet as intelligence develops, faith alone only deepens doubt, making it difficult to walk the path with conviction. To the intellectual mind, illogical belief and religion appear dangerous, inferior, or outdated. But Buddhism is, at its heart, an extremely logical teaching. In Japan, it seems, the logical teachings were set aside so that the teachings could reach as many people as possible through faith, while Buddhism's logical side was studied by literate monastics and a small upper class.</p>
<p>Times have changed. Ordinary people today possess the language and literacy once limited to monastics, so everyone can now study teachings that used to be restricted to a few. Rather than presenting them in their old form, they must be explained clearly, adapted to today's circumstances. And it is essential not to stop at conceptual understanding but to practice, to understand the benefit through one's own experience, and so deepen one's faith. Through this process a conviction-filled faith can be cultivated.</p>
<h4>Japan's challenge</h4>
<p>With the tide of Western materialism, many Japanese are losing sight of their own culture and roots. Those born before the war probably still carry these roots, but most are now elderly, and in a few years those who embody Japan's culture and roots will be gone, while much of that heritage has not been passed to the young, who follow Western materialism and grow more self-centered. Yet the virtues the Japanese have cultivated over centuries rest on sound reason — on the correct causal understanding that by reducing self-centeredness and nurturing altruism, both self and others become happy.</p>
<p>This is not only Japan's story. Judaism faces a similar crisis of cultural loss to materialism, and Tibet is in the same situation. What is fascinating is that Western scientists, psychologists, and intellectuals have begun turning toward Buddhist wisdom, finding meaning in its logic and philosophy. Seen from this angle, people of the East too will surely one day turn back toward their own roots.</p>
<h4>The process of Buddhist revival in Japan</h4>
<p>The Japanese already possess many Buddhist virtues — humility, patience, courtesy, consideration — and Buddhist customs such as temple visits, circumambulation, prostrations, and offerings already exist. These customs and virtues can greatly support practice, but performed as mere moral routine they carry little power. We need to understand the true meaning and benefit of these cultural practices: to logically understand which right actions bring happiness and which mistaken actions bring suffering, and so deepen faith and guide the mind in the right direction. What this era calls for is to hear the teachings, be genuinely convinced by them, sharpen the intellect, and thereby guide the mind rightly.</p>
<p>The essence of the Dharma is not found in custom or culture alone. It is realized by refining intellect and wisdom in meditation and engaging the mind directly. Japan has magnificent traditions — tea ceremony, flower arrangement, the martial ways — and the founders of these paths were all deeply versed in seated meditation. In the same way today, we must transmit not just the outer forms but the wisdom behind them. Then culture and Dharma will support one another, and even in this confused society people will be able to live sounder, more meaningful lives.</p>
<p><em>Abridged translation of an interview with Dzigar Kongtrul Rinpoche (November 25, 2001)</em></p>
<h2>The sangha</h2>
<h4>"Building a culture in harmony with the Dharma"</h4>
<p>A sangha is a community rooted in Buddhist principles, its origins reaching back to the time of the Buddha. Its purpose is to build a culture in harmony with the Dharma. Nurturing such a culture means hearing and contemplating the teachings, re-examining our habitual assumptions, ways of thinking, and behavior, and transforming them to accord with truth. Becoming part of a sangha is a great support for studying the Dharma together and deepening one's understanding of the path in relationship with others.<br />For more than fifteen years, our sangha in Japan has been absorbing Buddhist culture little by little — like cloth steeped in dye — by studying and practicing the Dharma, deepening our connection with the teacher and lineage, and taking part in service and the work that sustains the organization.</p>
<p>Kongtrul Rinpoche places particular emphasis on this approach, because working together with others through joys and difficulties is not only a measure of progress on the path but an indispensable element of growth as a practitioner.</p>
<p>Rinpoche says: "Working together in the sangha is like people bound for the same destination boarding a single ship and sailing the great ocean of samsara together."</p>`,
  },
  {
    slugJa: "msbj-ni-tsuite",
    slugEn: "about-msbj",
    titleJa: "MSBJについて",
    titleEn: "About MSBJ",
    excerptJa:
      "一般社団法人マンガラ・シュリ・ブティ・ジャパンの概要と、2001年の設立から現在までの沿革。",
    excerptEn:
      "Profile of Mangala Shri Bhuti Japan General Incorporated Association, and its history since founding in 2001.",
    type: "ARTICLE",
    imageUrl: "/images/legacy/113186001.webp",
    publishedAt: "2023-03-19",
    bodyJa: `<h4>一般社団法人マンガラ・シュリ・ブティ・ジャパンについて</h4>
<p>マンガラ・シュリ・ブティ・ジャパン（MSBJ）は、ズィガー・コントゥル・リンポチェの指導の下、ニンマ派ロンチェン・ニンティクの系譜を学ぶサンガ（僧伽：仏の道を共に学ぶ集合体）です。</p>
<p>リンポチェが初来日された2001年4月に、米国<a href="http://www.mangalashribhuti.org">Mangala Shri Bhuti</a>の日本支部（任意団体）として設立されました。その後、毎年リンポチェをお迎えし、伝統的な仏典を題材にしながら、継続して法話会を開催しています。</p>
<p>また法話を聞いて終わるのではなく、日常生活でその教えを実践し、個人の体験に基づいて理解を深められるよう毎月、勉強会と座禅会を開催しています。</p>
<p>2015年11月2日、サンガの公益性をより高め、その活動を将来に継承していくために一般社団法人化しました。</p>
<h3>法人概要</h3>
<p>名称：一般社団法人マンガラ・シュリ・ブティ・ジャパン<br />英文名称：Mangala Shri Bhuti Japan General Incorporated Association (MSBJ)<br />設立目的：日本におけるチベット仏教の普及活動<br />特別顧問：ズィガー・コントゥル・リンポチェ（Mangala Shri Bhuti, USA）<br />代表理事：岡林<br />電話：075-200-7126<br />創立：2001年4月に任意団体として設立、2015年11月に一般社団法人化</p>
<h3>沿革</h3>
<p>2001年　米国Mangala Shri Bhutiの日本支部として、任意団体マンガラ・シュリ・ブティ・ジャパンを京都にて設立<br />　4月『チベット仏教とは』『そよ風のようなシンプルさ』（講説）<br />　11月『仏教瞑想の本質』（講説）<br />2002年4月『四無量心』（講説）<br />2003年4月『心の本性』（指南）<br />2004年4月『入菩薩行論 9章』『究竟一乗宝性論』（口伝）、『リグジン・デュパ』『デチェン・ギャルモ』（灌頂）<br />2005年4月『クンサンラマの教え』（講説）、『ロンチェン・ニンティク前行』（口伝/指南）<br />2006年4月『入菩薩行論』1～6章（講説）<br />2007年4月『入菩薩行論』7～8章（講説）<br />2008年6月『入菩薩行論』9章（講説）<br />2009年5月『入菩薩行論』9章（講説）<br />2010年5月『究竟一乗宝性論』導入（講説）、伊豆支部を開設<br />2011年1月『究竟一乗宝性論』仏宝（講説）<br />2012年1月『究竟一乗宝性論』法宝（講説）<br />2013年1月『究竟一乗宝性論』僧宝（講説）、『リグジン・デュパ・ドュプチュ』（法会）<br />2014年2月『究竟一乗宝性論』如来蔵（講説）、『デチェン・ギャルモ・ドュプチュ』（法会）<br />2015年4月『究竟一乗宝性論』如来蔵（講説）、『リグジン・デュパ・ドュプチュ』（法会）<br />2015年11月　一般社団法人マンガラ・シュリ・ブティ・ジャパンを設立<br />2016年5月『究竟一乗宝性論』如来蔵（講説）、『ドゥガル・ランドル・ドュプチュ』（法会）<br />2016年12月『困難な状況の中で思いやりを育む』（講説）by ドゥンセ・ジャンポール・ノルブ<br />2017年5月『究竟一乗宝性論』菩提（講説）、『リグジン・デュパ・ドュルプチュ』（法会）<br />2017年12月『修行者の誇り』（講説）by ドゥンセ・ジャンポール・ノルブ</p>`,
    bodyEn: `<h4>About Mangala Shri Bhuti Japan</h4>
<p>Mangala Shri Bhuti Japan (MSBJ) is a sangha — a community studying the Buddha's path together — following the Nyingma Longchen Nyingtik lineage under the guidance of Dzigar Kongtrul Rinpoche.</p>
<p>It was founded in April 2001, on Rinpoche's first visit to Japan, as the Japanese branch of <a href="http://www.mangalashribhuti.org">Mangala Shri Bhuti</a> in the United States. Since then Rinpoche has been welcomed to Japan every year for ongoing teachings based on traditional Buddhist texts.</p>
<p>So that the teachings do not end with listening, monthly study groups and zazen sessions help members practice in daily life and deepen understanding through personal experience.</p>
<p>On November 2, 2015, MSBJ incorporated as a general incorporated association (ippan shadan hojin) to strengthen its public role and carry its activities into the future.</p>
<h3>Corporate profile</h3>
<p>Name: Mangala Shri Bhuti Japan General Incorporated Association (MSBJ)<br />Purpose: promotion of Tibetan Buddhism in Japan<br />Special advisor: Dzigar Kongtrul Rinpoche (Mangala Shri Bhuti, USA)<br />Representative director: Okabayashi<br />Telephone: 075-200-7126<br />Founded: April 2001 as a voluntary association; incorporated November 2015</p>
<h3>History</h3>
<p>2001 — Founded in Kyoto as the Japanese branch of Mangala Shri Bhuti (USA).<br />April: "What is Tibetan Buddhism," "Simplicity Like a Gentle Breeze" (teachings). November: "The Essence of Buddhist Meditation."<br />2002 April: "The Four Immeasurables."<br />2003 April: "The Nature of Mind" (guidance).<br />2004 April: Bodhicharyavatara ch. 9 and Uttaratantra Shastra (oral transmission); Rigdzin Düpa and Dechen Gyalmo (empowerments).<br />2005 April: "Words of My Perfect Teacher"; Longchen Nyingtik ngöndro (transmission/guidance).<br />2006–2009: Bodhicharyavatara chapters 1–9 (teachings).<br />2010 May: Uttaratantra Shastra introduction; Izu branch opened.<br />2011–2015: Uttaratantra Shastra — Buddha, Dharma, and Sangha jewels; tathagatagarbha (teachings); Rigdzin Düpa and Dechen Gyalmo drupchös.<br />November 2015: incorporated as MSBJ.<br />2016 May: Uttaratantra Shastra (tathagatagarbha); Dukngal Rangdrol drupchö. December: "Cultivating Compassion in Difficult Circumstances" by Dungse Jampal Norbu.<br />2017 May: Uttaratantra Shastra (enlightenment); Rigdzin Düpa drupchö. December: "The Pride of a Practitioner" by Dungse Jampal Norbu.</p>`,
  },
  {
    slugJa: "teikan",
    slugEn: "articles-of-incorporation",
    titleJa: "定款",
    titleEn: "Articles of incorporation",
    excerptJa: "一般社団法人マンガラ・シュリ・ブティ・ジャパンの定款（全文）。",
    excerptEn:
      "The articles of incorporation of Mangala Shri Bhuti Japan (full text, in Japanese).",
    type: "ARTICLE",
    publishedAt: "2023-03-19",
    bodyJa: `<h3>第1章 総 則</h3>
<p>【名称】<br />第1条 当法人は、一般社団法人マンガラ・シュリ・ブティ・ジャパンと称し、英文ではMangala Shri Bhuti Japan General Incorporated Associationと表示する。</p>
<p>【主たる事務所】<br />第2条 当法人は、主たる事務所を京都府京都市左京区に置く。</p>
<p>【目的】<br />第3条 当法人は、チベット仏教ニンマ派ロンチェン・ニンティック系譜に属する米国非営利団体マンガラ・シュリ・ブティに保有されている有形無形の文化財の護持発展に寄与することを目的とする。前条の目的を達成するため、次の事業を行う。</p>
<ol><li>チベット仏教ニンマ派ロンチェン・ニンティック系譜に関する、修学、修行、奉仕を柱とする人材育成事業</li><li>日本におけるチベット仏教、および大乗・金剛乗仏教に関する教育研究推進事業</li></ol>
<p>前各号に附帯する一切の業務</p>
<p>【公告の方法】<br />第4条 当法人の公告は、当法人の主たる事務所の公衆の見やすい場所に掲示する方法により行う。</p>
<h3>第2章 社 員</h3>
<p>【入社】<br />第5条 この法人の会員は，次の3種とし、賛助会員を除く会員をもって一般社団法人及び一般財団法人に関する法律（以下「一般法人法」とする。）上の社員とする。</p>
<ol><li>特別会員　設立時に指定された者を除き、一般会員歴5年以上ならびに理事会の承認を得た者</li><li>一般会員　この法人の目的に賛同し、その護持運営のために支援および活動する者</li><li>賛助会員　この法人が実施する各種事業の目的に賛同し支援する者</li></ol>
<p>2 各会員となるには、当法人所定の様式による申込みをし、理事会の承認を得るものとする。</p>
<p>【会費等】<br />第6条 社員は、当法人の事業活動に経常的に生じる費用に充てるため、入会金及び会費として、社員総会において別に定める額を支払う義務を負う。賛助会員は、各事業年度において、社員総会において別に定める賛助金を一口以上支払う義務を負う。</p>
<p>【任意退社】<br />第7条 社員は、いつでも退社することができる。ただし、1か月以上前に当法人に対して予告をするものとする。</p>
<p>【除名】<br />第8条 当法人の社員が、当法人の名誉を毀損し、若しくは当法人の目的に反する行為をし、又は社員としての義務に違反するなど除名すべき正当な事由があるときは、「一般法人法」第49条第2項に定める社員総会の決議によりその社員を除名することができる。</p>
<p>【社員の資格喪失】<br />第9条 前2条の場合のほか、社員が次の各号のいずれかに該当する場合には、その資格を喪失する。</p>
<ol><li>第6条の支払義務を3年以上履行しなかったとき</li><li>社員総会の議決により承認されたとき</li><li>当該社員が死亡し、又は解散したとき</li></ol>
<h3>第3章 社員総会</h3>
<p>【開催】<br />第10条 定時社員総会は、毎事業年度終了後3ヵ月以内に開催し、臨時社員総会は必要がある場合に開催する。</p>
<p>【招集】<br />第11条 社員総会は、法令に別段の定めがある場合を除き、理事会の決議に基づき代表理事が招集する。<br />2 社員総会の招集通知は、会日より1週間前までに社員に対して発する。</p>
<p>【決議の方法】<br />第12条 社員総会の決議は、法令又はこの定款に別段の定めがある場合を除き、総社員の議決権の過半数を有する社員が出席し、出席した当該社員の議決権の過半数をもって行う。</p>
<p>【議決権】<br />第13条 特別会員は、各20個の議決権を有する。<br />2 一般会員は、各1個の議決権を有する。</p>
<p>【議長】<br />第14条 社員総会の議長は、代表理事がこれに当たる。</p>
<p>【議事録】<br />第15条 社員総会の議事については、法令の定めるところにより、議事録を作成し、議長及び出席した理事がこれに署名又は記名押印する。</p>
<h3>第4章 役 員</h3>
<p>【役員】<br />第16条 当法人に、次の役員を置く。</p>
<ol><li>理事 ３名以上9名以内</li><li>監事 １名以上3名以内</li></ol>
<p>2 理事のうち１名を代表理事とする。</p>
<p>【選任】<br />第17条 理事及び監事は、社員総会の決議によって社員の中から選任する。<br />2 代表理事は、理事の互選によって定める。</p>
<p>【任期】<br />第18条 理事の任期は、選任後2年以内に終了する事業年度のうち最終のものに関する定時社員総会の終結の時までとする。<br />2 監事の任期は、選任後2年以内に終了する事業年度のうち最終のものに関する定時社員総会の終結の時までとする。<br />3 任期の満了前に退任した理事又は監事の補欠として選任された理事又監事の任期は、前任者の任期の満了する時までとする。<br />4 理事又は監事は，第16条に定める定数に足りなくなるときは，任期の満了又は辞任により退任した後も、新たに選任された者が就任するまで、なお理事又は監事としての権利義務を有する。</p>
<p>【職務及び権限】<br />第19条 理事は、法令及びこの定款の定めるところにより、その職務を執行する。<br />2 代表理事は、当法人を代表し、その業務を統括する。<br />3 監事は、理事の職務の執行を監査し、法令の定めるところにより、監査報告を作成する。<br />4 監事は、いつでも、理事及び使用人に対して事業の報告を求め、当法人の業務及び財産の状況の調査をすることができる。</p>
<p>【解任】<br />第20条 理事又は監事は、社員総会の決議によって解任することができる。</p>
<p>【報酬等】<br />第21条 理事及び監事に対して，その職務執行の対価として，社員総会において別に定める報酬等の支給の基準に従って算定した額を，社員総会の決議を経て，報酬等として支給することができる。</p>
<h3>第5章 理事会</h3>
<p>【構成】<br />第22条 この法人に理事会を置く。<br />2 理事会は、すべての理事をもって構成する。</p>
<p>【権限】<br />第23条 理事会は、次の職務を行う。</p>
<ol><li>この法人の業務執行の決定</li><li>理事の職務の執行の監督</li><li>代表理事の選定及び解職</li></ol>
<p>2 代表理事は、当法人を代表し、その業務を統括する。</p>
<p>【招集】<br />第24条 理事会は、代表理事が招集する。<br />2 代表理事が欠けたとき又は代表理事に事故があるときは、各理事が理事会を招集する。</p>
<p>【決議】<br />第25条 理事会の決議は、決議について特別の利害関係を有する理事を除く理事の過半数が出席し、その過半数をもって行う。<br />2 前項の規定にかかわらず、一般法人法第96条の要件を満たしたときは、理事会の決議があったものとみなす。</p>
<p>【議事録】<br />第26条 理事会の議事については、法令で定めるところにより、議事録を作成する。<br />2 出席した理事及び監事は、前項の議事録に署名又は記名押印する。</p>
<h3>第6章 資産および会計</h3>
<p>【事業年度】<br />第27条 当法人の事業年度は、毎年6月1日から翌年5月31日までの年1期とする。</p>
<p>【事業報告及び決算】<br />第28条 当法人の事業報告及び決算については、毎事業年度終了後，代表理事が次の書類を作成し，監事の監査を受けた上で、理事会の承認を経て、定時社員総会に提出し、第1号の書類についてはその内容を報告し、第2号及び第3号の書類については承認を受けなければならない。</p>
<ol><li>事業報告</li><li>貸借対照表</li><li>損益計算書（正味財産増減計算書）</li></ol>
<p>2　前項の規定により報告され、又は承認を受けた書類のほか、監査報告を主たる事務所に5年間備え置くとともに、定款及び社員名簿を主たる事務所に備え置くものとする。</p>
<h3>第7章 定款の変更及び解散</h3>
<p>【定款の変更】<br />第29条　この定款は，社員総会の決議によって変更することができる。</p>
<p>【解散】<br />第30条　この法人は，社員総会の決議その他法令で定められた事由により解散する。</p>
<p>【剰余金の分配の禁止】<br />第31条　この法人は，剰余金の分配を行わない。</p>
<p>【残余財産の帰属】<br />第32条　この法人が清算をする場合において有する残余財産は、社員総会の決議を経て、公益社団法人及び公益財団法人の認定等に関する法律第5条第17号に掲げる法人又は国若しくは地方公共団体に贈与するものとする。</p>`,
    bodyEn: `<p>The articles of incorporation of Mangala Shri Bhuti Japan General Incorporated Association are maintained in Japanese. Below is a summary of the key provisions; the authoritative full text is available on the Japanese page.</p>
<h3>Summary</h3>
<p><strong>Name and office</strong> — The corporation is named Mangala Shri Bhuti Japan General Incorporated Association, with its principal office in Sakyo-ku, Kyoto.</p>
<p><strong>Purpose</strong> — To contribute to preserving and developing the tangible and intangible cultural heritage held by Mangala Shri Bhuti (USA), a nonprofit belonging to the Longchen Nyingtik lineage of the Nyingma school of Tibetan Buddhism, through: (1) personnel development centered on study, practice, and service in that lineage; and (2) promotion of education and research on Tibetan, Mahayana, and Vajrayana Buddhism in Japan.</p>
<p><strong>Membership</strong> — Three classes: special members, regular members, and supporting members, admitted on application with board approval.</p>
<p><strong>Governance</strong> — A general assembly of members meets annually; the corporation has 3–9 directors (one representative director) and 1–3 auditors, elected by the general assembly for two-year terms; a board of directors decides the execution of business.</p>
<p><strong>Accounting</strong> — The fiscal year runs from June 1 to May 31. Distribution of surplus is prohibited; on dissolution, residual assets are donated to a public-interest corporation or to national or local government.</p>`,
  },
  {
    slugJa: "keifu",
    slugEn: "lineage",
    titleJa: "系譜",
    titleEn: "Lineage",
    excerptJa:
      "ズィガー・コントゥル・リンポチェ、ディルゴ・ケンツェ・リンポチェ、ドゥンセ・ジャンポール・ノルブ、そしてロンチェン・ニンティック系譜と仏教について。",
    excerptEn:
      "Dzigar Kongtrul Rinpoche, Dilgo Khyentse Rinpoche, Dungse Jampal Norbu, the Longchen Nyingtik lineage, and an introduction to Buddhism.",
    type: "ARTICLE",
    imageUrl: "/images/legacy/113185942.webp",
    teacherSlug: "dzigar-kongtrul-rinpoche",
    publishedAt: "2023-03-19",
    bodyJa: `<h2>現代における精神の道</h2>
<p>人生には、ときおり初対面でも心に深い印象を残す人がいます。おそらく、そのとき心打たれるのは、その人の醸し出す無私の力強さや、溢れる自信、目の奥に輝く智慧の光、身体からにじみ出る暖かさではないでしょうか。そのような人と出会うことで、私たちの知性や好奇心は刺激され、「ただ平凡に生きるこの人生の本当の意味とは何だろう？」という探求心が芽生えることがあります。ズィガー・コントゥル・リンポチェは、そのような人物のひとりです。</p>
<p>今の時代、智慧を連綿と受け継ぐ法脈に出会うことは稀です。そのような中、ズィガー・コントゥル・リンポチェは、チベット仏教ニンマ派の正当な法脈を伝承しています。インドの地で高僧の父と熱心な修行者の母のもとに生まれたコントゥル・リンポチェは、幼い頃に化身ラマ（トゥルク）として認定され、僧院で伝統的な仏教の教えを修習しました。青年期には、各地の導師から教えを授かるために、一人、生活に必要なわずかな荷物を背負い、路傍の廃屋を寝床としながら、インド国内を旅します。後に、現在の妻エリザベスと出会い、結婚。これがアメリカに移り住むきっかけとなりました。現在、コントゥル・リンポチェはアメリカを中心に、精神性の遺産を現代文化の糸で編み込みながら、彼が「生涯を賭けた仕事」と呼ぶ、仏法の真正な智慧を関心のある人に伝えるという仕事に従事しています。</p>
<p>コントゥル・リンポチェは、「現代社会における精神の道とは、精神修行と日常生活を融合させることにある」と述べています。修行と日常を融合するとは、心の本性を離れることなく、人生の喜びや困難など、あらゆる体験に、柔軟かつ勇敢に、そして探求心を持って取り組むことを意味します。</p>
<h2>ズィガー・コントゥル・リンポチェ</h2>
<p>ズィガー・コントゥル・リンポチェは1964年、北インドのヒマチェル・プラデッシュ州でチベット人の両親のもとに生まれる。幼少時にジャムグン・コントゥル・ロドゥ・タイェの化身（トゥルク）として認定され、その後、僧院で仏教教義全般を修習、とりわけ、ニンマ派の教え、特にロンチェン・ニンティクの教えを彼の根本ラマ（導師）、ディルゴ・ケンツェ・リンポチェから伝授される。また、トゥルク・ウジェン・リンポチェやニョシュル・ケン・リンポチェ、高僧ケンポ・リンチェンの下でも、広範に仏法を学ぶ。</p>
<p>1989年、妻子と共に米国に移住、1990年からコロラド州ボールダーのナロパ大学で仏教哲学の教師として5年間教壇に立つ。この時期に、ケンツェ・リンポチェのサンスクリット名を冠したマンガラ・シュリ・ブティ・サンガを設立。マンガラ・シュリ・ブティは現在、世界7カ国の14カ所センターに240人の生徒を擁し、ニンマ派ロンチェン・ニンティク法脈の智慧の伝承と修行を目的として活動している。コントゥル・リンポチェは、米国コロラド州を中心に、北米、南米、欧州、アジアなど、世界各地で精力的に仏法を説いている。</p>
<p>リンポチェの法話は世界各地で、仏教を概念だけの理解に留めず、困難な状況でどのように心に取り組めばよいかを、論理的かつ現代に即した比喩を用いて分かりやすく解説することで知られている。また、精神性の教えが表面的なものにならないように、伝統的な仏教古典を学ぶことも重視されており、日本を含め世界各地でシェダと呼ばれる伝統的な仏教学習プログラムを実施している。最近では、「現代における菩薩（MDB、Modern Day's Bodhisattva）」という理念を提唱し、日々の生活の中で各自が心に取り組み、自己愛着を減らし、利他心を強めることで、自らが灯火となり、少しずつ周りの家族や仕事場から、その灯火を他者に灯していく草の根的な菩薩の活動の重要性を説いている。</p>
<p>生徒の一人、ペマ・チョドロンは米国で多数の仏教書を執筆しているベストセラー作家で、彼女は現在、リンポチェの指導を受けながら、彼のコロラドのリトリートセンターでリトリートを行っている。またリンポチェの妻で修行者でもあるエリザベス・マチス・ナムギャルは、『The Power of an Open Question』の著者でもある。</p>
<p>リンポチェは抽象画家でもあり、アートにおけるクリエイティブティのプロセスを瞑想修行と重ね合わせ、ニューヨークや欧州でアートの側面からも仏教（ナチュラル・バイタリティ）を説いている。</p>
<h2>ディルゴ・ケンツェ・リンポチェ</h2>
<p>コントゥル・リンポチェの精神の父で根本ラマ※であるディルゴ・ケンツェ・リンポチェは、リメ（チベット仏教の超宗派）運動の偉大な指導者であるジャムヤン・ケンツェ・ワンポの化身でした。ディルゴ・ケンツェ・リンポチェの学識、理解、不断の慈愛、そして威厳ある風貌は、いまだ多くの人々の心に鮮明に記憶されています。コントゥル・リンポチェのサンガ「マンガラ・シュリ・ブティ」は、ケンツェ・リンポチェのサンスクリット名を冠しています。</p>
<p>※根本ラマ：弟子に心の本性を伝達してくれる導師</p>
<h4>弟子としてのコントゥル・リンポチェ</h4>
<p>「私自身も、我が師ディルゴ・ケンツェ・リンポチェにお会いするときはいつも、彼の落ち着きと、明晰さ、広大さから、自分の利己心が浮き彫りにされるような感覚を覚えました。私の話がどれだけ重要に思えたとしても、彼の前に行くと、いつも自分の自己中心的な心が見透かされているような気になったものです。これは、師弟間で交わされる無言のコミュニケーションであり、私が師から学んだ方便の一つでもあります。</p>
<p>この種のやりとりは、師と別の人の間でも交わされていました。あるときなど、完全に心を取り乱し、ほとんど錯乱状態になった人が、彼の存在に触れるだけで、すぐさま落ち着きを取り戻していました。これが、「師を鏡とする」ということの意味するところです。師によって、私たちは行き詰まった心についての気づきや理解を得られるだけでなく、心の本来の健全さも教えられます。これこそが、師弟関係を築く最大の目的であると言えるでしょう。」</p>
<p>－『It's Up to You: The Practice of Self-Reflection on the Buddhist Path』（ズィガー・コントゥル・リンポチェ著、Shambhala Publications: 2005）からの引用</p>
<h2>ドゥンセ・ジャンポール・ノルブ</h2>
<p>ズィガー・コントゥル・リンポチェのご子息であり米国MSBの後継者であるドゥンセ・ジャンポール・ノルブ氏（ドゥンセラ）は、近年でこそアジアを訪れることが多いものの、その人生のほとんどを米国コロラドで過ごしています。「いつから仏教を学んでいるのか」と問われれば、彼はおそらく「生まれてすぐ」と答えるでしょう。父コントゥル・リンポチェから様々な教えや伝授を、昼夜問わず―ときにはクレストンの山々を散歩しながら―授かっているからです。</p>
<p>コントゥル・リンポチェはまだドゥンセラが幼少のころ、根本ラマであるキャブジェ・ディルゴ・ケンツェ・リンポチェより、ドゥンセラを系譜の継承者として育てるよう指示を受けました。ドゥンセラはその後、インドや米国におけるシェダ（伝統的な学習課程）など、コントゥル・リンポチェより様々な導きを受け、現在は、コロラド州にあるリトリートセンター『ロンチェン・ジグメ・サムテン・リン』にて毎年百日間のリトリートを行いながら、世界各地にて法話を説いています。彼のテーマは「仏教の教えがいかに日常生活に役立つのか」であり、説く内容は個人的な体験に根ざしたものです。彼の法話はまったく新しい視点をもたらし、智慧とユーモアに満ち溢れています。</p>
<p>キャブジェ・ディルゴ・ケンツェ・リンポチェは涅槃に入る三週間前、ドゥンセラの将来について記した手紙をコントゥル・リンポチェに手渡しました。コントゥル・リンポチェは次のように述べています。「この手紙は、私が根本ラマであるケンツェ・リンポチェに最後にお会いしたときに頂いたものである。私と妻のエリザベスは、その時以来、この師の最後の言葉を心に留め、ジャンポールとも話し合いながら、その助言の実現に努めてきた。」</p>
<h2>ロンチェン・ニンティック系譜</h2>
<p>ロンチェン･ニンティクは、18世紀の埋蔵経発掘者（テルトン）、持明者ジグメ・リンパにより発見された埋蔵経（テルマ）に依拠する法脈です。ジグメ･リンパは、サダナ（成就法）、教説、真髄の秘訣からなるこれらの埋蔵経を、グル・パドマサンバヴァ、ダキーニ・イェシェ・ツォギャル、一切智者ロンチェン・ラブジャム、その他の数多くの導師のビジョンから直接授かりました。ジグメ･リンパは、8世紀のチベットの法王ティソン・デツェンの化身で、そのティソン王は、チベットに仏法を堅固に根付かせるべく、グル・パドマサンバヴァをチベットに招来し、チベットで最初の僧院となるサムイェを建立させた人物です。</p>
<p>ロンチェン･ニンティクの体系は、ニンティク、またはアティ･ヨーガの最深の教え「ゾクチェン（大いなる完成）」の名で知られます。ロンチェン･ニンティクの教えが初めてこの地上にもたらされたのは、ジグメ･リンパがサムイェ近郊の洞窟、サムイェ・チンプで3年間のリトリート（隠遁修行）を行っているときのことでした。彼は、14世紀のアティ･ヨーガ導師、一切智者ロンチェン・ラブジャムに向けられた一点の献身により、3度、ロンチェンパの智法身のビジョンに出会います。この体験を通じて、水が器から別の器に注がれるように、ロンチェンパの教えとアティ・ヨーガの悟り「ゾクチェン」の一切がジグメ・リンパの心に伝授されました。</p>
<p>導師（ラマ）への揺るぎない献身を、勝義諦を了解する最も重要な手段と位置づけるこれらの教えは、今日においても、深甚なるロンチェン・ニンティク体系の心髄となっています。ロンチェン･ニンティクは現在、現存する数多くのニンマ派の法脈の中でも最も幅広く実践されている伝統のひとつであり、その深甚かつ本質的な点から、チベット仏教四派の多くの導師や僧院によって実践されています。</p>
<h2>仏教について</h2>
<p>仏教は、約2500年前（紀元前5世紀）、インドの王子、ゴータマ・シッダールタがガヤの菩提樹の下で悟りを開き、その後サルナートの鹿野苑で、自らの体験に基づき、ごくシンプルな教えを説いたのが始まりとされています。彼の悟りは深甚であったため、彼は「目覚めた者」、ブッダとして知られるようになりました。ブッダの教えは、物事の真理を意味する「仏法」と呼ばれ、日々の体験や心に直接取り組むことで苦しみを離れる、極めて実践的な方法を説き明かしています。</p>
<p>ブッダは特性や目的の異なる人々に対し様々な教えを説きましたが、それらは一般的に3つに区分されます。</p>
<p>上座部仏教：ブッダの根本的な教えで、個人の解脱を目指す乗り物（小乗とも呼ばれる）</p>
<p>大乗仏教：生きとし生けるものへの慈悲と、物事の究極の本性を分析、理解することを重視する、生きとし生けるものの覚りを目指す乗り物</p>
<p>金剛乗（密教）：目的は大乗と同じだが、そこにすみやかに行き着くための様々な方便を有する乗り物</p>
<h4>チベット仏教</h4>
<p>チベット仏教は、これら3つの乗り物を包括的に取り入れ、この三乗を仏教の実践と教学の段階的な道と捉えている点が特徴的です。チベットに仏教が初めてもたらされたのは7世紀のこと。ティソン・デツェン王の代には仏教が国教と定められ、インドからナーランダー大僧院の長老シャーンタラクシタとパドマサンバヴァを招聘し、大僧院サムイェー寺を建設、顕密の仏典がチベット語に翻訳されました。現在大きく分けて、ニンマ派、カギュ派、ゲルク派、サキャ派の4宗派が存在します。</p>
<h4>ニンマ派</h4>
<p>ニンマ派は、パドマサンバヴァ（グル・リンポチェ）を宗祖とし、タントラと埋蔵教典（テルマ）に依拠する宗派で、「ゾクチェン」（ゾクパ・チェンポ、大いなる完成）を最奥義とします。ニンマ派の中にも、カンドゥ・ニンティクやビィマ・ニンティク、ロンチェン・ニンティクなどいくつかの系譜が存在します。</p>`,
    bodyEn: `<h2>A spiritual path for the modern age</h2>
<p>Sometimes in life we meet a person who leaves a deep impression even at first meeting. What strikes us is perhaps their selfless strength, their overflowing confidence, the light of wisdom shining in their eyes, or the warmth radiating from their presence. Meeting such a person stirs our intelligence and curiosity, and a question may take root: what is the true meaning of this ordinary life? Dzigar Kongtrul Rinpoche is such a person.</p>
<p>It is rare in this age to encounter a lineage in which wisdom has been passed down unbroken. Dzigar Kongtrul Rinpoche transmits an authentic lineage of the Nyingma school of Tibetan Buddhism. Born in India to a father who was a high lama and a mother who was a devoted practitioner, he was recognized in childhood as an incarnate lama (tulku) and trained in the traditional teachings in a monastery. As a young man he traveled across India alone to receive teachings from masters, carrying only the barest necessities and sleeping in abandoned roadside huts. He later met and married his wife Elizabeth, which brought him to America. Today, weaving the heritage of spirituality with the threads of modern culture, Kongtrul Rinpoche is engaged in what he calls his life's work: conveying the authentic wisdom of the Dharma to those who seek it.</p>
<p>"The spiritual path in modern society," Rinpoche says, "lies in merging spiritual practice with everyday life" — engaging every experience, joys and difficulties alike, with flexibility, courage, and curiosity, without ever leaving the nature of mind.</p>
<h2>Dzigar Kongtrul Rinpoche</h2>
<p>Dzigar Kongtrul Rinpoche was born in 1964 in Himachal Pradesh, northern India, to Tibetan parents. Recognized in childhood as the incarnation of Jamgön Kongtrul Lodrö Thayé, he studied the full range of Buddhist doctrine in a monastic setting and received the Nyingma teachings — especially the Longchen Nyingtik — from his root lama, Dilgo Khyentse Rinpoche. He also studied extensively under Tulku Urgyen Rinpoche, Nyoshul Khen Rinpoche, and the learned Khenpo Rinchen.</p>
<p>In 1989 he moved to the United States with his family, and from 1990 taught Buddhist philosophy for five years at Naropa University in Boulder, Colorado. During this period he founded the Mangala Shri Bhuti sangha, named for Khyentse Rinpoche's Sanskrit name. Mangala Shri Bhuti now has some 240 students at fourteen centres in seven countries, dedicated to transmitting and practicing the wisdom of the Longchen Nyingtik lineage. Rinpoche teaches energetically across North and South America, Europe, and Asia.</p>
<p>His teaching is known worldwide for going beyond conceptual understanding — explaining logically, with contemporary analogies, how to work with the mind in difficult circumstances. So that spiritual teaching does not become superficial, he also emphasizes study of the traditional Buddhist classics, conducting shedra programs of traditional Buddhist study in Japan and around the world. More recently he has proposed the ideal of the Modern Day's Bodhisattva (MDB): by working with one's own mind in daily life, reducing self-attachment and strengthening altruism, each person becomes a lamp, gradually kindling that light in family, workplace, and beyond — a grassroots bodhisattva activity.</p>
<p>Among his students, Pema Chödrön, the bestselling author of many Buddhist books in America, currently practices retreat at his Colorado retreat centre under his guidance. His wife, the practitioner Elizabeth Mattis Namgyel, is the author of The Power of an Open Question.</p>
<p>Rinpoche is also an abstract painter; likening the creative process in art to meditation practice, he teaches Buddhism through art (Natural Vitality) in New York and Europe.</p>
<h2>Dilgo Khyentse Rinpoche</h2>
<p>Dilgo Khyentse Rinpoche, Kongtrul Rinpoche's spiritual father and root lama*, was the incarnation of Jamyang Khyentse Wangpo, the great leader of the Rimé (non-sectarian) movement of Tibetan Buddhism. His learning, understanding, unceasing loving-kindness, and dignified presence remain vividly remembered by many. Kongtrul Rinpoche's sangha, Mangala Shri Bhuti, bears Khyentse Rinpoche's Sanskrit name.</p>
<p>*Root lama: the master who transmits the nature of mind to the student.</p>
<h4>Kongtrul Rinpoche as a student</h4>
<p>"Whenever I met my teacher Dilgo Khyentse Rinpoche, his calm, clarity, and vastness seemed to throw my own self-centeredness into relief. However important my concerns seemed, in his presence I always felt my egocentric mind was seen through. This was the wordless communication between teacher and student, and one of the skillful means I learned from my teacher.</p>
<p>This kind of exchange happened with others as well. Once, a person in complete distress, nearly deranged, regained composure simply through contact with his presence. This is what it means to 'use the teacher as a mirror.' Through the teacher we gain awareness and understanding of our stuck mind, and we are also shown the mind's inherent sanity. This, one could say, is the greatest purpose of the teacher-student relationship."</p>
<p>— from It's Up to You: The Practice of Self-Reflection on the Buddhist Path (Dzigar Kongtrul, Shambhala Publications, 2005)</p>
<h2>Dungse Jampal Norbu</h2>
<p>Dungse Jampal Norbu (Dungse-la), son of Dzigar Kongtrul Rinpoche and his successor at MSB in the United States, has spent most of his life in Colorado, though in recent years he often visits Asia. Asked how long he has studied Buddhism, he would likely answer "since birth" — receiving teachings and transmissions from his father day and night, sometimes while walking the mountains of Crestone.</p>
<p>When Dungse-la was still a child, Kyabje Dilgo Khyentse Rinpoche instructed Kongtrul Rinpoche to raise him as a holder of the lineage. He has since received guidance from his father, including traditional shedra study in India and the United States. He now spends a hundred days each year in retreat at Longchen Jigme Samten Ling in Colorado while teaching around the world. His theme is how the Buddhist teachings serve daily life, grounded in personal experience; his talks bring an entirely fresh perspective, full of wisdom and humor.</p>
<p>Three weeks before entering parinirvana, Kyabje Dilgo Khyentse Rinpoche handed Kongtrul Rinpoche a letter about Dungse-la's future. Kongtrul Rinpoche says: "I received this letter at my last meeting with my root lama. Since that time, my wife Elizabeth and I have kept these final words in our hearts and, in conversation with Jampal, have worked to fulfill their counsel."</p>
<h2>The Longchen Nyingtik lineage</h2>
<p>The Longchen Nyingtik is a lineage based on the treasure teachings (terma) revealed by the eighteenth-century treasure revealer (tertön), the vidyadhara Jigme Lingpa. He received these treasures — sadhanas, teachings, and pith instructions — directly from visions of Guru Padmasambhava, the dakini Yeshe Tsogyal, the omniscient Longchen Rabjam, and many other masters. Jigme Lingpa was the incarnation of the eighth-century Tibetan Dharma king Trisong Detsen, who invited Guru Padmasambhava to Tibet and had Samye, Tibet's first monastery, built to firmly root the Dharma there.</p>
<p>The Longchen Nyingtik system is known as Nyingtik, the deepest teaching of Ati Yoga — Dzogchen, the Great Perfection. The teachings first came into the world while Jigme Lingpa was in three-year retreat in the cave of Samye Chimphu. Through one-pointed devotion to the fourteenth-century Ati Yoga master Longchen Rabjam, he met the wisdom-body of Longchenpa in vision three times, and through this experience the entirety of Longchenpa's teaching and the realization of Dzogchen was transmitted to his mind, like water poured from one vessel into another.</p>
<p>These teachings, which place unwavering devotion to the lama as the most important means of realizing ultimate truth, remain the heart of the profound Longchen Nyingtik system today. It is now one of the most widely practiced of the many living Nyingma lineages, practiced by masters and monasteries of all four schools of Tibetan Buddhism for its depth and essentiality.</p>
<h2>About Buddhism</h2>
<p>Buddhism began about 2,500 years ago (5th century BCE) when the Indian prince Gautama Siddhartha attained awakening under the bodhi tree at Gaya and then taught, very simply and from his own experience, at the Deer Park of Sarnath. Because his awakening was profound, he became known as the Buddha, "the awakened one." His teaching, the Dharma — the truth of things — sets out an eminently practical way of leaving suffering behind by working directly with daily experience and the mind.</p>
<p>The Buddha gave many teachings for people of different capacities and aims. They are generally divided into three:</p>
<p>Theravada: the Buddha's foundational teachings, the vehicle aiming at individual liberation.</p>
<p>Mahayana: the vehicle aiming at the awakening of all beings, emphasizing compassion for all and the analysis and understanding of the ultimate nature of things.</p>
<p>Vajrayana (tantra): sharing the Mahayana's aim, but possessing many skillful means for reaching it swiftly.</p>
<h4>Tibetan Buddhism</h4>
<p>Tibetan Buddhism is distinctive in embracing all three vehicles as a graduated path of practice and study. Buddhism first reached Tibet in the seventh century; under King Trisong Detsen it became the state religion, the elder Shantarakshita of Nalanda and Padmasambhava were invited from India, the great monastery of Samye was built, and the sutras and tantras were translated into Tibetan. Today there are four main schools: Nyingma, Kagyu, Gelug, and Sakya.</p>
<h4>The Nyingma school</h4>
<p>The Nyingma school, founded on Padmasambhava (Guru Rinpoche), relies on the tantras and the treasure scriptures (terma), with Dzogchen — the Great Perfection — as its innermost teaching. Within the Nyingma school are several lineages, including the Khandro Nyingtik, Vima Nyingtik, and Longchen Nyingtik.</p>`,
  },
  {
    slugJa: "msbj-link",
    slugEn: "msbj-link-en",
    titleJa: "MSBJリンク",
    titleEn: "MSBJ Link",
    excerptJa:
      "リンポチェの短編法話集。『パーソナルリンク』の要約を邦訳したものです。",
    excerptEn:
      "Short dharma talks by Rinpoche — Japanese translations of summaries from the Personal Link program.",
    type: "TEACHING",
    imageUrl: "/images/legacy/113185947.webp",
    teacherSlug: "dzigar-kongtrul-rinpoche",
    publishedAt: "2023-03-19",
    bodyJa: `<p>『MSBJリンク』は、1996年から2000年にかけてリンポチェの法話を週一回、電話を介して配信していたプログラム、『パーソナルリンク』の要約を邦訳したものです。『パーソナルリンク』は、リンポチェの法話をライブ配信することで、忙しい生活の中でも仏法に触れる機会を提供する目的で行われていました。現在は、『Link』と名を変え、週1回（英語）ポッドキャストで配信しています。</p>`,
    bodyEn: `<p>MSBJ Link is a collection of Japanese translations of summaries from Personal Link, a program that broadcast Rinpoche's dharma talks weekly by telephone from 1996 to 2000. Personal Link offered a chance to connect with the Dharma amid busy lives through live talks. Today it continues as Link, a weekly podcast in English.</p>`,
  },
  {
    slugJa: "dharma-article",
    slugEn: "dharma-articles",
    titleJa: "ダルマ・アーティクル",
    titleEn: "Dharma articles",
    excerptJa:
      "ズィガー・コントゥル・リンポチェの法話や、最近のMSBJの活動に関する記事。",
    excerptEn:
      "Articles on Dzigar Kongtrul Rinpoche's teachings and recent MSBJ activities.",
    type: "TEACHING",
    imageUrl: "/images/legacy/113185974.webp",
    teacherSlug: "dzigar-kongtrul-rinpoche",
    publishedAt: "2023-03-19",
    bodyJa: `<p>ズィガー・コントゥル・リンポチェの法話や、最近のMSBJの活動に関する記事を掲載します。</p>
<p>これまでのダルマ・アーティクルには、『幸せの原理：「自我の権威」に立ち向かう』『「正直である」という道：世界と自分自身を欺かない』『優雅さと気品』（Part 1・2）『動揺する心に取り組む、Part 3: 真の強さを認識する』などがあります。</p>`,
    bodyEn: `<p>This section carries articles on Dzigar Kongtrul Rinpoche's dharma talks and recent MSBJ activities.</p>
<p>Past dharma articles include "The Principle of Happiness: Confronting the Authority of Ego," "The Path of Honesty: Deceiving Neither the World Nor Yourself," "Grace and Dignity" (Parts 1 and 2), and "Working with an Agitated Mind, Part 3: Recognizing True Strength."</p>`,
  },
  {
    slugJa: "video-howa",
    slugEn: "video-teachings",
    titleJa: "ビデオ法話",
    titleEn: "Video teachings",
    excerptJa: "日本語キャプション付きのリンポチェのビデオ法話。",
    excerptEn: "Video dharma talks by Rinpoche with Japanese captions.",
    type: "VIDEO",
    imageUrl: "/images/legacy/113185976.webp",
    teacherSlug: "dzigar-kongtrul-rinpoche",
    publishedAt: "2023-03-19",
    bodyJa: `<p>リンポチェのビデオ法話（日本語キャプションあり）です。</p>
<h4>『現代のヨーギ』（2010年8月）</h4>
<h4>『進路を示す菩提心』（2011年9月）</h4>
<h4>『精神の道の歩みを遅らせる罪悪感』（2019年1月再投稿）</h4>
<h4>『概念の覆いを取り除く』（2019年1月再投稿）</h4>`,
    bodyEn: `<p>Video dharma talks by Rinpoche, with Japanese captions.</p>
<h4>"The Modern Yogi" (August 2010)</h4>
<h4>"Bodhicitta That Shows the Way" (September 2011)</h4>
<h4>"Guilt That Slows the Spiritual Path" (reposted January 2019)</h4>
<h4>"Removing the Veil of Concepts" (reposted January 2019)</h4>`,
  },
  {
    slugJa: "sonota-no-howa",
    slugEn: "other-teachings",
    titleJa: "その他の法話",
    titleEn: "Other teachings",
    excerptJa: "＃１《迷乱を超える》 — MSBJリンクからの法話要約。",
    excerptEn: "#1 Going Beyond Confusion — a talk summary from MSBJ Link.",
    type: "TEACHING",
    imageUrl: "/images/legacy/113185978.webp",
    teacherSlug: "dzigar-kongtrul-rinpoche",
    publishedAt: "2023-03-19",
    bodyJa: `<h4>＃１《迷乱を超える》</h4>
<p>私たちは、この末法の世で、過去の行い（カルマ、業）の果に絶えず翻弄され、激しい苦痛を体験している。そこで、唯一信頼の置ける拠り所は至高の三宝（仏法僧）だ。教えを聞くだけでは十分でなく、まずは自らのどうにもならない状況を認め、教えを自分の体験に根差して心から理解する必要がある。</p>
<p>特に「一切の事物は心の投影である」と理解することが重要だ。「自らが投影している」という理解がなければ、心の投影を真に存在すると思い込み、ただ苦痛を甘受するだけとなる。生きとし生けるものは、今生で浮き沈みを繰り返しているが、すべては自らのカルマによるものである。心の投影である現象世界を力ずくでコントロールしようとせず、またはあきらめて、その力に屈するでもなく、事物を実体視する罠に陥る傾向から抜け出す方法を見つければならない。心の本性に目を向けるのだ。誰も行為の果を免れることはできない。しかし、心で実際に何が起きているのかを正しく観察できれるようになれば、自ら投影する像に執着したり、脅かされる習慣を超えて、事物の真のあり様、すなわち「死を含む、あらゆる人生の体験は幻のような戯れにすぎない」と理解していくことができる。</p>
<p>輪廻を生きる有情や輪廻そのものを拠り所とせず、一度でも、決して裏切らぬ三宝という拠り所に心を向けることができたなら、自分の知識や概念を越えて三宝が心の滋養と平穏をもたらしてくれることが分かるだろう。瞑想修業を通じて、一刻も早くこの境地に達し、それを堅固なものにしなければならない。</p>`,
    bodyEn: `<h4>#1 Going Beyond Confusion</h4>
<p>In this degenerate age we are constantly tossed about by the results of our past actions (karma), experiencing intense suffering. The only trustworthy refuge is the supreme Three Jewels — Buddha, Dharma, and Sangha. Hearing the teachings is not enough: we must first acknowledge our own helpless situation and come to understand the teachings from the heart, grounded in our own experience.</p>
<p>It is especially important to understand that all things are projections of mind. Without the understanding that "I am the one projecting," we take the mind's projections to truly exist and simply endure the pain. All beings rise and fall through this life, and all of it is due to their own karma. Rather than trying to control the phenomenal world — a projection of mind — by force, or giving up and submitting to its power, we must find a way out of the tendency to fall into the trap of reifying things. Turn toward the nature of mind. No one escapes the results of action; but if we learn to observe correctly what is actually happening in the mind, we can go beyond the habit of clinging to or being threatened by our own projections, and come to understand the true way of things: that every experience of life, including death, is nothing but an illusion-like play.</p>
<p>If even once we can turn the mind toward the refuge that never betrays — the Three Jewels — rather than relying on beings within samsara or on samsara itself, we will find that beyond our knowledge and concepts the Three Jewels bring nourishment and peace to the mind. Through meditation practice we must reach this state as quickly as possible and make it firm.</p>`,
  },
  {
    slugJa: "nenji-howa-2023",
    slugEn: "annual-teaching-2023",
    titleJa: "2023年年次法話：『究竟一乗宝性論』利益の章",
    titleEn:
      "2023 annual teaching: the Benefit chapter of the Uttaratantra Shastra",
    excerptJa:
      "ズィガー・コントゥル・リンポチェによる年次法話。2023年5月13日・14日、京都タシ・ガチルにて。",
    excerptEn:
      "Dzigar Kongtrul Rinpoche's annual teaching, May 13–14, 2023 at Tashi Gachil, Kyoto.",
    type: "TEACHING",
    imageUrl: "/images/legacy/113186020.webp",
    teacherSlug: "dzigar-kongtrul-rinpoche",
    publishedAt: "2023-03-19",
    bodyJa: `<h4>ズィガー・コントゥル・リンポチェ年次法話</h4>
<p>ズィガー・コントゥル・リンポチェは、毎年、伝統的な仏典を題材にした法話を開催しています。伝統的な教えに基づく、深甚で広大な学習は、道のはじめから目的地に至るまでの地図を明らかにし、心の本性の理解を深めていく大きな支えとなります。仏法の学習と修行は、互いに補完しあうもので、継続して学び、実践する中で、少しずつまるで曇り空に光が差し込むように、これまで不明だった点が明らかとなり、心の本性への確信を揺るぎないものにしていくことができます。</p>
<p>今年の題材、如来蔵（仏性）の教えである『究竟一乗宝性論』は、ブッダが説いた三つの教えのうち、第三法輪に属します。第二法輪において空性が説かれたのに対し、第三法輪では主に光明の側面が説かれます。『究竟一乗宝性論』は大乗と金剛乗の橋渡しをする教えとも言われています。</p>
<p>リンポチェによる『究竟一乗宝性論』の今年の法話では、最後の章の「利益」を解説されます。</p>
<p>様々な仏教用語を交えながら、法話は進められますが、リンポチェの法話スタイルは、単に学問的な知識を高めるためではなく、教えをいかに日常に取り入れるかの視点で、現代の状況に合わせて、わかりやすく説かれます。そのため、初めての方でも様々な形でインスピレーションを得られると思います。ご興味がある方は、ぜひご参加ください。</p>
<p>【内容】『究竟一乗宝性論』（弥勒著）〜仏性の教え〜の解説、利益の章</p>
<p>【テキスト】『Buddha Nature – The Mahayana Uttaratantra Shastra with commentary』（英語）。参加者の方には本テキストの日本語訳をお送りします。</p>
<p>【日時】2023年5月13日（土）、14日（日）<br />9:15 受付開始<br />9:30～10:00 読経、座禅<br />10:00～12:00 法話1<br />12:00～14:00 昼休み<br />14:00～14:30 座禅<br />14:30～16:30 法話2</p>
<p>【場所】京都東山鹿ヶ谷タシ・ガチル（詳しくはお問い合わせください）</p>
<p>【参加費】4,000円/1法話、全4法話（全参加で16,000円）。法話は英語（日本語通訳あり）。</p>
<p>昼食はご持参いただくか、近くのレストランをご利用ください。なお、定員となり次第、予約受付を終了させていただきます。参加ご希望の方はお早めにご連絡ください。</p>`,
    bodyEn: `<h4>Dzigar Kongtrul Rinpoche's annual teaching</h4>
<p>Every year Dzigar Kongtrul Rinpoche gives teachings based on a traditional Buddhist text. Deep and broad study grounded in the traditional teachings reveals the map from the beginning of the path to its destination and greatly supports a deepening understanding of the nature of mind. Study and practice complement each other: as we continue to learn and practice, points that were unclear gradually come to light — like sunlight breaking through clouds — and our confidence in the nature of mind becomes unshakable.</p>
<p>This year's text, the Uttaratantra Shastra — the teaching on buddha nature (tathagatagarbha) — belongs to the third turning of the wheel of Dharma. Where the second turning taught emptiness, the third teaches primarily the aspect of luminosity. The Uttaratantra is also said to be a bridge between the Mahayana and the Vajrayana.</p>
<p>In this year's teaching Rinpoche explains the final chapter, on Benefit.</p>
<p>Although Buddhist terminology is used throughout, Rinpoche's style is not aimed at merely increasing scholarly knowledge: he teaches clearly, adapted to modern circumstances, from the perspective of how to bring the teachings into daily life. Even newcomers will find inspiration in many forms. All who are interested are warmly invited.</p>
<p>Content: commentary on the Benefit chapter of the Uttaratantra Shastra (Maitreya) — the teaching on buddha nature.</p>
<p>Text: Buddha Nature — The Mahayana Uttaratantra Shastra with commentary (English). Participants receive a Japanese translation.</p>
<p>Dates: Saturday May 13 and Sunday May 14, 2023.<br />9:15 registration; 9:30–10:00 chanting and zazen; 10:00–12:00 talk 1; 12:00–14:00 lunch; 14:00–14:30 zazen; 14:30–16:30 talk 2.</p>
<p>Venue: Tashi Gachil, Shishigatani, Higashiyama, Kyoto (please inquire for details).</p>
<p>Fee: ¥4,000 per talk, four talks in all (¥16,000 for full attendance). Talks are in English with Japanese interpretation.</p>
<p>Please bring lunch or use a nearby restaurant. Registration closes when capacity is reached — early booking is recommended.</p>`,
  },
  {
    slugJa: "shoseki",
    slugEn: "books",
    titleJa: "リンポチェの書籍",
    titleEn: "Books by Rinpoche",
    excerptJa:
      "『心の鏡を見つめる』（It's Up to You）など、ズィガー・コントゥル・リンポチェの書籍。",
    excerptEn:
      "Books by Dzigar Kongtrul Rinpoche, including the Japanese edition of It's Up to You.",
    type: "ARTICLE",
    imageUrl: "/images/legacy/113186132.webp",
    teacherSlug: "dzigar-kongtrul-rinpoche",
    publishedAt: "2023-03-19",
    bodyJa: `<h4>ズィガー・コントゥル・リンポチェの書籍</h4>
<p><img src="/images/legacy/113186132.webp" /></p>
<p>ズィガー・コントゥル・リンポチェの書籍、『心の鏡を見つめる ―日常に行き渡らせるチベット仏教の教え―』（It's Up to You）が出版されています。当サイトのショップ、またはAmazonからご購入いただけます。</p>
<p>英語の著書には『It's Up to You』『Light Comes Through』『Diligence』『Natural Vitality』などがあります。</p>`,
    bodyEn: `<h4>Books by Dzigar Kongtrul Rinpoche</h4>
<p><img src="/images/legacy/113186132.webp" /></p>
<p>The Japanese edition of Dzigar Kongtrul Rinpoche's It's Up to You — 『心の鏡を見つめる』, "Gazing into the Mirror of the Mind: Tibetan Buddhist Teachings to Permeate Daily Life" — is available from our shop or from Amazon.</p>
<p>His English-language books include It's Up to You, Light Comes Through, Diligence, and Natural Vitality.</p>`,
  },
  {
    slugJa: "katsudo",
    slugEn: "activities",
    titleJa: "活動",
    titleEn: "Activities",
    excerptJa:
      "学習、修行、奉仕 — 法話会、勉強会、オンライン・トレーニング、座禅会、供養行、放生会。",
    excerptEn:
      "Study, practice, and service — annual teachings, study groups, online training, zazen, tsok offerings, and the life-release ceremony.",
    type: "ARTICLE",
    imageUrl: "/images/legacy/113185949.webp",
    publishedAt: "2023-03-19",
    bodyJa: `<h3>学習、修行、奉仕</h3>
<p>マンガラ・シュリ・ブティ・サンガでは、様々な修学コースを学びながら、ロジョン（心の訓練）や一連の修行階梯を実践し、最終的にリトリート（隠遁修行）で伝授されるゾクチェンの教えを頂点とする道を歩むことになります。サンガへの奉仕活動も、個人の資質を高める重要な要素とされています。</p>
<p>これらの学習、修行、奉仕により育まれる文化は、弟子たちの利己心をすり減らし、利他的な人間へと成長させるのに役立ちます。</p>
<h3>仏教学習プログラム</h3>
<h4>法話会</h4>
<p>年に一回、コントゥル・リンポチェをお迎えして京都で法話会を開催しています。毎回仏教の伝統的な経典を題材に解説されます。</p>
<h4>勉強会</h4>
<p>月に一回、京都のタシ・ガチルで勉強会を開催しています。ここでは、教えを概念だけの理解に留めず、日常生活で体験に根ざして理解を深め、そこで得た個人的な体験を共有し、互いにインスピレーションを与え合うような場を提供することを目的としています。仏教に興味があるないに関わらず、心に取り組むことに関心がある方なら、どなたでもご参加いただけます。</p>
<h4>オンライン・トレーニング</h4>
<p>教えをいかに日常に融合させることができるか、いかにして日々の生活を道を歩む肥やしとしていけるか、このような切実な願いを満たす一つの選択肢として、マンガラ・シュリ・ブティでは、オンライン・トレーニングを開催しています。ウェブ・カンファレンスZoomを活用し、地理的に離れている方でもご参加いただけます。コントゥル・リンポチェがこれまでに世界中で説かれた法話から、該当するテーマに最適なものを選び、まとめ、それを基に学習、熟考、瞑想（聞思修）を進めていきます。2週毎にオンライン・カンファレンスを行い、それぞれの体験や気づいた点などを、互いに共有し、その理解をさらに深めていくプログラムとなっています。</p>
<h3>修行プログラム</h3>
<h4>座禅会</h4>
<p>現代のライフスタイルでは、日々の忙しい生活の中、長い時間、座り、心を見つめる機会を持つことは難しくなっています。そのような中、毎月1回、京都東山の緑に囲まれた静かな場所で、一日座禅会（1時間の座禅を5セッション）を行っています。1セッション毎に裏山の庭で歩き禅を行い、昼食後には庭掃除など、修行を兼ねた作務を行います。参加者の多くは、長い間、座ることで、座禅会が終わった後もしばらくは心の習慣的な反応に流されない心の強さを味わえると感じています。瞑想や座禅に興味がある方なら、どなたでもご参加いただけます。全てのセッションに参加できなくても、1セッションからの部分的な参加も受け付けています。</p>
<h4>供養行</h4>
<p>月に2回、京都のタシ・ガチルでツォクを行っています。リンポチェから灌頂を受けた方のみ参加できます。</p>
<h4>放生会</h4>
<p>年に1回、リンポチェとともに放生会を行っています。南伊豆の海にて魚介を放生します。直接ご参加できない方のために、お志を受け付けております。（放生会：供養のために、捕らえた生き物を池や野に放す法会）<br />志：1口2,000円から</p>`,
    bodyEn: `<h3>Study, practice, and service</h3>
<p>In the Mangala Shri Bhuti sangha, students take up various courses of study while practicing lojong (mind training) and a graduated series of practices, following a path that culminates in the Dzogchen teachings transmitted in retreat. Service to the sangha is also considered an essential element in developing one's character.</p>
<p>The culture nurtured by this study, practice, and service helps students wear down self-centeredness and grow into altruistic human beings.</p>
<h3>Buddhist study programs</h3>
<h4>Annual teachings</h4>
<p>Once a year we welcome Kongtrul Rinpoche to Kyoto for a teaching based on a traditional Buddhist scripture.</p>
<h4>Monthly study group</h4>
<p>Once a month a study group meets at Tashi Gachil in Kyoto. Its aim is to go beyond conceptual understanding: to deepen understanding through experience in daily life, share those personal experiences, and inspire one another. Anyone interested in working with the mind is welcome, whether or not they have an interest in Buddhism.</p>
<h4>Online training</h4>
<p>How can the teachings be merged with daily life? How can everyday life nourish the path? As one answer to these earnest questions, Mangala Shri Bhuti offers online training. Using Zoom, participants can join from anywhere. Talks that Kongtrul Rinpoche has given around the world are selected and compiled by theme, forming the basis for study, contemplation, and meditation. Online meetings every two weeks let participants share their experiences and insights and deepen their understanding together.</p>
<h3>Practice programs</h3>
<h4>Zazen sessions</h4>
<p>Modern life makes it hard to find time to sit for long periods and look at the mind. Once a month we hold a full-day zazen session — five one-hour sittings — in a quiet, green corner of Higashiyama, Kyoto, with walking meditation in the hillside garden between sessions and work practice such as garden cleaning after lunch. Many participants find that sitting at length gives them a strength of mind that persists after the session ends, resisting the mind's habitual reactions. Anyone interested in meditation or zazen is welcome; partial participation from a single session is fine.</p>
<h4>Tsok offerings</h4>
<p>Tsok is performed twice a month at Tashi Gachil in Kyoto. Open to those who have received empowerment from Rinpoche.</p>
<h4>Life release (hojo-e)</h4>
<p>Once a year we perform a life-release ceremony with Rinpoche, releasing fish and shellfish into the sea at Minami-Izu. For those unable to attend in person, offerings are accepted. (Life release: a ceremony in which captured living beings are released into ponds and fields as an act of dedication.)<br />Offerings: from ¥2,000 per unit.</p>`,
  },
  {
    slugJa: "online-training",
    slugEn: "online-training-en",
    titleJa: "オンライン・トレーニング",
    titleEn: "Online training",
    excerptJa:
      "Zoomによる修学コース。学習、熟考、瞑想（聞思修）を2週毎のオンライン・ミーティングで進めます。",
    excerptEn:
      "Study courses over Zoom — hearing, contemplating, and meditating, with online meetings every two weeks.",
    type: "ARTICLE",
    imageUrl: "/images/legacy/113186036.webp",
    publishedAt: "2023-03-19",
    bodyJa: `<p>「仏教書やスピリチュアルな本を読み、または来日された仏教の師の法話に直接参加するなどして、強いインスピレーションを受けても、しばらくすると、その情熱もしぼみ、また別な本や師を探そうとする。ただこの繰り返しで、なかなか教えを道とすることができない。道を歩んでいる感覚を得られない。」このような状況は、日本だけではなく世界中で見られる現象です。</p>
<p>このような中、「教えをいかに日常に融合させることができるか」、「いかにして日々の生活を道を歩む肥やしにしていけるか」、また「その後、どうすれば仏教の道をその階梯にそって進むことができるか」、「どうすれば一人の師について弟子となり道を歩むことができるか」、「どのように金剛乗の教えや修行を今の生活を送りながら続けることができるか」、このような切実な思いに応える一つの選択肢として、マンガラ・シュリ・ブティでは、MSBJオンライン・トレーニングを開催しています。</p>
<p>オンライン・ミーティング・アプリケーション（Zoom）を使用し、遠方の方でもご参加いただけるオンライン・トレーニングは、コントゥル・リンポチェがこれまでに世界中で説かれた法話から、各テーマに合ったものを選び、それを基に学習、熟考、瞑想（聞思修）を進めていきます。リンポチェの弟子が2週毎にオンライン・ミーティングを行い、それぞれの体験や気づいた点などを、互いに共有することで、単なる概念的な理解にとどめず、体験に根差したものへと深めていくことを目指します。</p>
<h4>系譜トレーニング</h4>
<p>系譜トレーニングでは、大乗の道の全体像を理解しながら、一歩づつ階梯を進めていくことができます。その後、さらに興味のある方は、コントゥル・リンポチェより「心の本性」に直接導いてもらうことで金剛乗の土台を築き、金剛乗の前行や成就法を実践し、最終的にゾクチェンの教えを授かることになります。全7コースあり、新しいコースを受講するには、それ以前のコースを修了している必要があります。</p>`,
    bodyEn: `<p>"You read a Buddhist or spiritual book, or attend a talk by a visiting teacher, and feel deeply inspired — but before long the enthusiasm fades and you find yourself looking for another book, another teacher. The cycle repeats, and somehow the teachings never become a path; there is no feeling of actually walking it." This situation is found not only in Japan but throughout the world.</p>
<p>How can the teachings be merged with daily life? How can everyday life become nourishment for the path? How, then, does one progress along the stages of the Buddhist path, become the student of a single teacher, and continue Vajrayana study and practice while living one's present life? As one answer to these earnest questions, Mangala Shri Bhuti offers MSBJ online training.</p>
<p>Using Zoom so that participants can join from anywhere, the training selects talks Kongtrul Rinpoche has given around the world, matched to each theme, as the basis for hearing, contemplating, and meditating. Rinpoche's students meet online every two weeks to share their experiences and insights, aiming to deepen understanding beyond the merely conceptual into something rooted in experience.</p>
<h4>Lineage training</h4>
<p>In the lineage training, students advance step by step while gaining a picture of the whole Mahayana path. Those who wish to continue receive direct introduction to the nature of mind from Kongtrul Rinpoche, laying the foundation of the Vajrayana; they then practice the Vajrayana preliminaries and sadhanas, ultimately receiving the Dzogchen teachings. There are seven courses in all; each new course requires completion of the previous one.</p>`,
  },
  {
    slugJa: "keifu-training-1",
    slugEn: "lineage-training-1",
    titleJa: "系譜トレーニング、コース1「目覚めた心を育む」",
    titleEn: "Lineage training, course 1: Cultivating an Awakened Mind",
    excerptJa:
      "自己内省と四無量心を用い、心のあり様全体を変えていく10〜12週間のオンラインコース。",
    excerptEn:
      "A 10–12 week online course using self-reflection and the four immeasurables to transform the whole way the mind is held.",
    type: "ARTICLE",
    imageUrl: "/images/legacy/113186051.webp",
    publishedAt: "2023-03-19",
    bodyJa: `<p>コップに半分の水が入っているとき、ついつい半分も空っぽだと考えがちです。しかし、半分も水が入っていると考えるほうが、いろいろな場面でメリットがあります。ものの見方一つで、ものの感じ方、考え方、ふるまいが大きく変わることは、皆さんもご承知でしょう。しかし、ものの見方を変えることは容易ではありません。ほとんどの人は、見方を変える方法を知りません。いつものおきまりの習慣で、何に対しても、どこか微細な形で不安を抱き、不満を感じています。ですので、何か手を打たねばなりません。「目覚めた心を育む」コースでは、目覚めたものの見方を少しずつ身につけていきます。ここでは、何世紀にも渡り受け継がれ確立されてきた仏教の伝統的な瞑想行のうちの、自己内省と四無量心を用い、単に心の態度だけでなく、心のあり様全体を変えていくことで、人生を変容させていきます。</p>
<p>コース1を受講するにあたり、仏教に精通している必要はありません。また、仏教徒になることを強いるものでもありませんので、どなたでもご参加ください。</p>
<h4>「目覚めた心を育む」</h4>
<p>人生を生きる上で、苦しみや不満、葛藤は避けては通れません。しかし、身体の苦痛や心の苦しみから逃れようとすればするほど、それらに絡み取られ、深みにはまっていきます。ではどうすれば、このような痛ましいサイクルから抜け出すことができるでしょう？本コースでは、この疑問に答える2つの瞑想のテクニックを学び、実践していきます。</p>
<h4>1.1 自己内省と瞑想</h4>
<p>苦しみをもたらす悪しき習慣から自由になるには、まず心を内に向け、生来の知性により、この苦のサイクルに陥る原因を捨て去る必要があります。この自己内省のプロセスは、我執（自我への執着）や五大煩悩（執着、怒り、無知、嫉妬、傲慢）といった、ネガティブな心の状態の原因と条件を調べることから始まります。心を落ち着けて、心の体験を詳細に調べることで、行為が本来の意図に矛盾していることを認識するようになり、そして、充足感を得る最も直接的で最善の方法が明らかになっていきます。</p>
<h4>1.2 四無量心</h4>
<p>私たちは皆、心のどこかで、真の充足感を求めており、「人生の本当の意味とは何なのか？」と探求しています。しかし、無知と迷乱から、「満たされない欲求を満たすことで、初めて充足感を得られる」と信じて疑いません。自分を含めた生きとし生けるものに無量の利益をもたらしたいと願う、四無量心（慈愛、慈悲、随喜、平等心）を育んでいくようになると、善良なる心こそが、彼らに大いなる幸せをもたらす鍵であるということを発見することになります。そして、偏見のない開かれた、思いやりある心が強まっていくことで、真の充足感を得られる道がより明らかとなり、また探し続けてきた意義ある人生が手の届く所にあると知ることになります。</p>
<h4>コース予定</h4>
<p>コース１「目覚めた心を育む」は、10-12週間のコースで、約2週間毎にZoomオンライン・ミーティングを行います。</p>
<h4>参加申し込み</h4>
<p>コース1の参加費は1万円。（難しい方はご相談ください）参加ご希望の方はお問い合わせページからご連絡ください。受付確認後、法話資料をダウンロードできるサイトのアドレスをお送りします。</p>
<p>コース1を修了された方は、コース2「仏教徒になる」を受講することができます。</p>`,
    bodyEn: `<p>When a glass is half full of water, we tend to think of it as half empty. Yet thinking of it as half full serves us better in many situations. As everyone knows, a single way of seeing changes how we feel, think, and behave. But changing our way of seeing is not easy — most people don't know how. Out of sheer habit we carry a subtle unease and dissatisfaction toward everything. Something must be done. In the course "Cultivating an Awakened Mind," we gradually acquire an awakened way of seeing. Using two traditional Buddhist meditation practices established over centuries — self-reflection and the four immeasurables — we transform not merely the mind's attitude but its whole way of being, and thereby transform our lives.</p>
<p>No familiarity with Buddhism is needed to take course 1, and it does not require becoming a Buddhist. Everyone is welcome.</p>
<h4>Cultivating an Awakened Mind</h4>
<p>Suffering, dissatisfaction, and conflict cannot be avoided in life. Yet the more we try to escape physical pain and mental suffering, the more entangled and deeply mired we become. How, then, can we break out of this painful cycle? In this course we learn and practice two meditation techniques that answer this question.</p>
<h4>1.1 Self-reflection and meditation</h4>
<p>To become free of the harmful habits that bring suffering, we must first turn the mind inward and, with our innate intelligence, abandon the causes of this cycle of pain. The process of self-reflection begins by examining the causes and conditions of negative states of mind: ego-clinging and the five great afflictions — attachment, anger, ignorance, jealousy, and arrogance. By settling the mind and examining our experience in detail, we come to recognize how our actions contradict our true intentions, and the most direct and best way to find contentment becomes clear.</p>
<h4>1.2 The four immeasurables</h4>
<p>Somewhere in our hearts we all seek true contentment, asking what the real meaning of life is. Out of ignorance and confusion, we believe without question that contentment comes only from satisfying unmet desires. As we cultivate the four immeasurables — loving-kindness, compassion, sympathetic joy, and equanimity — wishing immeasurable benefit for all beings including ourselves, we discover that a good heart is the key to their great happiness. As an unbiased, open, caring mind grows stronger, the way to true contentment becomes clearer, and we find that the meaningful life we have been searching for is within reach.</p>
<h4>Schedule</h4>
<p>Course 1, "Cultivating an Awakened Mind," runs 10–12 weeks, with Zoom meetings roughly every two weeks.</p>
<h4>Registration</h4>
<p>The fee for course 1 is ¥10,000 (please consult us if this is difficult). To join, contact us via the contact page. After confirmation you will receive the address of a site where the teaching materials can be downloaded.</p>
<p>Those who complete course 1 may take course 2, "Becoming a Buddhist."</p>`,
  },
  {
    slugJa: "keifu-training-2",
    slugEn: "lineage-training-2",
    titleJa: "系譜トレーニング、コース2「仏教徒になる」",
    titleEn: "Lineage training, course 2: Becoming a Buddhist",
    excerptJa:
      "三帰依と菩提心 — 「目覚めた心」の体験を深める20週間のオンラインコース。",
    excerptEn:
      "Taking refuge and bodhicitta — a 20-week online course deepening the experience of the awakened mind.",
    type: "ARTICLE",
    imageUrl: "/images/legacy/113186053.webp",
    publishedAt: "2023-03-19",
    bodyJa: `<p>「コース1、目覚めた心を育む」で学んだ、「自己内省」と「シャマタ行（数息観および四無量心）」を実践することで心に変化が見られ始めると、それを日々の生活により浸透させたいという思いが生じてくるかもしれません。本コースでは、そのための様々な実践法を紹介し、この「目覚めた心」の体験をさらに深めていくための仏法の道を解説します。</p>
<p>本コースを受講するには、コース1（目覚めた心を育む）を修了している必要があります。</p>
<h4>2.1 三帰依</h4>
<p>「シャマタ（集中する行）」と「自己内省の行」を実践していくと、「ネガティブな感情に、人生の大半を翻弄されている。その結果、不安をつのらせ、自他共に苦しみを招いている」ということに気づくかもしれません。しかし、これらの感情に振り回されたくないと願いながら、世間の娯楽や名声、称賛といった外側のものに心の平穏や安心を求めても、実際に思い通りになることは稀です。そこから、自らの内に、より信頼の置ける精神的な拠り所を求めたいと願う人が出てくるかもしれません。しかし、心を導き、その本来の能力を開花させていくには、その道の専門家の助言や支援を受ける必要があります。このような理由から、私たちはブッダ（仏）を指導者とし、ダルマ（法）を道とし、サンガ（僧）を仲間として、これら仏法僧の三宝を拠り所としていきます。このセクションでは、三帰依行が、いかにして道を歩む上での土台となり、私たちの心を守りながら、日常生活で深い充足感をもたらしてくれるかについて学んでいきます。</p>
<h4>2.2 菩提心</h4>
<p>ネガティブな感情から離れられる拠り所を見つけると、その芽生え始めた"自由の感覚"を他者とも共有したいという気持ちが自然と湧いてきます。この"自由の感覚"から、自分以外の世界や生きとし生けるものと深い部分でつながる感覚が少しずつ強まり、これまで想像もしたことのないような大きな広がりや慈悲を感じていたいと願うようになります。そして、そのためにも、自他に苦しみをもたらす習慣的なエゴの力を弱めるために、「自他平等」や、自分と生きとし生けるものを入れ替えていく「自他交換」のシナリオガイド瞑想法を実践し、深く広大な心を探求していくことになります。これらの実践により、生きとし生けるもののために自らが完全な覚りを得たいと願う、ボディチッタ（＝「目覚めた心」または「菩提心」）の喜びが少しずつ明らかになってきます。</p>
<h4>コース予定</h4>
<p>コース2「仏教徒になる」は、20週間（5ヶ月）のコースで、2週間毎にオンライン・ミーティング（全10回）を行います。</p>
<h4>参加申し込み</h4>
<p>コース2の参加費は1万円です。受付確認後、法話資料をダウンロードできるサイトのアドレスをお送りします。ご質問等はお問い合わせページからご連絡ください。</p>`,
    bodyEn: `<p>As the practices learned in course 1 — self-reflection and shamatha (breath counting and the four immeasurables) — begin to change the mind, a wish may arise to let that change permeate daily life more deeply. This course introduces a range of practices for doing so and explains the Buddhist path for deepening the experience of the awakened mind.</p>
<p>Completion of course 1 (Cultivating an Awakened Mind) is required.</p>
<h4>2.1 Taking refuge in the Three Jewels</h4>
<p>Practicing shamatha and self-reflection, we may notice that negative emotions toss us about for most of our lives, breeding anxiety and bringing suffering to ourselves and others. Though we wish not to be swept around by these emotions, seeking peace and security in outer things — entertainment, fame, praise — rarely works out as hoped. From this, some come to wish for a more reliable spiritual refuge within. But to guide the mind and unfold its innate capacity, we need the advice and support of experts on that path. For this reason we take the Buddha as guide, the Dharma as path, and the Sangha as companions — taking refuge in the Three Jewels. In this section we learn how refuge practice becomes the foundation for walking the path, protecting the mind while bringing deep contentment to daily life.</p>
<h4>2.2 Bodhicitta</h4>
<p>Having found a refuge from negative emotion, the wish naturally arises to share this budding sense of freedom with others. From it, a feeling of deep connection with the world and all living beings gradually strengthens, and we come to wish for a vastness and compassion greater than anything we had imagined. To weaken the habitual force of ego that brings suffering to self and others, we practice guided meditations on the equality of self and other and on exchanging self for others, exploring a deep and vast mind. Through these practices, the joy of bodhicitta — the awakened mind that wishes to attain complete awakening for the sake of all beings — gradually reveals itself.</p>
<h4>Schedule</h4>
<p>Course 2, "Becoming a Buddhist," runs 20 weeks (five months), with online meetings every two weeks (ten in all).</p>
<h4>Registration</h4>
<p>The fee for course 2 is ¥10,000. After confirmation you will receive the address of a site where the teaching materials can be downloaded. For questions, please use the contact page.</p>`,
  },
  {
    slugJa: "jiko-naisei-course",
    slugEn: "self-reflection-course",
    titleJa: "オンライン勉強会「自己内省」コース",
    titleEn: "Online study course: Self-Reflection",
    excerptJa:
      "『It's Up to You』（心の鏡を見つめる）を題材に「自己内省」を学ぶ全22回のオンライン勉強会。",
    excerptEn:
      "A 22-session online study course on self-reflection, based on It's Up to You.",
    type: "ARTICLE",
    imageUrl: "/images/legacy/113186057.webp",
    teacherSlug: "dzigar-kongtrul-rinpoche",
    publishedAt: "2023-03-19",
    bodyJa: `<p>『It's Up to You（心の鏡を見つめる）』（ズィガー・コントゥル・リンポチェ著）を題材にしたオンライン勉強会で、教えに息吹を吹き込み、生きた体験とする「自己内省」について、学んでいきます。</p>
<p>参加費：15,000円（全22回分の費用）<br />参加方法：オンライン・カンファレンス・アプリ、Zoomによるビデオ会議による参加（PC、Mac、スマートフォン等が必要）<br />テキスト：テキストはその都度お送りいたします。</p>
<p>以下は、『It's Up to You』序章です。</p>
<h4>序章</h4>
<p>幸せを求めることは誰にも共通する普遍的なものである。また、幸せや人生の意義を見出す以外にも、私たちは善良で、良識な人間でありたいと願っている。善良で、良識ある幸せな人間になりたいという願いは理にかなうだけでなく、崇高な願いでもある。しかし、皮肉にも、多くの人はこの願いを叶えようと様々なことを試しては挫折し、苦悩している。理想とするイメージを思い描いても、疑念や、恐れ、不安に振り回され、苦しんでいるようだ。</p>
<p>精神の道では、「覚り」について語られる。しかし、鏡に映し出される今の自分の姿と、この覚りをどのように整合すれば良いのだろう？迷乱した心から目を背け、覚りを求めても、そのような修行は目の前の直接の体験と切り離されたものとなる。一方、悪しき心の習慣にだけ目を向けるなら、自己没頭の苦痛に陥り、全く身動きが取れない状態になる。</p>
<p>この自らの迷乱した心と覚りのイメージを整合させようとする苦悩は、道を歩み始める最初の出発点となる。これは自由と幸せを求める、心の深い欲求の表れであり、それ自体、生きとし生けるものに備わる心の大いなる潜在性の存在を示唆している。しかし、この大いなる潜在性が備わるからといって、初めから高貴な覚った存在であるという意味ではない。道を歩み始めても、迷乱は続く。しかし、この迷乱は、避けようとしたり、戦いを挑むのではなく、活用していくこともできる。大いなる潜在性と心の神経症の両方を受け入れられるようになるには、ある程度、心が成熟する必要がある。そしてこの成熟は、自己内省の行により育むことができるのだ。</p>
<p>自己内省とは、心に何が生じても、善悪の分別なく正直に心を見つめる精神であり、それを実践する行為そのものである。おそらく、不快な体験を取り除き、心地よい体験を追い求める傾向が強いことから、いざ自己内省に挑戦してみると、習慣の圧倒的な力の前に実践が難しいと感じるかもしれない。しかし、自己内省の行には、他には見られない「美点」と「寛容」がある。それは「今体験している以外のものを必要としない」ということだ。一切の先入観なく心を見つめることができれば、心の大いなる潜在性と迷乱の両方に智慧の光をあてることができる。そうすることで、これまでの心のあがきを、覚りの道の土台へと変容させることができるのだ。</p>
<p>自己内省は、仏教のあらゆる伝統や系譜に共通するテーマである。そして教えに息吹を吹き込み、生きた体験とすることで、修行を単なる別の娯楽へと貶める危険から私たちを守るものなのである。</p>`,
    bodyEn: `<p>This online study course, based on It's Up to You by Dzigar Kongtrul Rinpoche, explores self-reflection — the practice that breathes life into the teachings and makes them living experience.</p>
<p>Fee: ¥15,000 (covering all 22 sessions)<br />Format: video meetings via Zoom (PC, Mac, or smartphone required)<br />Text: materials are sent for each session.</p>
<p>The following is from the introduction to It's Up to You.</p>
<h4>Introduction</h4>
<p>The search for happiness is universal. Beyond finding happiness and meaning in life, we also wish to be good, decent human beings. The wish to be a good, decent, happy person is not only reasonable but noble. Ironically, however, many people try everything to fulfill this wish, fail, and suffer. Even as we picture our ideal, we seem tossed about by doubt, fear, and anxiety.</p>
<p>The spiritual path speaks of awakening. But how do we reconcile that awakening with the self we now see in the mirror? If we turn away from our confused mind and chase awakening, our practice becomes divorced from direct experience. If we look only at our bad mental habits, we fall into the pain of self-absorption and cannot move at all.</p>
<p>The struggle to reconcile our confused mind with the image of awakening is the very starting point of the path. It expresses the mind's deep longing for freedom and happiness — itself a sign of the great potential inherent in all living beings. Yet having this great potential does not mean we are noble, awakened beings from the start. Even after setting out on the path, confusion continues. But rather than avoiding it or doing battle with it, this confusion can be put to use. To accept both the great potential and the mind's neuroses requires a certain maturity of mind — and that maturity can be cultivated through the practice of self-reflection.</p>
<p>Self-reflection is the spirit of looking honestly at whatever arises in the mind, without judging it good or bad — and the act of practicing that spirit. Because our tendency to remove unpleasant experience and pursue pleasant experience is strong, self-reflection may feel difficult against the overwhelming force of habit. But the practice has a beauty and generosity found nowhere else: it requires nothing other than what you are experiencing right now. If we can look at the mind without any preconception, the light of wisdom shines on both the mind's great potential and its confusion. In this way our former struggles are transformed into the foundation of the path of awakening.</p>
<p>Self-reflection is a theme common to every Buddhist tradition and lineage. By breathing life into the teachings and making them living experience, it protects our practice from the danger of becoming just another form of entertainment.</p>`,
  },
  {
    slugJa: "kokoro-no-kagami-shuppan",
    slugEn: "its-up-to-you-published",
    titleJa: "『心の鏡を見つめる』が出版されました",
    titleEn: "Japanese edition of It's Up to You published",
    excerptJa:
      "ズィガー・コントゥル・リンポチェの著書『It's Up to You』の日本語版が出版されました。",
    excerptEn:
      "The Japanese edition of Dzigar Kongtrul Rinpoche's It's Up to You is now available.",
    type: "BLOG",
    imageUrl: "/images/legacy/113186132.webp",
    teacherSlug: "dzigar-kongtrul-rinpoche",
    publishedAt: "2023-02-01",
    bodyJa: `<p>ズィガー・コントゥル・リンポチェの著書『心の鏡を見つめる ―日常に行き渡らせるチベット仏教の教え―』（原題：It's Up to You）が出版されました。</p>
<p>自己内省 — 心に何が生じても、善悪の分別なく正直に心を見つめる行 — を軸に、チベット仏教の教えを日常生活に行き渡らせる道を説いた一冊です。当サイトのショップからご購入いただけます。</p>`,
    bodyEn: `<p>The Japanese edition of Dzigar Kongtrul Rinpoche's It's Up to You (『心の鏡を見つめる』, "Gazing into the Mirror of the Mind") has been published.</p>
<p>Centered on self-reflection — looking honestly at whatever arises in the mind, without judging it good or bad — the book shows how to let the teachings of Tibetan Buddhism permeate daily life. It is available from our shop.</p>`,
  },
  {
    slugJa: "onsei-mp3-hanbai",
    slugEn: "audio-mp3-on-sale",
    titleJa: "年次法話（音声MP3）の販売を開始しました",
    titleEn: "Annual teaching audio (MP3) now on sale",
    excerptJa:
      "2010年から2019年までの『究竟一乗宝性論』年次法話の音声MP3を販売しています。",
    excerptEn:
      "Audio MP3s of the 2010–2019 annual teachings on the Uttaratantra Shastra are now on sale.",
    type: "BLOG",
    publishedAt: "2023-01-15",
    bodyJa: `<p>2010年から2019年までの『究竟一乗宝性論』に関する年次法話（音声MP3）の販売を開始しました。各年次法話（4法話）は4,000円です。当サイトのショップからご購入いただけます。</p>`,
    bodyEn: `<p>Audio recordings (MP3) of the annual teachings on the Uttaratantra Shastra from 2010 through 2019 are now on sale. Each year's teaching (four talks) is ¥4,000, available from our shop.</p>`,
  },
];

export interface LegacyProduct {
  slugJa: string;
  slugEn: string;
  nameJa: string;
  nameEn: string;
  descriptionJa: string;
  descriptionEn: string;
  imageUrl?: string;
  sortOrder: number;
  variants: {
    nameJa: string;
    nameEn: string;
    sku: string;
    priceAmount: number;
    digital: boolean;
    stockQuantity: number;
  }[];
}

export const legacyProducts: LegacyProduct[] = [
  {
    slugJa: "kokoro-no-kagami",
    slugEn: "its-up-to-you-jp",
    nameJa: "『心の鏡を見つめる』（書籍）",
    nameEn: "It's Up to You — Japanese edition (book)",
    descriptionJa:
      "ズィガー・コントゥル・リンポチェ著『心の鏡を見つめる ―日常に行き渡らせるチベット仏教の教え―』（原題：It's Up to You）。自己内省の行を軸に、チベット仏教の教えを日常生活に行き渡らせる道を説いた一冊です。",
    descriptionEn:
      "The Japanese edition of It's Up to You by Dzigar Kongtrul Rinpoche — Tibetan Buddhist teachings on the practice of self-reflection, brought into daily life.",
    imageUrl: "/images/legacy/113186132.webp",
    sortOrder: 1,
    variants: [
      {
        nameJa: "単行本",
        nameEn: "Paperback",
        sku: "BOOK-IUTY-JP",
        priceAmount: 2200,
        digital: false,
        stockQuantity: 30,
      },
    ],
  },
  {
    slugJa: "nenji-howa-mp3",
    slugEn: "annual-teaching-mp3",
    nameJa: "年次法話 音声MP3『究竟一乗宝性論』",
    nameEn: "Annual teaching audio MP3: Uttaratantra Shastra",
    descriptionJa:
      "2010年から2019年までの『究竟一乗宝性論』年次法話の音声（MP3）。各年次法話は4法話構成です。ご購入後、ダウンロードリンクをお送りします。",
    descriptionEn:
      "Audio recordings (MP3) of the annual teachings on the Uttaratantra Shastra, 2010–2019. Each year comprises four talks. A download link is sent after purchase.",
    imageUrl: "/images/legacy/113186119.webp",
    sortOrder: 2,
    variants: [
      {
        nameJa: "2019年法話（全4話）",
        nameEn: "2019 teaching (4 talks)",
        sku: "MP3-UT-2019",
        priceAmount: 4000,
        digital: true,
        stockQuantity: 9999,
      },
      {
        nameJa: "2010〜2018年 各年次法話（全4話）",
        nameEn: "2010–2018 teachings (4 talks per year)",
        sku: "MP3-UT-ARCHIVE",
        priceAmount: 4000,
        digital: true,
        stockQuantity: 9999,
      },
    ],
  },
];

export interface LegacyEvent {
  slugJa: string;
  slugEn: string;
  titleJa: string;
  titleEn: string;
  descriptionJa: string;
  descriptionEn: string;
  status: "PUBLISHED" | "COMPLETED";
  mode: "IN_PERSON" | "ONLINE" | "HYBRID";
  priceType: "FREE" | "FIXED" | "DONATION";
  priceAmount?: number;
  capacity?: number;
  beginnerFriendly: boolean;
  startsAt: string;
  endsAt: string;
  venueKey?: string;
  imageUrl?: string;
  seriesSlug?: string;
}

export const legacyEventSeries = [
  {
    slugJa: "nenji-howa",
    slugEn: "annual-teachings",
    titleJa: "年次法話会",
    titleEn: "Annual teachings",
    descriptionJa:
      "年に一回、コントゥル・リンポチェをお迎えして京都で開催する、伝統的な仏典を題材にした法話会。",
    descriptionEn:
      "Once a year, Kongtrul Rinpoche is welcomed to Kyoto for teachings based on a traditional Buddhist text.",
  },
  {
    slugJa: "keifu-training",
    slugEn: "lineage-training",
    titleJa: "系譜トレーニング（オンライン）",
    titleEn: "Lineage training (online)",
    descriptionJa:
      "大乗の道の全体像を理解しながら、一歩づつ階梯を進めていく全7コースのオンライン修学プログラム。",
    descriptionEn:
      "A seven-course online study program advancing step by step through the whole Mahayana path.",
  },
];

export const legacyEvents: LegacyEvent[] = [
  {
    slugJa: "nenji-howa-2023",
    slugEn: "annual-teaching-2023",
    titleJa: "2023年年次法話：『究竟一乗宝性論』利益の章",
    titleEn:
      "2023 annual teaching: the Benefit chapter of the Uttaratantra Shastra",
    descriptionJa:
      "コントゥル・リンポチェが来日され、『究竟一乗宝性論』の最終章、利益について法話をされます。9:15受付開始、9:30読経・座禅、10:00法話1、14:00座禅、14:30法話2。テキスト『Buddha Nature – The Mahayana Uttaratantra Shastra with commentary』。法話は英語（日本語通訳あり）。参加費4,000円/1法話、全4法話。",
    descriptionEn:
      "Kongtrul Rinpoche teaches the final chapter — Benefit — of the Uttaratantra Shastra. Registration 9:15; chanting and zazen 9:30; talk 1 at 10:00; zazen 14:00; talk 2 at 14:30. Text: Buddha Nature — The Mahayana Uttaratantra Shastra with commentary. Talks in English with Japanese interpretation. ¥4,000 per talk, four talks.",
    status: "COMPLETED",
    mode: "IN_PERSON",
    priceType: "FIXED",
    priceAmount: 4000,
    capacity: 40,
    beginnerFriendly: true,
    startsAt: "2023-05-13T09:30:00+09:00",
    endsAt: "2023-05-14T16:30:00+09:00",
    venueKey: "tashi-gachil",
    imageUrl: "/images/legacy/113186125.webp",
    seriesSlug: "nenji-howa",
  },
  {
    slugJa: "drupcho-2023",
    slugEn: "drupcho-2023",
    titleJa: "ドゥックガル・ランドル・ドゥプチュ（苦の自己解脱成就法）",
    titleEn: "Dukngal Rangdrol drupchö (Self-Liberation of Suffering)",
    descriptionJa:
      "観音菩薩を本尊とする成就法。4日間を通じ、コントゥル・リンポチェを始め、参加者は世界中の生きとし生けるものの安楽を願い、ドゥックガル・ランドル・ドゥプチュを行います。祈願とお志（1口2,000円から）を受け付けています。祈願文は具体的な内容と共にご自分の名前を添えてください。寄せられた祈願文は毎日読み上げられ祈念されます。",
    descriptionEn:
      "A sadhana practice with Avalokiteshvara as the principal deity. Over four days, Kongtrul Rinpoche and participants perform the Dukngal Rangdrol drupchö for the welfare of all beings. Prayer requests and offerings (from ¥2,000 per unit) are welcome; please include specific wishes and your name. Requests are read aloud and prayed for daily.",
    status: "COMPLETED",
    mode: "IN_PERSON",
    priceType: "DONATION",
    beginnerFriendly: false,
    startsAt: "2023-05-05T09:00:00+09:00",
    endsAt: "2023-05-08T17:00:00+09:00",
    venueKey: "tashi-choling",
    imageUrl: "/images/legacy/113185999.webp",
  },
  {
    slugJa: "hojoe-2023",
    slugEn: "life-release-2023",
    titleJa: "放生会",
    titleEn: "Life-release ceremony (hojo-e)",
    descriptionJa:
      "供養行の後にコントゥル・リンポチェとともに南伊豆の海にて放生会を行います。直接ご参加できない方のために、お志（1口2,000円から）を受け付けております。（放生会：供養のために、捕らえた生き物を池や野に放す法会）",
    descriptionEn:
      "Following the drupchö, a life-release ceremony with Kongtrul Rinpoche at the sea in Minami-Izu — releasing captured living beings as an act of dedication. For those unable to attend, offerings from ¥2,000 per unit are accepted.",
    status: "COMPLETED",
    mode: "IN_PERSON",
    priceType: "DONATION",
    beginnerFriendly: true,
    startsAt: "2023-05-08T10:00:00+09:00",
    endsAt: "2023-05-08T15:00:00+09:00",
    venueKey: "tashi-choling",
    imageUrl: "/images/legacy/113186000.webp",
  },
  {
    slugJa: "benkyokai-2026-08",
    slugEn: "study-group-2026-08",
    titleJa: "月次勉強会（8月）",
    titleEn: "Monthly study group (August)",
    descriptionJa:
      "教えを概念だけの理解に留めず、日常生活での実践に基づいた個人的な体験を共有することで、互いにインスピレーションを与え合う場です。仏教への興味のあるなしに関わらず、心に取り組むことに関心がある方なら、どなたでもご参加いただけます。オンラインでの参加も可能です。13:00〜13:45 各自で瞑想、14:00〜16:00 勉強会とディスカッション。",
    descriptionEn:
      "A place to go beyond conceptual understanding — sharing personal experience from practice in daily life and inspiring one another. Anyone interested in working with the mind is welcome, whether or not they have an interest in Buddhism. Online participation available. 13:00–13:45 individual meditation; 14:00–16:00 study and discussion.",
    status: "PUBLISHED",
    mode: "HYBRID",
    priceType: "FREE",
    capacity: 20,
    beginnerFriendly: true,
    startsAt: "2026-08-22T13:00:00+09:00",
    endsAt: "2026-08-22T16:00:00+09:00",
    venueKey: "tashi-gachil",
  },
  {
    slugJa: "zazenkai-2026-09",
    slugEn: "zazen-day-2026-09",
    titleJa: "一日座禅会（9月）",
    titleEn: "Full-day zazen session (September)",
    descriptionJa:
      "京都東山の緑に囲まれた静かな場所で、一日座禅会（1時間の座禅を5セッション）を行います。1セッション毎に裏山の庭で歩き禅を行い、昼食後には庭掃除など、修行を兼ねた作務を行います。瞑想や座禅に興味がある方なら、どなたでもご参加いただけます。1セッションからの部分的な参加も受け付けています。",
    descriptionEn:
      "A full-day zazen session — five one-hour sittings — in a quiet, green corner of Higashiyama, Kyoto, with walking meditation between sessions and work practice after lunch. Anyone interested in meditation is welcome; partial participation from a single session is fine.",
    status: "PUBLISHED",
    mode: "IN_PERSON",
    priceType: "FREE",
    capacity: 15,
    beginnerFriendly: true,
    startsAt: "2026-09-13T09:00:00+09:00",
    endsAt: "2026-09-13T16:00:00+09:00",
    venueKey: "tashi-gachil",
  },
];

export const legacyRedirects = [
  { fromPath: "/pg472.html", toPath: "/ja/teachings/vision" },
  { fromPath: "/pg803.html", toPath: "/ja/teachings/msbj-ni-tsuite" },
  { fromPath: "/pg804.html", toPath: "/ja/teachings/teikan" },
  { fromPath: "/pg477.html", toPath: "/ja/teachings/keifu" },
  { fromPath: "/pg853.html", toPath: "/ja/teachings" },
  { fromPath: "/pg641.html", toPath: "/ja/teachings/dharma-article" },
  { fromPath: "/pg642.html", toPath: "/ja/teachings/video-howa" },
  { fromPath: "/pg643.html", toPath: "/ja/teachings/sonota-no-howa" },
  { fromPath: "/pg805.html", toPath: "/ja/teachings/nenji-howa-2023" },
  { fromPath: "/pg916.html", toPath: "/ja/teachings/shoseki" },
  { fromPath: "/pg852.html", toPath: "/ja/teachings/online-training" },
  { fromPath: "/pg855.html", toPath: "/ja/teachings/keifu-training-2" },
  { fromPath: "/pg856.html", toPath: "/ja/teachings/jiko-naisei-course" },
];
