// Footer data constants for ZEYREY e-commerce footer

export interface FooterCategory {
  name: string;
  url: string;
}

export interface FooterCategorySection {
  title: string;
  categories: FooterCategory[];
}

export interface AboutContentSection {
  title: string;
  content: string;
}

// About ZEYREY content sections
export const ABOUT_CONTENT: AboutContentSection[] = [
  {
    title: "Discover a World of Affordable Fashion & Everyday Essentials",
    content:
      "Upgrade your wardrobe and stock your home with the latest trends and essentials at prices designed for everyday value. ZEYREY offers a vast selection of products across all categories, ensuring you find everything you need at prices suited for everyday budgets.",
  },
  {
    title: "Shop Millions of Products Across All Categories",
    content:
      "From trendy fashion finds to essential homeware, ZEYREY is your one-stop shop for everything you need. Explore millions of products across a wide variety of categories, ensuring you find the perfect item for any occasion.",
  },
  {
    title: "Latest Women's Fashion Is Right Here",
    content:
      "Are you looking to revamp your wardrobe with stylish and affordable pieces? Look no further than ZEYREY's extensive collection of women's western wear. Find trendy dresses, casual jeans, and comfortable tops suitable for any occasion. Our collection reflects current trends, with fresh styles added regularly, ensuring you stay on top of your fashion game. Elevate your outfit and add a touch of personality with our diverse range of accessories, jewelry sets, handbags, and footwear to complement your style.",
  },
  {
    title: "Largest Collection of Menswear and Accessories",
    content:
      "Upgrade your casual or formal attire with ZEYREY's men's wear collection. We offer a vast selection of T-shirts, jeans, polos, coats, and shirts in all sizes. Our user-friendly search tool allows you to filter by size, color, and material, making it easy to find the perfect fit. Explore our collection of trendy accessories, including wallets, cufflinks, and bags, to add a touch of sophistication to your look. Need a new sherwani or any Indian Attire for an upcoming wedding function? Check out our latest men's ethnic wear collection.",
  },
  {
    title: "Top Quality Beauty & Personal Care Products",
    content:
      "With thousands of different cosmetic brands and products, finding the right skincare, haircare & makeup products for you can be overwhelming. Our selection focuses on skincare and beauty products curated for comfort and care. From foundations and concealers to mascaras, eyeshadows, and lipsticks — you'll find all your makeup essentials in one place.",
  },
  {
    title: "Baby Care & Kids Fashion Wear",
    content:
      "Parenthood calls for constant buying of new clothes for your kids! Whether you're looking for trendy baby clothes or just want affordable and trendy kidswear, Browse a variety of options for children of all ages, from everyday wear to festive styles. You'll find everything from pink rompers and dresses for girls to sets and jeans for boys. Plus, we have ethnic wear and accessories for all ages of kids, from newborns to grown-ups.",
  },
  {
    title: "Shop Home Decor & Kitchen Products, Electronics, and Much More",
    content:
      "If you want to elevate your kitchen space, then you've come to the right place! Discover and browse a wide variety of quality home products, kitchen essentials like cooking utensils and serveware, kitchen storage, appliances like blenders, choppers, cooktops, and more! Home styling is not just a trend but a necessity of the hour for every home. ZEYREY offers a variety of home decor essentials across styles and budgets. At ZEYREY, you'll find a variety of gadgets and accessories for your everyday electronic needs.",
  },
  {
    title: "Health, Fitness & Sports",
    content:
      "Health is wealth! We know how important it is for you to take care of your health and your family's fitness. Explore a range of fitness and wellness products suited for home workouts and everyday use. You will find a wide variety of fitness equipment, health supplements, foods, nuts, and many more at very affordable prices. Get started with your home workouts by shopping for dumbbell sets, exercise bands, exercise mats, skipping ropes, sports kits, and more!",
  },
  {
    title: "Office Supplies and Stationery",
    content:
      "We have a wide range of stationery items which will help you stay tidy and organised. You can buy notebooks, diaries and notepads and craft supplies which are great for school and college, or you can buy office supplies which are great for adults. We have a variety of pens, pencils, and other stationery supplies to ensure that you have what you need to write down your thoughts, make lists and so much more.",
  },
];

// Product category sections with links
export const FOOTER_CATEGORIES: FooterCategorySection[] = [
  {
    title: "Baby",
    categories: [
      { name: "Baby Blanket", url: "/shop?category=Baby Blanket" },
      { name: "Baby Hanging Cradle", url: "/shop?category=Baby Hanging Cradle" },
      { name: "Baby Pillows", url: "/shop?category=Baby Pillows" },
      { name: "Baby Sleeping Bag", url: "/shop?category=Baby Sleeping Bag" },
      { name: "Baby Towels", url: "/shop?category=Baby Towels" },
    ],
  },
  {
    title: "Electronics & Accessories",
    categories: [
      { name: "Android Smart Watches", url: "/shop?category=Android Smart Watches" },
      { name: "Bluetooth Earphones", url: "/shop?category=Bluetooth Earphones" },
      { name: "Bluetooth Speakers", url: "/shop?category=Bluetooth Speakers" },
      { name: "Car Mobile Holders", url: "/shop?category=Car Mobile Holders" },
      { name: "CCTV Cameras", url: "/shop?category=CCTV Cameras" },
      { name: "Data Cables", url: "/shop?category=Data Cables" },
      { name: "Earphones", url: "/shop?category=Earphones" },
    ],
  },
  {
    title: "Home & Kitchen",
    categories: [
      { name: "Aprons", url: "/shop?category=Aprons" },
      { name: "Choppers", url: "/shop?category=Choppers" },
      { name: "Chopping Boards", url: "/shop?category=Chopping Boards" },
      { name: "Cookers", url: "/shop?category=Cookers" },
      { name: "Cutlery", url: "/shop?category=Cutlery" },
      { name: "Food Processors", url: "/shop?category=Food Processors" },
      { name: "Juicer", url: "/shop?category=Juicer" },
    ],
  },
  {
    title: "Home & Living",
    categories: [
      { name: "Bean Bags", url: "/shop?category=Bean Bags" },
      { name: "Bedding Sets", url: "/shop?category=Bedding Sets" },
      { name: "Blankets", url: "/shop?category=Blankets" },
      { name: "Cotton Bedsheets", url: "/shop?category=Cotton Bedsheets" },
      { name: "Cushions", url: "/shop?category=Cushions" },
      { name: "Curtains & Sheers", url: "/shop?category=Curtains & Sheers" },
      { name: "Pillow Covers", url: "/shop?category=Pillow Covers" },
    ],
  },
  {
    title: "Kids",
    categories: [
      { name: "Girls Stylish Tops", url: "/shop?category=Girls Stylish Tops" },
      { name: "Kids Blazers", url: "/shop?category=Kids Blazers" },
      { name: "Kids Ethnic Gowns", url: "/shop?category=Kids Ethnic Gowns" },
      { name: "Kids Kurtis & Kurtas", url: "/shop?category=Kids Kurtis & Kurtas" },
      { name: "Kids Lunch Boxes", url: "/shop?category=Kids Lunch Boxes" },
      { name: "Rompers", url: "/shop?category=Rompers" },
      { name: "Tshirts Boys", url: "/shop?category=Tshirts Boys" },
    ],
  },
  {
    title: "Men Accessories",
    categories: [
      { name: "Gold Jewellery Men", url: "/shop?category=Gold Jewellery Men" },
      { name: "Leather Watches Men", url: "/shop?category=Leather Watches Men" },
      { name: "Men Crossbody Bags", url: "/shop?category=Men Crossbody Bags" },
      { name: "Men Keychains", url: "/shop?category=Men Keychains" },
      { name: "Men Scarves", url: "/shop?category=Men Scarves" },
      { name: "Men Socks", url: "/shop?category=Men Socks" },
    ],
  },
  {
    title: "Men Ethnicwear",
    categories: [
      { name: "Men Dhoti Kurtas", url: "/shop?category=Men Dhoti Kurtas" },
      { name: "Men Dhotis", url: "/shop?category=Men Dhotis" },
      { name: "Men Indo Western Dresses", url: "/shop?category=Men Indo Western Dresses" },
      { name: "Men Velvet Sherwanis", url: "/shop?category=Men Velvet Sherwanis" },
    ],
  },
  {
    title: "Men Footwear",
    categories: [
      { name: "Leather Loafers Men", url: "/shop?category=Leather Loafers Men" },
      { name: "Men Sandals", url: "/shop?category=Men Sandals" },
      { name: "Reebok Sports Shoes Men", url: "/shop?category=Reebok Sports Shoes Men" },
    ],
  },
  {
    title: "Men Western Wear",
    categories: [
      { name: "Cotton Shorts Men", url: "/shop?category=Cotton Shorts Men" },
      { name: "Denim Jeans Men", url: "/shop?category=Denim Jeans Men" },
      { name: "Formal Shirts Men", url: "/shop?category=Formal Shirts Men" },
      { name: "Formal Trousers Men", url: "/shop?category=Formal Trousers Men" },
      { name: "Leather Jackets Men", url: "/shop?category=Leather Jackets Men" },
      { name: "Printed Tshirts", url: "/shop?category=Printed Tshirts" },
    ],
  },
  {
    title: "Personal Care & Wellness",
    categories: [
      { name: "BB Cream", url: "/shop?category=BB Cream" },
      { name: "Beard Oil", url: "/shop?category=Beard Oil" },
      { name: "Body Scrub", url: "/shop?category=Body Scrub" },
      { name: "Compact", url: "/shop?category=Compact" },
      { name: "Deodorants", url: "/shop?category=Deodorants" },
      { name: "Hair Care", url: "/shop?category=Hair Care" },
      { name: "Lip Balm", url: "/shop?category=Lip Balm" },
    ],
  },
  {
    title: "Women Accessories",
    categories: [
      { name: "Ankle Socks Women", url: "/shop?category=Ankle Socks Women" },
      { name: "Bindis", url: "/shop?category=Bindis" },
      { name: "Chandbali Earrings", url: "/shop?category=Chandbali Earrings" },
      { name: "Clutches", url: "/shop?category=Clutches" },
      { name: "Hair Accessories", url: "/shop?category=Hair Accessories" },
      { name: "Handbags", url: "/shop?category=Handbags" },
      { name: "Jewellery Set", url: "/shop?category=Jewellery Set" },
    ],
  },
  {
    title: "Women Ethnicwear",
    categories: [
      { name: "Abaya", url: "/shop?category=Abaya" },
      { name: "Black Kurta", url: "/shop?category=Black Kurta" },
      { name: "Blouse Piece", url: "/shop?category=Blouse Piece" },
      { name: "Chikankari Kurtis", url: "/shop?category=Chikankari Kurtis" },
      { name: "Designer Lehenga", url: "/shop?category=Designer Lehenga" },
      { name: "Designer Suits", url: "/shop?category=Designer Suits" },
      { name: "Silk Saree", url: "/shop?category=Silk Saree" },
    ],
  },
  {
    title: "Women Footwear",
    categories: [
      { name: "Bellies", url: "/shop?category=Bellies" },
      { name: "Juttis & Mojaris", url: "/shop?category=Juttis & Mojaris" },
      { name: "Women Slippers", url: "/shop?category=Women Slippers" },
    ],
  },
  {
    title: "Women Western Wear",
    categories: [
      { name: "Ankle Length Leggings", url: "/shop?category=Ankle Length Leggings" },
      { name: "Black Camisoles", url: "/shop?category=Black Camisoles" },
      { name: "Capris", url: "/shop?category=Capris" },
      { name: "Denim Women Shorts", url: "/shop?category=Denim Women Shorts" },
      { name: "Designer Gown", url: "/shop?category=Designer Gown" },
      { name: "Printed Leggings", url: "/shop?category=Printed Leggings" },
      { name: "Women Jackets", url: "/shop?category=Women Jackets" },
    ],
  },
];

// Community and app download content
export const COMMUNITY_CONTENT = {
  title: "Join the ZEYREY Community",
  description:
    "For a seamless online shopping experience, feel free to download the ZEYREY App. With millions of happy customers, we believe in growing our community. To give you a hassle-free online shopping experience, plenty of user-friendly features will make your shopping online easier than ever. ZEYREY offers multiple payment options, debit and credit cards, UPI, and COD, to help you with a smooth checkout process. For any queries or concerns, send us an email at support@zeyrey.net.",
};

export const APP_DOWNLOAD_CONTENT = {
  title: "Download ZEYREY App Now",
  subtitle: "More Than Just Shopping",
  description: "Interested in selling online? ZEYREY enables individuals to start their selling journey with ease.",
};
