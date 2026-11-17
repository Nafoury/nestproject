import { PrismaClient } from "@prisma/client";

const CATEGORY_ID = BigInt(1);

export async function seedTeltonikaProducts(prisma: PrismaClient) {
  const user = await prisma.user.findFirst();
  if (!user) throw new Error("No user found");

  // Look up an attribute's id by slug — every field below uses this.
  async function attr(slug: string) {
    const a = await prisma.attribute.findUnique({ where: { slug } });
    if (!a) throw new Error(`Attribute not found: ${slug}`);
    return a.id;
  }

  // Look up (or create) an AttributeOption by attribute slug + value.
  async function option(attributeSlug: string, value: string) {
    const attributeId = await attr(attributeSlug);
    return prisma.attributeOption.upsert({
      where: { attributeId_value: { attributeId, value } },
      update: {},
      create: { attributeId, value, displayName: value },
    });
  }

  // Attach an option-based value to a product (now handles both single strings and arrays).
  async function setOptions(productId: bigint, attributeSlug: string, values: string | string[]) {
    const attributeId = await attr(attributeSlug);
    const pa = await prisma.productAttribute.create({
      data: { productId, attributeId },
    });

    // Normalize to array so the loop always works
    const valuesArray = Array.isArray(values) ? values : [values];

    for (const value of valuesArray) {
      const opt = await option(attributeSlug, value);
      await prisma.productAttributeOption.create({
        data: { productAttributeId: pa.id, attributeOptionId: opt.id },
      });
    }
  }

  // Plain single text value (radio / non-multiple checkbox / free text).
  async function setText(productId: bigint, attributeSlug: string, value: string) {
    await prisma.productAttribute.create({
      data: { productId, attributeId: await attr(attributeSlug), textValue: value },
    });
  }

  // Single number value.
  async function setNumber(productId: bigint, attributeSlug: string, value: number) {
    await prisma.productAttribute.create({
      data: { productId, attributeId: await attr(attributeSlug), numberValue: value },
    });
  }

  // Min/max range value.
  async function setRange(productId: bigint, attributeSlug: string, min: number, max: number) {
    await prisma.productAttribute.create({
      data: { productId, attributeId: await attr(attributeSlug), numberMin: min, numberMax: max },
    });
  }

  // Boolean value.
  async function setBool(productId: bigint, attributeSlug: string, value: boolean) {
    await prisma.productAttribute.create({
      data: { productId, attributeId: await attr(attributeSlug), booleanValue: value },
    });
  }

  // =========================================================================
  // FMC130 — Wired vehicle tracker with internal battery and reverse polarity protection.
  // =========================================================================
  const fmc130 = await prisma.product.create({
    data: {
      title: "FMC130",
      description: "Wired vehicle tracker with internal battery and reverse polarity protection.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(fmc130.id, "length", 65);
  await setNumber(fmc130.id, "width", 56.6);
  await setNumber(fmc130.id, "height", 20.6);
  await setNumber(fmc130.id, "weight", 61);
  await setOptions(fmc130.id, "color", "Black");
  await setOptions(fmc130.id, "casing-material", "Plastic");
  // Mounting Option: not specified in source data ("?") — skipped
  await setOptions(fmc130.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmc130.id, "operating-temperature", -20, 40);
  await setRange(fmc130.id, "storage-temperature", -20, 45);
  await setRange(fmc130.id, "operating-temperature-without-battery", -40, 85);
  await setRange(fmc130.id, "storage-temperature-without-battery", -40, 85);
  await setRange(fmc130.id, "humidity", 5, 95);
  await setNumber(fmc130.id, "ip-rating", 41);

  // -- Electrical --
  await setRange(fmc130.id, "input-voltage-range", 10, 30);
  // Solar Powered: not specified in source data (blank) — skipped
  await setNumber(fmc130.id, "power-consumption-active-mode", 33);
  await setNumber(fmc130.id, "power-consumption-sleep-mode", 16);
  // Current Draw Active Mode: not specified in source data ("?") — skipped
  // Current Draw Sleep Mode: not specified in source data ("?") — skipped

  await setBool(fmc130.id, "internal-battery", true);
  await setOptions(fmc130.id, "internal-battery-type", "Li-Ion");
  await setNumber(fmc130.id, "internal-battery-size", 170);
  // Replaceable Internal Battery: not specified in source data (blank) — skipped
  // Rechargeable Internal Battery: not specified in source data (blank) — skipped
  // Battery Shelf Life: not specified in source data ("?") — skipped
  // Battery Service Life: not specified in source data ("?") — skipped
  await setRange(fmc130.id, "battery-charging-temperature", 0, 45);
  await setRange(fmc130.id, "battery-discharging-temperature", -20, 60);
  // Battery Charging Time: not specified in source data ("?") — skipped

  await setBool(fmc130.id, "power-saving", true);
  await setOptions(fmc130.id, "power-saving-options", ["Sleep Mode", "Deep Mode"]);
  // Power Surge Alert: not specified in source data ("?") — skipped
  // Surge Protection: not specified in source data ("?") — skipped
  await setBool(fmc130.id, "reverse-polarity-protection", true);

  // LEDs: presence not confirmed in source data (blank) — skipped
  // LED Options: source text ("N status LED lights") does not map to the option enum — skipped

  console.log("Created FMC130");

  // =========================================================================
  // FMB920 — Wired vehicle tracker with internal battery and reverse polarity protection.
  // =========================================================================
  const fmb920 = await prisma.product.create({
    data: {
      title: "FMB920",
      description: "Wired vehicle tracker with internal battery and reverse polarity protection.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(fmb920.id, "length", 79);
  await setNumber(fmb920.id, "width", 43);
  await setNumber(fmb920.id, "height", 12);
  await setNumber(fmb920.id, "weight", 54);
  await setOptions(fmb920.id, "color", "Black");
  await setOptions(fmb920.id, "casing-material", "Plastic");
  // Mounting Option: not specified in source data ("?") — skipped
  await setOptions(fmb920.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmb920.id, "operating-temperature", -20, 40);
  // Storage Temperature: not specified in source data ("?") — skipped
  await setRange(fmb920.id, "operating-temperature-without-battery", -40, 85);
  await setRange(fmb920.id, "storage-temperature-without-battery", -40, 85);
  await setRange(fmb920.id, "humidity", 5, 95);
  await setNumber(fmb920.id, "ip-rating", 54);

  // -- Electrical --
  await setRange(fmb920.id, "input-voltage-range", 6, 30);
  // Solar Powered: not specified in source data (blank) — skipped
  await setNumber(fmb920.id, "power-consumption-active-mode", 25);
  await setNumber(fmb920.id, "power-consumption-sleep-mode", 5);
  // Current Draw Active Mode: not specified in source data ("?") — skipped
  // Current Draw Sleep Mode: not specified in source data ("?") — skipped

  await setBool(fmb920.id, "internal-battery", true);
  await setOptions(fmb920.id, "internal-battery-type", "Li-Ion");
  await setNumber(fmb920.id, "internal-battery-size", 170);
  // Replaceable Internal Battery: not specified in source data (blank) — skipped
  // Rechargeable Internal Battery: not specified in source data (blank) — skipped
  // Battery Shelf Life: not specified in source data ("?") — skipped
  // Battery Service Life: not specified in source data ("?") — skipped
  await setRange(fmb920.id, "battery-charging-temperature", 0, 45);
  await setRange(fmb920.id, "battery-discharging-temperature", -20, 60);
  // Battery Charging Time: not specified in source data ("?") — skipped

  await setBool(fmb920.id, "power-saving", true);
  await setOptions(fmb920.id, "power-saving-options", ["Sleep Mode", "Deep Mode"]);
  // Power Surge Alert: not specified in source data ("?") — skipped
  // Surge Protection: not specified in source data ("?") — skipped
  await setBool(fmb920.id, "reverse-polarity-protection", true);

  // LEDs: presence not confirmed in source data (blank) — skipped
  // LED Options: source text ("N status LED lights") does not map to the option enum — skipped

  console.log("Created FMB920");

  // =========================================================================
  // FMB910 — Wired vehicle tracker with internal battery and reverse polarity protection.
  // =========================================================================
  const fmb910 = await prisma.product.create({
    data: {
      title: "FMB910",
      description: "Wired vehicle tracker with internal battery and reverse polarity protection.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(fmb910.id, "length", 78.15);
  await setNumber(fmb910.id, "width", 42.75);
  await setNumber(fmb910.id, "height", 21);
  await setNumber(fmb910.id, "weight", 69);
  await setOptions(fmb910.id, "color", "Black");
  await setOptions(fmb910.id, "casing-material", "Plastic");
  // Mounting Option: not specified in source data ("?") — skipped
  await setOptions(fmb910.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmb910.id, "operating-temperature", -20, 40);
  // Storage Temperature: not specified in source data ("?") — skipped
  await setRange(fmb910.id, "operating-temperature-without-battery", -40, 85);
  await setRange(fmb910.id, "storage-temperature-without-battery", -40, 85);
  await setRange(fmb910.id, "humidity", 5, 95);
  await setNumber(fmb910.id, "ip-rating", 54);

  // -- Electrical --
  await setRange(fmb910.id, "input-voltage-range", 6, 30);
  // Solar Powered: not specified in source data (blank) — skipped
  await setNumber(fmb910.id, "power-consumption-active-mode", 25);
  await setNumber(fmb910.id, "power-consumption-sleep-mode", 5);
  // Current Draw Active Mode: not specified in source data ("?") — skipped
  // Current Draw Sleep Mode: not specified in source data ("?") — skipped

  await setBool(fmb910.id, "internal-battery", true);
  await setOptions(fmb910.id, "internal-battery-type", "Li-Ion");
  await setNumber(fmb910.id, "internal-battery-size", 170);
  // Replaceable Internal Battery: not specified in source data (blank) — skipped
  // Rechargeable Internal Battery: not specified in source data (blank) — skipped
  // Battery Shelf Life: not specified in source data ("?") — skipped
  // Battery Service Life: not specified in source data ("?") — skipped
  await setRange(fmb910.id, "battery-charging-temperature", 0, 45);
  await setRange(fmb910.id, "battery-discharging-temperature", -20, 60);
  // Battery Charging Time: not specified in source data ("?") — skipped

  await setBool(fmb910.id, "power-saving", true);
  await setOptions(fmb910.id, "power-saving-options", ["Sleep Mode", "Deep Mode"]);
  // Power Surge Alert: not specified in source data ("?") — skipped
  // Surge Protection: not specified in source data ("?") — skipped
  await setBool(fmb910.id, "reverse-polarity-protection", true);

  // LEDs: presence not confirmed in source data (blank) — skipped
  // LED Options: source text ("N status LED lights") does not map to the option enum — skipped

  console.log("Created FMB910");

  // =========================================================================
  // FMB900 — Wired vehicle tracker with reverse polarity protection, no internal battery.
  // =========================================================================
  const fmb900 = await prisma.product.create({
    data: {
      title: "FMB900",
      description: "Wired vehicle tracker with reverse polarity protection, no internal battery.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(fmb900.id, "length", 79);
  await setNumber(fmb900.id, "width", 43);
  await setNumber(fmb900.id, "height", 12);
  await setNumber(fmb900.id, "weight", 50);
  await setOptions(fmb900.id, "color", "Black");
  await setOptions(fmb900.id, "casing-material", "Plastic");
  // Mounting Option: not specified in source data ("?") — skipped
  await setOptions(fmb900.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmb900.id, "operating-temperature", -20, 40);
  // Storage Temperature: not specified in source data ("?") — skipped
  await setRange(fmb900.id, "operating-temperature-without-battery", -40, 85);
  await setRange(fmb900.id, "storage-temperature-without-battery", -40, 85);
  await setRange(fmb900.id, "humidity", 5, 95);
  await setNumber(fmb900.id, "ip-rating", 54);

  // -- Electrical --
  await setRange(fmb900.id, "input-voltage-range", 6, 30);
  // Solar Powered: not specified in source data (blank) — skipped
  await setNumber(fmb900.id, "power-consumption-active-mode", 35);
  await setNumber(fmb900.id, "power-consumption-sleep-mode", 5);
  // Current Draw Active Mode: not specified in source data ("?") — skipped
  // Current Draw Sleep Mode: not specified in source data ("?") — skipped

  await setBool(fmb900.id, "internal-battery", false);
  // Replaceable Internal Battery: not specified in source data (blank) — skipped
  // Rechargeable Internal Battery: not specified in source data (blank) — skipped
  // Battery Shelf Life: not specified in source data ("?") — skipped
  // Battery Service Life: not specified in source data ("?") — skipped
  // Battery Charging Time: not specified in source data ("?") — skipped

  await setBool(fmb900.id, "power-saving", true);
  await setOptions(fmb900.id, "power-saving-options", ["Sleep Mode", "Deep Mode"]);
  // Power Surge Alert: not specified in source data ("?") — skipped
  // Surge Protection: not specified in source data ("?") — skipped
  await setBool(fmb900.id, "reverse-polarity-protection", true);

  // LEDs: presence not confirmed in source data (blank) — skipped
  // LED Options: source text ("N status LED lights") does not map to the option enum — skipped

  console.log("Created FMB900");

  // =========================================================================
  // FMC920 — Wired vehicle tracker with internal battery and reverse polarity protection.
  // =========================================================================
  const fmc920 = await prisma.product.create({
    data: {
      title: "FMC920",
      description: "Wired vehicle tracker with internal battery and reverse polarity protection.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(fmc920.id, "length", 79);
  await setNumber(fmc920.id, "width", 43);
  await setNumber(fmc920.id, "height", 12);
  await setNumber(fmc920.id, "weight", 54);
  await setOptions(fmc920.id, "color", "Black");
  await setOptions(fmc920.id, "casing-material", "Plastic");
  // Mounting Option: not specified in source data ("?") — skipped
  await setOptions(fmc920.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(fmc920.id, "operating-temperature", -20, 40);
  // Storage Temperature: not specified in source data ("?") — skipped
  await setRange(fmc920.id, "operating-temperature-without-battery", -40, 85);
  await setRange(fmc920.id, "storage-temperature-without-battery", -40, 85);
  await setRange(fmc920.id, "humidity", 5, 95);
  await setNumber(fmc920.id, "ip-rating", 54);

  // -- Electrical --
  await setRange(fmc920.id, "input-voltage-range", 10, 30);
  // Solar Powered: not specified in source data (blank) — skipped
  await setNumber(fmc920.id, "power-consumption-active-mode", 28);
  await setNumber(fmc920.id, "power-consumption-sleep-mode", 8);
  // Current Draw Active Mode: not specified in source data ("?") — skipped
  // Current Draw Sleep Mode: not specified in source data ("?") — skipped

  await setBool(fmc920.id, "internal-battery", true);
  await setOptions(fmc920.id, "internal-battery-type", "Li-Ion");
  await setNumber(fmc920.id, "internal-battery-size", 170);
  // Replaceable Internal Battery: not specified in source data (blank) — skipped
  // Rechargeable Internal Battery: not specified in source data (blank) — skipped
  // Battery Shelf Life: not specified in source data ("?") — skipped
  // Battery Service Life: not specified in source data ("?") — skipped
  await setRange(fmc920.id, "battery-charging-temperature", 0, 45);
  await setRange(fmc920.id, "battery-discharging-temperature", -20, 60);
  // Battery Charging Time: not specified in source data ("?") — skipped

  await setBool(fmc920.id, "power-saving", true);
  await setOptions(fmc920.id, "power-saving-options", ["Sleep Mode", "Deep Mode"]);
  // Power Surge Alert: not specified in source data ("?") — skipped
  // Surge Protection: not specified in source data ("?") — skipped
  await setBool(fmc920.id, "reverse-polarity-protection", true);

  // LEDs: presence not confirmed in source data (blank) — skipped
  // LED Options: source text ("N status LED lights") does not map to the option enum — skipped

  console.log("Created FMC920");

}
