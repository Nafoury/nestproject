import { PrismaClient } from "@prisma/client";

const CATEGORY_ID = BigInt(1);

export async function seedXirgoProducts(prisma: PrismaClient) {
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
  // LX41
  // ===========================================================================
  const lx41 = await prisma.product.create({
    data: {
      title: "LX41",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  await setOptions(lx41.id, "brand", "Xirgo");

  // -- Physical --
  await setNumber(lx41.id, "length", 68);
  await setNumber(lx41.id, "width", 90);
  await setNumber(lx41.id, "height", 19);
  await setNumber(lx41.id, "weight", 64);
  await setOptions(lx41.id, "color", ["Black"]);
  await setOptions(lx41.id, "casing-material", ["Plastic"]);
  await setOptions(lx41.id, "mounting-option", ["Zip tie"]);
  await setText(lx41.id, "connector-type", "Wired");
  // -- Environmental --
  await setRange(lx41.id, "operating-temperature", -20, 60);
  await setRange(lx41.id, "operating-temperature-without-battery", -40, 85);
  await setNumber(lx41.id, "ip-rating", 44);
  // -- Electrical --
  await setRange(lx41.id, "input-voltage-range", 9, 31);
  await setNumber(lx41.id, "power-consumption-active-mode", 100);
  await setNumber(lx41.id, "power-consumption-sleep-mode", 4);
  await setBool(lx41.id, "internal-battery", true);
  await setOptions(lx41.id, "internal-battery-type", "LiPo");
  await setRange(lx41.id, "internal-battery-size", 210, 850);
  await setRange(lx41.id, "battery-charging-temperature", 0, 60);
  await setRange(lx41.id, "battery-discharging-temperature", -20, 60);
  await setOptions(lx41.id, "recharge-options", ["Auto"]);
  await setBool(lx41.id, "power-saving", true);
  await setOptions(lx41.id, "power-saving-options", ["Deep Sleep"]);
  await setBool(lx41.id, "power-surge-alert", false);
  await setBool(lx41.id, "surge-protection", true);
  await setBool(lx41.id, "reverse-polarity-protection", true);
  await setBool(lx41.id, "leds", true);
  await setOptions(lx41.id, "led-options", ["Cellular", "GNSS", "CAN"]);
  // -- Connectivity --
  await setOptions(lx41.id, "connectivity", ["2G", "4G"]);
  await setOptions(lx41.id, "4g-type", ["LTE Cat 1"]);
  await setOptions(lx41.id, "fallback-option", ["2G"]);
  await setText(lx41.id, "module-name", "Quectel EG915N-EA");
  await setText(lx41.id, "number-of-sim-slots", "1");
  await setOptions(lx41.id, "sim-slot-option", "Nano");
  await setBool(lx41.id, "esim", true);
  await setText(lx41.id, "cellular-antenna-type", "Internal");
  await setBool(lx41.id, "satellite-modem", false);
  await setBool(lx41.id, "wifi", false);
  await setBool(lx41.id, "bluetooth", true);
  await setOptions(lx41.id, "bluetooth-version", "5.2");
  await setOptions(lx41.id, "bluetooth-features", ["Scan", "Advertise", "GATT"]);
  await setBool(lx41.id, "nb-iot", false);
  await setBool(lx41.id, "lorawan", false);
  await setBool(lx41.id, "nfc", false);
  // -- GNSS --
  await setOptions(lx41.id, "gnss-services", ["GPS", "Glonass", "Beidou", "Galileo", "QZSS", "SBAS"]);
  await setOptions(lx41.id, "gnss-antenna-type", "Internal");
  await setNumber(lx41.id, "tracking-sensitivity", -159);
  await setNumber(lx41.id, "acquisition-sensitivity", -160);
  await setNumber(lx41.id, "cold-start-time", 28.01);
  await setNumber(lx41.id, "warm-start-time", 28.01);
  await setNumber(lx41.id, "hot-start-time", 4.05);
  await setNumber(lx41.id, "positional-accuracy", 1.72);
  // -- Storage --
  await setRange(lx41.id, "internal-memory-size", 8, 8);
  await setNumber(lx41.id, "logging-capacity", 150);
  await setBool(lx41.id, "data-compression", true);
  await setBool(lx41.id, "external-memory-slot", false);
  // -- Input / Output / Interfaces --
  await setRange(lx41.id, "analog_input", 0, 0);
  await setRange(lx41.id, "digital_input", 1, 1);
  await setRange(lx41.id, "digital_output", 1, 1);
  await setBool(lx41.id, "one_wire", false);
  await setBool(lx41.id, "one_wire_power", false);
  await setBool(lx41.id, "configurable_input", true);
  await setRange(lx41.id, "configurable_input_quantity", 1, 1);
  await setBool(lx41.id, "configurable_output", true);
  await setRange(lx41.id, "configurable_output_quantity", 1, 1);
  await setBool(lx41.id, "negative_input_gnd_sense", false);
  await setBool(lx41.id, "can_bus", false);
  await setBool(lx41.id, "can_adaptor", false);
  await setBool(lx41.id, "kline", false);
  await setBool(lx41.id, "rs232", false);
  await setBool(lx41.id, "rs485", false);
  await setBool(lx41.id, "uart", false);
  await setBool(lx41.id, "impulse_input", true);
  await setBool(lx41.id, "pulse_input", true);
  await setBool(lx41.id, "frequency_input", true);
  await setBool(lx41.id, "usb", true);
  await setOptions(lx41.id, "usb_purpose", ["Configuration"]);
  await setText(lx41.id, "usb_type", "micro USB");
  await setBool(lx41.id, "audio_in", false);
  await setBool(lx41.id, "audio_out", false);
  // -- Device Management --
  await setBool(lx41.id, "desktop_device_management_software", false);
  await setBool(lx41.id, "web_based_device_management_software", true);
  await setBool(lx41.id, "mobile_app_device_management_software", false);
  await setBool(lx41.id, "ota_commands_sms", true);
  await setBool(lx41.id, "ota_commands_data", true);
  await setBool(lx41.id, "ota_configuration_sms", true);
  await setBool(lx41.id, "ota_configuration_data", true);
  await setBool(lx41.id, "software_development_kit_sdk", true);
  await setBool(lx41.id, "sdk_algorithm", true);
  await setOptions(lx41.id, "firmware_update", ["Manual"]);
  // -- Warranty & Origin --
  await setNumber(lx41.id, "warranty-value", 24);
  await setBool(lx41.id, "document-portal", true);

  console.log("Created LX41");

  // ===========================================================================
  // LX42
  // ===========================================================================
  const lx42 = await prisma.product.create({
    data: {
      title: "LX42",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  await setOptions(lx42.id, "brand", "Xirgo");

  // -- Physical --
  await setNumber(lx42.id, "length", 68);
  await setNumber(lx42.id, "width", 90);
  await setNumber(lx42.id, "height", 19);
  await setNumber(lx42.id, "weight", 64);
  await setOptions(lx42.id, "color", ["Black"]);
  await setOptions(lx42.id, "casing-material", ["Plastic"]);
  await setOptions(lx42.id, "mounting-option", ["Zip tie"]);
  await setText(lx42.id, "connector-type", "Wired");
  // -- Environmental --
  await setRange(lx42.id, "operating-temperature", -20, 60);
  await setRange(lx42.id, "operating-temperature-without-battery", -40, 85);
  await setNumber(lx42.id, "ip-rating", 44);
  // -- Electrical --
  await setRange(lx42.id, "input-voltage-range", 9, 31);
  await setNumber(lx42.id, "power-consumption-active-mode", 100);
  await setNumber(lx42.id, "power-consumption-sleep-mode", 4);
  await setBool(lx42.id, "internal-battery", true);
  await setOptions(lx42.id, "internal-battery-type", "LiPo");
  await setRange(lx42.id, "internal-battery-size", 210, 850);
  await setRange(lx42.id, "battery-charging-temperature", 0, 60);
  await setRange(lx42.id, "battery-discharging-temperature", -20, 60);
  await setOptions(lx42.id, "recharge-options", ["Auto"]);
  await setBool(lx42.id, "power-saving", true);
  await setOptions(lx42.id, "power-saving-options", ["Deep Sleep"]);
  await setBool(lx42.id, "power-surge-alert", false);
  await setBool(lx42.id, "surge-protection", true);
  await setBool(lx42.id, "reverse-polarity-protection", true);
  await setBool(lx42.id, "leds", true);
  await setOptions(lx42.id, "led-options", ["Cellular", "GNSS", "CAN"]);
  // -- Connectivity --
  await setOptions(lx42.id, "connectivity", ["2G", "4G"]);
  await setOptions(lx42.id, "4g-type", ["LTE Cat 1"]);
  await setOptions(lx42.id, "fallback-option", ["2G"]);
  await setText(lx42.id, "module-name", "Quectel EG915N-EA");
  await setText(lx42.id, "number-of-sim-slots", "1");
  await setOptions(lx42.id, "sim-slot-option", "Nano");
  await setBool(lx42.id, "esim", true);
  await setText(lx42.id, "cellular-antenna-type", "Internal");
  await setBool(lx42.id, "satellite-modem", false);
  await setBool(lx42.id, "wifi", false);
  await setBool(lx42.id, "bluetooth", true);
  await setOptions(lx42.id, "bluetooth-version", "5.2");
  await setOptions(lx42.id, "bluetooth-features", ["Scan", "Advertise", "GATT"]);
  await setBool(lx42.id, "nb-iot", false);
  await setBool(lx42.id, "lorawan", false);
  await setBool(lx42.id, "nfc", false);
  // -- GNSS --
  await setOptions(lx42.id, "gnss-services", ["GPS", "Glonass", "Beidou", "Galileo", "QZSS", "SBAS"]);
  await setOptions(lx42.id, "gnss-antenna-type", "Internal");
  await setNumber(lx42.id, "tracking-sensitivity", -159);
  await setNumber(lx42.id, "acquisition-sensitivity", -160);
  await setNumber(lx42.id, "cold-start-time", 28.01);
  await setNumber(lx42.id, "warm-start-time", 28.01);
  await setNumber(lx42.id, "hot-start-time", 4.05);
  await setNumber(lx42.id, "positional-accuracy", 1.72);
  // -- Storage --
  await setRange(lx42.id, "internal-memory-size", 8, 8);
  await setNumber(lx42.id, "logging-capacity", 150);
  await setBool(lx42.id, "data-compression", true);
  await setBool(lx42.id, "external-memory-slot", false);
  // -- Input / Output / Interfaces --
  await setRange(lx42.id, "analog_input", 3, 3);
  await setText(lx42.id, "analog_measuring_resolution", "0.001");
  await setRange(lx42.id, "digital_input", 4, 4);
  await setRange(lx42.id, "digital_output", 2, 2);
  await setBool(lx42.id, "one_wire", true);
  await setBool(lx42.id, "one_wire_power", true);
  await setBool(lx42.id, "configurable_input", true);
  await setRange(lx42.id, "configurable_input_quantity", 4, 4);
  await setBool(lx42.id, "configurable_output", true);
  await setRange(lx42.id, "configurable_output_quantity", 2, 2);
  await setBool(lx42.id, "negative_input_gnd_sense", false);
  await setBool(lx42.id, "can_bus", false);
  await setBool(lx42.id, "can_adaptor", false);
  await setBool(lx42.id, "kline", false);
  await setBool(lx42.id, "rs232", false);
  await setBool(lx42.id, "rs485", false);
  await setBool(lx42.id, "uart", false);
  await setBool(lx42.id, "impulse_input", true);
  await setBool(lx42.id, "pulse_input", true);
  await setBool(lx42.id, "frequency_input", true);
  await setBool(lx42.id, "usb", true);
  await setOptions(lx42.id, "usb_purpose", ["Configuration"]);
  await setText(lx42.id, "usb_type", "micro USB");
  await setBool(lx42.id, "audio_in", false);
  await setBool(lx42.id, "audio_out", false);
  // -- Device Management --
  await setBool(lx42.id, "desktop_device_management_software", false);
  await setBool(lx42.id, "web_based_device_management_software", true);
  await setBool(lx42.id, "mobile_app_device_management_software", false);
  await setBool(lx42.id, "ota_commands_sms", true);
  await setBool(lx42.id, "ota_commands_data", true);
  await setBool(lx42.id, "ota_configuration_sms", true);
  await setBool(lx42.id, "ota_configuration_data", true);
  await setBool(lx42.id, "software_development_kit_sdk", true);
  await setBool(lx42.id, "sdk_algorithm", true);
  await setOptions(lx42.id, "firmware_update", ["Manual"]);
  // -- Warranty & Origin --
  await setNumber(lx42.id, "warranty-value", 24);
  await setBool(lx42.id, "document-portal", true);

  console.log("Created LX42");

  // ===========================================================================
  // LX43
  // ===========================================================================
  const lx43 = await prisma.product.create({
    data: {
      title: "LX43",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  await setOptions(lx43.id, "brand", "Xirgo");

  // -- Physical --
  await setNumber(lx43.id, "length", 68);
  await setNumber(lx43.id, "width", 90);
  await setNumber(lx43.id, "height", 19);
  await setNumber(lx43.id, "weight", 64);
  await setOptions(lx43.id, "color", ["Black"]);
  await setOptions(lx43.id, "casing-material", ["Plastic"]);
  await setOptions(lx43.id, "mounting-option", ["Zip tie"]);
  await setText(lx43.id, "connector-type", "Wired");
  // -- Environmental --
  await setRange(lx43.id, "operating-temperature", -20, 60);
  await setRange(lx43.id, "operating-temperature-without-battery", -40, 85);
  await setNumber(lx43.id, "ip-rating", 44);
  // -- Electrical --
  await setRange(lx43.id, "input-voltage-range", 9, 31);
  await setNumber(lx43.id, "power-consumption-active-mode", 100);
  await setNumber(lx43.id, "power-consumption-sleep-mode", 4);
  await setBool(lx43.id, "internal-battery", true);
  await setOptions(lx43.id, "internal-battery-type", "LiPo");
  await setRange(lx43.id, "internal-battery-size", 210, 850);
  await setRange(lx43.id, "battery-charging-temperature", 0, 60);
  await setRange(lx43.id, "battery-discharging-temperature", -20, 60);
  await setOptions(lx43.id, "recharge-options", ["Auto"]);
  await setBool(lx43.id, "power-saving", true);
  await setOptions(lx43.id, "power-saving-options", ["Deep Sleep"]);
  await setBool(lx43.id, "power-surge-alert", false);
  await setBool(lx43.id, "surge-protection", true);
  await setBool(lx43.id, "reverse-polarity-protection", true);
  await setBool(lx43.id, "leds", true);
  await setOptions(lx43.id, "led-options", ["Cellular", "GNSS", "CAN"]);
  // -- Connectivity --
  await setOptions(lx43.id, "connectivity", ["2G", "4G"]);
  await setOptions(lx43.id, "4g-type", ["LTE Cat 1"]);
  await setOptions(lx43.id, "fallback-option", ["2G"]);
  await setText(lx43.id, "module-name", "Quectel EG915N-EA");
  await setText(lx43.id, "number-of-sim-slots", "1");
  await setOptions(lx43.id, "sim-slot-option", "Nano");
  await setBool(lx43.id, "esim", true);
  await setText(lx43.id, "cellular-antenna-type", "Internal");
  await setBool(lx43.id, "satellite-modem", false);
  await setBool(lx43.id, "wifi", false);
  await setBool(lx43.id, "bluetooth", true);
  await setOptions(lx43.id, "bluetooth-version", "5.2");
  await setOptions(lx43.id, "bluetooth-features", ["Scan", "Advertise", "GATT"]);
  await setBool(lx43.id, "nb-iot", false);
  await setBool(lx43.id, "lorawan", false);
  await setBool(lx43.id, "nfc", false);
  // -- GNSS --
  await setOptions(lx43.id, "gnss-services", ["GPS", "Glonass", "Beidou", "Galileo", "QZSS", "SBAS"]);
  await setOptions(lx43.id, "gnss-antenna-type", "Internal");
  await setNumber(lx43.id, "tracking-sensitivity", -159);
  await setNumber(lx43.id, "acquisition-sensitivity", -160);
  await setNumber(lx43.id, "cold-start-time", 28.01);
  await setNumber(lx43.id, "warm-start-time", 28.01);
  await setNumber(lx43.id, "hot-start-time", 4.05);
  await setNumber(lx43.id, "positional-accuracy", 1.72);
  // -- Storage --
  await setRange(lx43.id, "internal-memory-size", 8, 8);
  await setNumber(lx43.id, "logging-capacity", 150);
  await setBool(lx43.id, "data-compression", true);
  await setBool(lx43.id, "external-memory-slot", false);
  // -- Input / Output / Interfaces --
  await setRange(lx43.id, "analog_input", 3, 3);
  await setText(lx43.id, "analog_measuring_resolution", "0.001");
  await setRange(lx43.id, "digital_input", 4, 4);
  await setRange(lx43.id, "digital_output", 4, 4);
  await setBool(lx43.id, "one_wire", true);
  await setBool(lx43.id, "one_wire_power", true);
  await setBool(lx43.id, "configurable_input", true);
  await setRange(lx43.id, "configurable_input_quantity", 4, 4);
  await setBool(lx43.id, "configurable_output", true);
  await setRange(lx43.id, "configurable_output_quantity", 4, 4);
  await setBool(lx43.id, "negative_input_gnd_sense", false);
  await setBool(lx43.id, "can_bus", false);
  await setBool(lx43.id, "can_adaptor", false);
  await setBool(lx43.id, "kline", false);
  await setBool(lx43.id, "rs232", true);
  await setBool(lx43.id, "rs485", true);
  await setBool(lx43.id, "uart", false);
  await setBool(lx43.id, "impulse_input", true);
  await setBool(lx43.id, "pulse_input", true);
  await setBool(lx43.id, "frequency_input", true);
  await setBool(lx43.id, "usb", true);
  await setOptions(lx43.id, "usb_purpose", ["Configuration"]);
  await setText(lx43.id, "usb_type", "micro USB");
  await setBool(lx43.id, "audio_in", false);
  await setBool(lx43.id, "audio_out", false);
  // -- Device Management --
  await setBool(lx43.id, "desktop_device_management_software", false);
  await setBool(lx43.id, "web_based_device_management_software", true);
  await setBool(lx43.id, "mobile_app_device_management_software", false);
  await setBool(lx43.id, "ota_commands_sms", true);
  await setBool(lx43.id, "ota_commands_data", true);
  await setBool(lx43.id, "ota_configuration_sms", true);
  await setBool(lx43.id, "ota_configuration_data", true);
  await setBool(lx43.id, "software_development_kit_sdk", true);
  await setBool(lx43.id, "sdk_algorithm", true);
  await setOptions(lx43.id, "firmware_update", ["Manual"]);
  // -- Warranty & Origin --
  await setNumber(lx43.id, "warranty-value", 24);
  await setBool(lx43.id, "document-portal", true);

  console.log("Created LX43");

  // ===========================================================================
  // LX44
  // ===========================================================================
  const lx44 = await prisma.product.create({
    data: {
      title: "LX44",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  await setOptions(lx44.id, "brand", "Xirgo");

  // -- Physical --
  await setNumber(lx44.id, "length", 68);
  await setNumber(lx44.id, "width", 90);
  await setNumber(lx44.id, "height", 19);
  await setNumber(lx44.id, "weight", 64);
  await setOptions(lx44.id, "color", ["Black"]);
  await setOptions(lx44.id, "casing-material", ["Plastic"]);
  await setOptions(lx44.id, "mounting-option", ["Zip tie"]);
  await setText(lx44.id, "connector-type", "Wired");
  // -- Environmental --
  await setRange(lx44.id, "operating-temperature", -20, 60);
  await setRange(lx44.id, "operating-temperature-without-battery", -40, 85);
  await setNumber(lx44.id, "ip-rating", 44);
  // -- Electrical --
  await setRange(lx44.id, "input-voltage-range", 9, 31);
  await setNumber(lx44.id, "power-consumption-active-mode", 100);
  await setNumber(lx44.id, "power-consumption-sleep-mode", 4);
  await setBool(lx44.id, "internal-battery", true);
  await setOptions(lx44.id, "internal-battery-type", "LiPo");
  await setRange(lx44.id, "internal-battery-size", 210, 850);
  await setRange(lx44.id, "battery-charging-temperature", 0, 60);
  await setRange(lx44.id, "battery-discharging-temperature", -20, 60);
  await setOptions(lx44.id, "recharge-options", ["Auto"]);
  await setBool(lx44.id, "power-saving", true);
  await setOptions(lx44.id, "power-saving-options", ["Deep Sleep"]);
  await setBool(lx44.id, "power-surge-alert", false);
  await setBool(lx44.id, "surge-protection", true);
  await setBool(lx44.id, "reverse-polarity-protection", true);
  await setBool(lx44.id, "leds", true);
  await setOptions(lx44.id, "led-options", ["Cellular", "GNSS", "CAN"]);
  // -- Connectivity --
  await setOptions(lx44.id, "connectivity", ["2G", "4G"]);
  await setOptions(lx44.id, "4g-type", ["LTE Cat 1"]);
  await setOptions(lx44.id, "fallback-option", ["2G"]);
  await setText(lx44.id, "module-name", "Quectel EG915N-EA");
  await setText(lx44.id, "number-of-sim-slots", "1");
  await setOptions(lx44.id, "sim-slot-option", "Nano");
  await setBool(lx44.id, "esim", true);
  await setText(lx44.id, "cellular-antenna-type", "Internal");
  await setBool(lx44.id, "satellite-modem", false);
  await setBool(lx44.id, "wifi", false);
  await setBool(lx44.id, "bluetooth", true);
  await setOptions(lx44.id, "bluetooth-version", "5.2");
  await setOptions(lx44.id, "bluetooth-features", ["Scan", "Advertise", "GATT"]);
  await setBool(lx44.id, "nb-iot", false);
  await setBool(lx44.id, "lorawan", false);
  await setBool(lx44.id, "nfc", false);
  // -- GNSS --
  await setOptions(lx44.id, "gnss-services", ["GPS", "Glonass", "Beidou", "Galileo", "QZSS", "SBAS"]);
  await setOptions(lx44.id, "gnss-antenna-type", "Internal");
  await setNumber(lx44.id, "tracking-sensitivity", -159);
  await setNumber(lx44.id, "acquisition-sensitivity", -160);
  await setNumber(lx44.id, "cold-start-time", 28.01);
  await setNumber(lx44.id, "warm-start-time", 28.01);
  await setNumber(lx44.id, "hot-start-time", 4.05);
  await setNumber(lx44.id, "positional-accuracy", 1.72);
  // -- Storage --
  await setRange(lx44.id, "internal-memory-size", 8, 8);
  await setNumber(lx44.id, "logging-capacity", 150);
  await setBool(lx44.id, "data-compression", true);
  await setBool(lx44.id, "external-memory-slot", false);
  // -- Input / Output / Interfaces --
  await setRange(lx44.id, "analog_input", 3, 3);
  await setText(lx44.id, "analog_measuring_resolution", "0.001");
  await setRange(lx44.id, "digital_input", 4, 4);
  await setRange(lx44.id, "digital_output", 4, 4);
  await setBool(lx44.id, "one_wire", true);
  await setBool(lx44.id, "one_wire_power", true);
  await setBool(lx44.id, "configurable_input", true);
  await setRange(lx44.id, "configurable_input_quantity", 4, 4);
  await setBool(lx44.id, "configurable_output", true);
  await setRange(lx44.id, "configurable_output_quantity", 4, 4);
  await setBool(lx44.id, "negative_input_gnd_sense", false);
  await setBool(lx44.id, "can_bus", true);
  await setText(lx44.id, "can_input", "2");
  await setOptions(lx44.id, "can_protocol", ["J1939", "J1708", "J1979", "Proprietary"]);
  await setBool(lx44.id, "can_adaptor", true);
  await setText(lx44.id, "can_type", "Embedded");
  await setBool(lx44.id, "kline", false);
  await setBool(lx44.id, "rs232", true);
  await setBool(lx44.id, "rs485", false);
  await setBool(lx44.id, "uart", false);
  await setBool(lx44.id, "impulse_input", true);
  await setBool(lx44.id, "pulse_input", true);
  await setBool(lx44.id, "frequency_input", true);
  await setBool(lx44.id, "usb", true);
  await setOptions(lx44.id, "usb_purpose", ["Configuration"]);
  await setText(lx44.id, "usb_type", "micro USB");
  await setBool(lx44.id, "audio_in", false);
  await setBool(lx44.id, "audio_out", false);
  // -- Device Management --
  await setBool(lx44.id, "desktop_device_management_software", false);
  await setBool(lx44.id, "web_based_device_management_software", true);
  await setBool(lx44.id, "mobile_app_device_management_software", false);
  await setBool(lx44.id, "ota_commands_sms", true);
  await setBool(lx44.id, "ota_commands_data", true);
  await setBool(lx44.id, "ota_configuration_sms", true);
  await setBool(lx44.id, "ota_configuration_data", true);
  await setBool(lx44.id, "software_development_kit_sdk", true);
  await setBool(lx44.id, "sdk_algorithm", true);
  await setOptions(lx44.id, "firmware_update", ["Manual"]);
  // -- Warranty & Origin --
  await setNumber(lx44.id, "warranty-value", 24);
  await setBool(lx44.id, "document-portal", true);

  console.log("Created LX44");

  // ===========================================================================
  // LX45
  // ===========================================================================
  const lx45 = await prisma.product.create({
    data: {
      title: "LX45",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  await setOptions(lx45.id, "brand", "Xirgo");

  // -- Physical --
  await setNumber(lx45.id, "length", 68);
  await setNumber(lx45.id, "width", 90);
  await setNumber(lx45.id, "height", 19);
  await setNumber(lx45.id, "weight", 64);
  await setOptions(lx45.id, "color", ["Black"]);
  await setOptions(lx45.id, "casing-material", ["Plastic"]);
  await setOptions(lx45.id, "mounting-option", ["Zip tie"]);
  await setText(lx45.id, "connector-type", "Wired");
  // -- Environmental --
  await setRange(lx45.id, "operating-temperature", -20, 60);
  await setRange(lx45.id, "operating-temperature-without-battery", -40, 85);
  await setNumber(lx45.id, "ip-rating", 44);
  // -- Electrical --
  await setRange(lx45.id, "input-voltage-range", 9, 31);
  await setNumber(lx45.id, "power-consumption-active-mode", 100);
  await setNumber(lx45.id, "power-consumption-sleep-mode", 4);
  await setBool(lx45.id, "internal-battery", true);
  await setOptions(lx45.id, "internal-battery-type", "LiPo");
  await setRange(lx45.id, "internal-battery-size", 210, 850);
  await setRange(lx45.id, "battery-charging-temperature", 0, 60);
  await setRange(lx45.id, "battery-discharging-temperature", -20, 60);
  await setOptions(lx45.id, "recharge-options", ["Auto"]);
  await setBool(lx45.id, "power-saving", true);
  await setOptions(lx45.id, "power-saving-options", ["Deep Sleep"]);
  await setBool(lx45.id, "power-surge-alert", false);
  await setBool(lx45.id, "surge-protection", true);
  await setBool(lx45.id, "reverse-polarity-protection", true);
  await setBool(lx45.id, "leds", true);
  await setOptions(lx45.id, "led-options", ["Cellular", "GNSS", "CAN"]);
  // -- Connectivity --
  await setOptions(lx45.id, "connectivity", ["2G", "4G"]);
  await setOptions(lx45.id, "4g-type", ["LTE Cat 1"]);
  await setOptions(lx45.id, "fallback-option", ["2G"]);
  await setText(lx45.id, "module-name", "Quectel EG915N-EA");
  await setText(lx45.id, "number-of-sim-slots", "1");
  await setOptions(lx45.id, "sim-slot-option", "Nano");
  await setBool(lx45.id, "esim", true);
  await setText(lx45.id, "cellular-antenna-type", "Internal");
  await setBool(lx45.id, "satellite-modem", false);
  await setBool(lx45.id, "wifi", false);
  await setBool(lx45.id, "bluetooth", true);
  await setOptions(lx45.id, "bluetooth-version", "5.2");
  await setOptions(lx45.id, "bluetooth-features", ["Scan", "Advertise", "GATT"]);
  await setBool(lx45.id, "nb-iot", false);
  await setBool(lx45.id, "lorawan", false);
  await setBool(lx45.id, "nfc", false);
  // -- GNSS --
  await setOptions(lx45.id, "gnss-services", ["GPS", "Glonass", "Beidou", "Galileo", "QZSS", "SBAS"]);
  await setOptions(lx45.id, "gnss-antenna-type", "Internal");
  await setNumber(lx45.id, "tracking-sensitivity", -159);
  await setNumber(lx45.id, "acquisition-sensitivity", -160);
  await setNumber(lx45.id, "cold-start-time", 28.01);
  await setNumber(lx45.id, "warm-start-time", 28.01);
  await setNumber(lx45.id, "hot-start-time", 4.05);
  await setNumber(lx45.id, "positional-accuracy", 1.72);
  // -- Storage --
  await setRange(lx45.id, "internal-memory-size", 8, 8);
  await setNumber(lx45.id, "logging-capacity", 150);
  await setBool(lx45.id, "data-compression", true);
  await setBool(lx45.id, "external-memory-slot", false);
  // -- Input / Output / Interfaces --
  await setRange(lx45.id, "analog_input", 3, 3);
  await setText(lx45.id, "analog_measuring_resolution", "0.001");
  await setRange(lx45.id, "digital_input", 4, 4);
  await setRange(lx45.id, "digital_output", 2, 2);
  await setBool(lx45.id, "one_wire", true);
  await setBool(lx45.id, "one_wire_power", true);
  await setBool(lx45.id, "configurable_input", true);
  await setRange(lx45.id, "configurable_input_quantity", 4, 4);
  await setBool(lx45.id, "configurable_output", true);
  await setRange(lx45.id, "configurable_output_quantity", 2, 2);
  await setBool(lx45.id, "negative_input_gnd_sense", false);
  await setBool(lx45.id, "can_bus", true);
  await setText(lx45.id, "can_input", "2");
  await setOptions(lx45.id, "can_protocol", ["J1939", "J1708", "J1979", "Proprietary"]);
  await setBool(lx45.id, "can_adaptor", true);
  await setText(lx45.id, "can_type", "Embedded");
  await setBool(lx45.id, "kline", false);
  await setBool(lx45.id, "rs232", true);
  await setBool(lx45.id, "rs485", true);
  await setBool(lx45.id, "uart", false);
  await setBool(lx45.id, "impulse_input", true);
  await setBool(lx45.id, "pulse_input", true);
  await setBool(lx45.id, "frequency_input", true);
  await setBool(lx45.id, "usb", true);
  await setOptions(lx45.id, "usb_purpose", ["Configuration"]);
  await setText(lx45.id, "usb_type", "micro USB");
  await setBool(lx45.id, "audio_in", false);
  await setBool(lx45.id, "audio_out", false);
  // -- Device Management --
  await setBool(lx45.id, "desktop_device_management_software", false);
  await setBool(lx45.id, "web_based_device_management_software", true);
  await setBool(lx45.id, "mobile_app_device_management_software", false);
  await setBool(lx45.id, "ota_commands_sms", true);
  await setBool(lx45.id, "ota_commands_data", true);
  await setBool(lx45.id, "ota_configuration_sms", true);
  await setBool(lx45.id, "ota_configuration_data", true);
  await setBool(lx45.id, "software_development_kit_sdk", true);
  await setBool(lx45.id, "sdk_algorithm", true);
  await setOptions(lx45.id, "firmware_update", ["Manual"]);
  // -- Warranty & Origin --
  await setNumber(lx45.id, "warranty-value", 24);
  await setBool(lx45.id, "document-portal", true);

  console.log("Created LX45");
}
