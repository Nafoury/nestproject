import { PrismaClient } from "@prisma/client";

const CATEGORY_ID = BigInt(1);

export async function seedXirgoProducts(prisma: PrismaClient) {
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

  async function setText(productId: bigint, attributeSlug: string, value: string) {
    await prisma.productAttribute.create({
      data: { productId, attributeId: await attr(attributeSlug), textValue: value },
    });
  }

  async function setNumber(productId: bigint, attributeSlug: string, value: number) {
    await prisma.productAttribute.create({
      data: { productId, attributeId: await attr(attributeSlug), numberValue: value },
    });
  }

  async function setRange(productId: bigint, attributeSlug: string, min: number, max: number) {
    await prisma.productAttribute.create({
      data: { productId, attributeId: await attr(attributeSlug), numberMin: min, numberMax: max },
    });
  }

  async function setBool(productId: bigint, attributeSlug: string, value: boolean) {
    await prisma.productAttribute.create({
      data: { productId, attributeId: await attr(attributeSlug), booleanValue: value },
    });
  }

  // NOTE: All 5 Xirgo models (LX41–LX45) have identical values across the
  // Physical / Environmental / Electrical spec groups in the source sheet.
  // Fields marked "?" in the sheet are intentionally omitted below.
  // Battery Size ("210 / 850mAh") -> used higher value (850), same rule as weight.
  // IP Rating ("IP44 / IP67") -> used higher value (67).
  // Power Consumption Sleep Mode ("<4mA") -> used 4.
  // Battery Charging Time ("configurable charging current") -> not numeric, omitted.

  const models = ["LX41", "LX42", "LX43", "LX44", "LX45"];

  for (const model of models) {
    const product = await prisma.product.create({
      data: {
        title: model,
        description: "Xirgo GPS tracker.",
        price: 0.0,
        categoryId: CATEGORY_ID,
        userId: user.id,
      },
    });

    // -- Physical --
    await setNumber(product.id, "length", 68);
    await setNumber(product.id, "width", 90);
    await setNumber(product.id, "height", 19);
    await setNumber(product.id, "weight", 160); // higher of 64g (tracker) / 160g (set)
    await setOptions(product.id, "color", "Black");
    await setOptions(product.id, "casing-material", "Plastic");
    await setOptions(product.id, "mounting-option", ["Zip tie"]);
    await setOptions(product.id, "connector-type", "Wired");

    // -- Environmental --
    await setRange(product.id, "operating-temperature", -20, 60);
    // storage-temperature: "?" — omitted
    await setRange(product.id, "operating-temperature-without-battery", -40, 85);
    // storage-temperature-without-battery: "?" — omitted
    // humidity: "?" — omitted
    await setNumber(product.id, "ip-rating", 67); // higher of IP44 / IP67

    // -- Electrical --
    await setRange(product.id, "input-voltage-range", 9, 31);
    await setNumber(product.id, "power-consumption-active-mode", 100);
    await setNumber(product.id, "power-consumption-sleep-mode", 4);
    // current-draw-active-mode: "?" — omitted
    // current-draw-sleep-mode: "?" — omitted

    await setBool(product.id, "internal-battery", true);
    await setOptions(product.id, "internal-battery-type", "Li-Po");
    await setNumber(product.id, "internal-battery-size", 850); // higher of 210 / 850mAh
    // battery-shelf-life: "?" — omitted
    // battery-service-life: "?" — omitted
    await setRange(product.id, "battery-charging-temperature", 0, 60);
    await setRange(product.id, "battery-discharging-temperature", -20, 60);
    // battery-charging-time: "configurable charging current" (non-numeric) — omitted
    await setOptions(product.id, "recharge-options", ["Auto"]);

    await setBool(product.id, "power-saving", true);
    await setOptions(product.id, "power-saving-options", ["Deep Mode"]);
    await setBool(product.id, "power-surge-alert", false);
    await setBool(product.id, "surge-protection", true);
    await setBool(product.id, "reverse-polarity-protection", true);

    await setBool(product.id, "leds", true);
    await setOptions(product.id, "led-options", ["Cellular", "GNSS", "CAN"]);

    console.log(`Created ${model}`);
  }
}
