export interface LaptopSpecItem {
  label: string;
  value: string;
}

export interface LaptopSpecGroup {
  group: string;
  items: LaptopSpecItem[];
}

export interface LaptopUpgradeOption {
  id: string;
  label: string;
  additionalPrice: number; // in paise
  description?: string;
}

export interface LaptopData {
  id: string;
  slug: string;
  model: string;
  brand: "Dell" | "Lenovo" | "HP" | "Apple";
  category: string;
  grade: "A_PLUS" | "A" | "B";
  mrp: number; // in paise
  sellingPrice: number; // in paise
  processor: string;
  ram: string;
  storage: string;
  display: string;
  battery: string;
  batteryHealth: string;
  os: string;
  warranty: string;
  availableUnits: number;
  imageUrl: string;
  hoverImageUrl: string;
  secondaryImageUrl: string;
  qcPassedCount: number;
  conditionNotes: string;
  shortDescription: string;
  description: string;
  ports: string[];
  specs: LaptopSpecGroup[];
  upgradeOptions: {
    ram: LaptopUpgradeOption[];
    storage: LaptopUpgradeOption[];
    warranty: LaptopUpgradeOption[];
  };
  whatsInTheBox: {
    title: string;
    description: string;
    icon: string;
  }[];
  qcChecklist: {
    category: string;
    items: string[];
  }[];
}

export const ALL_LAPTOPS: LaptopData[] = [
  {
    id: "lap-01",
    slug: "dell-latitude-7490-i5-8th-16gb-512gb",
    model: "Dell Latitude 7490 Business Ultrabook",
    brand: "Dell",
    category: "Business & Enterprise",
    grade: "A_PLUS",
    mrp: 7500000,
    sellingPrice: 2499900,
    processor: "Intel Core i5-8350U (4 Cores / 8 Threads · Up to 3.6 GHz)",
    ram: "16GB DDR4 (Expandable to 32GB)",
    storage: "512GB NVMe M.2 High-Speed SSD",
    display: "14.0\" FHD (1920x1080) Anti-Glare IPS Display",
    battery: "60Wh Li-Ion ExpressCharge",
    batteryHealth: "91% Health Guaranteed (3.5–5 Hours Backup)",
    os: "Windows 11 Pro Genuine Pre-Activated",
    warranty: "6 Months Comprehensive Warranty",
    availableUnits: 5,
    imageUrl: "/images/laptops/dell-latitude-7490-front.jpg",
    hoverImageUrl: "/images/laptops/dell-latitude-7490-hover.jpg",
    secondaryImageUrl: "/images/laptops/dell-latitude-7490-hover.jpg",
    qcPassedCount: 42,
    conditionNotes: "Pristine Grade A+ condition. Zero screen dead pixels or scratches. Magnesium alloy lid with factory soft-touch finish.",
    shortDescription: "Magnesium alloy business workhorse powered by Intel 8th Gen Quad-Core with 16GB RAM and lightning-fast NVMe storage.",
    description: "The Dell Latitude 7490 is engineered for enterprise-grade productivity, durability, and mobile computing. Crafted from premium magnesium alloy with carbon-fiber reinforced structure, it withstands rigorous everyday handling. Thoroughly tested across our comprehensive 42-point quality diagnostic checklist.",
    ports: ["Thunderbolt 3 / USB-C", "3x USB 3.1 Gen 1", "HDMI 1.4b", "MicroSD Card Reader", "RJ-45 Gigabit Ethernet", "Audio Combo Jack"],
    specs: [
      {
        group: "Processor & Graphics",
        items: [
          { label: "Processor", value: "Intel Core i5-8350U (4 Cores, 8 Threads, 6MB Cache)" },
          { label: "Base / Turbo Clock", value: "1.70 GHz Base / 3.60 GHz Max Turbo" },
          { label: "Integrated Graphics", value: "Intel UHD Graphics 620 with 4K output support" },
        ],
      },
      {
        group: "Memory & Storage",
        items: [
          { label: "Installed RAM", value: "16GB DDR4 2400MHz Dual-Channel" },
          { label: "RAM Expandability", value: "2x SO-DIMM Slots (Up to 32GB supported)" },
          { label: "Primary Storage", value: "512GB M.2 PCIe NVMe Solid State Drive" },
          { label: "Storage Health", value: "100% SMART Health (Tested > 2100 MB/s Read)" },
        ],
      },
      {
        group: "Display & Audio",
        items: [
          { label: "Screen Size & Resolution", value: "14.0-inch Full HD (1920 x 1080) IPS" },
          { label: "Surface Finish", value: "Anti-Glare Matte (Non-Reflective, Eye Care)" },
          { label: "Speakers", value: "High-Quality Stereo Speakers with Waves MaxxAudio Pro" },
          { label: "Webcam & Mic", value: "720p HD Camera with Dual-Array Digital Microphones" },
        ],
      },
      {
        group: "Battery & Charging",
        items: [
          { label: "Battery Capacity", value: "4-Cell 60Wh Li-Ion Battery" },
          { label: "Certified Health", value: "91% Original Capacity (Minimum 3.5h backup tested)" },
          { label: "Charger Included", value: "Original Dell 65W AC Adapter + Indian Power Cord" },
        ],
      },
    ],
    upgradeOptions: {
      ram: [
        { id: "ram-16", label: "16GB DDR4 (Standard)", additionalPrice: 0 },
        { id: "ram-32", label: "Upgrade to 32GB DDR4 High-Speed", additionalPrice: 200000, description: "Recommended for heavy multitasking, VMs, and development" },
      ],
      storage: [
        { id: "ssd-512", label: "512GB NVMe SSD (Standard)", additionalPrice: 0 },
        { id: "ssd-1tb", label: "Upgrade to 1TB NVMe Gen3 SSD", additionalPrice: 250000, description: "Doubles storage for large projects, video editing, and databases" },
      ],
      warranty: [
        { id: "war-6", label: "6 Months Comprehensive Doorstep Warranty", additionalPrice: 0 },
        { id: "war-12", label: "Extend to 1 Year Comprehensive Pan-India Warranty", additionalPrice: 149900, description: "Covers motherboard, display panel, RAM, storage, and keyboard" },
      ],
    },
    whatsInTheBox: [
      { title: "Dell Latitude 7490", description: "Certified Grade A+ Refurbished Laptop with Genuine Windows 11 Pro", icon: "laptop" },
      { title: "OEM 65W Fast Charger", description: "Original Dell Power Adapter with heavy-duty Indian 3-pin power cord", icon: "zap" },
      { title: "NextGen Warranty Certificate", description: "Official physical warranty card with unique Serial Number tracking", icon: "shield" },
      { title: "GST Tax Invoice", description: "Tax-compliant invoice for 18% Input Tax Credit (ITC) claim", icon: "file-text" },
      { title: "Complimentary Laptop Sleeve", description: "Water-resistant padded neoprene carry case (Free Gift)", icon: "package" },
    ],
    qcChecklist: [
      {
        category: "Display & Visuals",
        items: ["Zero dead pixels or color blotches verified", "Anti-glare coating 100% intact", "Backlight uniformity tested across 9 points", "Hinge torque & tilt tested 1000+ cycles"],
      },
      {
        category: "Motherboard & Performance",
        items: ["Intel Core i5 Prime95 thermal stress test passed", "Fresh thermal paste applied (Arctic MX-4)", "No thermal throttling under sustained load", "MemTest86 RAM validation passed 0 errors"],
      },
      {
        category: "Keyboard, Trackpad & Audio",
        items: ["Every single key actuation tested", "Backlight LEDs uniform brightness", "Precision glass trackpad gestures verified", "Stereo speakers & dual mics tested at full volume"],
      },
      {
        category: "Battery & Connectivity",
        items: ["Battery health tested > 85% real capacity", "USB Type-C Power Delivery & DisplayPort tested", "Dual-band Wi-Fi 5 & Bluetooth 5.0 signal strength verified", "All USB 3.1 & HDMI ports tested"],
      },
    ],
  },
  {
    id: "lap-02",
    slug: "lenovo-thinkpad-t480-i5-16gb-256gb",
    model: "Lenovo ThinkPad T480 (Dual Battery System)",
    brand: "Lenovo",
    category: "Business & Enterprise",
    grade: "A_PLUS",
    mrp: 8500000,
    sellingPrice: 2649900,
    processor: "Intel Core i5-8250U Quad-Core (Up to 3.4 GHz)",
    ram: "16GB DDR4 (Expandable to 32GB)",
    storage: "256GB PCIe NVMe Opal2 SSD",
    display: "14.0\" FHD (1920x1080) Matte IPS 250 nits",
    battery: "Bridge Battery System (24Wh Internal + 48Wh External Hot-Swappable)",
    batteryHealth: "89% Health Guaranteed (6–8 Hours Extended Backup)",
    os: "Windows 11 Pro Genuine Pre-Activated",
    warranty: "6 Months Comprehensive Warranty",
    availableUnits: 3,
    imageUrl: "/images/laptops/lenovo-thinkpad-t480-front.jpg",
    hoverImageUrl: "/images/laptops/lenovo-thinkpad-t480-hover.jpg",
    secondaryImageUrl: "/images/laptops/lenovo-thinkpad-t480-hover.jpg",
    qcPassedCount: 45,
    conditionNotes: "Legendary tactile ThinkPad keyboard in brand-new condition. 100% verified Red TrackPoint and dual hot-swappable batteries.",
    shortDescription: "The gold-standard corporate laptop with dual-battery system, spill-resistant keyboard, and dual Thunderbolt 3 ports.",
    description: "The Lenovo ThinkPad T480 is revered worldwide by developers, engineers, and corporate executives for its unmatched typing experience, military-spec MIL-STD-810G durability, and hot-swappable Bridge Battery architecture.",
    ports: ["Thunderbolt 3 / USB-C", "USB-C 3.1 Gen 1", "2x USB 3.1 Gen 1", "HDMI 1.4b", "RJ-45 Gigabit Ethernet", "Full-size SD Card Reader", "Headphone / Mic combo"],
    specs: [
      {
        group: "Processor & Graphics",
        items: [
          { label: "Processor", value: "Intel Core i5-8250U (4 Cores, 8 Threads, 6MB Cache)" },
          { label: "Clock Speed", value: "1.60 GHz Base up to 3.40 GHz Max Turbo" },
          { label: "Graphics", value: "Intel UHD Graphics 620" },
        ],
      },
      {
        group: "Memory & Storage",
        items: [
          { label: "RAM", value: "16GB DDR4 (2x Slots, Expandable to 32GB)" },
          { label: "Storage", value: "256GB NVMe Opal2 Self-Encrypting SSD" },
        ],
      },
      {
        group: "Battery & Autonomy",
        items: [
          { label: "Battery Architecture", value: "Bridge Battery (24Wh Internal + 48Wh Removable)" },
          { label: "Certified Backup", value: "Up to 6–8 hours realistic programming/office usage" },
          { label: "Charger", value: "Original Lenovo 65W Type-C Fast Charger" },
        ],
      },
    ],
    upgradeOptions: {
      ram: [
        { id: "ram-16", label: "16GB DDR4 (Standard)", additionalPrice: 0 },
        { id: "ram-32", label: "Upgrade to 32GB DDR4", additionalPrice: 200000 },
      ],
      storage: [
        { id: "ssd-256", label: "256GB NVMe SSD (Standard)", additionalPrice: 0 },
        { id: "ssd-512", label: "Upgrade to 512GB NVMe High-Speed SSD", additionalPrice: 150000 },
        { id: "ssd-1tb", label: "Upgrade to 1TB NVMe High-Speed SSD", additionalPrice: 280000 },
      ],
      warranty: [
        { id: "war-6", label: "6 Months Comprehensive Warranty", additionalPrice: 0 },
        { id: "war-12", label: "Extend to 1 Year Comprehensive Warranty", additionalPrice: 149900 },
      ],
    },
    whatsInTheBox: [
      { title: "ThinkPad T480 Laptop", description: "Pre-tested Grade A+ Refurbished with Dual Battery", icon: "laptop" },
      { title: "Original 65W Type-C Charger", description: "Lenovo RapidCharge adapter with 3-pin cable", icon: "zap" },
      { title: "NextGen Warranty Certificate", description: "6-Month Doorstep Pan-India Coverage", icon: "shield" },
      { title: "GST Tax Invoice", description: "Official B2B/B2C GST Invoice with Serial Number", icon: "file-text" },
      { title: "Free Neoprene Laptop Sleeve", description: "Water-resistant shock-absorbing sleeve", icon: "package" },
    ],
    qcChecklist: [
      {
        category: "ThinkPad Specific Tests",
        items: ["TrackPoint red nub & physical click buttons 100% verified", "Both Internal & External batteries tested under load", "Spill-resistant keyboard drainage channels cleared", "MIL-STD chassis rigidity verified"],
      },
    ],
  },
  {
    id: "lap-03",
    slug: "hp-elitebook-840-g6-i7-16gb-512gb",
    model: "HP EliteBook 840 G6 CNC Aluminum",
    brand: "HP",
    category: "Business & Enterprise",
    grade: "A",
    mrp: 9500000,
    sellingPrice: 3199900,
    processor: "Intel Core i7-8565U (4 Cores / 8 Threads · Up to 4.6 GHz)",
    ram: "16GB DDR4 (Expandable to 32GB)",
    storage: "512GB PCIe NVMe Turbo SSD",
    display: "14.0\" FHD (1920x1080) IPS Anti-Glare with Bang & Olufsen",
    battery: "HP Long Life 3-cell 50Wh Li-ion",
    batteryHealth: "88% Health Guaranteed (3.5–4.5 Hours Backup)",
    os: "Windows 11 Pro Genuine Pre-Activated",
    warranty: "6 Months Comprehensive Warranty",
    availableUnits: 2,
    imageUrl: "/images/laptops/hp-elitebook-840-g6-front.jpg",
    hoverImageUrl: "/images/laptops/hp-elitebook-840-g6-hover.jpg",
    secondaryImageUrl: "/images/laptops/hp-elitebook-840-g6-hover.jpg",
    qcPassedCount: 40,
    conditionNotes: "Premium silver CNC aluminum unibody. Minor unnoticeable micro-mark on bottom plate. Premium Bang & Olufsen audio.",
    shortDescription: "Ultra-slim silver aluminum corporate ultrabook with Core i7 performance, Bang & Olufsen acoustics, and HP SureView.",
    description: "The HP EliteBook 840 G6 is precision-crafted from solid CNC machined aluminum. Delivering executive performance with Intel Core i7 8th Gen, crisp Bang & Olufsen premium speakers, and advanced security features.",
    ports: ["Thunderbolt 3 / USB-C", "2x USB 3.1 Gen 1", "HDMI 1.4b", "RJ-45 Gigabit Ethernet", "Docking Connector", "Audio Combo Jack"],
    specs: [
      {
        group: "Processor & Graphics",
        items: [
          { label: "Processor", value: "Intel Core i7-8565U (4 Cores, 8 Threads, 8MB Cache)" },
          { label: "Max Turbo", value: "Up to 4.60 GHz Intel Turbo Boost" },
          { label: "Graphics", value: "Intel UHD Graphics 620" },
        ],
      },
      {
        group: "Audio & Multimedia",
        items: [
          { label: "Acoustics", value: "Bang & Olufsen Dual Stereo Speakers with HP Noise Cancellation" },
          { label: "Webcam", value: "HD Camera with Privacy Shutter + IR Facial Recognition" },
        ],
      },
    ],
    upgradeOptions: {
      ram: [
        { id: "ram-16", label: "16GB DDR4 (Standard)", additionalPrice: 0 },
        { id: "ram-32", label: "Upgrade to 32GB DDR4", additionalPrice: 200000 },
      ],
      storage: [
        { id: "ssd-512", label: "512GB NVMe SSD (Standard)", additionalPrice: 0 },
        { id: "ssd-1tb", label: "Upgrade to 1TB NVMe High-Speed SSD", additionalPrice: 250000 },
      ],
      warranty: [
        { id: "war-6", label: "6 Months Comprehensive Warranty", additionalPrice: 0 },
        { id: "war-12", label: "Extend to 1 Year Comprehensive Warranty", additionalPrice: 149900 },
      ],
    },
    whatsInTheBox: [
      { title: "HP EliteBook 840 G6", description: "Certified Grade A Aluminum Laptop", icon: "laptop" },
      { title: "HP Original 65W AC Adapter", description: "Smart AC adapter with surge protection", icon: "zap" },
      { title: "Warranty Certificate", description: "6-Month Pan-India Doorstep Warranty", icon: "shield" },
      { title: "Tax Invoice", description: "100% Tax Compliant GST Invoice", icon: "file-text" },
      { title: "Free Laptop Sleeve", description: "Premium padded protective sleeve", icon: "package" },
    ],
    qcChecklist: [
      {
        category: "HP EliteBook Quality Standards",
        items: ["Bang & Olufsen audio harmonic clarity verified", "Aluminum unibody straightness & hinge alignment tested", "Core i7 full turbo clock sustained under stress test"],
      },
    ],
  },
  {
    id: "lap-04",
    slug: "apple-macbook-air-m1-8gb-256gb-space-grey",
    model: "Apple MacBook Air M1 (Space Grey)",
    brand: "Apple",
    category: "Ultrabooks & Thin-and-Light",
    grade: "A_PLUS",
    mrp: 9990000,
    sellingPrice: 5299900,
    processor: "Apple M1 Silicon (8-Core CPU · 7-Core GPU · 16-Core Neural Engine)",
    ram: "8GB Unified Memory",
    storage: "256GB Ultra-Fast NVMe Solid State Drive",
    display: "13.3\" Retina Display with True Tone (2560x1600 P3 Wide Color)",
    battery: "49.9Wh Lithium Polymer",
    batteryHealth: "93% Health Guaranteed (< 80 Battery Cycles · 10–14h Backup)",
    os: "macOS Sonoma / Sequoia Genuine",
    warranty: "6 Months Comprehensive Warranty",
    availableUnits: 4,
    imageUrl: "/images/laptops/macbook-air-m1-front.jpg",
    hoverImageUrl: "/images/laptops/macbook-air-m1-hover.jpg",
    secondaryImageUrl: "/images/laptops/macbook-air-m1-hover.jpg",
    qcPassedCount: 48,
    conditionNotes: "Flawless Grade A+ cosmetic rating. Screen anti-reflective coating 100% spotless. Low battery cycle count with extraordinary battery life.",
    shortDescription: "The revolutionary silent fanless MacBook Air with Apple M1 silicon, Retina display, and all-day 12h+ battery endurance.",
    description: "Apple MacBook Air with M1 delivers incredible performance and efficiency in a silent, fanless design. With an 8-core CPU, gorgeous Retina display with P3 wide color, and battery that lasts up to 14 hours of real work.",
    ports: ["2x Thunderbolt / USB 4 (Charging, DisplayPort, Thunderbolt 3)", "3.5mm Headphone Jack"],
    specs: [
      {
        group: "Apple Silicon Architecture",
        items: [
          { label: "SoC", value: "Apple M1 chip (4 performance cores + 4 efficiency cores)" },
          { label: "GPU", value: "7-Core Apple Graphics" },
          { label: "Neural Engine", value: "16-Core Neural Engine for on-device machine learning" },
        ],
      },
      {
        group: "Retina Display",
        items: [
          { label: "Resolution", value: "2560 x 1600 native resolution at 227 pixels per inch" },
          { label: "Color Gamut", value: "Wide color (P3) with True Tone technology" },
          { label: "Brightness", value: "400 nits brightness" },
        ],
      },
      {
        group: "Battery & Power",
        items: [
          { label: "Battery Health", value: "93% Original Capacity Verified (Cycle Count < 80)" },
          { label: "Real Battery Backup", value: "10 to 14 Hours typical web browsing/productivity" },
          { label: "Charger", value: "Original Apple 30W USB-C Power Adapter + 2m Type-C Cable" },
        ],
      },
    ],
    upgradeOptions: {
      ram: [{ id: "ram-8", label: "8GB Unified Memory (Configured)", additionalPrice: 0 }],
      storage: [{ id: "ssd-256", label: "256GB Apple High-Speed SSD", additionalPrice: 0 }],
      warranty: [
        { id: "war-6", label: "6 Months Comprehensive Warranty", additionalPrice: 0 },
        { id: "war-12", label: "Extend to 1 Year Comprehensive Apple Warranty", additionalPrice: 249900 },
      ],
    },
    whatsInTheBox: [
      { title: "MacBook Air M1 Space Grey", description: "Grade A+ Certified Refurbished Apple Laptop", icon: "laptop" },
      { title: "Apple 30W USB-C Adapter", description: "Original Apple OEM adapter with 2m woven cable", icon: "zap" },
      { title: "Warranty Certificate", description: "6-Month Pan-India NextGen Warranty", icon: "shield" },
      { title: "GST Tax Invoice", description: "Legitimate Tax Invoice with Serial Number", icon: "file-text" },
      { title: "Sleeve Case", description: "Slim magnetic protective sleeve", icon: "package" },
    ],
    qcChecklist: [
      {
        category: "Apple Diagnostics",
        items: ["Apple Hardware Diagnostic (AHD) passed 100%", "Magic Keyboard scissor switches tested", "Force Touch haptic trackpad response verified", "Touch ID fingerprint sensor calibrated & verified"],
      },
    ],
  },
  {
    id: "lap-05",
    slug: "dell-latitude-5400-i5-8th-8gb-256gb",
    model: "Dell Latitude 5400 Business Notebook",
    brand: "Dell",
    category: "Business & Enterprise",
    grade: "A",
    mrp: 6800000,
    sellingPrice: 2199900,
    processor: "Intel Core i5-8265U Quad-Core (Up to 3.9 GHz)",
    ram: "8GB DDR4 (Expandable to 32GB)",
    storage: "256GB M.2 Solid State Drive",
    display: "14.0\" HD WLED Anti-glare Display",
    battery: "51Wh ExpressCharge Capable",
    batteryHealth: "87% Health Guaranteed (3–4 Hours Backup)",
    os: "Windows 11 Pro Genuine Pre-Activated",
    warranty: "6 Months Comprehensive Warranty",
    availableUnits: 7,
    imageUrl: "/images/laptops/dell-latitude-5400-front.jpg",
    hoverImageUrl: "/images/laptops/dell-latitude-5400-hover.jpg",
    secondaryImageUrl: "/images/laptops/dell-latitude-5400-hover.jpg",
    qcPassedCount: 40,
    conditionNotes: "Grade A condition. Post-lease enterprise unit with clean casing and tested ports.",
    shortDescription: "Budget-friendly enterprise workhorse with Intel 8th Gen Quad-Core, fast SSD, and upgradeable memory.",
    description: "The Dell Latitude 5400 is an incredibly cost-effective work notebook designed for offices, students, and remote professionals needing rock-solid Dell reliability without breaking the bank.",
    ports: ["USB Type-C 3.1 Gen 2", "3x USB 3.1 Gen 1", "HDMI 1.4", "RJ-45 Ethernet", "SD Card Reader", "Audio Jack"],
    specs: [
      {
        group: "Specs",
        items: [
          { label: "Processor", value: "Intel Core i5-8265U (4C/8T · Up to 3.90 GHz)" },
          { label: "RAM", value: "8GB DDR4 (Expandable to 32GB)" },
          { label: "Storage", value: "256GB M.2 SSD" },
        ],
      },
    ],
    upgradeOptions: {
      ram: [
        { id: "ram-8", label: "8GB DDR4 (Standard)", additionalPrice: 0 },
        { id: "ram-16", label: "Upgrade to 16GB DDR4", additionalPrice: 120000 },
      ],
      storage: [
        { id: "ssd-256", label: "256GB SSD (Standard)", additionalPrice: 0 },
        { id: "ssd-512", label: "Upgrade to 512GB SSD", additionalPrice: 150000 },
      ],
      warranty: [
        { id: "war-6", label: "6 Months Comprehensive Warranty", additionalPrice: 0 },
        { id: "war-12", label: "Extend to 1 Year Comprehensive Warranty", additionalPrice: 149900 },
      ],
    },
    whatsInTheBox: [
      { title: "Dell Latitude 5400", description: "Grade A Refurbished Laptop", icon: "laptop" },
      { title: "OEM 65W Charger", description: "Original Dell Charger", icon: "zap" },
      { title: "Warranty Card", description: "6 Months Comprehensive", icon: "shield" },
      { title: "GST Invoice", description: "Official Tax Invoice", icon: "file-text" },
      { title: "Laptop Sleeve", description: "Padded case", icon: "package" },
    ],
    qcChecklist: [
      { category: "Hardware Tests", items: ["40-Point QC Diagnostic passed"] },
    ],
  },
  {
    id: "lap-06",
    slug: "lenovo-thinkpad-x1-carbon-6th-gen-i7",
    model: "Lenovo ThinkPad X1 Carbon Gen 6 (Ultralight 1.13kg)",
    brand: "Lenovo",
    category: "Ultrabooks & Thin-and-Light",
    grade: "A_PLUS",
    mrp: 13500000,
    sellingPrice: 3899900,
    processor: "Intel Core i7-8650U vPro (4 Cores / 8 Threads · Up to 4.2 GHz)",
    ram: "16GB LPDDR3 2133MHz",
    storage: "512GB PCIe NVMe Ultra-Fast SSD",
    display: "14.0\" WQHD (2560x1440) IPS 300 nits Anti-Glare",
    battery: "57Wh with RapidCharge (80% in 60 min)",
    batteryHealth: "90% Health Guaranteed (4–6 Hours Backup)",
    os: "Windows 11 Pro Genuine Pre-Activated",
    warranty: "6 Months Comprehensive Warranty",
    availableUnits: 2,
    imageUrl: "/images/laptops/lenovo-thinkpad-x1-carbon-front.jpg",
    hoverImageUrl: "/images/laptops/lenovo-thinkpad-x1-carbon-hover.jpg",
    secondaryImageUrl: "/images/laptops/lenovo-thinkpad-x1-carbon-hover.jpg",
    qcPassedCount: 46,
    conditionNotes: "Premium Carbon-Fiber reinforced unibody weighing only 1.13 kg. Flawless 2K WQHD display panel.",
    shortDescription: "Ultra-premium flagship carbon-fiber business laptop. Featherlight 1.13kg with Core i7 and stunning 2K WQHD display.",
    description: "The ThinkPad X1 Carbon Gen 6 represents the pinnacle of executive mobile computing. Encased in satellite-grade carbon fiber with a 180-degree lay-flat hinge and Dolby Vision high-resolution display.",
    ports: ["2x Thunderbolt 3 / USB-C", "2x USB 3.1 Gen 1", "HDMI 1.4", "Headphone/Mic combo", "Ethernet extension connector"],
    specs: [
      {
        group: "Specs",
        items: [
          { label: "Processor", value: "Intel Core i7-8650U vPro (Up to 4.20 GHz)" },
          { label: "Display", value: "14\" WQHD 2560x1440 IPS Anti-Glare" },
          { label: "Weight", value: "1.13 kg (Ultra-portable)" },
        ],
      },
    ],
    upgradeOptions: {
      ram: [{ id: "ram-16", label: "16GB LPDDR3 (Fixed Onboard)", additionalPrice: 0 }],
      storage: [
        { id: "ssd-512", label: "512GB NVMe SSD (Standard)", additionalPrice: 0 },
        { id: "ssd-1tb", label: "Upgrade to 1TB NVMe Gen3 SSD", additionalPrice: 250000 },
      ],
      warranty: [
        { id: "war-6", label: "6 Months Comprehensive Warranty", additionalPrice: 0 },
        { id: "war-12", label: "Extend to 1 Year Comprehensive Warranty", additionalPrice: 149900 },
      ],
    },
    whatsInTheBox: [
      { title: "ThinkPad X1 Carbon", description: "Grade A+ Carbon-Fiber Laptop", icon: "laptop" },
      { title: "65W Type-C RapidCharger", description: "Original Lenovo Charger", icon: "zap" },
      { title: "Warranty Card", description: "6 Months Doorstep Warranty", icon: "shield" },
      { title: "GST Invoice", description: "Tax invoice with Serial ID", icon: "file-text" },
      { title: "Premium Sleeve", description: "Tailored felt carry sleeve", icon: "package" },
    ],
    qcChecklist: [{ category: "Diagnostics", items: ["46-Point Diagnostic passed"] }],
  },
  {
    id: "lap-07",
    slug: "hp-probook-440-g7-i5-10th-8gb-512gb",
    model: "HP ProBook 440 G7 10th Gen Core i5",
    brand: "HP",
    category: "Business & Enterprise",
    grade: "A",
    mrp: 7200000,
    sellingPrice: 2799900,
    processor: "Intel Core i5-10210U 10th Gen (4C/8T · Up to 4.2 GHz)",
    ram: "8GB DDR4 (Expandable to 32GB)",
    storage: "512GB PCIe NVMe SSD",
    display: "14.0\" FHD (1920x1080) IPS Anti-Glare",
    battery: "HP Long Life 3-cell 45Wh Li-ion",
    batteryHealth: "89% Health Guaranteed (3.5–4.5 Hours Backup)",
    os: "Windows 11 Pro Genuine Pre-Activated",
    warranty: "6 Months Comprehensive Warranty",
    availableUnits: 6,
    imageUrl: "/images/laptops/hp-probook-440-g7-front.jpg",
    hoverImageUrl: "/images/laptops/hp-probook-440-g7-hover.jpg",
    secondaryImageUrl: "/images/laptops/hp-probook-440-g7-hover.jpg",
    qcPassedCount: 40,
    conditionNotes: "Grade A silver aluminum deck. 10th Gen processor delivering modern performance and battery optimization.",
    shortDescription: "Modern 10th Gen Intel Core i5 business laptop with aluminum keyboard deck and large 512GB NVMe storage.",
    description: "The HP ProBook 440 G7 combines 10th generation Intel processing with an aluminum keyboard deck, multi-layered security, and fast Wi-Fi 6 connectivity.",
    ports: ["USB 3.1 Type-C", "2x USB 3.1 Gen 1", "USB 2.0", "HDMI 1.4b", "RJ-45 Ethernet", "SD Card Reader"],
    specs: [
      {
        group: "Specs",
        items: [
          { label: "Processor", value: "Intel Core i5-10210U 10th Gen (Up to 4.20 GHz)" },
          { label: "RAM", value: "8GB DDR4 (Expandable to 32GB)" },
          { label: "Storage", value: "512GB NVMe PCIe SSD" },
        ],
      },
    ],
    upgradeOptions: {
      ram: [
        { id: "ram-8", label: "8GB DDR4 (Standard)", additionalPrice: 0 },
        { id: "ram-16", label: "Upgrade to 16GB DDR4", additionalPrice: 120000 },
      ],
      storage: [
        { id: "ssd-512", label: "512GB SSD (Standard)", additionalPrice: 0 },
        { id: "ssd-1tb", label: "Upgrade to 1TB SSD", additionalPrice: 250000 },
      ],
      warranty: [
        { id: "war-6", label: "6 Months Comprehensive Warranty", additionalPrice: 0 },
        { id: "war-12", label: "Extend to 1 Year Comprehensive Warranty", additionalPrice: 149900 },
      ],
    },
    whatsInTheBox: [
      { title: "HP ProBook 440 G7", description: "Grade A Refurbished Laptop", icon: "laptop" },
      { title: "HP 45W Smart Charger", description: "Original HP Charger", icon: "zap" },
      { title: "Warranty Card", description: "6 Months Comprehensive", icon: "shield" },
      { title: "GST Invoice", description: "Official GST Tax Invoice", icon: "file-text" },
      { title: "Laptop Sleeve", description: "Free water-resistant sleeve", icon: "package" },
    ],
    qcChecklist: [{ category: "Diagnostics", items: ["40-Point QC Passed"] }],
  },
  {
    id: "lap-08",
    slug: "dell-precision-5530-workstation-i7-32gb-1tb",
    model: "Dell Precision 5530 4K Mobile Workstation (Nvidia Quadro)",
    brand: "Dell",
    category: "High-Performance Workstations",
    grade: "A_PLUS",
    mrp: 18500000,
    sellingPrice: 5899900,
    processor: "Intel Core i7-8850H 6-Core / 12-Thread (Up to 4.3 GHz)",
    ram: "32GB DDR4 2666MHz High-Speed",
    storage: "1TB Ultra-Fast NVMe PCIe SSD",
    display: "15.6\" UltraSharp 4K UHD (3840x2160) IGZO Touch (100% AdobeRGB)",
    battery: "97Wh 6-Cell Lithium-Ion",
    batteryHealth: "86% Health Guaranteed (3–4.5 Hours Backup)",
    os: "Windows 11 Pro Genuine Pre-Activated",
    warranty: "6 Months Comprehensive Warranty",
    availableUnits: 1,
    imageUrl: "/images/laptops/dell-precision-5530-front.jpg",
    hoverImageUrl: "/images/laptops/dell-precision-5530-hover.jpg",
    secondaryImageUrl: "/images/laptops/dell-precision-5530-hover.jpg",
    qcPassedCount: 50,
    conditionNotes: "Flawless carbon fiber palm rest and CNC aluminum shell. Breathtaking 4K touch display with 100% AdobeRGB color accuracy.",
    shortDescription: "Monster 6-core workstation with Nvidia Quadro P1000 4GB GPU, 32GB RAM, 1TB NVMe, and 4K Touch screen.",
    description: "The Dell Precision 5530 is a mobile workstation engineered for CAD designers, 3D animators, video colorists, and AI data scientists. Features ISV certified Nvidia Quadro P1000 4GB GPU.",
    ports: ["Thunderbolt 3 / USB-C", "2x USB 3.1 Gen 1", "HDMI 2.0 (4K @ 60Hz)", "Full SD Card Reader", "Audio Jack"],
    specs: [
      {
        group: "Specs",
        items: [
          { label: "Processor", value: "Intel Core i7-8850H (6 Cores, 12 Threads, 9MB Cache)" },
          { label: "Dedicated GPU", value: "Nvidia Quadro P1000 4GB GDDR5 ISV Certified" },
          { label: "Display", value: "15.6\" 4K Touch UHD 3840x2160 IGZO Panel" },
          { label: "RAM & Storage", value: "32GB DDR4 + 1TB NVMe SSD" },
        ],
      },
    ],
    upgradeOptions: {
      ram: [{ id: "ram-32", label: "32GB DDR4 High-Speed (Standard)", additionalPrice: 0 }],
      storage: [{ id: "ssd-1tb", label: "1TB NVMe SSD (Standard)", additionalPrice: 0 }],
      warranty: [
        { id: "war-6", label: "6 Months Comprehensive Warranty", additionalPrice: 0 },
        { id: "war-12", label: "Extend to 1 Year Comprehensive Warranty", additionalPrice: 249900 },
      ],
    },
    whatsInTheBox: [
      { title: "Precision 5530 Workstation", description: "Grade A+ Workstation", icon: "laptop" },
      { title: "Dell 130W Slim AC Adapter", description: "High-wattage workstation charger", icon: "zap" },
      { title: "Warranty Card", description: "6 Months Comprehensive", icon: "shield" },
      { title: "GST Invoice", description: "GST Invoice with Serial Number", icon: "file-text" },
      { title: "15.6\" Protective Sleeve", description: "Heavy-duty padded sleeve", icon: "package" },
    ],
    qcChecklist: [{ category: "Diagnostics", items: ["50-Point Heavy Workstation Diagnostic passed"] }],
  },
  {
    id: "lap-09",
    slug: "lenovo-thinkpad-l390-yoga-2in1-touch",
    model: "Lenovo ThinkPad L390 Yoga 360° Touch with Stylus Pen",
    brand: "Lenovo",
    category: "Ultrabooks & Thin-and-Light",
    grade: "B",
    mrp: 7800000,
    sellingPrice: 2249900,
    processor: "Intel Core i5-8265U Quad-Core (Up to 3.9 GHz)",
    ram: "8GB DDR4 (Expandable to 32GB)",
    storage: "256GB NVMe M.2 SSD",
    display: "13.3\" FHD (1920x1080) IPS Multi-Touch Corning Gorilla Glass",
    battery: "45Wh Li-Ion with Rapid Charge",
    batteryHealth: "85% Health Guaranteed (3–4 Hours Backup)",
    os: "Windows 11 Pro Genuine Pre-Activated",
    warranty: "6 Months Comprehensive Warranty",
    availableUnits: 4,
    imageUrl: "/images/laptops/lenovo-thinkpad-l390-yoga-front.jpg",
    hoverImageUrl: "/images/laptops/lenovo-thinkpad-l390-yoga-hover.jpg",
    secondaryImageUrl: "/images/laptops/lenovo-thinkpad-l390-yoga-hover.jpg",
    qcPassedCount: 42,
    conditionNotes: "Grade B: Light minor cosmetic scuffs on outer casing. Screen glass 100% clean and responsive. Active Stylus pen docked inside chassis.",
    shortDescription: "Versatile 360° convertible 2-in-1 laptop with responsive multi-touch screen and integrated rechargeable active stylus pen.",
    description: "The ThinkPad L390 Yoga is built for flexibility with four operating modes: Laptop, Tent, Stand, and Tablet. Ideal for signing documents, sketching diagrams, and taking notes with the integrated ThinkPad Pen Pro.",
    ports: ["2x USB-C 3.1 Gen 1", "2x USB 3.1 Gen 1", "HDMI 1.4b", "MicroSD Card Reader", "Audio Jack"],
    specs: [
      {
        group: "Specs",
        items: [
          { label: "Form Factor", value: "360° Convertible 2-in-1 (Laptop, Tent, Tablet)" },
          { label: "Active Pen", value: "ThinkPad Pen Pro rechargeable stylus docked inside" },
        ],
      },
    ],
    upgradeOptions: {
      ram: [
        { id: "ram-8", label: "8GB DDR4 (Standard)", additionalPrice: 0 },
        { id: "ram-16", label: "Upgrade to 16GB DDR4", additionalPrice: 120000 },
      ],
      storage: [
        { id: "ssd-256", label: "256GB SSD (Standard)", additionalPrice: 0 },
        { id: "ssd-512", label: "Upgrade to 512GB SSD", additionalPrice: 150000 },
      ],
      warranty: [
        { id: "war-6", label: "6 Months Comprehensive Warranty", additionalPrice: 0 },
        { id: "war-12", label: "Extend to 1 Year Comprehensive Warranty", additionalPrice: 149900 },
      ],
    },
    whatsInTheBox: [
      { title: "ThinkPad L390 Yoga", description: "Grade B 2-in-1 Touch Laptop", icon: "laptop" },
      { title: "ThinkPad Pen Pro", description: "Rechargeable active stylus pen", icon: "edit-3" },
      { title: "Original 65W Type-C Charger", description: "Fast charger", icon: "zap" },
      { title: "Warranty Card", description: "6 Months Comprehensive", icon: "shield" },
      { title: "GST Invoice", description: "Official Tax Invoice", icon: "file-text" },
    ],
    qcChecklist: [{ category: "Diagnostics", items: ["Touch digitizer & 360° hinge tested"] }],
  },
  {
    id: "lap-10",
    slug: "apple-macbook-pro-13-touchbar-i5-16gb-512gb",
    model: "Apple MacBook Pro 13\" (Touch Bar & 4 Thunderbolt Ports)",
    brand: "Apple",
    category: "Ultrabooks & Thin-and-Light",
    grade: "A",
    mrp: 14990000,
    sellingPrice: 4799900,
    processor: "Intel Core i5 Quad-Core 2.3GHz (Turbo Boost up to 3.8GHz)",
    ram: "16GB 2133MHz LPDDR3",
    storage: "512GB High-Speed Apple PCIe SSD",
    display: "13.3\" Retina Display (2560x1600 True Tone, 500 nits)",
    battery: "58Wh Lithium Polymer",
    batteryHealth: "88% Health Guaranteed (5–7 Hours Backup)",
    os: "macOS Ventura / Sonoma Genuine",
    warranty: "6 Months Comprehensive Warranty",
    availableUnits: 3,
    imageUrl: "/images/laptops/apple-macbook-pro-13-front.jpg",
    hoverImageUrl: "/images/laptops/apple-macbook-pro-13-hover.jpg",
    secondaryImageUrl: "/images/laptops/apple-macbook-pro-13-hover.jpg",
    qcPassedCount: 45,
    conditionNotes: "Grade A Space Grey finish. OLED Touch Bar and Touch ID sensor tested 100% functional. Pristine 500 nits Retina screen.",
    shortDescription: "Pro-tier MacBook Pro with interactive OLED Touch Bar, 4 Thunderbolt 3 ports, 16GB RAM, and vibrant 500 nits Retina screen.",
    description: "Built for creatives and software professionals who require Intel virtualization compatibility with Apple's iconic industrial design and rich Touch Bar controls.",
    ports: ["4x Thunderbolt 3 / USB-C Ports", "3.5mm Headphone Jack"],
    specs: [
      {
        group: "Specs",
        items: [
          { label: "Processor", value: "Intel Core i5 Quad-Core 2.3 GHz (Up to 3.8 GHz)" },
          { label: "Interactive Touch Bar", value: "OLED Touch Bar with integrated Touch ID sensor" },
          { label: "Ports", value: "4x Full-Speed Thunderbolt 3 Ports" },
        ],
      },
    ],
    upgradeOptions: {
      ram: [{ id: "ram-16", label: "16GB LPDDR3 (Configured)", additionalPrice: 0 }],
      storage: [{ id: "ssd-512", label: "512GB Apple PCIe SSD", additionalPrice: 0 }],
      warranty: [
        { id: "war-6", label: "6 Months Comprehensive Warranty", additionalPrice: 0 },
        { id: "war-12", label: "Extend to 1 Year Comprehensive Warranty", additionalPrice: 249900 },
      ],
    },
    whatsInTheBox: [
      { title: "MacBook Pro 13", description: "Grade A Touch Bar Laptop", icon: "laptop" },
      { title: "Apple 61W USB-C Adapter", description: "Original Apple Fast Charger", icon: "zap" },
      { title: "Warranty Card", description: "6 Months Doorstep Warranty", icon: "shield" },
      { title: "GST Invoice", description: "Official Tax Invoice", icon: "file-text" },
      { title: "Sleeve Case", description: "Padded protective sleeve", icon: "package" },
    ],
    qcChecklist: [{ category: "Diagnostics", items: ["Touch Bar & 4 TB3 ports tested"] }],
  },
  {
    id: "lap-11",
    slug: "hp-zbook-15-g5-workstation-i7-32gb-512gb",
    model: "HP ZBook 15 G5 Heavy Workstation (Quadro Graphics)",
    brand: "HP",
    category: "High-Performance Workstations",
    grade: "A_PLUS",
    mrp: 17500000,
    sellingPrice: 5499900,
    processor: "Intel Core i7-8750H 6-Core / 12-Thread (Up to 4.1 GHz)",
    ram: "32GB DDR4 2666MHz (Expandable to 64GB)",
    storage: "512GB HP Z Turbo NVMe SSD + 1TB HDD",
    display: "15.6\" FHD IPS Anti-Glare 400 nits (Nvidia Quadro P2000 4GB)",
    battery: "90Wh HP Long Life 4-cell Li-ion",
    batteryHealth: "89% Health Guaranteed (3–4 Hours Backup)",
    os: "Windows 11 Pro Genuine Pre-Activated",
    warranty: "6 Months Comprehensive Warranty",
    availableUnits: 2,
    imageUrl: "/images/laptops/hp-zbook-15-g5-front.jpg",
    hoverImageUrl: "/images/laptops/hp-zbook-15-g5-hover.jpg",
    secondaryImageUrl: "/images/laptops/hp-zbook-15-g5-hover.jpg",
    qcPassedCount: 52,
    conditionNotes: "Grade A+ heavy engineering tank. Dual high-performance cooling fans, certified ISV graphics for SolidWorks & 3ds Max.",
    shortDescription: "Industrial 6-core workstation tank with Nvidia Quadro P2000 4GB GPU, dual fans, 32GB RAM, and dual drive storage.",
    description: "The HP ZBook 15 G5 is the workhorse of choice for aerospace, automotive, and civil engineers demanding relentless stability under 24/7 continuous simulation loads.",
    ports: ["2x Thunderbolt 3 / USB-C", "3x USB 3.0", "HDMI 2.0", "RJ-45 Ethernet", "SmartCard Reader", "SD Card Reader"],
    specs: [
      {
        group: "Specs",
        items: [
          { label: "Processor", value: "Intel Core i7-8750H (6 Cores / 12 Threads)" },
          { label: "Dedicated Graphics", value: "Nvidia Quadro P2000 4GB GDDR5" },
          { label: "Cooling", value: "Dual high-static pressure fans with vapor chambers" },
        ],
      },
    ],
    upgradeOptions: {
      ram: [{ id: "ram-32", label: "32GB DDR4 (Standard)", additionalPrice: 0 }],
      storage: [
        { id: "ssd-512", label: "512GB NVMe SSD + 1TB HDD (Standard)", additionalPrice: 0 },
        { id: "ssd-1tb", label: "Upgrade to 1TB NVMe SSD + 1TB HDD", additionalPrice: 200000 },
      ],
      warranty: [
        { id: "war-6", label: "6 Months Comprehensive Warranty", additionalPrice: 0 },
        { id: "war-12", label: "Extend to 1 Year Comprehensive Warranty", additionalPrice: 249900 },
      ],
    },
    whatsInTheBox: [
      { title: "HP ZBook 15 G5", description: "Grade A+ Mobile Workstation", icon: "laptop" },
      { title: "HP 150W Workstation Charger", description: "Original high-output power brick", icon: "zap" },
      { title: "Warranty Card", description: "6 Months Comprehensive", icon: "shield" },
      { title: "GST Invoice", description: "18% GST Input Credit invoice", icon: "file-text" },
      { title: "15.6\" Heavy Sleeve", description: "Shock-resistant carry case", icon: "package" },
    ],
    qcChecklist: [{ category: "Diagnostics", items: ["52-Point Workstation Stress Test passed"] }],
  },
  {
    id: "lap-12",
    slug: "dell-vostro-3400-i5-11th-8gb-512gb",
    model: "Dell Vostro 3400 11th Gen Core i5 (Iris Xe)",
    brand: "Dell",
    category: "Student & Everyday",
    grade: "A_PLUS",
    mrp: 6500000,
    sellingPrice: 2899900,
    processor: "Intel Core i5-1135G7 11th Gen (4C/8T · Up to 4.2 GHz with Iris Xe)",
    ram: "8GB DDR4 3200MHz (Expandable to 32GB)",
    storage: "512GB PCIe NVMe SSD",
    display: "14.0\" FHD (1920x1080) Anti-glare LED Backlight Narrow Border",
    battery: "3-Cell 42Wh ExpressCharge",
    batteryHealth: "92% Health Guaranteed (4–5 Hours Backup)",
    os: "Windows 11 Pro Genuine Pre-Activated",
    warranty: "6 Months Comprehensive Warranty",
    availableUnits: 5,
    imageUrl: "/images/laptops/dell-vostro-3400-front.jpg",
    hoverImageUrl: "/images/laptops/dell-vostro-3400-hover.jpg",
    secondaryImageUrl: "/images/laptops/dell-vostro-3400-hover.jpg",
    qcPassedCount: 40,
    conditionNotes: "Grade A+ Like New condition. Modern 11th Gen Tiger Lake processor with powerful Intel Iris Xe graphics.",
    shortDescription: "Sleek and light 11th Gen Intel Core i5 with Iris Xe graphics, narrow bezels, and 512GB fast NVMe SSD.",
    description: "The Dell Vostro 3400 pairs modern 11th Gen Intel performance with narrow border FHD display and ExpressCharge battery technology, recharging up to 80% in an hour.",
    ports: ["USB 3.2 Gen 1 Type-C", "2x USB 3.2 Gen 1", "USB 2.0", "HDMI 1.4", "RJ-45 Ethernet", "SD Card Reader"],
    specs: [
      {
        group: "Specs",
        items: [
          { label: "Processor", value: "Intel Core i5-1135G7 11th Gen (Up to 4.20 GHz)" },
          { label: "Graphics", value: "Intel Iris Xe Graphics (Smooth 1080p gaming & video)" },
          { label: "RAM Speed", value: "8GB DDR4 3200MHz" },
        ],
      },
    ],
    upgradeOptions: {
      ram: [
        { id: "ram-8", label: "8GB DDR4 (Standard)", additionalPrice: 0 },
        { id: "ram-16", label: "Upgrade to 16GB DDR4", additionalPrice: 120000 },
      ],
      storage: [
        { id: "ssd-512", label: "512GB SSD (Standard)", additionalPrice: 0 },
        { id: "ssd-1tb", label: "Upgrade to 1TB SSD", additionalPrice: 250000 },
      ],
      warranty: [
        { id: "war-6", label: "6 Months Comprehensive Warranty", additionalPrice: 0 },
        { id: "war-12", label: "Extend to 1 Year Comprehensive Warranty", additionalPrice: 149900 },
      ],
    },
    whatsInTheBox: [
      { title: "Dell Vostro 3400", description: "Grade A+ 11th Gen Laptop", icon: "laptop" },
      { title: "Dell 45W AC Adapter", description: "Original Charger", icon: "zap" },
      { title: "Warranty Card", description: "6 Months Doorstep Warranty", icon: "shield" },
      { title: "GST Invoice", description: "Official Tax Invoice", icon: "file-text" },
      { title: "Laptop Sleeve", description: "Water-resistant carry sleeve", icon: "package" },
    ],
    qcChecklist: [{ category: "Diagnostics", items: ["40-Point QC Passed"] }],
  },
];

export function getLaptopBySlug(slug: string): LaptopData | undefined {
  return ALL_LAPTOPS.find((lap) => lap.slug === slug);
}
