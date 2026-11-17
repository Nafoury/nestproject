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

  // Attach an option-based value to a product (handles both single strings and arrays).
  async function setOptions(productId: bigint, attributeSlug: string, values: string | string[]) {
    const attributeId = await attr(attributeSlug);
    const pa = await prisma.productAttribute.create({
      data: { productId, attributeId },
    });

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

  // ===========================================================================
  // FMB110
  // ===========================================================================
  const fmb110 = await prisma.product.create({
    data: {
      title: "FMB110",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  await setOptions(fmb110.id, "brand", "Teltonika");

  // -- Physical --
  await setNumber(fmb110.id, "length", 65);
  await setNumber(fmb110.id, "width", 56);
  await setNumber(fmb110.id, "height", 18.9);
  await setNumber(fmb110.id, "weight", 50);
  await setOptions(fmb110.id, "color", ["Black"]);
  await setOptions(fmb110.id, "casing-material", ["Plastic"]);
  await setText(fmb110.id, "connector-type", "Wired");
  // -- Environmental --
  await setRange(fmb110.id, "operating-temperature-without-battery", -40, 85);
  await setRange(fmb110.id, "storage-temperature-without-battery", -40, 85);
  await setRange(fmb110.id, "humidity", 5, 95);
  await setNumber(fmb110.id, "ip-rating", 41);
  // -- Electrical --
  await setRange(fmb110.id, "input-voltage-range", 10, 30);
  await setNumber(fmb110.id, "power-consumption-active-mode", 35);
  await setNumber(fmb110.id, "power-consumption-sleep-mode", 7);
  await setBool(fmb110.id, "internal-battery", false);
  await setBool(fmb110.id, "power-saving", true);
  await setOptions(fmb110.id, "power-saving-options", ["Sleep", "Deep Sleep"]);
  await setBool(fmb110.id, "reverse-polarity-protection", true);
  await setBool(fmb110.id, "leds", true);
  await setOptions(fmb110.id, "led-options", ["Battery", "Power"]);
  // -- Connectivity --
  await setOptions(fmb110.id, "connectivity", ["2G"]);
  await setText(fmb110.id, "module-name", "Teltonika TM2500");
  await setOptions(fmb110.id, "sim-slot-option", "Micro-SIM");
  await setBool(fmb110.id, "esim", false);
  await setBool(fmb110.id, "satellite-modem", false);
  await setBool(fmb110.id, "wifi", false);
  await setBool(fmb110.id, "bluetooth", true);
  await setOptions(fmb110.id, "bluetooth-version", "4.0 + LE");
  await setBool(fmb110.id, "nb-iot", false);
  await setBool(fmb110.id, "lorawan", false);
  // -- GNSS --
  await setOptions(fmb110.id, "gnss-services", ["GPS", "GLONASS", "GALILEO", "BEIDOU", "SBAS", "QZSS", "DGPS", "AGPS"]);
  await setNumber(fmb110.id, "tracking-sensitivity", -165);
  await setNumber(fmb110.id, "cold-start-time", 35);
  await setNumber(fmb110.id, "warm-start-time", 25);
  await setNumber(fmb110.id, "hot-start-time", 1);
  await setNumber(fmb110.id, "positional-accuracy", 2.5);
  // -- Storage --
  await setRange(fmb110.id, "internal-memory-size", 128, 128);
  await setBool(fmb110.id, "external-memory-slot", false);
  // -- Input / Output / Interfaces --
  await setRange(fmb110.id, "analog_input", 2, 2);
  await setRange(fmb110.id, "digital_input", 3, 3);
  await setRange(fmb110.id, "digital_output", 2, 2);
  await setBool(fmb110.id, "one_wire", true);
  await setBool(fmb110.id, "impulse_input", false);
  await setBool(fmb110.id, "usb", true);
  await setText(fmb110.id, "usb_type", "2.0 Micro-USB");
  // -- Warranty & Origin --
  await setNumber(fmb110.id, "warranty-value", 1);
  await setBool(fmb110.id, "document-portal", false);
  await setOptions(fmb110.id, "country-of-origin", ["Lithuania"]);

  console.log("Created FMB110");

  // ===========================================================================
  // FMC130
  // ===========================================================================
  const fmc130 = await prisma.product.create({
    data: {
      title: "FMC130",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  await setOptions(fmc130.id, "brand", "Teltonika");

  // -- Physical --
  await setNumber(fmc130.id, "length", 65);
  await setNumber(fmc130.id, "width", 56);
  await setNumber(fmc130.id, "height", 6);
  await setNumber(fmc130.id, "weight", 61);
  await setOptions(fmc130.id, "color", ["Black"]);
  await setOptions(fmc130.id, "casing-material", ["Plastic"]);
  await setText(fmc130.id, "connector-type", "Wired");
  // -- Environmental --
  await setRange(fmc130.id, "operating-temperature", -20, 40);
  await setRange(fmc130.id, "storage-temperature", -20, 45);
  await setRange(fmc130.id, "operating-temperature-without-battery", -40, 85);
  await setRange(fmc130.id, "storage-temperature-without-battery", -40, 85);
  await setRange(fmc130.id, "humidity", 5, 95);
  await setNumber(fmc130.id, "ip-rating", 41);
  // -- Electrical --
  await setRange(fmc130.id, "input-voltage-range", 10, 30);
  await setNumber(fmc130.id, "power-consumption-active-mode", 33);
  await setNumber(fmc130.id, "power-consumption-sleep-mode", 16);
  await setBool(fmc130.id, "internal-battery", true);
  await setOptions(fmc130.id, "internal-battery-type", "Li-Ion");
  await setRange(fmc130.id, "internal-battery-size", 170, 170);
  await setRange(fmc130.id, "battery-charging-temperature", 0, 45);
  await setRange(fmc130.id, "battery-discharging-temperature", -20, 60);
  await setBool(fmc130.id, "power-saving", true);
  await setOptions(fmc130.id, "power-saving-options", ["Sleep", "Deep Sleep"]);
  await setBool(fmc130.id, "reverse-polarity-protection", true);
  await setBool(fmc130.id, "leds", true);
  await setOptions(fmc130.id, "led-options", ["Cellular", "Battery"]);
  // -- Connectivity --
  await setOptions(fmc130.id, "connectivity", ["4G"]);
  await setText(fmc130.id, "module-name", "FMC130-ME1: MeiG SLM320-E1 with Teltonika TM2500FMC130-ME3: MeiG SLM320-E2 with Teltonika TM2500FMC130-MCIB0: MeiG SLM320-LA with Teltonika TM2500");
  await setOptions(fmc130.id, "sim-slot-option", "Micro-SIM");
  await setBool(fmc130.id, "esim", true);
  await setBool(fmc130.id, "satellite-modem", false);
  await setBool(fmc130.id, "wifi", false);
  await setBool(fmc130.id, "bluetooth", true);
  await setOptions(fmc130.id, "bluetooth-version", "4.0 + LE");
  await setBool(fmc130.id, "nb-iot", false);
  await setBool(fmc130.id, "lorawan", false);
  // -- GNSS --
  await setOptions(fmc130.id, "gnss-services", ["GPS", "GLONASS", "GALILEO", "BEIDOU", "QZSS", "AGPS"]);
  await setNumber(fmc130.id, "tracking-sensitivity", -165);
  await setNumber(fmc130.id, "cold-start-time", 35);
  await setNumber(fmc130.id, "warm-start-time", 25);
  await setNumber(fmc130.id, "hot-start-time", 1);
  await setNumber(fmc130.id, "positional-accuracy", 2.5);
  await setNumber(fmc130.id, "velocity-accuracy", 0.1);
  // -- Storage --
  await setRange(fmc130.id, "internal-memory-size", 128, 128);
  await setBool(fmc130.id, "external-memory-slot", false);
  // -- Input / Output / Interfaces --
  await setRange(fmc130.id, "analog_input", 2, 2);
  await setRange(fmc130.id, "digital_input", 3, 3);
  await setRange(fmc130.id, "digital_output", 3, 3);
  await setBool(fmc130.id, "one_wire", true);
  await setBool(fmc130.id, "impulse_input", true);
  await setBool(fmc130.id, "usb", true);
  await setText(fmc130.id, "usb_type", "2.0 Micro-USB");
  // -- Warranty & Origin --
  await setNumber(fmc130.id, "warranty-value", 1);
  await setBool(fmc130.id, "document-portal", false);
  await setOptions(fmc130.id, "country-of-origin", ["Lithuania"]);

  console.log("Created FMC130");

  // ===========================================================================
  // FMB920
  // ===========================================================================
  const fmb920 = await prisma.product.create({
    data: {
      title: "FMB920",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  await setOptions(fmb920.id, "brand", "Teltonika");

  // -- Physical --
  await setNumber(fmb920.id, "length", 79);
  await setNumber(fmb920.id, "width", 43);
  await setNumber(fmb920.id, "height", 12);
  await setNumber(fmb920.id, "weight", 54);
  await setOptions(fmb920.id, "color", ["Black"]);
  await setOptions(fmb920.id, "casing-material", ["Plastic"]);
  await setText(fmb920.id, "connector-type", "Wired");
  // -- Environmental --
  await setRange(fmb920.id, "operating-temperature", -20, 40);
  await setRange(fmb920.id, "operating-temperature-without-battery", -40, 85);
  await setRange(fmb920.id, "storage-temperature-without-battery", -40, 85);
  await setRange(fmb920.id, "humidity", 5, 95);
  await setNumber(fmb920.id, "ip-rating", 54);
  // -- Electrical --
  await setRange(fmb920.id, "input-voltage-range", 6, 30);
  await setNumber(fmb920.id, "power-consumption-active-mode", 25);
  await setNumber(fmb920.id, "power-consumption-sleep-mode", 5);
  await setBool(fmb920.id, "internal-battery", true);
  await setOptions(fmb920.id, "internal-battery-type", "Li-Ion");
  await setRange(fmb920.id, "internal-battery-size", 170, 170);
  await setRange(fmb920.id, "battery-charging-temperature", 0, 45);
  await setRange(fmb920.id, "battery-discharging-temperature", -20, 60);
  await setBool(fmb920.id, "power-saving", true);
  await setOptions(fmb920.id, "power-saving-options", ["Sleep", "Deep Sleep"]);
  await setBool(fmb920.id, "reverse-polarity-protection", true);
  await setBool(fmb920.id, "leds", true);
  await setOptions(fmb920.id, "led-options", ["Power", "SatComm"]);
  // -- Connectivity --
  await setOptions(fmb920.id, "connectivity", ["2G"]);
  await setText(fmb920.id, "module-name", "Teltonika TM2500");
  await setOptions(fmb920.id, "sim-slot-option", "Micro-SIM");
  await setBool(fmb920.id, "esim", false);
  await setBool(fmb920.id, "satellite-modem", false);
  await setBool(fmb920.id, "wifi", false);
  await setBool(fmb920.id, "bluetooth", true);
  await setOptions(fmb920.id, "bluetooth-version", "4.0 + LE");
  await setBool(fmb920.id, "nb-iot", false);
  await setBool(fmb920.id, "lorawan", false);
  // -- GNSS --
  await setOptions(fmb920.id, "gnss-services", ["GPS", "GLONASS", "GALILEO", "BEIDOU", "SBAS", "QZSS", "DGPS", "AGPS"]);
  await setNumber(fmb920.id, "tracking-sensitivity", -165);
  await setNumber(fmb920.id, "cold-start-time", 35);
  await setNumber(fmb920.id, "warm-start-time", 25);
  await setNumber(fmb920.id, "hot-start-time", 1);
  await setNumber(fmb920.id, "positional-accuracy", 2.5);
  await setNumber(fmb920.id, "velocity-accuracy", 0.1);
  // -- Storage --
  await setRange(fmb920.id, "internal-memory-size", 128, 128);
  await setBool(fmb920.id, "external-memory-slot", false);
  // -- Input / Output / Interfaces --
  await setRange(fmb920.id, "analog_input", 1, 1);
  await setRange(fmb920.id, "digital_input", 1, 1);
  await setRange(fmb920.id, "digital_output", 1, 1);
  await setBool(fmb920.id, "one_wire", false);
  await setBool(fmb920.id, "impulse_input", false);
  await setBool(fmb920.id, "usb", true);
  await setText(fmb920.id, "usb_type", "2.0 Micro-USB");
  // -- Warranty & Origin --
  await setNumber(fmb920.id, "warranty-value", 1);
  await setBool(fmb920.id, "document-portal", false);
  await setOptions(fmb920.id, "country-of-origin", ["Lithuania"]);

  console.log("Created FMB920");

  // ===========================================================================
  // FMB910
  // ===========================================================================
  const fmb910 = await prisma.product.create({
    data: {
      title: "FMB910",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  await setOptions(fmb910.id, "brand", "Teltonika");

  // -- Physical --
  await setNumber(fmb910.id, "length", 78);
  await setNumber(fmb910.id, "width", 15);
  await setNumber(fmb910.id, "height", 42);
  await setNumber(fmb910.id, "weight", 69);
  await setOptions(fmb910.id, "color", ["Black"]);
  await setOptions(fmb910.id, "casing-material", ["Plastic"]);
  await setText(fmb910.id, "connector-type", "Wired");
  // -- Environmental --
  await setRange(fmb910.id, "operating-temperature", -20, 40);
  await setRange(fmb910.id, "operating-temperature-without-battery", -40, 85);
  await setRange(fmb910.id, "storage-temperature-without-battery", -40, 85);
  await setRange(fmb910.id, "humidity", 5, 95);
  await setNumber(fmb910.id, "ip-rating", 54);
  // -- Electrical --
  await setRange(fmb910.id, "input-voltage-range", 6, 30);
  await setNumber(fmb910.id, "power-consumption-active-mode", 25);
  await setNumber(fmb910.id, "power-consumption-sleep-mode", 5);
  await setBool(fmb910.id, "internal-battery", true);
  await setOptions(fmb910.id, "internal-battery-type", "Li-Ion");
  await setRange(fmb910.id, "internal-battery-size", 170, 170);
  await setRange(fmb910.id, "battery-charging-temperature", 0, 45);
  await setRange(fmb910.id, "battery-discharging-temperature", -20, 60);
  await setBool(fmb910.id, "power-saving", true);
  await setOptions(fmb910.id, "power-saving-options", ["Sleep", "Deep Sleep"]);
  await setBool(fmb910.id, "reverse-polarity-protection", true);
  await setBool(fmb910.id, "leds", true);
  await setOptions(fmb910.id, "led-options", ["Battery", "Power"]);
  // -- Connectivity --
  await setOptions(fmb910.id, "connectivity", ["2G"]);
  await setText(fmb910.id, "module-name", "Teltonika TM2500");
  await setOptions(fmb910.id, "sim-slot-option", "Micro-SIM");
  await setBool(fmb910.id, "esim", false);
  await setBool(fmb910.id, "satellite-modem", false);
  await setBool(fmb910.id, "wifi", false);
  await setBool(fmb910.id, "bluetooth", true);
  await setOptions(fmb910.id, "bluetooth-version", "4.0 + LE");
  await setBool(fmb910.id, "nb-iot", false);
  await setBool(fmb910.id, "lorawan", false);
  // -- GNSS --
  await setOptions(fmb910.id, "gnss-services", ["GPS", "GLONASS", "GALILEO", "BEIDOU", "SBAS", "QZSS", "DGPS", "AGPS"]);
  await setNumber(fmb910.id, "tracking-sensitivity", -165);
  await setNumber(fmb910.id, "cold-start-time", 35);
  await setNumber(fmb910.id, "warm-start-time", 25);
  await setNumber(fmb910.id, "hot-start-time", 1);
  await setNumber(fmb910.id, "positional-accuracy", 2.5);
  await setNumber(fmb910.id, "velocity-accuracy", 0.1);
  // -- Storage --
  await setRange(fmb910.id, "internal-memory-size", 128, 128);
  await setBool(fmb910.id, "external-memory-slot", false);
  // -- Input / Output / Interfaces --
  await setRange(fmb910.id, "analog_input", 1, 1);
  await setRange(fmb910.id, "digital_input", 1, 1);
  await setRange(fmb910.id, "digital_output", 1, 1);
  await setBool(fmb910.id, "one_wire", false);
  await setBool(fmb910.id, "impulse_input", false);
  await setBool(fmb910.id, "usb", true);
  await setText(fmb910.id, "usb_type", "2.0 Micro-USB");
  // -- Warranty & Origin --
  await setNumber(fmb910.id, "warranty-value", 1);
  await setBool(fmb910.id, "document-portal", false);
  await setOptions(fmb910.id, "country-of-origin", ["Lithuania"]);

  console.log("Created FMB910");

  // ===========================================================================
  // FMB900
  // ===========================================================================
  const fmb900 = await prisma.product.create({
    data: {
      title: "FMB900",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  await setOptions(fmb900.id, "brand", "Teltonika");

  // -- Physical --
  await setNumber(fmb900.id, "length", 79);
  await setNumber(fmb900.id, "width", 43);
  await setNumber(fmb900.id, "height", 12);
  await setNumber(fmb900.id, "weight", 50);
  await setOptions(fmb900.id, "color", ["Black"]);
  await setOptions(fmb900.id, "casing-material", ["Plastic"]);
  await setText(fmb900.id, "connector-type", "Wired");
  // -- Environmental --
  await setRange(fmb900.id, "operating-temperature", -20, 40);
  await setRange(fmb900.id, "operating-temperature-without-battery", -40, 85);
  await setRange(fmb900.id, "storage-temperature-without-battery", -40, 85);
  await setRange(fmb900.id, "humidity", 5, 95);
  await setNumber(fmb900.id, "ip-rating", 54);
  // -- Electrical --
  await setRange(fmb900.id, "input-voltage-range", 6, 30);
  await setNumber(fmb900.id, "power-consumption-active-mode", 35);
  await setNumber(fmb900.id, "power-consumption-sleep-mode", 5);
  await setBool(fmb900.id, "internal-battery", false);
  await setBool(fmb900.id, "power-saving", true);
  await setOptions(fmb900.id, "power-saving-options", ["Sleep", "Deep Sleep"]);
  await setBool(fmb900.id, "reverse-polarity-protection", true);
  await setBool(fmb900.id, "leds", true);
  await setOptions(fmb900.id, "led-options", ["Charging", "Power"]);
  // -- Connectivity --
  await setOptions(fmb900.id, "connectivity", ["2G"]);
  await setText(fmb900.id, "module-name", "Teltonika TM2500");
  await setOptions(fmb900.id, "sim-slot-option", "Micro-SIM");
  await setBool(fmb900.id, "esim", false);
  await setBool(fmb900.id, "satellite-modem", false);
  await setBool(fmb900.id, "wifi", false);
  await setBool(fmb900.id, "bluetooth", true);
  await setOptions(fmb900.id, "bluetooth-version", "4.0 + LE");
  await setBool(fmb900.id, "nb-iot", false);
  await setBool(fmb900.id, "lorawan", false);
  // -- GNSS --
  await setOptions(fmb900.id, "gnss-services", ["GPS", "GLONASS", "GALILEO", "BEIDOU", "SBAS", "QZSS", "DGPS", "AGPS"]);
  await setNumber(fmb900.id, "tracking-sensitivity", -165);
  await setNumber(fmb900.id, "cold-start-time", 35);
  await setNumber(fmb900.id, "warm-start-time", 25);
  await setNumber(fmb900.id, "hot-start-time", 1);
  await setNumber(fmb900.id, "positional-accuracy", 2.5);
  await setNumber(fmb900.id, "velocity-accuracy", 0.1);
  // -- Storage --
  await setRange(fmb900.id, "internal-memory-size", 128, 128);
  await setBool(fmb900.id, "external-memory-slot", false);
  // -- Input / Output / Interfaces --
  await setRange(fmb900.id, "analog_input", 1, 1);
  await setRange(fmb900.id, "digital_input", 1, 1);
  await setRange(fmb900.id, "digital_output", 1, 1);
  await setBool(fmb900.id, "impulse_input", false);
  await setBool(fmb900.id, "usb", true);
  await setText(fmb900.id, "usb_type", "2.0 Micro-USB");
  // -- Warranty & Origin --
  await setNumber(fmb900.id, "warranty-value", 1);
  await setBool(fmb900.id, "document-portal", false);
  await setOptions(fmb900.id, "country-of-origin", ["Lithuania"]);

  console.log("Created FMB900");
}
