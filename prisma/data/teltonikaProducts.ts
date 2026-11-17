import { PrismaClient } from "@prisma/client";

const CATEGORY_ID = BigInt(1);

export async function seedTeltonikaProducts(prisma: PrismaClient) {
  const user = await prisma.user.findFirst();
  if (!user) throw new Error("No user found");

  async function attr(slug: string) {
    const a = await prisma.attribute.findUnique({ where: { slug } });
    if (!a) throw new Error(`Attribute not found: ${slug}`);
    return a.id;
  }

  async function option(attributeSlug: string, value: string) {
    const attributeId = await attr(attributeSlug);
    return prisma.attributeOption.upsert({
      where: { attributeId_value: { attributeId, value } },
      update: {},
      create: { attributeId, value, displayName: value },
    });
  }

  async function setOptions(productId: bigint, attributeSlug: string, values: string | string[]) {
    const attributeId = await attr(attributeSlug);
    const pa = await prisma.productAttribute.create({ data: { productId, attributeId } });
    const valuesArray = Array.isArray(values) ? values : [values];
    for (const value of valuesArray) {
      const opt = await option(attributeSlug, value);
      await prisma.productAttributeOption.create({ data: { productAttributeId: pa.id, attributeOptionId: opt.id } });
    }
  }

  async function setNumber(productId: bigint, attributeSlug: string, value: number) {
    await prisma.productAttribute.create({ data: { productId, attributeId: await attr(attributeSlug), numberValue: value } });
  }

  async function setRange(productId: bigint, attributeSlug: string, min: number, max: number) {
    await prisma.productAttribute.create({ data: { productId, attributeId: await attr(attributeSlug), numberMin: min, numberMax: max } });
  }

  async function setBool(productId: bigint, attributeSlug: string, value: boolean) {
    await prisma.productAttribute.create({ data: { productId, attributeId: await attr(attributeSlug), booleanValue: value } });
  }

  // ================= FMB110 =================
  const fmb110 = await prisma.product.create({
    data: {
      title: "FMB110",
      description: "Teltonika FMB110 tracker.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(fmb110.id, "weight", 50);
  await setOptions(fmb110.id, "color", "Black");
  await setOptions(fmb110.id, "casing-material", "Plastic");
  await setOptions(fmb110.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmb110.id, "operating-temperature-without-battery", -40, 85);
  await setRange(fmb110.id, "storage-temperature-without-battery", -40, 85);
  await setNumber(fmb110.id, "humidity", 95);
  await setNumber(fmb110.id, "ip-rating", 41);

  // -- Electrical --
  await setRange(fmb110.id, "input-voltage-range", 10, 30);
  await setNumber(fmb110.id, "power-consumption-active-mode", 35);
  await setNumber(fmb110.id, "power-consumption-sleep-mode", 7);


  await setBool(fmb110.id, "power-saving", true);
  await setOptions(fmb110.id, "power-saving-options", ["Sleep", "Deep Sleep"]);
  await setBool(fmb110.id, "reverse-polarity-protection", true);


  console.log("Created FMB110");

  // ================= FMC130 =================
  const fmc130 = await prisma.product.create({
    data: {
      title: "FMC130",
      description: "Teltonika FMC130 tracker.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(fmc130.id, "weight", 61);
  await setOptions(fmc130.id, "color", "Black");
  await setOptions(fmc130.id, "casing-material", "Plastic");
  await setOptions(fmc130.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmc130.id, "operating-temperature", -20, 40);
  await setRange(fmc130.id, "storage-temperature", -20, 45);
  await setRange(fmc130.id, "operating-temperature-without-battery", -40, 85);
  await setRange(fmc130.id, "storage-temperature-without-battery", -40, 85);
  await setNumber(fmc130.id, "humidity", 95);
  await setNumber(fmc130.id, "ip-rating", 41);

  // -- Electrical --
  await setRange(fmc130.id, "input-voltage-range", 10, 30);
  await setNumber(fmc130.id, "power-consumption-active-mode", 33);
  await setNumber(fmc130.id, "power-consumption-sleep-mode", 16);

  await setOptions(fmc130.id, "internal-battery-type", "Li-Ion");
  await setNumber(fmc130.id, "internal-battery-size", 170);
  await setRange(fmc130.id, "battery-charging-temperature", 0, 45);
  await setRange(fmc130.id, "battery-discharging-temperature", -20, 60);

  await setBool(fmc130.id, "power-saving", true);
  await setOptions(fmc130.id, "power-saving-options", ["Sleep", "Deep Sleep"]);
  await setBool(fmc130.id, "reverse-polarity-protection", true);


  console.log("Created FMC130");

  // ================= FMB920 =================
  const fmb920 = await prisma.product.create({
    data: {
      title: "FMB920",
      description: "Teltonika FMB920 tracker.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(fmb920.id, "weight", 54);
  await setOptions(fmb920.id, "color", "Black");
  await setOptions(fmb920.id, "casing-material", "Plastic");
  await setOptions(fmb920.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmb920.id, "operating-temperature", -20, 40);
  await setRange(fmb920.id, "operating-temperature-without-battery", -40, 85);
  await setRange(fmb920.id, "storage-temperature-without-battery", -40, 85);
  await setNumber(fmb920.id, "humidity", 95);
  await setNumber(fmb920.id, "ip-rating", 54);

  // -- Electrical --
  await setRange(fmb920.id, "input-voltage-range", 6, 30);
  await setNumber(fmb920.id, "power-consumption-active-mode", 25);
  await setNumber(fmb920.id, "power-consumption-sleep-mode", 5);

  await setOptions(fmb920.id, "internal-battery-type", "Li-Ion");
  await setNumber(fmb920.id, "internal-battery-size", 170);
  await setRange(fmb920.id, "battery-charging-temperature", 0, 45);
  await setRange(fmb920.id, "battery-discharging-temperature", -20, 60);

  await setBool(fmb920.id, "power-saving", true);
  await setOptions(fmb920.id, "power-saving-options", ["Sleep", "Deep Sleep"]);
  await setBool(fmb920.id, "reverse-polarity-protection", true);


  console.log("Created FMB920");

  // ================= FMB910 =================
  const fmb910 = await prisma.product.create({
    data: {
      title: "FMB910",
      description: "Teltonika FMB910 tracker.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(fmb910.id, "weight", 69);
  await setOptions(fmb910.id, "color", "Black");
  await setOptions(fmb910.id, "casing-material", "Plastic");
  await setOptions(fmb910.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmb910.id, "operating-temperature", -20, 40);
  await setRange(fmb910.id, "operating-temperature-without-battery", -40, 85);
  await setRange(fmb910.id, "storage-temperature-without-battery", -40, 85);
  await setNumber(fmb910.id, "humidity", 95);
  await setNumber(fmb910.id, "ip-rating", 54);

  // -- Electrical --
  await setRange(fmb910.id, "input-voltage-range", 6, 30);
  await setNumber(fmb910.id, "power-consumption-active-mode", 25);
  await setNumber(fmb910.id, "power-consumption-sleep-mode", 5);

  await setOptions(fmb910.id, "internal-battery-type", "Li-Ion");
  await setNumber(fmb910.id, "internal-battery-size", 170);
  await setRange(fmb910.id, "battery-charging-temperature", 0, 45);
  await setRange(fmb910.id, "battery-discharging-temperature", -20, 60);

  await setBool(fmb910.id, "power-saving", true);
  await setOptions(fmb910.id, "power-saving-options", ["Sleep", "Deep Sleep"]);
  await setBool(fmb910.id, "reverse-polarity-protection", true);


  console.log("Created FMB910");

  // ================= FMB900 =================
  const fmb900 = await prisma.product.create({
    data: {
      title: "FMB900",
      description: "Teltonika FMB900 tracker.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(fmb900.id, "weight", 50);
  await setOptions(fmb900.id, "color", "Black");
  await setOptions(fmb900.id, "casing-material", "Plastic");
  await setOptions(fmb900.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmb900.id, "operating-temperature", -20, 40);
  await setRange(fmb900.id, "operating-temperature-without-battery", -40, 85);
  await setRange(fmb900.id, "storage-temperature-without-battery", -40, 85);
  await setNumber(fmb900.id, "humidity", 95);
  await setNumber(fmb900.id, "ip-rating", 54);

  // -- Electrical --
  await setRange(fmb900.id, "input-voltage-range", 6, 30);
  await setNumber(fmb900.id, "power-consumption-active-mode", 35);
  await setNumber(fmb900.id, "power-consumption-sleep-mode", 5);


  await setBool(fmb900.id, "power-saving", true);
  await setOptions(fmb900.id, "power-saving-options", ["Sleep", "Deep Sleep"]);
  await setBool(fmb900.id, "reverse-polarity-protection", true);


  console.log("Created FMB900");

  // ================= FMC920 =================
  const fmc920 = await prisma.product.create({
    data: {
      title: "FMC920",
      description: "Teltonika FMC920 tracker.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(fmc920.id, "weight", 54);
  await setOptions(fmc920.id, "color", "Black");
  await setOptions(fmc920.id, "casing-material", "Plastic");
  await setOptions(fmc920.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmc920.id, "operating-temperature", -20, 40);
  await setRange(fmc920.id, "operating-temperature-without-battery", -40, 85);
  await setRange(fmc920.id, "storage-temperature-without-battery", -40, 85);
  await setNumber(fmc920.id, "humidity", 95);
  await setNumber(fmc920.id, "ip-rating", 54);

  // -- Electrical --
  await setRange(fmc920.id, "input-voltage-range", 10, 30);
  await setNumber(fmc920.id, "power-consumption-active-mode", 28);
  await setNumber(fmc920.id, "power-consumption-sleep-mode", 8);

  await setOptions(fmc920.id, "internal-battery-type", "Li-Ion");
  await setNumber(fmc920.id, "internal-battery-size", 170);
  await setRange(fmc920.id, "battery-charging-temperature", 0, 45);
  await setRange(fmc920.id, "battery-discharging-temperature", -20, 60);

  await setBool(fmc920.id, "power-saving", true);
  await setOptions(fmc920.id, "power-saving-options", ["Sleep", "Deep Sleep"]);
  await setBool(fmc920.id, "reverse-polarity-protection", true);


  console.log("Created FMC920");

  // ================= FMM920 =================
  const fmm920 = await prisma.product.create({
    data: {
      title: "FMM920",
      description: "Teltonika FMM920 tracker.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(fmm920.id, "weight", 55);
  await setOptions(fmm920.id, "color", "Black");
  await setOptions(fmm920.id, "casing-material", "Plastic");
  await setOptions(fmm920.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmm920.id, "operating-temperature", -20, 40);
  await setRange(fmm920.id, "operating-temperature-without-battery", -40, 85);
  await setRange(fmm920.id, "storage-temperature-without-battery", -40, 85);
  await setNumber(fmm920.id, "humidity", 95);
  await setNumber(fmm920.id, "ip-rating", 54);

  // -- Electrical --
  await setRange(fmm920.id, "input-voltage-range", 10, 30);
  await setNumber(fmm920.id, "power-consumption-active-mode", 25);
  await setNumber(fmm920.id, "power-consumption-sleep-mode", 5);

  await setOptions(fmm920.id, "internal-battery-type", "Li-Ion");
  await setNumber(fmm920.id, "internal-battery-size", 170);
  await setRange(fmm920.id, "battery-charging-temperature", 0, 45);
  await setRange(fmm920.id, "battery-discharging-temperature", -20, 60);

  await setBool(fmm920.id, "power-saving", true);
  await setOptions(fmm920.id, "power-saving-options", ["Sleep", "Deep Sleep"]);
  await setBool(fmm920.id, "reverse-polarity-protection", true);


  console.log("Created FMM920");

  // ================= FMB130 =================
  const fmb130 = await prisma.product.create({
    data: {
      title: "FMB130",
      description: "Teltonika FMB130 tracker.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(fmb130.id, "weight", 55);
  await setOptions(fmb130.id, "color", "Black");
  await setOptions(fmb130.id, "casing-material", "Plastic");
  await setOptions(fmb130.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmb130.id, "operating-temperature-without-battery", -40, 85);
  await setRange(fmb130.id, "storage-temperature-without-battery", -40, 85);
  await setNumber(fmb130.id, "humidity", 95);
  await setNumber(fmb130.id, "ip-rating", 41);

  // -- Electrical --
  await setRange(fmb130.id, "input-voltage-range", 10, 30);

  await setOptions(fmb130.id, "internal-battery-type", "Li-Ion");
  await setNumber(fmb130.id, "internal-battery-size", 170);
  await setRange(fmb130.id, "battery-charging-temperature", 0, 45);
  await setRange(fmb130.id, "battery-discharging-temperature", -20, 60);

  await setBool(fmb130.id, "power-saving", true);
  await setOptions(fmb130.id, "power-saving-options", ["Sleep", "Deep Sleep"]);
  await setBool(fmb130.id, "reverse-polarity-protection", true);


  console.log("Created FMB130");

  // ================= FMM130 =================
  const fmm130 = await prisma.product.create({
    data: {
      title: "FMM130",
      description: "Teltonika FMM130 tracker.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(fmm130.id, "weight", 55);
  await setOptions(fmm130.id, "color", "Black");
  await setOptions(fmm130.id, "casing-material", "Plastic");
  await setOptions(fmm130.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmm130.id, "operating-temperature", -20, 40);
  await setRange(fmm130.id, "operating-temperature-without-battery", -40, 85);
  await setRange(fmm130.id, "storage-temperature-without-battery", -40, 85);
  await setNumber(fmm130.id, "humidity", 95);
  await setNumber(fmm130.id, "ip-rating", 41);

  // -- Electrical --
  await setRange(fmm130.id, "input-voltage-range", 10, 30);
  await setNumber(fmm130.id, "power-consumption-active-mode", 34);
  await setNumber(fmm130.id, "power-consumption-sleep-mode", 11);

  await setOptions(fmm130.id, "internal-battery-type", "Li-Ion");
  await setNumber(fmm130.id, "internal-battery-size", 170);
  await setRange(fmm130.id, "battery-charging-temperature", 0, 45);
  await setRange(fmm130.id, "battery-discharging-temperature", -20, 60);

  await setBool(fmm130.id, "power-saving", true);
  await setOptions(fmm130.id, "power-saving-options", ["Sleep", "Deep Sleep"]);
  await setBool(fmm130.id, "reverse-polarity-protection", true);


  console.log("Created FMM130");

  // ================= FMB001 =================
  const fmb001 = await prisma.product.create({
    data: {
      title: "FMB001",
      description: "Teltonika FMB001 tracker.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(fmb001.id, "weight", 63);
  await setOptions(fmb001.id, "color", "Black");
  await setOptions(fmb001.id, "casing-material", "Plastic");
  await setOptions(fmb001.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmb001.id, "operating-temperature-without-battery", -40, 85);
  await setRange(fmb001.id, "storage-temperature-without-battery", -40, 85);
  await setNumber(fmb001.id, "humidity", 95);
  await setNumber(fmb001.id, "ip-rating", 41);

  // -- Electrical --
  await setRange(fmb001.id, "input-voltage-range", 10, 30);
  await setNumber(fmb001.id, "power-consumption-active-mode", 25);
  await setNumber(fmb001.id, "power-consumption-sleep-mode", 5);

  await setOptions(fmb001.id, "internal-battery-type", "Li-Ion");
  await setNumber(fmb001.id, "internal-battery-size", 170);
  await setRange(fmb001.id, "battery-charging-temperature", 0, 45);
  await setRange(fmb001.id, "battery-discharging-temperature", -20, 60);

  await setBool(fmb001.id, "power-saving", true);
  await setOptions(fmb001.id, "power-saving-options", ["Sleep", "Deep Sleep"]);
  await setBool(fmb001.id, "reverse-polarity-protection", true);


  console.log("Created FMB001");

  // ================= FMT100 =================
  const fmt100 = await prisma.product.create({
    data: {
      title: "FMT100",
      description: "Teltonika FMT100 tracker.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(fmt100.id, "weight", 63);
  await setOptions(fmt100.id, "color", "Black");
  await setOptions(fmt100.id, "casing-material", "Plastic");
  await setOptions(fmt100.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmt100.id, "operating-temperature-without-battery", -40, 85);
  await setRange(fmt100.id, "storage-temperature-without-battery", -40, 85);
  await setNumber(fmt100.id, "humidity", 95);
  await setNumber(fmt100.id, "ip-rating", 65);

  // -- Electrical --
  await setRange(fmt100.id, "input-voltage-range", 10, 30);
  await setNumber(fmt100.id, "power-consumption-active-mode", 24.41);
  await setNumber(fmt100.id, "power-consumption-sleep-mode", 3.75);

  await setOptions(fmt100.id, "internal-battery-type", "Li-Ion");
  await setNumber(fmt100.id, "internal-battery-size", 170);
  await setRange(fmt100.id, "battery-discharging-temperature", -20, 60);

  await setBool(fmt100.id, "power-saving", true);
  await setOptions(fmt100.id, "power-saving-options", ["Sleep", "Deep Sleep"]);
  await setBool(fmt100.id, "reverse-polarity-protection", true);


  console.log("Created FMT100");

  // ================= FMP100 =================
  const fmp100 = await prisma.product.create({
    data: {
      title: "FMP100",
      description: "Teltonika FMP100 tracker.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(fmp100.id, "weight", 55);
  await setOptions(fmp100.id, "color", "Black");
  await setOptions(fmp100.id, "casing-material", "Plastic");
  await setOptions(fmp100.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmp100.id, "operating-temperature-without-battery", -40, 85);
  await setRange(fmp100.id, "storage-temperature-without-battery", -40, 85);
  await setNumber(fmp100.id, "humidity", 95);
  await setNumber(fmp100.id, "ip-rating", 41);

  // -- Electrical --
  await setRange(fmp100.id, "input-voltage-range", 10, 30);
  await setNumber(fmp100.id, "power-consumption-active-mode", 28);
  await setNumber(fmp100.id, "power-consumption-sleep-mode", 7);

  await setOptions(fmp100.id, "internal-battery-type", "Li-Ion");
  await setNumber(fmp100.id, "internal-battery-size", 170);
  await setRange(fmp100.id, "battery-discharging-temperature", -20, 60);

  await setBool(fmp100.id, "power-saving", true);
  await setOptions(fmp100.id, "power-saving-options", ["Sleep", "Deep Sleep"]);
  await setBool(fmp100.id, "reverse-polarity-protection", true);


  console.log("Created FMP100");

  // ================= FMB010 =================
  const fmb010 = await prisma.product.create({
    data: {
      title: "FMB010",
      description: "Teltonika FMB010 tracker.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(fmb010.id, "weight", 63);
  await setOptions(fmb010.id, "color", "Black");
  await setOptions(fmb010.id, "casing-material", "Plastic");
  await setOptions(fmb010.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmb010.id, "operating-temperature-without-battery", -40, 85);
  await setRange(fmb010.id, "storage-temperature-without-battery", -40, 85);
  await setNumber(fmb010.id, "humidity", 95);
  await setNumber(fmb010.id, "ip-rating", 41);

  // -- Electrical --
  await setRange(fmb010.id, "input-voltage-range", 10, 30);
  await setNumber(fmb010.id, "power-consumption-active-mode", 28);
  await setNumber(fmb010.id, "power-consumption-sleep-mode", 7);

  await setOptions(fmb010.id, "internal-battery-type", "Li-Ion");
  await setNumber(fmb010.id, "internal-battery-size", 170);
  await setRange(fmb010.id, "battery-charging-temperature", 0, 45);
  await setRange(fmb010.id, "battery-discharging-temperature", -20, 60);

  await setBool(fmb010.id, "power-saving", true);
  await setOptions(fmb010.id, "power-saving-options", ["Sleep", "Deep Sleep"]);
  await setBool(fmb010.id, "reverse-polarity-protection", true);


  console.log("Created FMB010");

  // ================= FMB020 =================
  const fmb020 = await prisma.product.create({
    data: {
      title: "FMB020",
      description: "Teltonika FMB020 tracker.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(fmb020.id, "weight", 63);
  await setOptions(fmb020.id, "color", "Black");
  await setOptions(fmb020.id, "casing-material", "Plastic");
  await setOptions(fmb020.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmb020.id, "operating-temperature-without-battery", -40, 85);
  await setRange(fmb020.id, "storage-temperature-without-battery", -40, 85);
  await setNumber(fmb020.id, "humidity", 95);
  await setNumber(fmb020.id, "ip-rating", 41);

  // -- Electrical --
  await setRange(fmb020.id, "input-voltage-range", 10, 30);
  await setNumber(fmb020.id, "power-consumption-active-mode", 28);
  await setNumber(fmb020.id, "power-consumption-sleep-mode", 7);

  await setOptions(fmb020.id, "internal-battery-type", "Li-Ion");
  await setNumber(fmb020.id, "internal-battery-size", 45);
  await setRange(fmb020.id, "battery-charging-temperature", 0, 45);
  await setRange(fmb020.id, "battery-discharging-temperature", -20, 60);

  await setBool(fmb020.id, "power-saving", true);
  await setOptions(fmb020.id, "power-saving-options", ["Sleep", "Deep Sleep"]);
  await setBool(fmb020.id, "reverse-polarity-protection", true);


  console.log("Created FMB020");

  // ================= FMB003 =================
  const fmb003 = await prisma.product.create({
    data: {
      title: "FMB003",
      description: "Teltonika FMB003 tracker.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(fmb003.id, "weight", 30);
  await setOptions(fmb003.id, "color", "Black");
  await setOptions(fmb003.id, "casing-material", "Plastic");
  await setOptions(fmb003.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmb003.id, "operating-temperature-without-battery", -40, 85);
  await setRange(fmb003.id, "storage-temperature-without-battery", -40, 85);
  await setNumber(fmb003.id, "humidity", 95);
  await setNumber(fmb003.id, "ip-rating", 41);

  // -- Electrical --
  await setRange(fmb003.id, "input-voltage-range", 10, 30);
  await setNumber(fmb003.id, "power-consumption-active-mode", 28);
  await setNumber(fmb003.id, "power-consumption-sleep-mode", 7);

  await setOptions(fmb003.id, "internal-battery-type", "Li-Ion");
  await setNumber(fmb003.id, "internal-battery-size", 45);
  await setRange(fmb003.id, "battery-charging-temperature", 0, 45);
  await setRange(fmb003.id, "battery-discharging-temperature", -20, 60);

  await setBool(fmb003.id, "power-saving", true);
  await setOptions(fmb003.id, "power-saving-options", ["Sleep", "Deep Sleep"]);
  await setBool(fmb003.id, "reverse-polarity-protection", true);


  console.log("Created FMB003");

  // ================= FMB120 =================
  const fmb120 = await prisma.product.create({
    data: {
      title: "FMB120",
      description: "Teltonika FMB120 tracker.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(fmb120.id, "weight", 55);
  await setOptions(fmb120.id, "color", "Black");
  await setOptions(fmb120.id, "casing-material", "Plastic");
  await setOptions(fmb120.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmb120.id, "operating-temperature-without-battery", -40, 85);
  await setRange(fmb120.id, "storage-temperature-without-battery", -40, 85);
  await setNumber(fmb120.id, "humidity", 95);
  await setNumber(fmb120.id, "ip-rating", 41);

  // -- Electrical --
  await setRange(fmb120.id, "input-voltage-range", 10, 30);
  await setNumber(fmb120.id, "power-consumption-active-mode", 28);
  await setNumber(fmb120.id, "power-consumption-sleep-mode", 7);

  await setOptions(fmb120.id, "internal-battery-type", "Li-Ion");
  await setNumber(fmb120.id, "internal-battery-size", 170);
  await setRange(fmb120.id, "battery-charging-temperature", 0, 45);
  await setRange(fmb120.id, "battery-discharging-temperature", -20, 60);

  await setBool(fmb120.id, "power-saving", true);
  await setOptions(fmb120.id, "power-saving-options", ["Sleep", "Deep Sleep"]);
  await setBool(fmb120.id, "reverse-polarity-protection", true);


  console.log("Created FMB120");

  // ================= FMB122 =================
  const fmb122 = await prisma.product.create({
    data: {
      title: "FMB122",
      description: "Teltonika FMB122 tracker.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(fmb122.id, "weight", 51);
  await setOptions(fmb122.id, "color", "Black");
  await setOptions(fmb122.id, "casing-material", "Plastic");
  await setOptions(fmb122.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmb122.id, "operating-temperature-without-battery", -40, 85);
  await setRange(fmb122.id, "storage-temperature-without-battery", -40, 85);
  await setNumber(fmb122.id, "humidity", 95);
  await setNumber(fmb122.id, "ip-rating", 41);

  // -- Electrical --
  await setRange(fmb122.id, "input-voltage-range", 10, 30);
  await setNumber(fmb122.id, "power-consumption-active-mode", 34);
  await setNumber(fmb122.id, "power-consumption-sleep-mode", 11);

  await setOptions(fmb122.id, "internal-battery-type", "Li-Ion");
  await setNumber(fmb122.id, "internal-battery-size", 170);
  await setRange(fmb122.id, "battery-charging-temperature", 0, 45);
  await setRange(fmb122.id, "battery-discharging-temperature", -20, 60);

  await setBool(fmb122.id, "power-saving", true);
  await setOptions(fmb122.id, "power-saving-options", ["Sleep", "Deep Sleep"]);
  await setBool(fmb122.id, "reverse-polarity-protection", true);


  console.log("Created FMB122");

  // ================= FMB125 =================
  const fmb125 = await prisma.product.create({
    data: {
      title: "FMB125",
      description: "Teltonika FMB125 tracker.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(fmb125.id, "weight", 52);
  await setOptions(fmb125.id, "color", "Black");
  await setOptions(fmb125.id, "casing-material", "Plastic");
  await setOptions(fmb125.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmb125.id, "operating-temperature-without-battery", -40, 85);
  await setRange(fmb125.id, "storage-temperature-without-battery", -40, 85);
  await setNumber(fmb125.id, "humidity", 95);
  await setNumber(fmb125.id, "ip-rating", 41);

  // -- Electrical --
  await setRange(fmb125.id, "input-voltage-range", 10, 30);
  await setNumber(fmb125.id, "power-consumption-active-mode", 34);
  await setNumber(fmb125.id, "power-consumption-sleep-mode", 11);

  await setOptions(fmb125.id, "internal-battery-type", "Li-Ion");
  await setNumber(fmb125.id, "internal-battery-size", 170);
  await setRange(fmb125.id, "battery-charging-temperature", 0, 45);
  await setRange(fmb125.id, "battery-discharging-temperature", -20, 60);

  await setBool(fmb125.id, "power-saving", true);
  await setOptions(fmb125.id, "power-saving-options", ["Sleep", "Deep Sleep"]);
  await setBool(fmb125.id, "reverse-polarity-protection", true);


  console.log("Created FMB125");

  // ================= FMB225 =================
  const fmb225 = await prisma.product.create({
    data: {
      title: "FMB225",
      description: "Teltonika FMB225 tracker.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(fmb225.id, "weight", 75);
  await setOptions(fmb225.id, "color", "Black");
  await setOptions(fmb225.id, "casing-material", "Plastic");
  await setOptions(fmb225.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmb225.id, "operating-temperature-without-battery", -40, 85);
  await setRange(fmb225.id, "storage-temperature-without-battery", -40, 85);
  await setNumber(fmb225.id, "humidity", 95);
  await setNumber(fmb225.id, "ip-rating", 67);

  // -- Electrical --
  await setRange(fmb225.id, "input-voltage-range", 10, 30);
  await setNumber(fmb225.id, "power-consumption-active-mode", 34);
  await setNumber(fmb225.id, "power-consumption-sleep-mode", 11);

  await setOptions(fmb225.id, "internal-battery-type", "Li-Ion");
  await setNumber(fmb225.id, "internal-battery-size", 170);
  await setRange(fmb225.id, "battery-charging-temperature", 0, 45);
  await setRange(fmb225.id, "battery-discharging-temperature", -20, 60);

  await setBool(fmb225.id, "power-saving", true);
  await setOptions(fmb225.id, "power-saving-options", ["Sleep", "Deep Sleep"]);
  await setBool(fmb225.id, "reverse-polarity-protection", true);


  console.log("Created FMB225");

  // ================= FMM003 =================
  const fmm003 = await prisma.product.create({
    data: {
      title: "FMM003",
      description: "Teltonika FMM003 tracker.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(fmm003.id, "weight", 63);
  await setOptions(fmm003.id, "color", "Black");
  await setOptions(fmm003.id, "casing-material", "Plastic");
  await setOptions(fmm003.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmm003.id, "operating-temperature-without-battery", -40, 85);
  await setRange(fmm003.id, "storage-temperature-without-battery", -40, 85);
  await setNumber(fmm003.id, "humidity", 95);
  await setNumber(fmm003.id, "ip-rating", 41);

  // -- Electrical --
  await setRange(fmm003.id, "input-voltage-range", 10, 30);
  await setNumber(fmm003.id, "power-consumption-active-mode", 31);
  await setNumber(fmm003.id, "power-consumption-sleep-mode", 13);

  await setOptions(fmm003.id, "internal-battery-type", "Li-Ion");
  await setNumber(fmm003.id, "internal-battery-size", 170);
  await setRange(fmm003.id, "battery-charging-temperature", 0, 45);
  await setRange(fmm003.id, "battery-discharging-temperature", -20, 60);

  await setBool(fmm003.id, "power-saving", true);
  await setOptions(fmm003.id, "power-saving-options", ["Sleep", "Deep Sleep"]);
  await setBool(fmm003.id, "reverse-polarity-protection", true);


  console.log("Created FMM003");

  // ================= FMB230 =================
  const fmb230 = await prisma.product.create({
    data: {
      title: "FMB230",
      description: "Teltonika FMB230 tracker.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(fmb230.id, "weight", 75);
  await setOptions(fmb230.id, "color", "Black");
  await setOptions(fmb230.id, "casing-material", "Plastic");
  await setOptions(fmb230.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmb230.id, "operating-temperature-without-battery", -40, 85);
  await setRange(fmb230.id, "storage-temperature-without-battery", -40, 85);
  await setNumber(fmb230.id, "humidity", 95);
  await setNumber(fmb230.id, "ip-rating", 67);

  // -- Electrical --
  await setRange(fmb230.id, "input-voltage-range", 10, 30);
  await setNumber(fmb230.id, "power-consumption-active-mode", 34);
  await setNumber(fmb230.id, "power-consumption-sleep-mode", 5.5);

  await setOptions(fmb230.id, "internal-battery-type", "Li-Ion");
  await setNumber(fmb230.id, "internal-battery-size", 170);
  await setRange(fmb230.id, "battery-charging-temperature", 0, 45);
  await setRange(fmb230.id, "battery-discharging-temperature", -20, 60);

  await setBool(fmb230.id, "power-saving", true);
  await setOptions(fmb230.id, "power-saving-options", ["Sleep", "Deep Sleep"]);
  await setBool(fmb230.id, "reverse-polarity-protection", true);


  console.log("Created FMB230");

  // ================= FMM00A =================
  const fmm00a = await prisma.product.create({
    data: {
      title: "FMM00A",
      description: "Teltonika FMM00A tracker.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(fmm00a.id, "weight", 63);
  await setOptions(fmm00a.id, "color", "Black");
  await setOptions(fmm00a.id, "casing-material", "Plastic");
  await setOptions(fmm00a.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmm00a.id, "operating-temperature-without-battery", -40, 85);
  await setRange(fmm00a.id, "storage-temperature-without-battery", -40, 85);
  await setNumber(fmm00a.id, "humidity", 95);
  await setNumber(fmm00a.id, "ip-rating", 41);

  // -- Electrical --
  await setRange(fmm00a.id, "input-voltage-range", 10, 30);
  await setNumber(fmm00a.id, "power-consumption-active-mode", 31);
  await setNumber(fmm00a.id, "power-consumption-sleep-mode", 13);

  await setOptions(fmm00a.id, "internal-battery-type", "Li-Ion");
  await setNumber(fmm00a.id, "internal-battery-size", 115);
  await setRange(fmm00a.id, "battery-charging-temperature", 0, 45);
  await setRange(fmm00a.id, "battery-discharging-temperature", -20, 60);

  await setBool(fmm00a.id, "power-saving", true);
  await setOptions(fmm00a.id, "power-saving-options", ["Sleep", "Deep Sleep"]);
  await setBool(fmm00a.id, "reverse-polarity-protection", true);


  console.log("Created FMM00A");

  // ================= FMC125 =================
  const fmc125 = await prisma.product.create({
    data: {
      title: "FMC125",
      description: "Teltonika FMC125 tracker.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(fmc125.id, "weight", 62);
  await setOptions(fmc125.id, "color", "Black");
  await setOptions(fmc125.id, "casing-material", "Plastic");
  await setOptions(fmc125.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmc125.id, "operating-temperature-without-battery", -40, 85);
  await setRange(fmc125.id, "storage-temperature-without-battery", -40, 85);
  await setNumber(fmc125.id, "humidity", 95);
  await setNumber(fmc125.id, "ip-rating", 41);

  // -- Electrical --
  await setRange(fmc125.id, "input-voltage-range", 10, 30);
  await setNumber(fmc125.id, "power-consumption-active-mode", 36);
  await setNumber(fmc125.id, "power-consumption-sleep-mode", 12);

  await setOptions(fmc125.id, "internal-battery-type", "Li-Ion");
  await setNumber(fmc125.id, "internal-battery-size", 170);
  await setRange(fmc125.id, "battery-charging-temperature", 0, 45);
  await setRange(fmc125.id, "battery-discharging-temperature", -20, 60);

  await setBool(fmc125.id, "power-saving", true);
  await setOptions(fmc125.id, "power-saving-options", ["Sleep", "Deep Sleep"]);
  await setBool(fmc125.id, "reverse-polarity-protection", true);


  console.log("Created FMC125");

  // ================= FMC003 =================
  const fmc003 = await prisma.product.create({
    data: {
      title: "FMC003",
      description: "Teltonika FMC003 tracker.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(fmc003.id, "weight", 63);
  await setOptions(fmc003.id, "color", "Black");
  await setOptions(fmc003.id, "casing-material", "Plastic");
  await setOptions(fmc003.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmc003.id, "operating-temperature-without-battery", -40, 85);
  await setRange(fmc003.id, "storage-temperature-without-battery", -40, 85);
  await setNumber(fmc003.id, "humidity", 95);
  await setNumber(fmc003.id, "ip-rating", 41);

  // -- Electrical --
  await setRange(fmc003.id, "input-voltage-range", 10, 30);
  await setNumber(fmc003.id, "power-consumption-active-mode", 31);
  await setNumber(fmc003.id, "power-consumption-sleep-mode", 13);

  await setOptions(fmc003.id, "internal-battery-type", "Li-Ion");
  await setNumber(fmc003.id, "internal-battery-size", 170);
  await setRange(fmc003.id, "battery-charging-temperature", 0, 45);
  await setRange(fmc003.id, "battery-discharging-temperature", -20, 60);

  await setBool(fmc003.id, "power-saving", true);
  await setOptions(fmc003.id, "power-saving-options", ["Sleep", "Deep Sleep"]);
  await setBool(fmc003.id, "reverse-polarity-protection", true);


  console.log("Created FMC003");

  // ================= FMC00A =================
  const fmc00a = await prisma.product.create({
    data: {
      title: "FMC00A",
      description: "Teltonika FMC00A tracker.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(fmc00a.id, "weight", 63);
  await setOptions(fmc00a.id, "color", "Black");
  await setOptions(fmc00a.id, "casing-material", "Plastic");
  await setOptions(fmc00a.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmc00a.id, "operating-temperature-without-battery", -40, 85);
  await setRange(fmc00a.id, "storage-temperature-without-battery", -40, 85);
  await setNumber(fmc00a.id, "humidity", 95);
  await setNumber(fmc00a.id, "ip-rating", 41);

  // -- Electrical --
  await setRange(fmc00a.id, "input-voltage-range", 10, 30);
  await setNumber(fmc00a.id, "power-consumption-active-mode", 31);
  await setNumber(fmc00a.id, "power-consumption-sleep-mode", 13);

  await setOptions(fmc00a.id, "internal-battery-type", "Li-Ion");
  await setNumber(fmc00a.id, "internal-battery-size", 115);
  await setRange(fmc00a.id, "battery-charging-temperature", 0, 45);
  await setRange(fmc00a.id, "battery-discharging-temperature", -20, 60);

  await setBool(fmc00a.id, "power-saving", true);
  await setOptions(fmc00a.id, "power-saving-options", ["Sleep", "Deep Sleep"]);
  await setBool(fmc00a.id, "reverse-polarity-protection", true);


  console.log("Created FMC00A");

  // ================= TFT100 =================
  const tft100 = await prisma.product.create({
    data: {
      title: "TFT100",
      description: "Teltonika TFT100 tracker.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(tft100.id, "weight", 169);
  await setOptions(tft100.id, "color", "Black");
  await setOptions(tft100.id, "casing-material", "Plastic");
  await setOptions(tft100.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(tft100.id, "operating-temperature-without-battery", -20, 75);
  await setRange(tft100.id, "storage-temperature-without-battery", -20, 75);
  await setNumber(tft100.id, "humidity", 95);
  await setNumber(tft100.id, "ip-rating", 67);

  // -- Electrical --
  await setRange(tft100.id, "input-voltage-range", -97, 10);

  await setOptions(tft100.id, "internal-battery-type", "Li-Ion");
  await setNumber(tft100.id, "internal-battery-size", 1800);
  await setRange(tft100.id, "battery-charging-temperature", 0, 45);
  await setRange(tft100.id, "battery-discharging-temperature", -20, 70);

  await setBool(tft100.id, "power-saving", true);
  await setOptions(tft100.id, "power-saving-options", ["Sleep", "Deep Sleep"]);


  console.log("Created TFT100");

  // ================= FMC225 =================
  const fmc225 = await prisma.product.create({
    data: {
      title: "FMC225",
      description: "Teltonika FMC225 tracker.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(fmc225.id, "weight", 79);
  await setOptions(fmc225.id, "color", "Black");
  await setOptions(fmc225.id, "casing-material", "Plastic");
  await setOptions(fmc225.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmc225.id, "operating-temperature", -20, 40);
  await setRange(fmc225.id, "operating-temperature-without-battery", -40, 85);
  await setRange(fmc225.id, "storage-temperature-without-battery", -40, 85);
  await setNumber(fmc225.id, "humidity", 95);
  await setNumber(fmc225.id, "ip-rating", 67);

  // -- Electrical --
  await setRange(fmc225.id, "input-voltage-range", 10, 30);
  await setNumber(fmc225.id, "power-consumption-active-mode", 36);
  await setNumber(fmc225.id, "power-consumption-sleep-mode", 12);

  await setOptions(fmc225.id, "internal-battery-type", "Li-Ion");
  await setNumber(fmc225.id, "internal-battery-size", 170);
  await setRange(fmc225.id, "battery-charging-temperature", 0, 45);
  await setRange(fmc225.id, "battery-discharging-temperature", -20, 70);

  await setBool(fmc225.id, "power-saving", true);
  await setOptions(fmc225.id, "power-saving-options", ["Sleep", "Deep Sleep"]);
  await setBool(fmc225.id, "reverse-polarity-protection", true);


  console.log("Created FMC225");

  // ================= FMC230 =================
  const fmc230 = await prisma.product.create({
    data: {
      title: "FMC230",
      description: "Teltonika FMC230 tracker.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(fmc230.id, "weight", 79);
  await setOptions(fmc230.id, "color", "Black");
  await setOptions(fmc230.id, "casing-material", "Plastic");
  await setOptions(fmc230.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmc230.id, "operating-temperature", -20, 40);
  await setRange(fmc230.id, "storage-temperature", -20, 45);
  await setRange(fmc230.id, "operating-temperature-without-battery", -40, 85);
  await setRange(fmc230.id, "storage-temperature-without-battery", -40, 85);
  await setNumber(fmc230.id, "humidity", 95);
  await setNumber(fmc230.id, "ip-rating", 67);

  // -- Electrical --
  await setRange(fmc230.id, "input-voltage-range", 10, 30);
  await setNumber(fmc230.id, "power-consumption-active-mode", 33);
  await setNumber(fmc230.id, "power-consumption-sleep-mode", 16);

  await setOptions(fmc230.id, "internal-battery-type", "Li-Ion");
  await setNumber(fmc230.id, "internal-battery-size", 170);
  await setRange(fmc230.id, "battery-charging-temperature", 0, 45);
  await setRange(fmc230.id, "battery-discharging-temperature", -20, 70);

  await setBool(fmc230.id, "power-saving", true);
  await setOptions(fmc230.id, "power-saving-options", ["Sleep", "Deep Sleep"]);
  await setBool(fmc230.id, "reverse-polarity-protection", true);


  console.log("Created FMC230");

  // ================= FMM125 =================
  const fmm125 = await prisma.product.create({
    data: {
      title: "FMM125",
      description: "Teltonika FMM125 tracker.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(fmm125.id, "weight", 55);
  await setOptions(fmm125.id, "color", "Black");
  await setOptions(fmm125.id, "casing-material", "Plastic");
  await setOptions(fmm125.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmm125.id, "operating-temperature", -20, 40);
  await setRange(fmm125.id, "operating-temperature-without-battery", -40, 85);
  await setRange(fmm125.id, "storage-temperature-without-battery", -40, 85);
  await setNumber(fmm125.id, "humidity", 95);
  await setNumber(fmm125.id, "ip-rating", 41);

  // -- Electrical --
  await setRange(fmm125.id, "input-voltage-range", 10, 30);

  await setOptions(fmm125.id, "internal-battery-type", "Li-Ion");
  await setNumber(fmm125.id, "internal-battery-size", 170);
  await setRange(fmm125.id, "battery-charging-temperature", 0, 45);
  await setRange(fmm125.id, "battery-discharging-temperature", -20, 60);

  await setBool(fmm125.id, "power-saving", true);
  await setOptions(fmm125.id, "power-saving-options", ["Sleep", "Deep Sleep"]);
  await setBool(fmm125.id, "reverse-polarity-protection", true);


  console.log("Created FMM125");

  // ================= FMM230 =================
  const fmm230 = await prisma.product.create({
    data: {
      title: "FMM230",
      description: "Teltonika FMM230 tracker.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(fmm230.id, "weight", 75);
  await setOptions(fmm230.id, "color", "Black");
  await setOptions(fmm230.id, "casing-material", "Plastic");
  await setOptions(fmm230.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmm230.id, "operating-temperature", -20, 40);
  await setRange(fmm230.id, "storage-temperature", -20, 45);
  await setRange(fmm230.id, "operating-temperature-without-battery", -40, 85);
  await setRange(fmm230.id, "storage-temperature-without-battery", -40, 85);
  await setNumber(fmm230.id, "humidity", 95);
  await setNumber(fmm230.id, "ip-rating", 67);

  // -- Electrical --
  await setRange(fmm230.id, "input-voltage-range", 10, 30);

  await setOptions(fmm230.id, "internal-battery-type", "Li-Ion");
  await setNumber(fmm230.id, "internal-battery-size", 170);
  await setRange(fmm230.id, "battery-charging-temperature", 0, 45);
  await setRange(fmm230.id, "battery-discharging-temperature", -20, 60);

  await setBool(fmm230.id, "power-saving", true);
  await setOptions(fmm230.id, "power-saving-options", ["Sleep", "Deep Sleep"]);
  await setBool(fmm230.id, "reverse-polarity-protection", true);


  console.log("Created FMM230");

  // ================= FMB202 =================
  const fmb202 = await prisma.product.create({
    data: {
      title: "FMB202",
      description: "Teltonika FMB202 tracker.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(fmb202.id, "weight", 205);
  await setOptions(fmb202.id, "color", "Black");
  await setOptions(fmb202.id, "casing-material", "Plastic");
  await setOptions(fmb202.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmb202.id, "operating-temperature-without-battery", -40, 85);
  await setRange(fmb202.id, "storage-temperature-without-battery", -40, 85);
  await setNumber(fmb202.id, "humidity", 95);
  await setNumber(fmb202.id, "ip-rating", 67);

  // -- Electrical --
  await setRange(fmb202.id, "input-voltage-range", 6, 30);
  await setNumber(fmb202.id, "power-consumption-active-mode", 28.3);
  await setNumber(fmb202.id, "power-consumption-sleep-mode", 4);

  await setOptions(fmb202.id, "internal-battery-type", "Ni-MH");
  await setNumber(fmb202.id, "internal-battery-size", 400);

  await setBool(fmb202.id, "power-saving", true);
  await setOptions(fmb202.id, "power-saving-options", ["Sleep", "Deep Sleep"]);


  console.log("Created FMB202");

  // ================= FMB204 =================
  const fmb204 = await prisma.product.create({
    data: {
      title: "FMB204",
      description: "Teltonika FMB204 tracker.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(fmb204.id, "weight", 205);
  await setOptions(fmb204.id, "color", "Black");
  await setOptions(fmb204.id, "casing-material", "Plastic");
  await setOptions(fmb204.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmb204.id, "operating-temperature-without-battery", -40, 85);
  await setRange(fmb204.id, "storage-temperature-without-battery", -40, 85);
  await setNumber(fmb204.id, "humidity", 95);
  await setNumber(fmb204.id, "ip-rating", 67);

  // -- Electrical --
  await setRange(fmb204.id, "input-voltage-range", 6, 30);
  await setNumber(fmb204.id, "power-consumption-active-mode", 28.3);
  await setNumber(fmb204.id, "power-consumption-sleep-mode", 4.2);

  await setOptions(fmb204.id, "internal-battery-type", "Li-Ion");
  await setNumber(fmb204.id, "internal-battery-size", 1800);
  await setRange(fmb204.id, "battery-charging-temperature", 0, 45);
  await setRange(fmb204.id, "battery-discharging-temperature", -20, 60);

  await setBool(fmb204.id, "power-saving", true);
  await setOptions(fmb204.id, "power-saving-options", ["Sleep", "Deep Sleep"]);


  console.log("Created FMB204");

  // ================= FMB965 =================
  const fmb965 = await prisma.product.create({
    data: {
      title: "FMB965",
      description: "Teltonika FMB965 tracker.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(fmb965.id, "weight", 74);
  await setOptions(fmb965.id, "color", "Black");
  await setOptions(fmb965.id, "casing-material", "Plastic");
  await setOptions(fmb965.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmb965.id, "operating-temperature", -40, 85);
  await setRange(fmb965.id, "operating-temperature-without-battery", -20, 40);
  await setRange(fmb965.id, "storage-temperature-without-battery", -40, 85);
  await setNumber(fmb965.id, "humidity", 95);
  await setNumber(fmb965.id, "ip-rating", 67);

  // -- Electrical --
  await setRange(fmb965.id, "input-voltage-range", 10, 30);

  await setOptions(fmb965.id, "internal-battery-type", "Li-Ion");
  await setNumber(fmb965.id, "internal-battery-size", 170);
  await setRange(fmb965.id, "battery-charging-temperature", 0, 45);
  await setRange(fmb965.id, "battery-discharging-temperature", -20, 60);

  await setBool(fmb965.id, "power-saving", true);
  await setOptions(fmb965.id, "power-saving-options", ["Sleep", "Deep Sleep"]);
  await setBool(fmb965.id, "reverse-polarity-protection", true);


  console.log("Created FMB965");

  // ================= FMB641 =================
  const fmb641 = await prisma.product.create({
    data: {
      title: "FMB641",
      description: "Teltonika FMB641 tracker.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(fmb641.id, "weight", 197);
  await setOptions(fmb641.id, "color", "Black");
  await setOptions(fmb641.id, "casing-material", "Plastic");
  await setOptions(fmb641.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmb641.id, "operating-temperature", -40, 85);
  await setRange(fmb641.id, "storage-temperature", -20, 45);
  await setRange(fmb641.id, "storage-temperature-without-battery", -40, 85);
  await setNumber(fmb641.id, "humidity", 95);
  await setNumber(fmb641.id, "ip-rating", 41);

  // -- Electrical --
  await setRange(fmb641.id, "input-voltage-range", 8, 32);
  await setNumber(fmb641.id, "power-consumption-active-mode", 120);
  await setNumber(fmb641.id, "power-consumption-sleep-mode", 28);

  await setOptions(fmb641.id, "internal-battery-type", "Ni-MH");
  await setNumber(fmb641.id, "internal-battery-size", 550);

  await setBool(fmb641.id, "power-saving", true);
  await setOptions(fmb641.id, "power-saving-options", ["Sleep", "Deep Sleep"]);
  await setBool(fmb641.id, "reverse-polarity-protection", true);


  console.log("Created FMB641");

  // ================= FMB140 =================
  const fmb140 = await prisma.product.create({
    data: {
      title: "FMB140",
      description: "Teltonika FMB140 tracker.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(fmb140.id, "weight", 55);
  await setOptions(fmb140.id, "color", "Black");
  await setOptions(fmb140.id, "casing-material", "Plastic");
  await setOptions(fmb140.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmb140.id, "operating-temperature", -40, 85);
  await setRange(fmb140.id, "storage-temperature-without-battery", -40, 85);
  await setNumber(fmb140.id, "humidity", 95);
  await setNumber(fmb140.id, "ip-rating", 41);

  // -- Electrical --
  await setRange(fmb140.id, "input-voltage-range", 10, 30);
  await setNumber(fmb140.id, "power-consumption-active-mode", 35);
  await setNumber(fmb140.id, "power-consumption-sleep-mode", 11);

  await setOptions(fmb140.id, "internal-battery-type", "Li-Ion");
  await setNumber(fmb140.id, "internal-battery-size", 170);
  await setRange(fmb140.id, "battery-charging-temperature", 0, 45);
  await setRange(fmb140.id, "battery-discharging-temperature", -20, 60);

  await setBool(fmb140.id, "power-saving", true);
  await setOptions(fmb140.id, "power-saving-options", ["Sleep", "Deep Sleep"]);
  await setBool(fmb140.id, "reverse-polarity-protection", true);


  console.log("Created FMB140");

  // ================= FMB150 =================
  const fmb150 = await prisma.product.create({
    data: {
      title: "FMB150",
      description: "Teltonika FMB150 tracker.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(fmb150.id, "weight", 55);
  await setOptions(fmb150.id, "color", "Black");
  await setOptions(fmb150.id, "casing-material", "Plastic");
  await setOptions(fmb150.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmb150.id, "operating-temperature", -40, 85);
  await setRange(fmb150.id, "storage-temperature-without-battery", -40, 85);
  await setNumber(fmb150.id, "humidity", 95);
  await setNumber(fmb150.id, "ip-rating", 41);

  // -- Electrical --
  await setRange(fmb150.id, "input-voltage-range", 10, 30);
  await setNumber(fmb150.id, "power-consumption-active-mode", 35);
  await setNumber(fmb150.id, "power-consumption-sleep-mode", 11);

  await setOptions(fmb150.id, "internal-battery-type", "Li-Ion");
  await setNumber(fmb150.id, "internal-battery-size", 170);
  await setRange(fmb150.id, "battery-charging-temperature", 0, 45);
  await setRange(fmb150.id, "battery-discharging-temperature", -20, 60);

  await setBool(fmb150.id, "power-saving", true);
  await setOptions(fmb150.id, "power-saving-options", ["Sleep", "Deep Sleep"]);
  await setBool(fmb150.id, "reverse-polarity-protection", true);


  console.log("Created FMB150");

  // ================= FMC150 =================
  const fmc150 = await prisma.product.create({
    data: {
      title: "FMC150",
      description: "Teltonika FMC150 tracker.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(fmc150.id, "weight", 55);
  await setOptions(fmc150.id, "color", "Black");
  await setOptions(fmc150.id, "casing-material", "Plastic");
  await setOptions(fmc150.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmc150.id, "operating-temperature-without-battery", -40, 85);
  await setRange(fmc150.id, "storage-temperature-without-battery", -40, 85);
  await setNumber(fmc150.id, "humidity", 95);
  await setNumber(fmc150.id, "ip-rating", 41);

  // -- Electrical --
  await setRange(fmc150.id, "input-voltage-range", 10, 30);
  await setNumber(fmc150.id, "power-consumption-active-mode", 35);
  await setNumber(fmc150.id, "power-consumption-sleep-mode", 11);

  await setOptions(fmc150.id, "internal-battery-type", "Li-Ion");
  await setNumber(fmc150.id, "internal-battery-size", 170);
  await setRange(fmc150.id, "battery-charging-temperature", 0, 45);
  await setRange(fmc150.id, "battery-discharging-temperature", -20, 60);

  await setBool(fmc150.id, "power-saving", true);
  await setOptions(fmc150.id, "power-saving-options", ["Sleep", "Deep Sleep"]);
  await setBool(fmc150.id, "reverse-polarity-protection", true);


  console.log("Created FMC150");

  // ================= FMM150 =================
  const fmm150 = await prisma.product.create({
    data: {
      title: "FMM150",
      description: "Teltonika FMM150 tracker.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(fmm150.id, "weight", 55);
  await setOptions(fmm150.id, "color", "Black");
  await setOptions(fmm150.id, "casing-material", "Plastic");
  await setOptions(fmm150.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmm150.id, "operating-temperature-without-battery", -40, 85);
  await setRange(fmm150.id, "storage-temperature-without-battery", -40, 85);
  await setNumber(fmm150.id, "humidity", 95);
  await setNumber(fmm150.id, "ip-rating", 41);

  // -- Electrical --
  await setRange(fmm150.id, "input-voltage-range", 10, 30);

  await setOptions(fmm150.id, "internal-battery-type", "Li-Ion");
  await setNumber(fmm150.id, "internal-battery-size", 170);
  await setRange(fmm150.id, "battery-charging-temperature", 0, 45);
  await setRange(fmm150.id, "battery-discharging-temperature", -20, 60);

  await setBool(fmm150.id, "power-saving", true);
  await setOptions(fmm150.id, "power-saving-options", ["Sleep", "Deep Sleep"]);
  await setBool(fmm150.id, "reverse-polarity-protection", true);


  console.log("Created FMM150");

  // ================= FMB209 =================
  const fmb209 = await prisma.product.create({
    data: {
      title: "FMB209",
      description: "Teltonika FMB209 tracker.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(fmb209.id, "weight", 205);
  await setOptions(fmb209.id, "color", "Black");
  await setOptions(fmb209.id, "casing-material", "Plastic");
  await setOptions(fmb209.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmb209.id, "operating-temperature-without-battery", -40, 85);
  await setRange(fmb209.id, "storage-temperature-without-battery", -40, 85);
  await setNumber(fmb209.id, "humidity", 95);
  await setNumber(fmb209.id, "ip-rating", 67);

  // -- Electrical --
  await setRange(fmb209.id, "input-voltage-range", 10, 30);
  await setNumber(fmb209.id, "power-consumption-active-mode", 28.3);
  await setNumber(fmb209.id, "power-consumption-sleep-mode", 4.6);

  await setOptions(fmb209.id, "internal-battery-type", "Li-Ion");
  await setNumber(fmb209.id, "internal-battery-size", 800);

  await setBool(fmb209.id, "power-saving", true);
  await setOptions(fmb209.id, "power-saving-options", ["Sleep", "Deep Sleep"]);
  await setBool(fmb209.id, "reverse-polarity-protection", true);


  console.log("Created FMB209");

  // ================= FMC640 =================
  const fmc640 = await prisma.product.create({
    data: {
      title: "FMC640",
      description: "Teltonika FMC640 tracker.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(fmc640.id, "weight", 201);
  await setOptions(fmc640.id, "color", "Black");
  await setOptions(fmc640.id, "casing-material", "Plastic");
  await setOptions(fmc640.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmc640.id, "storage-temperature", -20, 45);
  await setRange(fmc640.id, "operating-temperature-without-battery", -40, 85);
  await setRange(fmc640.id, "storage-temperature-without-battery", -40, 85);
  await setNumber(fmc640.id, "humidity", 95);
  await setNumber(fmc640.id, "ip-rating", 41);

  // -- Electrical --
  await setRange(fmc640.id, "input-voltage-range", 10, 30);
  await setNumber(fmc640.id, "power-consumption-active-mode", 38);
  await setNumber(fmc640.id, "power-consumption-sleep-mode", 19);

  await setOptions(fmc640.id, "internal-battery-type", "Ni-MH");
  await setNumber(fmc640.id, "internal-battery-size", 550);

  await setBool(fmc640.id, "power-saving", true);
  await setOptions(fmc640.id, "power-saving-options", ["Sleep", "Deep Sleep"]);
  await setBool(fmc640.id, "reverse-polarity-protection", true);


  console.log("Created FMC640");

  // ================= FMC650 =================
  const fmc650 = await prisma.product.create({
    data: {
      title: "FMC650",
      description: "Teltonika FMC650 tracker.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(fmc650.id, "weight", 197);
  await setOptions(fmc650.id, "color", "Black");
  await setOptions(fmc650.id, "casing-material", "Plastic");
  await setOptions(fmc650.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmc650.id, "operating-temperature", -20, 45);
  await setRange(fmc650.id, "operating-temperature-without-battery", -40, 85);
  await setRange(fmc650.id, "storage-temperature-without-battery", -40, 85);
  await setNumber(fmc650.id, "humidity", 95);
  await setNumber(fmc650.id, "ip-rating", 41);

  // -- Electrical --
  await setRange(fmc650.id, "input-voltage-range", 8, 32);
  await setNumber(fmc650.id, "power-consumption-active-mode", 68);
  await setNumber(fmc650.id, "power-consumption-sleep-mode", 13);

  await setOptions(fmc650.id, "internal-battery-type", "Ni-MH");
  await setNumber(fmc650.id, "internal-battery-size", 550);

  await setBool(fmc650.id, "power-saving", true);
  await setOptions(fmc650.id, "power-saving-options", ["Sleep", "Deep Sleep"]);
  await setBool(fmc650.id, "reverse-polarity-protection", true);


  console.log("Created FMC650");

  // ================= GH5200 =================
  const gh5200 = await prisma.product.create({
    data: {
      title: "GH5200",
      description: "Teltonika GH5200 tracker.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(gh5200.id, "weight", 80);
  await setOptions(gh5200.id, "color", "Black");
  await setOptions(gh5200.id, "casing-material", "Plastic");
  await setOptions(gh5200.id, "connector-type", "Wired");

  // -- Environmental --
  await setNumber(gh5200.id, "humidity", 85);
  await setNumber(gh5200.id, "ip-rating", 30);

  // -- Electrical --

  await setOptions(gh5200.id, "internal-battery-type", "Li-Ion");
  await setNumber(gh5200.id, "internal-battery-size", 1050);
  await setRange(gh5200.id, "battery-charging-temperature", 0, 45);
  await setRange(gh5200.id, "battery-discharging-temperature", -20, 58);

  await setBool(gh5200.id, "power-saving", true);
  await setOptions(gh5200.id, "power-saving-options", ["Sleep", "Deep Sleep"]);


  console.log("Created GH5200");

  // ================= TMT250 =================
  const tmt250 = await prisma.product.create({
    data: {
      title: "TMT250",
      description: "Teltonika TMT250 tracker.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(tmt250.id, "weight", 40);
  await setOptions(tmt250.id, "color", "Black");
  await setOptions(tmt250.id, "casing-material", "Plastic");
  await setOptions(tmt250.id, "connector-type", "Wired");

  // -- Environmental --
  await setNumber(tmt250.id, "humidity", 85);
  await setNumber(tmt250.id, "ip-rating", 67);

  // -- Electrical --

  await setOptions(tmt250.id, "internal-battery-type", "Li-Ion");
  await setNumber(tmt250.id, "internal-battery-size", 800);
  await setRange(tmt250.id, "battery-charging-temperature", 0, 45);
  await setRange(tmt250.id, "battery-discharging-temperature", -20, 58);

  await setBool(tmt250.id, "power-saving", true);
  await setOptions(tmt250.id, "power-saving-options", ["Sleep", "Deep Sleep"]);


  console.log("Created TMT250");

  // ================= TAT100 =================
  const tat100 = await prisma.product.create({
    data: {
      title: "TAT100",
      description: "Teltonika TAT100 tracker.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(tat100.id, "weight", 119);
  await setOptions(tat100.id, "color", "Black");
  await setOptions(tat100.id, "casing-material", "Plastic");
  await setOptions(tat100.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(tat100.id, "operating-temperature-without-battery", -20, 60);
  await setNumber(tat100.id, "humidity", 95);
  await setNumber(tat100.id, "ip-rating", 68);

  // -- Electrical --

  await setOptions(tat100.id, "internal-battery-type", "Li-SOCI2");
  await setNumber(tat100.id, "internal-battery-size", 2200);
  await setRange(tat100.id, "battery-discharging-temperature", -60, 85);

  await setBool(tat100.id, "power-saving", true);
  await setOptions(tat100.id, "power-saving-options", ["Sleep", "Deep Sleep"]);


  console.log("Created TAT100");

  // ================= FMC13A =================
  const fmc13a = await prisma.product.create({
    data: {
      title: "FMC13A",
      description: "Teltonika FMC13A tracker.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(fmc13a.id, "weight", 55);
  await setOptions(fmc13a.id, "color", "Black");
  await setOptions(fmc13a.id, "casing-material", "Plastic");
  await setOptions(fmc13a.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmc13a.id, "operating-temperature", -20, 40);
  await setRange(fmc13a.id, "storage-temperature", -20, 45);
  await setRange(fmc13a.id, "storage-temperature-without-battery", -40, 85);
  await setNumber(fmc13a.id, "humidity", 95);
  await setNumber(fmc13a.id, "ip-rating", 41);

  // -- Electrical --
  await setRange(fmc13a.id, "input-voltage-range", 10, 30);
  await setNumber(fmc13a.id, "power-consumption-active-mode", 33);
  await setNumber(fmc13a.id, "power-consumption-sleep-mode", 16);

  await setOptions(fmc13a.id, "internal-battery-type", "Li-Ion");
  await setNumber(fmc13a.id, "internal-battery-size", 170);
  await setRange(fmc13a.id, "battery-charging-temperature", 0, 45);
  await setRange(fmc13a.id, "battery-discharging-temperature", -20, 60);

  await setBool(fmc13a.id, "power-saving", true);
  await setOptions(fmc13a.id, "power-saving-options", ["Sleep", "Deep Sleep"]);
  await setBool(fmc13a.id, "reverse-polarity-protection", true);


  console.log("Created FMC13A");

  // ================= FMM13A =================
  const fmm13a = await prisma.product.create({
    data: {
      title: "FMM13A",
      description: "Teltonika FMM13A tracker.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(fmm13a.id, "weight", 55);
  await setOptions(fmm13a.id, "color", "Black");
  await setOptions(fmm13a.id, "casing-material", "Plastic");
  await setOptions(fmm13a.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmm13a.id, "operating-temperature", -20, 40);
  await setRange(fmm13a.id, "storage-temperature", -20, 45);
  await setRange(fmm13a.id, "storage-temperature-without-battery", -40, 85);
  await setNumber(fmm13a.id, "humidity", 95);
  await setNumber(fmm13a.id, "ip-rating", 41);

  // -- Electrical --
  await setRange(fmm13a.id, "input-voltage-range", 10, 30);
  await setNumber(fmm13a.id, "power-consumption-active-mode", 33);
  await setNumber(fmm13a.id, "power-consumption-sleep-mode", 16);

  await setOptions(fmm13a.id, "internal-battery-type", "Li-Ion");
  await setNumber(fmm13a.id, "internal-battery-size", 170);
  await setRange(fmm13a.id, "battery-charging-temperature", 0, 45);
  await setRange(fmm13a.id, "battery-discharging-temperature", -20, 60);

  await setBool(fmm13a.id, "power-saving", true);
  await setOptions(fmm13a.id, "power-saving-options", ["Sleep", "Deep Sleep"]);
  await setBool(fmm13a.id, "reverse-polarity-protection", true);


  console.log("Created FMM13A");

  // ================= FMC800 =================
  const fmc800 = await prisma.product.create({
    data: {
      title: "FMC800",
      description: "Teltonika FMC800 tracker.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(fmc800.id, "weight", 63);
  await setOptions(fmc800.id, "color", "Black");
  await setOptions(fmc800.id, "casing-material", "Plastic");
  await setOptions(fmc800.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmc800.id, "operating-temperature-without-battery", -40, 85);
  await setRange(fmc800.id, "storage-temperature-without-battery", -40, 85);
  await setNumber(fmc800.id, "humidity", 95);
  await setNumber(fmc800.id, "ip-rating", 41);

  // -- Electrical --
  await setRange(fmc800.id, "input-voltage-range", 10, 30);

  await setOptions(fmc800.id, "internal-battery-type", "Li-Ion");
  await setNumber(fmc800.id, "internal-battery-size", 170);
  await setRange(fmc800.id, "battery-charging-temperature", 0, 45);
  await setRange(fmc800.id, "battery-discharging-temperature", -20, 60);

  await setBool(fmc800.id, "power-saving", true);
  await setOptions(fmc800.id, "power-saving-options", ["Sleep", "Deep Sleep"]);
  await setBool(fmc800.id, "reverse-polarity-protection", true);


  console.log("Created FMC800");

  // ================= FMM800 =================
  const fmm800 = await prisma.product.create({
    data: {
      title: "FMM800",
      description: "Teltonika FMM800 tracker.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(fmm800.id, "weight", 63);
  await setOptions(fmm800.id, "color", "Black");
  await setOptions(fmm800.id, "casing-material", "Plastic");
  await setOptions(fmm800.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmm800.id, "operating-temperature-without-battery", -40, 85);
  await setRange(fmm800.id, "storage-temperature-without-battery", -40, 85);
  await setNumber(fmm800.id, "humidity", 95);
  await setNumber(fmm800.id, "ip-rating", 41);

  // -- Electrical --
  await setRange(fmm800.id, "input-voltage-range", 10, 30);

  await setOptions(fmm800.id, "internal-battery-type", "Li-Ion");
  await setNumber(fmm800.id, "internal-battery-size", 170);
  await setRange(fmm800.id, "battery-charging-temperature", 0, 45);
  await setRange(fmm800.id, "battery-discharging-temperature", -20, 60);

  await setBool(fmm800.id, "power-saving", true);
  await setOptions(fmm800.id, "power-saving-options", ["Sleep", "Deep Sleep"]);
  await setBool(fmm800.id, "reverse-polarity-protection", true);


  console.log("Created FMM800");

  // ================= FMB240 =================
  const fmb240 = await prisma.product.create({
    data: {
      title: "FMB240",
      description: "Teltonika FMB240 tracker.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setOptions(fmb240.id, "color", "Black");
  await setOptions(fmb240.id, "casing-material", "Plastic");
  await setOptions(fmb240.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmb240.id, "operating-temperature-without-battery", -40, 85);
  await setRange(fmb240.id, "storage-temperature-without-battery", -40, 85);
  await setNumber(fmb240.id, "humidity", 95);
  await setNumber(fmb240.id, "ip-rating", 67);

  // -- Electrical --
  await setRange(fmb240.id, "input-voltage-range", 10, 30);
  await setNumber(fmb240.id, "power-consumption-active-mode", 35);
  await setNumber(fmb240.id, "power-consumption-sleep-mode", 11);

  await setOptions(fmb240.id, "internal-battery-type", "Li-Ion");
  await setNumber(fmb240.id, "internal-battery-size", 170);
  await setRange(fmb240.id, "battery-charging-temperature", 0, 45);
  await setRange(fmb240.id, "battery-discharging-temperature", -20, 60);

  await setBool(fmb240.id, "power-saving", true);
  await setOptions(fmb240.id, "power-saving-options", ["Sleep", "Deep Sleep"]);
  await setBool(fmb240.id, "reverse-polarity-protection", true);


  console.log("Created FMB240");

  // ================= FMM80A =================
  const fmm80a = await prisma.product.create({
    data: {
      title: "FMM80A",
      description: "Teltonika FMM80A tracker.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(fmm80a.id, "weight", 63);
  await setOptions(fmm80a.id, "color", "Black");
  await setOptions(fmm80a.id, "casing-material", "Plastic");
  await setOptions(fmm80a.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmm80a.id, "storage-temperature", 0, 40);
  await setRange(fmm80a.id, "operating-temperature-without-battery", -40, 85);
  await setRange(fmm80a.id, "storage-temperature-without-battery", -40, 85);
  await setNumber(fmm80a.id, "humidity", 95);
  await setNumber(fmm80a.id, "ip-rating", 41);

  // -- Electrical --
  await setRange(fmm80a.id, "input-voltage-range", 10, 30);

  await setOptions(fmm80a.id, "internal-battery-type", "Li-Ion");
  await setNumber(fmm80a.id, "internal-battery-size", 115);
  await setRange(fmm80a.id, "battery-charging-temperature", 0, 45);
  await setRange(fmm80a.id, "battery-discharging-temperature", -20, 60);

  await setBool(fmm80a.id, "power-saving", true);
  await setOptions(fmm80a.id, "power-saving-options", ["Sleep", "Deep Sleep"]);
  await setBool(fmm80a.id, "reverse-polarity-protection", true);


  console.log("Created FMM80A");

  // ================= FMM650 =================
  const fmm650 = await prisma.product.create({
    data: {
      title: "FMM650",
      description: "Teltonika FMM650 tracker.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(fmm650.id, "weight", 54);
  await setOptions(fmm650.id, "color", "Black");
  await setOptions(fmm650.id, "casing-material", "Plastic");
  await setOptions(fmm650.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmm650.id, "operating-temperature", -20, 45);
  await setRange(fmm650.id, "operating-temperature-without-battery", -40, 85);
  await setRange(fmm650.id, "storage-temperature-without-battery", -40, 85);
  await setNumber(fmm650.id, "humidity", 95);
  await setNumber(fmm650.id, "ip-rating", 41);

  // -- Electrical --
  await setRange(fmm650.id, "input-voltage-range", 8, 32);
  await setNumber(fmm650.id, "power-consumption-active-mode", 25);
  await setNumber(fmm650.id, "power-consumption-sleep-mode", 5);

  await setOptions(fmm650.id, "internal-battery-type", "Ni-MH");
  await setNumber(fmm650.id, "internal-battery-size", 550);

  await setBool(fmm650.id, "power-saving", true);
  await setOptions(fmm650.id, "power-saving-options", ["Sleep", "Deep Sleep"]);
  await setBool(fmm650.id, "reverse-polarity-protection", true);


  console.log("Created FMM650");

  // ================= FMB930 =================
  const fmb930 = await prisma.product.create({
    data: {
      title: "FMB930",
      description: "Teltonika FMB930 tracker.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(fmb930.id, "weight", 54);
  await setOptions(fmb930.id, "color", "Black");
  await setOptions(fmb930.id, "casing-material", "Plastic");
  await setOptions(fmb930.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmb930.id, "storage-temperature", -20, 40);
  await setRange(fmb930.id, "operating-temperature-without-battery", -40, 85);
  await setRange(fmb930.id, "storage-temperature-without-battery", -40, 85);
  await setNumber(fmb930.id, "humidity", 95);
  await setNumber(fmb930.id, "ip-rating", 54);

  // -- Electrical --
  await setRange(fmb930.id, "input-voltage-range", 10, 90);
  await setNumber(fmb930.id, "power-consumption-active-mode", 25);
  await setNumber(fmb930.id, "power-consumption-sleep-mode", 5);

  await setOptions(fmb930.id, "internal-battery-type", "Li-Ion");
  await setNumber(fmb930.id, "internal-battery-size", 170);
  await setRange(fmb930.id, "battery-charging-temperature", 0, 45);
  await setRange(fmb930.id, "battery-discharging-temperature", -20, 60);

  await setBool(fmb930.id, "power-saving", true);
  await setOptions(fmb930.id, "power-saving-options", ["Sleep", "Deep Sleep"]);
  await setBool(fmb930.id, "reverse-polarity-protection", true);


  console.log("Created FMB930");

}