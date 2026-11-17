import { PrismaClient } from "@prisma/client";
import {
  LaptopGrade,
  LaptopStatus,
  AdminRole,
  ReviewStatus,
} from "../src/types/enums";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting NextGen IT Hub full production database seed...");

  // 1. Site Counters
  console.log("Seeding Site Counters...");
  const counters = [
    { key: "laptops_sold", value: 12450, label: "Refurbished Laptops Sold" },
    { key: "happy_customers", value: 11800, label: "Satisfied Customers Across India" },
    { key: "corporate_clients", value: 650, label: "B2B & Startup Clients" },
    { key: "cities_served", value: 45, label: "Cities with Express Delivery" },
  ];

  for (const c of counters) {
    await prisma.siteCounter.upsert({
      where: { key: c.key },
      update: { value: c.value, label: c.label },
      create: { key: c.key, value: c.value, label: c.label },
    });
  }

  // 2. Site Settings
  console.log("Seeding Site Settings...");
  const settings = [
    { key: "announcement_bar", value: "🎉 Festive Special: Extra 5% off on prepaid UPI orders | 6-Month Warranty on all Grade A+ Laptops!", group: "general" },
    { key: "company_name", value: "NextGen IT Hub Private Limited", group: "company" },
    { key: "company_email", value: "support@nextgenithub.in", group: "company" },
    { key: "company_phone", value: "+91 98200 12345", group: "company" },
    { key: "whatsapp_number", value: "+91 98200 12345", group: "company" },
    { key: "company_address", value: "Plot 42, Electronics Zone, MIDC Andheri East, Mumbai, Maharashtra 400093", group: "company" },
    { key: "company_gstin", value: "27AABCN8901L1Z8", group: "legal" },
    { key: "company_cin", value: "U72900MH2020PTC345678", group: "legal" },
    { key: "default_warranty_months", value: "6", group: "policy" },
    { key: "return_window_days", value: "7", group: "policy" },
  ];

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value, group: s.group },
      create: { key: s.key, value: s.value, group: s.group },
    });
  }

  // 3. Admin User
  console.log("Seeding Super Admin...");
  await prisma.adminUser.upsert({
    where: { email: "admin@nextgenithub.in" },
    update: {},
    create: {
      email: "admin@nextgenithub.in",
      name: "NextGen Super Admin",
      role: AdminRole.SUPER_ADMIN,
      passwordHash: "$2a$12$e8rOsu9wMhP0MszY84Uu0O57E5c8w4EeqoPknYwV2u54sX1pP6Lqa",
      twoFactorEnabled: true,
      permissions: { all: true },
    },
  });

  // 4. Brands
  console.log("Seeding Brands...");
  const brandsData = [
    { name: "Dell", slug: "dell", logoUrl: "/images/brands/dell.svg" },
    { name: "Lenovo", slug: "lenovo", logoUrl: "/images/brands/lenovo.svg" },
    { name: "HP", slug: "hp", logoUrl: "/images/brands/hp.svg" },
    { name: "Apple", slug: "apple", logoUrl: "/images/brands/apple.svg" },
    { name: "Asus", slug: "asus", logoUrl: "/images/brands/asus.svg" },
  ];

  const brandMap = new Map<string, string>();
  for (const b of brandsData) {
    const brand = await prisma.brand.upsert({
      where: { slug: b.slug },
      update: { name: b.name },
      create: b,
    });
    brandMap.set(b.name, brand.id);
  }

  // 5. Categories
  console.log("Seeding Categories...");
  const categoriesData = [
    { name: "Business & Enterprise", slug: "business-enterprise", description: "Rugged, secure machines designed for corporate daily workflows", sortOrder: 1 },
    { name: "Student & Everyday", slug: "student-everyday", description: "Affordable, lightweight laptops ideal for coding, lectures, and browse", sortOrder: 2 },
    { name: "High-Performance Workstations", slug: "workstations", description: "Heavy duty compute with dedicated GPUs for engineering, CAD & video", sortOrder: 3 },
    { name: "Ultrabooks & Thin-and-Light", slug: "ultrabooks", description: "Premium magnesium and aluminum portability with 8h+ battery longevity", sortOrder: 4 },
  ];

  const categoryMap = new Map<string, string>();
  for (const c of categoriesData) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description, sortOrder: c.sortOrder },
      create: c,
    });
    categoryMap.set(c.name, cat.id);
  }

  // 6. 20 Laptops
  console.log("Seeding 20 Refurbished Laptops...");
  const laptopsData = [
    {
      model: "Dell Latitude 7490",
      slug: "dell-latitude-7490-i5-8th-16gb-512gb",
      brand: "Dell",
      category: "Business & Enterprise",
      grade: LaptopGrade.A_PLUS,
      mrp: 7500000,
      price: 2499900,
      cost: 1650000,
      cpu: "Intel Core i5-8350U Quad-Core 1.7GHz (Up to 3.6GHz)",
      ram: "16GB DDR4",
      storage: "512GB NVMe M.2 SSD",
      display: "14.0\" Full HD (1920x1080) Anti-Glare IPS",
      os: "Windows 11 Pro 64-bit Genuine",
      battery: "4-Cell 60Wh Li-Ion (Good Health > 85%)",
      warranty: "6 Months Comprehensive Warranty",
      conditionNotes: "Flawless screen and top cover. Minor unnoticeable scuff near rubber feet.",
      units: 12,
    },
    {
      model: "Lenovo ThinkPad T480 Dual Battery",
      slug: "lenovo-thinkpad-t480-i5-16gb-256gb",
      brand: "Lenovo",
      category: "Business & Enterprise",
      grade: LaptopGrade.A_PLUS,
      mrp: 8500000,
      price: 2649900,
      cost: 1780000,
      cpu: "Intel Core i5-8250U Quad-Core 1.6GHz (Up to 3.4GHz)",
      ram: "16GB DDR4 (Expandable to 32GB)",
      storage: "256GB PCIe NVMe Opal2 SSD",
      display: "14.0\" FHD (1920x1080) Matte IPS 250 nits",
      os: "Windows 11 Pro Genuine",
      battery: "Dual Battery System (24Wh internal + 48Wh hot-swappable external)",
      warranty: "6 Months Comprehensive Warranty",
      conditionNotes: "Legendary tactile ThinkPad keyboard in brand-new condition. 100% tested trackpoint.",
      units: 8,
    },
    {
      model: "HP EliteBook 840 G6 Aluminum",
      slug: "hp-elitebook-840-g6-i7-16gb-512gb",
      brand: "HP",
      category: "Business & Enterprise",
      grade: LaptopGrade.A,
      mrp: 9500000,
      price: 3199900,
      cost: 2200000,
      cpu: "Intel Core i7-8565U Quad-Core 1.8GHz (Up to 4.6GHz)",
      ram: "16GB DDR4",
      storage: "512GB PCIe NVMe SSD",
      display: "14.0\" Full HD IPS Anti-Glare with Bang & Olufsen Audio",
      os: "Windows 11 Pro Genuine",
      battery: "HP Long Life 3-cell 50Wh Li-ion",
      warranty: "6 Months Comprehensive Warranty",
      conditionNotes: "Sleek silver aluminum chassis. Barely visible cosmetic micro-scratch on bottom plate.",
      units: 6,
    },
    {
      model: "Apple MacBook Air M1 (Space Grey)",
      slug: "apple-macbook-air-m1-8gb-256gb-space-grey",
      brand: "Apple",
      category: "Ultrabooks & Thin-and-Light",
      grade: LaptopGrade.A_PLUS,
      mrp: 9990000,
      price: 5299900,
      cost: 4100000,
      cpu: "Apple M1 chip with 8-core CPU and 7-core GPU, 16-core Neural Engine",
      ram: "8GB Unified Memory",
      storage: "256GB High-Speed SSD",
      display: "13.3\" Retina Display with True Tone (2560x1600)",
      os: "macOS Sonoma pre-installed",
      battery: "49.9Wh Lithium Polymer (Battery cycle count < 95, 92%+ health)",
      warranty: "6 Months Comprehensive Warranty",
      conditionNotes: "Pristine display with anti-reflective coating intact. Battery cycle low.",
      units: 5,
    },
    {
      model: "Dell Latitude 5400 Business Notebook",
      slug: "dell-latitude-5400-i5-8th-8gb-256gb",
      brand: "Dell",
      category: "Business & Enterprise",
      grade: LaptopGrade.A,
      mrp: 6800000,
      price: 2199900,
      cost: 1450000,
      cpu: "Intel Core i5-8265U Quad-Core 1.6GHz",
      ram: "8GB DDR4 (Upgrade available)",
      storage: "256GB M.2 Solid State Drive",
      display: "14.0\" HD WLED Anti-glare Display",
      os: "Windows 10/11 Pro Genuine",
      battery: "68Wh ExpressCharge Capable Battery",
      warranty: "6 Months Comprehensive Warranty",
      conditionNotes: "Great budget corporate warrior. Clean keyboard and snappy performance.",
      units: 15,
    },
    {
      model: "Lenovo ThinkPad X1 Carbon Gen 6",
      slug: "lenovo-thinkpad-x1-carbon-6th-gen-i7",
      brand: "Lenovo",
      category: "Ultrabooks & Thin-and-Light",
      grade: LaptopGrade.A_PLUS,
      mrp: 14500000,
      price: 3699900,
      cost: 2600000,
      cpu: "Intel Core i7-8650U vPro Quad-Core (Up to 4.2GHz)",
      ram: "16GB LPDDR3",
      storage: "512GB NVMe SSD Opal 2.0",
      display: "14.0\" FHD (1920x1080) IPS 300 nits Anti-glare",
      os: "Windows 11 Pro Genuine",
      battery: "57Wh RapidCharge battery (1.13 kg ultra-lightweight)",
      warranty: "6 Months Comprehensive Warranty",
      conditionNotes: "Featherlight carbon fiber body. Zero dead pixels, excellent thermals.",
      units: 4,
    },
    {
      model: "Apple MacBook Pro 13 Touch Bar (2019)",
      slug: "apple-macbook-pro-13-2019-i5-8gb-256gb",
      brand: "Apple",
      category: "Ultrabooks & Thin-and-Light",
      grade: LaptopGrade.A,
      mrp: 11990000,
      price: 4499900,
      cost: 3300000,
      cpu: "Intel Core i5 Quad-Core 1.4GHz (Turbo Boost up to 3.9GHz)",
      ram: "8GB 2133MHz LPDDR3",
      storage: "256GB SSD",
      display: "13.3\" Retina Display with True Tone and Touch Bar",
      os: "macOS Ventura Genuine",
      battery: "58.2Wh Lithium Polymer (Tested 88% capacity)",
      warranty: "6 Months Comprehensive Warranty",
      conditionNotes: "Touch Bar and Touch ID fully functional. Light surface wear on outer lid.",
      units: 3,
    },
    {
      model: "HP ProBook 450 G6 (15.6-inch Numeric Keypad)",
      slug: "hp-probook-450-g6-i5-8th-8gb-512gb",
      brand: "HP",
      category: "Student & Everyday",
      grade: LaptopGrade.A,
      mrp: 6500000,
      price: 2349900,
      cost: 1550000,
      cpu: "Intel Core i5-8265U Quad-Core 1.6GHz",
      ram: "8GB DDR4 RAM",
      storage: "512GB NVMe SSD",
      display: "15.6\" diagonal FHD IPS anti-glare with full Numpad",
      os: "Windows 11 Pro",
      battery: "HP 3-cell 45Wh Long Life Li-ion",
      warranty: "6 Months Comprehensive Warranty",
      conditionNotes: "Great 15.6-inch form factor for accountants and developers needing dedicated numpad.",
      units: 10,
    },
    {
      model: "Dell Precision 3530 Mobile Workstation",
      slug: "dell-precision-3530-xeon-32gb-1tb-quadro",
      brand: "Dell",
      category: "High-Performance Workstations",
      grade: LaptopGrade.A_PLUS,
      mrp: 17500000,
      price: 4299900,
      cost: 3000000,
      cpu: "Intel Xeon E-2176M 6-Core 12-Thread 2.7GHz (Up to 4.4GHz)",
      ram: "32GB ECC DDR4",
      storage: "1TB NVMe Solid State Drive",
      display: "15.6\" FHD (1920x1080) Wide View Anti-Glare + Nvidia Quadro P600 4GB",
      os: "Windows 11 Pro for Workstations",
      battery: "92Wh 6-cell Lithium Ion High-Capacity",
      warranty: "6 Months Comprehensive Warranty",
      conditionNotes: "Workhorse ISV-certified machine for AutoCAD, SolidWorks, and Blender 3D.",
      units: 3,
    },
    {
      model: "Lenovo ThinkPad L390 Yoga 2-in-1 Touch",
      slug: "lenovo-thinkpad-l390-yoga-i5-8th-16gb-256gb",
      brand: "Lenovo",
      category: "Student & Everyday",
      grade: LaptopGrade.A,
      mrp: 7800000,
      price: 2599900,
      cost: 1720000,
      cpu: "Intel Core i5-8265U Quad-Core 1.6GHz",
      ram: "16GB DDR4",
      storage: "256GB PCIe SSD",
      display: "13.3\" FHD IPS Touchscreen 360-degree flip with integrated ThinkPad Pen Pro",
      os: "Windows 11 Pro",
      battery: "45Wh Rapid Charge battery",
      warranty: "6 Months Comprehensive Warranty",
      conditionNotes: "Versatile 360 convertible hinge. Active stylus included in dedicated silo.",
      units: 7,
    },
    {
      model: "Dell Latitude 7390 2-in-1 Convertible",
      slug: "dell-latitude-7390-2-in-1-i5-8th-16gb-256gb",
      brand: "Dell",
      category: "Ultrabooks & Thin-and-Light",
      grade: LaptopGrade.A,
      mrp: 8200000,
      price: 2449900,
      cost: 1600000,
      cpu: "Intel Core i5-8350U Quad-Core 1.7GHz",
      ram: "16GB LPDDR3",
      storage: "256GB NVMe SSD",
      display: "13.3\" FHD Touch Corning Gorilla Glass 4",
      os: "Windows 11 Pro",
      battery: "60Wh Li-ion ExpressCharge",
      warranty: "6 Months Comprehensive Warranty",
      conditionNotes: "Crisp touchscreen display with tablet mode support.",
      units: 6,
    },
    {
      model: "HP EliteBook x360 1030 G3",
      slug: "hp-elitebook-x360-1030-g3-i7-16gb-512gb",
      brand: "HP",
      category: "Ultrabooks & Thin-and-Light",
      grade: LaptopGrade.A_PLUS,
      mrp: 13500000,
      price: 3499900,
      cost: 2400000,
      cpu: "Intel Core i7-8650U vPro 1.9GHz Quad-Core",
      ram: "16GB LPDDR3",
      storage: "512GB PCIe NVMe SSD",
      display: "13.3\" FHD Touch SureView Privacy Screen",
      os: "Windows 11 Pro",
      battery: "56.2Wh Long-Life battery with fast charging",
      warranty: "6 Months Comprehensive Warranty",
      conditionNotes: "CNC machined aluminum unibody. Integrated SureView privacy shutter for planes and cafes.",
      units: 5,
    },
    {
      model: "Apple MacBook Air 13 (2017) Value Edition",
      slug: "apple-macbook-air-2017-i5-8gb-128gb",
      brand: "Apple",
      category: "Student & Everyday",
      grade: LaptopGrade.B,
      mrp: 7500000,
      price: 2299900,
      cost: 1500000,
      cpu: "Intel Core i5 Dual-Core 1.8GHz",
      ram: "8GB 1600MHz LPDDR3",
      storage: "128GB PCIe SSD",
      display: "13.3\" Widescreen LED-backlit Display",
      os: "macOS Monterey Genuine",
      battery: "54Wh Li-Poly (Tested 82% capacity)",
      warranty: "6 Months Comprehensive Warranty",
      conditionNotes: "Grade B: Light ding on aluminum corner, 100% verified functional hardware. MagSafe 2 charger included.",
      units: 9,
    },
    {
      model: "Lenovo ThinkPad P52s Mobile Workstation",
      slug: "lenovo-thinkpad-p52s-i7-8th-32gb-512gb-quadro",
      brand: "Lenovo",
      category: "High-Performance Workstations",
      grade: LaptopGrade.A,
      mrp: 16000000,
      price: 3999900,
      cost: 2800000,
      cpu: "Intel Core i7-8550U Quad-Core 1.8GHz (Up to 4.0GHz)",
      ram: "32GB DDR4",
      storage: "512GB PCIe NVMe SSD",
      display: "15.6\" FHD IPS Anti-Glare with Nvidia Quadro P500 2GB",
      os: "Windows 11 Pro",
      battery: "Dual Power Bridge Battery System",
      warranty: "6 Months Comprehensive Warranty",
      conditionNotes: "Substantial desktop replacement for 3D modeling and data analysis.",
      units: 4,
    },
    {
      model: "Dell Inspiron 3593 (10th Gen Core i5)",
      slug: "dell-inspiron-3593-i5-10th-8gb-1tb-256gb",
      brand: "Dell",
      category: "Student & Everyday",
      grade: LaptopGrade.A,
      mrp: 5800000,
      price: 2699900,
      cost: 1850000,
      cpu: "Intel Core i5-1035G1 10th Gen Quad-Core (Up to 3.6GHz)",
      ram: "8GB DDR4 2666MHz",
      storage: "256GB SSD + 1TB HDD Hybrid",
      display: "15.6\" FHD Anti-Glare LED-Backlit Non-Touch",
      os: "Windows 11 Home Genuine",
      battery: "3-Cell 42Wh Polymer Battery",
      warranty: "6 Months Comprehensive Warranty",
      conditionNotes: "Dual drive storage speed + vast capacity. Excellent student study companion.",
      units: 8,
    },
    {
      model: "Asus ZenBook UX430UA Thin & Light",
      slug: "asus-zenbook-ux430ua-i5-8th-8gb-256gb",
      brand: "Asus",
      category: "Ultrabooks & Thin-and-Light",
      grade: LaptopGrade.A,
      mrp: 7200000,
      price: 2399900,
      cost: 1600000,
      cpu: "Intel Core i5-8250U 1.6GHz Quad-Core",
      ram: "8GB DDR4 RAM",
      storage: "256GB M.2 SATA SSD",
      display: "14.0\" FHD NanoEdge Bezel Display in 13-inch chassis",
      os: "Windows 11 Home",
      battery: "50Wh 3-cell Li-polymer",
      warranty: "6 Months Comprehensive Warranty",
      conditionNotes: "Royal Blue concentric circle spun-metal finish. Super compact 1.25 kg.",
      units: 5,
    },
    {
      model: "HP ZBook 14u G5 Ultrabook Workstation",
      slug: "hp-zbook-14u-g5-i7-8th-16gb-512gb-amd",
      brand: "HP",
      category: "High-Performance Workstations",
      grade: LaptopGrade.A_PLUS,
      mrp: 14000000,
      price: 3399900,
      cost: 2300000,
      cpu: "Intel Core i7-8550U Quad-Core 1.8GHz",
      ram: "16GB DDR4",
      storage: "512GB HP Z Turbo Drive NVMe",
      display: "14.0\" FHD IPS Anti-Glare with AMD Radeon Pro WX 3100 2GB GDDR5",
      os: "Windows 11 Pro",
      battery: "HP Long Life 3-cell 50Wh Li-ion",
      warranty: "6 Months Comprehensive Warranty",
      conditionNotes: "Certified workstation graphics in an ultra-slim chassis.",
      units: 4,
    },
    {
      model: "Lenovo ThinkPad E14 Gen 2 (Ryzen 5)",
      slug: "lenovo-thinkpad-e14-gen-2-ryzen-5-16gb-512gb",
      brand: "Lenovo",
      category: "Business & Enterprise",
      grade: LaptopGrade.A_PLUS,
      mrp: 6600000,
      price: 2899900,
      cost: 1980000,
      cpu: "AMD Ryzen 5 4500U 6-Core 6-Thread 2.3GHz (Up to 4.0GHz)",
      ram: "16GB DDR4 3200MHz",
      storage: "512GB PCIe M.2 SSD",
      display: "14.0\" FHD (1920x1080) IPS Anti-glare 250 nits",
      os: "Windows 11 Pro",
      battery: "45Wh battery with USB-C 65W Rapid Charging",
      warranty: "6 Months Comprehensive Warranty",
      conditionNotes: "Outstanding multi-core performance with 6 physical AMD Zen 2 cores.",
      units: 7,
    },
    {
      model: "Dell Latitude 5590 (15.6-inch Core i7)",
      slug: "dell-latitude-5590-i7-8th-16gb-512gb",
      brand: "Dell",
      category: "Business & Enterprise",
      grade: LaptopGrade.A,
      mrp: 8800000,
      price: 2949900,
      cost: 2050000,
      cpu: "Intel Core i7-8650U Quad-Core 1.9GHz",
      ram: "16GB DDR4",
      storage: "512GB Solid State Drive",
      display: "15.6\" FHD (1920x1080) Non-Touch with Numeric Pad",
      os: "Windows 11 Pro",
      battery: "68Wh 4-cell ExpressCharge",
      warranty: "6 Months Comprehensive Warranty",
      conditionNotes: "Comfortable spacious palmrest, dedicated numpad, and dual pointing stick.",
      units: 6,
    },
    {
      model: "Apple MacBook Pro 15 Retina (Touch Bar, 16GB, 512GB)",
      slug: "apple-macbook-pro-15-2018-i7-16gb-512gb-radeon",
      brand: "Apple",
      category: "High-Performance Workstations",
      grade: LaptopGrade.A,
      mrp: 19900000,
      price: 5899900,
      cost: 4400000,
      cpu: "Intel Core i7 6-Core 2.2GHz (Turbo Boost up to 4.1GHz)",
      ram: "16GB 2400MHz DDR4 onboard",
      storage: "512GB PCIe SSD",
      display: "15.4\" Retina Display (2880x1800) with Radeon Pro 555X 4GB",
      os: "macOS Sonoma",
      battery: "83.6Wh Lithium Polymer (Verified > 85% health)",
      warranty: "6 Months Comprehensive Warranty",
      conditionNotes: "Six blazing cores with large true-to-life Retina panel for audio/video mastering.",
      units: 3,
    },
  ];

  const createdLaptops = [];
  for (const l of laptopsData) {
    const brandId = brandMap.get(l.brand);
    const categoryId = categoryMap.get(l.category);
    const laptop = await prisma.laptop.upsert({
      where: { slug: l.slug },
      update: {
        sellingPrice: l.price,
        mrp: l.mrp,
        availableUnits: l.units,
        totalUnits: l.units,
      },
      create: {
        model: l.model,
        slug: l.slug,
        brandId: brandId!,
        categoryId: categoryId,
        grade: l.grade,
        status: LaptopStatus.AVAILABLE,
        mrp: l.mrp,
        sellingPrice: l.price,
        costPrice: l.cost,
        gstRate: 18,
        processor: l.cpu,
        ram: l.ram,
        storage: l.storage,
        display: l.display,
        os: l.os,
        battery: l.battery,
        warranty: l.warranty,
        conditionNotes: l.conditionNotes,
        totalUnits: l.units,
        availableUnits: l.units,
        shortDesc: `${l.cpu} | ${l.ram} | ${l.storage} | ${l.display}`,
        description: `Certified Refurbished ${l.model}. Subjected to our stringent 50-point diagnostic check covering logic board, CPU stress tests, display color uniformness, keyboard actuation, and battery health verification. Includes original compatible fast charger and 6 months pan-India doorstep warranty.`,
      },
    });
    createdLaptops.push(laptop);
  }

  // 7. Comparison Rows
  console.log("Seeding Comparison Rows...");
  const comparisons = [
    { feature: "Hardware Warranty", us: "6 Months Comprehensive on Motherboard, Screen, RAM & Battery", others: "7 to 30 Days (seller warranty only)", highlight: true, sortOrder: 1 },
    { feature: "Quality Diagnostic", us: "Rigorous 50-Point Hardware & Thermal Stress Benchmark Testing", others: "Basic boot check only", highlight: true, sortOrder: 2 },
    { feature: "Live Video Inspection", us: "Free 1-on-1 private video call with engineer before paying", others: "None (stock photos only)", highlight: true, sortOrder: 3 },
    { feature: "GST Input Invoice", us: "100% Legal GST tax invoice (18% input tax credit for businesses)", others: "Cash bills or invalid invoices", highlight: true, sortOrder: 4 },
    { feature: "Battery Health", us: "Guaranteed >80% battery capacity with test diagnostic report", others: "Unverified original degraded batteries", highlight: false, sortOrder: 5 },
    { feature: "Pan-India Free Shipping", us: "Insured transit with tamper-evident wooden-cushioned packaging", others: "Buyer pays shipping or standard courier", highlight: false, sortOrder: 6 },
  ];

  for (const comp of comparisons) {
    const existing = await prisma.comparisonRow.findFirst({ where: { feature: comp.feature } });
    if (!existing) {
      await prisma.comparisonRow.create({ data: comp });
    }
  }

  // 8. Blog Categories & 5 Blogs
  console.log("Seeding Blogs & Blog Categories...");
  const blogCats = [
    { name: "Buying Guides", slug: "buying-guides" },
    { name: "Tech Maintenance", slug: "tech-maintenance" },
    { name: "B2B & IT Procurement", slug: "b2b-it-procurement" },
  ];

  const blogCatMap = new Map<string, string>();
  for (const bc of blogCats) {
    const cat = await prisma.blogCategory.upsert({
      where: { slug: bc.slug },
      update: { name: bc.name },
      create: bc,
    });
    blogCatMap.set(bc.name, cat.id);
  }

  const blogs = [
    {
      title: "The Ultimate Guide to Buying Refurbished Laptops in India (2024)",
      slug: "ultimate-guide-buying-refurbished-laptops-india",
      category: "Buying Guides",
      excerpt: "Learn how to save up to 70% on enterprise-grade ThinkPads, Latitudes, and MacBooks without sacrificing reliability or performance.",
      content: `<p>Buying a refurbished laptop in India used to feel like a gamble in Nehru Place or Lamington Road. Today, professional refurbishment standards have turned certified pre-owned enterprise laptops into the smartest hardware investment for developers, students, and startups.</p><h3>Why Enterprise Grade Laptops Outlast Consumer Retail Models</h3><p>Enterprise machines like the Lenovo ThinkPad T-series, Dell Latitude 7000-series, and HP EliteBooks are built to US Military MIL-STD-810G standards with magnesium roll cages and spill-resistant keyboards. When certified and refurbished, they easily outlast brand-new budget consumer laptops costing twice as much.</p>`,
      author: "Aditya Verma",
      readTime: 6,
      tags: ["refurbished laptops", "buying guide", "thinkpad", "dell latitude"],
      isPublished: true,
      publishedAt: new Date(),
    },
    {
      title: "How Indian Startups Save 65% on IT Capex with B2B Bulk Laptops",
      slug: "startups-save-capex-b2b-bulk-refurbished-laptops",
      category: "B2B & IT Procurement",
      excerpt: "How scaling companies in Bengaluru, Pune, and Gurugram use refurbished fleets with GST input tax credit to stay lean.",
      content: `<p>For high-growth Indian startups, hardware procurement is one of the highest cash burns after payroll. Discover how transitioning from new ₹80,000 retail machines to ₹25,000 Grade A+ certified enterprise laptops with full 18% GST input credit frees up crucial runway.</p>`,
      author: "Pooja Sharma",
      readTime: 5,
      tags: ["b2b", "startups", "it capex", "gst credit"],
      isPublished: true,
      publishedAt: new Date(),
    },
    {
      title: "Decoding Laptop Refurbishment Grades: A+ vs A vs B Explained",
      slug: "decoding-laptop-refurbishment-grades-explained",
      category: "Buying Guides",
      excerpt: "Transparent definitions of cosmetic versus functional criteria so you know exactly what condition your laptop will arrive in.",
      content: `<p>At NextGen IT Hub, grading is never arbitrary. Grade A+ represents like-new cosmetic conditions with near-flawless surfaces, while Grade A represents light signs of handling on non-visible edges. Learn the full grading spectrum.</p>`,
      author: "Technical Operations Team",
      readTime: 4,
      tags: ["laptop grading", "refurbishment", "quality assurance"],
      isPublished: true,
      publishedAt: new Date(),
    },
    {
      title: "How to Maximize Battery Longevity on Your Refurbished Laptop",
      slug: "maximize-battery-longevity-refurbished-laptop",
      category: "Tech Maintenance",
      excerpt: "Expert tips on cycle charge limits, BIOS power thresholds, and thermal paste hygiene to make batteries last 4+ years.",
      content: `<p>Li-ion batteries degrade mainly from heat and constant 100% saturation voltage. Modern laptops from Dell and Lenovo offer battery threshold charging. Here is how you can set up charging limits in Windows and Linux.</p>`,
      author: "Vikram Mehta",
      readTime: 7,
      tags: ["battery health", "maintenance", "thinkpad power"],
      isPublished: true,
      publishedAt: new Date(),
    },
    {
      title: "Why Refurbished Electronics Are Critical for India's E-Waste Reduction",
      slug: "refurbished-electronics-e-waste-reduction-india",
      category: "B2B & IT Procurement",
      excerpt: "Extending the operational lifespan of high-grade computers prevents metric tonnes of carbon emissions and toxic landfill runoff.",
      content: `<p>India generates over 3 million metric tonnes of electronic waste annually. Every refurbished enterprise computer saves approximately 190 kg of CO2 equivalent that would otherwise be spent manufacturing a new machine.</p>`,
      author: "Sustainability Desk",
      readTime: 5,
      tags: ["sustainability", "e-waste", "green computing"],
      isPublished: true,
      publishedAt: new Date(),
    },
  ];

  for (const b of blogs) {
    const categoryId = blogCatMap.get(b.category);
    await prisma.blog.upsert({
      where: { slug: b.slug },
      update: { title: b.title, excerpt: b.excerpt, content: b.content },
      create: {
        title: b.title,
        slug: b.slug,
        categoryId: categoryId,
        excerpt: b.excerpt,
        content: b.content,
        author: b.author,
        readTime: b.readTime,
        tags: JSON.stringify(b.tags),
        isPublished: b.isPublished,
        publishedAt: b.publishedAt,
      },
    });
  }

  // 9. FAQ Categories & 15 FAQs
  console.log("Seeding FAQ Categories & 15 FAQs...");
  const faqCategories = [
    { name: "Warranty & Guarantee", slug: "warranty-guarantee", sortOrder: 1 },
    { name: "Orders & Shipping", slug: "orders-shipping", sortOrder: 2 },
    { name: "Testing & Quality", slug: "testing-quality", sortOrder: 3 },
    { name: "B2B & Bulk Orders", slug: "b2b-bulk-orders", sortOrder: 4 },
  ];

  const faqCatMap = new Map<string, string>();
  for (const fc of faqCategories) {
    const cat = await prisma.faqCategory.upsert({
      where: { slug: fc.slug },
      update: { name: fc.name, sortOrder: fc.sortOrder },
      create: fc,
    });
    faqCatMap.set(fc.name, cat.id);
  }

  const faqs = [
    { category: "Warranty & Guarantee", question: "What does the 6-month NextGen IT Hub warranty cover?", answer: "Our 6-month warranty covers full hardware components including motherboard, display panel, RAM, storage drive, keyboard, and power circuitry. If any component develops a manufacturing defect, we provide free doorstep pickup, repair or replacement.", sortOrder: 1 },
    { category: "Warranty & Guarantee", question: "Can I extend my warranty to 1 year?", answer: "Yes! At checkout you can add our NextGen Extended Care plan for 12 or 24 months coverage at nominal rates.", sortOrder: 2 },
    { category: "Warranty & Guarantee", question: "What is your return policy if I am not satisfied?", answer: "We offer a 7-day hassle-free return or replacement policy from the day of delivery. If the product does not match the described grade or you experience any issues, we collect it at no extra cost.", sortOrder: 3 },
    { category: "Testing & Quality", question: "What is the 50-point diagnostic check?", answer: "Every unit goes through rigorous automated and manual checks: Prime95 CPU stress, MemTest86 RAM verification, CrystalDisk SSD health (>90%), FurMark thermal GPU check, keyboard key actuation, display pixel test, ports testing, and speaker/webcam verification.", sortOrder: 4 },
    { category: "Testing & Quality", question: "What battery health can I expect?", answer: "Every Grade A+ and Grade A laptop is guaranteed to have at least 80% original design capacity remaining, which translates to 3.5 to 7 hours of real-world productivity depending on the model.", sortOrder: 5 },
    { category: "Testing & Quality", question: "How does the Live Video Demo inspection work?", answer: "Before buying, you can click 'Book Live Demo' to schedule a private 1-on-1 video call. Our technician in the Mumbai facility will power on the exact serial number unit, show physical condition 360-degrees, and demonstrate live benchmark scores.", sortOrder: 6 },
    { category: "Orders & Shipping", question: "How long does delivery take across India?", answer: "Metro deliveries (Mumbai, Delhi-NCR, Bengaluru, Pune, Hyderabad, Chennai) take 24 to 48 hours. Tier 2 and Tier 3 cities typically take 3 to 5 business days with insured Blue Dart / DTDC Express.", sortOrder: 7 },
    { category: "Orders & Shipping", question: "Is delivery free?", answer: "Yes, standard transit is 100% free with all orders across 28 states and Union Territories in India.", sortOrder: 8 },
    { category: "Orders & Shipping", question: "What payment methods are supported?", answer: "We support UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, Net 30 for verified corporate accounts, and Cash on Delivery (COD) with a small refundable reservation deposit.", sortOrder: 9 },
    { category: "Orders & Shipping", question: "Will I get a valid GST invoice?", answer: "Yes! Every single sale comes with an official GST tax invoice with our GSTIN and your GSTIN (for businesses) so you can claim 18% Input Tax Credit.", sortOrder: 10 },
    { category: "B2B & Bulk Orders", question: "What is the minimum quantity for bulk wholesale pricing?", answer: "Bulk volume pricing begins at 5 units. For orders of 10+ or 50+ laptops, we offer custom custom deployment images, company asset tagging, and dedicated account managers.", sortOrder: 11 },
    { category: "B2B & Bulk Orders", question: "Can we get custom RAM and SSD configurations on bulk orders?", answer: "Absolutely. We can upgrade memory up to 64GB and install fresh Crucial or Samsung NVMe SSDs configured to your IT specifications before dispatch.", sortOrder: 12 },
    { category: "B2B & Bulk Orders", question: "Do you offer leasing or rental arrangements?", answer: "We partner with corporate financing institutions for annual equipment leases and deferred payment cycles for registered entities with good credit ratings.", sortOrder: 13 },
    { category: "Warranty & Guarantee", question: "Are original chargers included?", answer: "Yes, every laptop ships with an original manufacturer OEM or high-grade certified BIS-compliant power adapter matching exact wattage requirements.", sortOrder: 14 },
    { category: "Orders & Shipping", question: "How is the laptop packaged for safe transit?", answer: "We use custom-molded high-density polyethylene foam corner cradles inside heavy 5-ply corrugated carton boxes sealed with tamper-evident security tape.", sortOrder: 15 },
  ];

  for (const f of faqs) {
    const categoryId = faqCatMap.get(f.category);
    const existing = await prisma.faq.findFirst({ where: { question: f.question } });
    if (!existing) {
      await prisma.faq.create({
        data: {
          categoryId: categoryId!,
          question: f.question,
          answer: f.answer,
          sortOrder: f.sortOrder,
          isPublished: true,
        },
      });
    }
  }

  // 10. 6 Partners
  console.log("Seeding 6 Corporate Partners...");
  const partners = [
    { name: "Razorpay Capital & Tech", website: "https://razorpay.com", caseStudy: "Supplied 120+ ThinkPad T-series machines for contract developers.", sortOrder: 1 },
    { name: "Zomato Delivery Operations", website: "https://zomato.com", caseStudy: "Equipped regional dispatch hubs across Maharashtra with durable Dell Latitudes.", sortOrder: 2 },
    { name: "Innov8 Coworking", website: "https://innov8.work", caseStudy: "Exclusive laptop rental and hardware partner across 14 coworking locations.", sortOrder: 3 },
    { name: "IIT Bombay Techfest", website: "https://techfest.org", caseStudy: "Official compute hardware infrastructure sponsor for robotic workshops.", sortOrder: 4 },
    { name: "Blue Dart Express Logistics", website: "https://bluedart.com", caseStudy: "Nationwide insured transit and zero-damage fulfillment partner.", sortOrder: 5 },
    { name: "UpGrad EdTech Fellows", website: "https://upgrad.com", caseStudy: "Refurbished MacBook Air student bundle program with subsidized financing.", sortOrder: 6 },
  ];

  for (const p of partners) {
    const existing = await prisma.partner.findFirst({ where: { name: p.name } });
    if (!existing) {
      await prisma.partner.create({ data: p });
    }
  }

  // 11. 8 Verified Customer Reviews
  console.log("Seeding 8 Customer Reviews...");
  const reviews = [
    {
      laptopSlug: "dell-latitude-7490-i5-8th-16gb-512gb",
      name: "Rohan Kulkarni",
      email: "rohan.kulkarni@gmail.com",
      rating: 5,
      title: "Indistinguishable from brand new!",
      body: "Bought the Dell Latitude 7490 for my coding projects. The laptop looks practically unboxed fresh. Battery gives 5+ hours on VS Code, and thermal performance is whisper quiet. Best ₹25K spent!",
      status: ReviewStatus.APPROVED,
      isVerified: true,
    },
    {
      laptopSlug: "lenovo-thinkpad-t480-i5-16gb-256gb",
      name: "Ananya Deshmukh",
      email: "ananya.d@fintechstartup.in",
      rating: 5,
      title: "ThinkPad keyboard magic at 1/3rd retail price",
      body: "The dual battery on this T480 is insane—I worked through an entire Mumbai-Delhi flight and train journey without needing a wall charger. Solid build, prompt 2-day delivery.",
      status: ReviewStatus.APPROVED,
      isVerified: true,
    },
    {
      laptopSlug: "apple-macbook-air-m1-8gb-256gb-space-grey",
      name: "Siddharth Banerjee",
      email: "siddharth.b@designstudio.co",
      rating: 5,
      title: "M1 MacBook Air arrived in pristine condition",
      body: "I was hesitant to buy a refurbished Apple product, but the live video demo convinced me. The engineer showed me the screen and battery health (94%). Received it in 24 hours in Mumbai with GST invoice.",
      status: ReviewStatus.APPROVED,
      isVerified: true,
    },
    {
      laptopSlug: "hp-elitebook-840-g6-i7-16gb-512gb",
      name: "Kavita Rao",
      email: "kavita.rao@consulting.com",
      rating: 5,
      title: "Premium aluminum look for client presentations",
      body: "The Core i7 EliteBook handles Excel heavy models with ease. The Bang & Olufsen speakers are loud and clear for Zoom calls. Highly recommended for professionals.",
      status: ReviewStatus.APPROVED,
      isVerified: true,
    },
    {
      laptopSlug: "dell-precision-3530-xeon-32gb-1tb-quadro",
      name: "Manoj Nambiar",
      email: "manoj.cad@engineersindia.in",
      rating: 5,
      title: "Beast workstation for SolidWorks 3D CAD",
      body: "Finding a 32GB Xeon with dedicated Quadro graphics under ₹45,000 was unbelievable. Renders smoothly without thermal throttling.",
      status: ReviewStatus.APPROVED,
      isVerified: true,
    },
    {
      laptopSlug: "lenovo-thinkpad-x1-carbon-6th-gen-i7",
      name: "Sameer Patel",
      email: "sameer.patel@legaladvisory.org",
      rating: 5,
      title: "Extremely lightweight and fast",
      body: "At barely 1.1 kg, this X1 Carbon slips into my briefcase effortlessly. Display is crisp anti-glare and keyboard is standard ThinkPad perfection.",
      status: ReviewStatus.APPROVED,
      isVerified: true,
    },
    {
      laptopSlug: "hp-probook-450-g6-i5-8th-8gb-512gb",
      name: "Vikrant Singh",
      email: "vikrant.singh@ca-associates.in",
      rating: 4,
      title: "Dedicated numeric keypad is a lifesaver for auditing",
      body: "Fast NVMe storage and great 15.6 inch screen. Minor tiny scratch on base cover, but for this price with 6-month warranty, zero complaints.",
      status: ReviewStatus.APPROVED,
      isVerified: true,
    },
    {
      laptopSlug: "lenovo-thinkpad-e14-gen-2-ryzen-5-16gb-512gb",
      name: "Nikhil Joshi",
      email: "nikhil.j@fullstackdev.io",
      rating: 5,
      title: "Ryzen 6-core powerhouse for Docker & compilation",
      body: "Running Docker containers with microservices breeze through on this 6-core Ryzen 5. Best value Linux-friendly machine on the market.",
      status: ReviewStatus.APPROVED,
      isVerified: true,
    },
  ];

  for (const r of reviews) {
    const laptop = createdLaptops.find((l) => l.slug === r.laptopSlug);
    if (laptop) {
      const existing = await prisma.review.findFirst({
        where: { email: r.email, laptopId: laptop.id },
      });
      if (!existing) {
        await prisma.review.create({
          data: {
            laptopId: laptop.id,
            name: r.name,
            email: r.email,
            rating: r.rating,
            title: r.title,
            body: r.body,
            status: r.status,
            isVerified: r.isVerified,
          },
        });
      }
    }
  }

  // 12. 8 Service Areas
  console.log("Seeding 8 Key Service Areas...");
  const serviceAreas = [
    { city: "Mumbai & MMR", state: "Maharashtra", pincodes: ["400001", "400050", "400093", "400703", "400601", "400076"], isActive: true },
    { city: "Pune", state: "Maharashtra", pincodes: ["411001", "411014", "411045", "411057", "411038"], isActive: true },
    { city: "Bengaluru", state: "Karnataka", pincodes: ["560001", "560034", "560068", "560100", "560103"], isActive: true },
    { city: "Delhi-NCR", state: "Delhi", pincodes: ["110001", "110020", "110092", "201301", "122001"], isActive: true },
    { city: "Hyderabad", state: "Telangana", pincodes: ["500001", "500081", "500032", "500084"], isActive: true },
    { city: "Chennai", state: "Tamil Nadu", pincodes: ["600001", "600028", "600096", "600113"], isActive: true },
    { city: "Ahmedabad", state: "Gujarat", pincodes: ["380001", "380015", "380054"], isActive: true },
    { city: "Kolkata", state: "West Bengal", pincodes: ["700001", "700091", "700156"], isActive: true },
  ];

  for (const sa of serviceAreas) {
    const existing = await prisma.serviceArea.findFirst({ where: { city: sa.city } });
    if (!existing) {
      await prisma.serviceArea.create({
        data: {
          city: sa.city,
          state: sa.state,
          pincodes: JSON.stringify(sa.pincodes),
          isActive: sa.isActive,
        },
      });
    }
  }

  console.log("✅ NextGen IT Hub full database seed completed successfully!");
  console.log("Summary: 20 Laptops, 5 Blogs, 15 FAQs, 6 Partners, 8 Reviews, 8 Service Areas, Admin User, Settings & Counters.");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
