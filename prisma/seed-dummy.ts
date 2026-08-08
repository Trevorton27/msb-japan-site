import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Load env vars before creating client
const root = path.join(__dirname, "..");
const envFile = fs.existsSync(path.join(root, ".env.local"))
  ? path.join(root, ".env.local")
  : path.join(root, ".env");
for (const line of fs.readFileSync(envFile, "utf-8").split("\n")) {
  const match = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
  if (match && match[1] && !process.env[match[1]]) {
    process.env[match[1]] = match[2] ?? "";
  }
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const books = [
    {
      slugJa: "rinpoche-no-oshie",
      slugEn: "teachings-of-rinpoche",
      titleJa: "リンポチェの教え",
      titleEn: "Teachings of Rinpoche",
      authorJa: "ジグメ・リンパ・リンポチェ",
      authorEn: "Jigme Rinpa Rinpoche",
      descriptionJa: "ジグメ・リンパ・リンポチェによる仏教の本質的な教えをまとめた一冊。瞑想の実践と日常生活における智慧の応用について詳しく解説されています。",
      descriptionEn: "A collection of essential Buddhist teachings covering meditation practice and the application of wisdom in daily life.",
      imageUrl: "/images/placeholder-book.svg",
      active: true,
      sortOrder: 1,
    },
    {
      slugJa: "kokoro-no-heiwa",
      slugEn: "peace-of-mind",
      titleJa: "こころの平和",
      titleEn: "Peace of Mind",
      authorJa: "ダライ・ラマ14世",
      authorEn: "His Holiness the Dalai Lama",
      descriptionJa: "ダライ・ラマ14世によるこころの平和を育む実践的な指南書。困難な時代に内なる静けさを見つける方法を丁寧に説明しています。",
      descriptionEn: "A practical guide to cultivating inner peace, explaining how to find stillness within during difficult times.",
      imageUrl: "/images/placeholder-book.svg",
      active: true,
      sortOrder: 2,
    },
    {
      slugJa: "bodhicitta-nyumon",
      slugEn: "introduction-to-bodhicitta",
      titleJa: "菩提心入門",
      titleEn: "Introduction to Bodhicitta",
      authorJa: "ミンリン・トリチェン",
      authorEn: "Minling Trichen Rinpoche",
      descriptionJa: "菩提心とは何か、そしてどのように日々の修行の中で育てていくかを説いた入門書。",
      descriptionEn: "An introduction to the nature of Bodhicitta and how to cultivate it within daily practice.",
      imageUrl: "/images/placeholder-book.svg",
      active: true,
      sortOrder: 3,
    },
    {
      slugJa: "vajrayana-no-michi",
      slugEn: "path-of-vajrayana",
      titleJa: "ヴァジュラヤーナの道",
      titleEn: "The Path of Vajrayana",
      authorJa: "ソギャル・リンポチェ",
      authorEn: "Sogyal Rinpoche",
      descriptionJa: "ヴァジュラヤーナ仏教の道への入門書。灌頂、修行、見解について包括的に解説しています。",
      descriptionEn: "A comprehensive introduction to the Vajrayana Buddhist path, covering empowerments, practices, and view.",
      imageUrl: "/images/placeholder-book.svg",
      active: true,
      sortOrder: 4,
    },
  ];

  for (const book of books) {
    await prisma.book.upsert({
      where: { slugJa: book.slugJa },
      update: book,
      create: book,
    });
  }
  console.log(`Seeded ${books.length} books`);

  const centers = [
    {
      slugJa: "tokyo-center",
      slugEn: "tokyo-center",
      nameJa: "東京ダルマセンター",
      nameEn: "Tokyo Dharma Center",
      locationJa: "東京都渋谷区",
      locationEn: "Shibuya, Tokyo",
      country: "Japan",
      descriptionJa: "東京の中心に位置するダルマセンター。定期的な瞑想セッションと法話を開催しています。すべてのレベルの修行者を歓迎します。",
      descriptionEn: "Located in the heart of Tokyo, this dharma center hosts regular meditation sessions and teachings. All levels of practitioners are welcome.",
      imageUrl: "/images/placeholder-center.svg",
      active: true,
      sortOrder: 1,
    },
    {
      slugJa: "kyoto-center",
      slugEn: "kyoto-center",
      nameJa: "京都ダルマセンター",
      nameEn: "Kyoto Dharma Center",
      locationJa: "京都市左京区",
      locationEn: "Sakyo, Kyoto",
      country: "Japan",
      descriptionJa: "古都京都の静かな環境の中で修行できるセンター。リトリートや集中修行を定期的に開催しています。",
      descriptionEn: "A center for practice in the serene environment of the ancient capital of Kyoto. Regular retreats are held throughout the year.",
      imageUrl: "/images/placeholder-center.svg",
      active: true,
      sortOrder: 2,
    },
    {
      slugJa: "new-york-center",
      slugEn: "new-york-center",
      nameJa: "ニューヨークダルマセンター",
      nameEn: "New York Dharma Center",
      locationJa: "ニューヨーク市マンハッタン",
      locationEn: "Manhattan, New York",
      country: "USA",
      descriptionJa: "ニューヨーク市の中心にあるセンター。英語と日本語でのプログラムを提供しています。",
      descriptionEn: "A center in New York City offering programs in both English and Japanese for practitioners of all backgrounds.",
      imageUrl: "/images/placeholder-center.svg",
      active: true,
      sortOrder: 3,
    },
    {
      slugJa: "london-center",
      slugEn: "london-center",
      nameJa: "ロンドンダルマセンター",
      nameEn: "London Dharma Center",
      locationJa: "ロンドン市内",
      locationEn: "Central London",
      country: "UK",
      descriptionJa: "ロンドン中心部に位置するセンター。ヨーロッパ全域からの修行者を受け入れています。",
      descriptionEn: "Situated in central London, this center welcomes practitioners from across Europe.",
      imageUrl: "/images/placeholder-center.svg",
      active: true,
      sortOrder: 4,
    },
    {
      slugJa: "paris-center",
      slugEn: "paris-center",
      nameJa: "パリダルマセンター",
      nameEn: "Paris Dharma Center",
      locationJa: "パリ市内",
      locationEn: "Paris",
      country: "France",
      descriptionJa: "パリに拠点を置くセンター。フランス語と英語でのプログラムを提供しています。",
      descriptionEn: "Based in Paris, offering programs in French and English for European practitioners.",
      imageUrl: "/images/placeholder-center.svg",
      active: true,
      sortOrder: 5,
    },
    {
      slugJa: "sydney-center",
      slugEn: "sydney-center",
      nameJa: "シドニーダルマセンター",
      nameEn: "Sydney Dharma Center",
      locationJa: "シドニー",
      locationEn: "Sydney",
      country: "Australia",
      descriptionJa: "オーストラリア・シドニーのダルマセンター。アジア太平洋地域の修行者コミュニティをサポートしています。",
      descriptionEn: "The Sydney dharma center supporting the practitioner community across the Asia-Pacific region.",
      imageUrl: "/images/placeholder-center.svg",
      active: true,
      sortOrder: 6,
    },
  ];

  for (const center of centers) {
    await prisma.dharmaCenter.upsert({
      where: { slugJa: center.slugJa },
      update: center,
      create: center,
    });
  }
  console.log(`Seeded ${centers.length} dharma centers`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
