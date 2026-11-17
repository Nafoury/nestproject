import { PrismaClient } from "@prisma/client";

const CATEGORY_ID = BigInt(1);

export async function seedProducts(prisma: PrismaClient) {
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
  // TRX500 — Premium all-in-one tracker with satellite fallback, dual SIM, and full CAN-bus diagnostics.
  // =========================================================================
  const trx500 = await prisma.product.create({
    data: {
      title: "TRX500",
      description: "Premium all-in-one tracker with satellite fallback, dual SIM, and full CAN-bus diagnostics.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(trx500.id, "length", 98);
  await setNumber(trx500.id, "width", 68);
  await setNumber(trx500.id, "height", 24);
  await setNumber(trx500.id, "weight", 145);
  await setOptions(trx500.id, "color", ["Black", "Grey/Silver"]);
  await setOptions(trx500.id, "casing-material", ["Metal", "Plastic"]);
  await setOptions(trx500.id, "mounting-option", ["Screw", "Magnetic", "Adhesive"]);
  await setText(trx500.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(trx500.id, "operating-temperature", -40, 85);
  await setRange(trx500.id, "storage-temperature", -40, 90);
  await setRange(trx500.id, "operating-temperature-without-battery", -40, 105);
  await setRange(trx500.id, "storage-temperature-without-battery", -40, 110);
  await setRange(trx500.id, "humidity", 5, 100);
  await setRange(trx500.id, "ip-rating", 67, 67);

  // -- Electrical --
  await setRange(trx500.id, "input-voltage-range", 9, 32);
  await setBool(trx500.id, "solar-powered", true);
  await setNumber(trx500.id, "power-consumption-active-mode", 210);
  await setNumber(trx500.id, "power-consumption-sleep-mode", 22);
  await setNumber(trx500.id, "power-consumption-deep-sleep-mode", 4);
  await setNumber(trx500.id, "current-draw-active-mode", 58);
  await setNumber(trx500.id, "current-draw-sleep-mode", 6);
  await setBool(trx500.id, "internal-battery", true);
  await setOptions(trx500.id, "internal-battery-type", "Li-Ion");
  await setRange(trx500.id, "internal-battery-size", 950, 1000);
  await setBool(trx500.id, "replaceable-internal-battery", true);
  await setBool(trx500.id, "rechargeable-internal-battery", true);
  await setOptions(trx500.id, "recharge-options", ["Wired", "Solar"]);
  await setNumber(trx500.id, "battery-shelf-life", 48);
  await setNumber(trx500.id, "battery-service-life", 72);
  await setRange(trx500.id, "battery-charging-temperature", -20, 45);
  await setRange(trx500.id, "battery-discharging-temperature", -20, 80);
  await setNumber(trx500.id, "battery-charging-time", 340);
  await setBool(trx500.id, "power-saving", true);
  await setOptions(trx500.id, "power-saving-options", ["Sleep Mode", "Deep Mode"]);
  await setBool(trx500.id, "power-surge-alert", true);
  await setBool(trx500.id, "surge-protection", true);
  await setBool(trx500.id, "reverse-polarity-protection", true);
  await setBool(trx500.id, "leds", true);
  await setOptions(trx500.id, "led-options", ["Power", "Battery", "Cellular", "GNSS", "Wi-Fi", "Satellite"]);

  // -- Connectivity --
  await setOptions(trx500.id, "connectivity", ["2G", "4G"]);
  await setOptions(trx500.id, "4g-type", ["LTE-M", "NB-IoT"]);
  await setOptions(trx500.id, "fallback-option", ["3G", "2G"]);
  await setText(trx500.id, "module-name", "Quectel EG915N-EA");
  await setText(trx500.id, "number-of-sim-slots", "2");
  await setOptions(trx500.id, "sim-slot-options", ["Nano", "Standard/Normal"]);
  await setBool(trx500.id, "esim", true);
  await setText(trx500.id, "cellular-antenna-type", "External");
  await setOptions(trx500.id, "cellular-antenna-connector-type", "SMA");
  await setBool(trx500.id, "cellular-external-antenna-port", true);
  await setRange(trx500.id, "antenna-gain", 2, 5);
  await setOptions(trx500.id, "gprs-frequency-bands", ["850 MHz", "900 MHz", "1800 MHz", "1900 MHz"]);
  await setBool(trx500.id, "satellite-modem", true);
  await setOptions(trx500.id, "satellite-service", "Iridium");
  await setOptions(trx500.id, "satcomm-prevalence", "Primary Auto Switching");
  await setBool(trx500.id, "wifi", true);
  await setOptions(trx500.id, "wifi-standard", ["802.11ac", "802.11n"]);
  await setOptions(trx500.id, "wifi-frequency-bands", ["2.4 GHz", "5 GHz"]);
  await setBool(trx500.id, "wifi-data-sending", true);
  await setBool(trx500.id, "wifi-positioning", true);
  await setBool(trx500.id, "wifi-hotspot", true);
  await setBool(trx500.id, "wifi-hub-to-hub", false);
  await setRange(trx500.id, "hotspot-range", 10, 30);
  await setBool(trx500.id, "bluetooth", true);
  await setOptions(trx500.id, "bluetooth-version", "5.0");
  await setOptions(trx500.id, "bluetooth-features", "BLE Beacon Scanning");
  await setBool(trx500.id, "nb-iot", true);
  await setBool(trx500.id, "lorawan", false);
  await setBool(trx500.id, "nfc", true);

  // -- GNSS --
  await setOptions(trx500.id, "gnss-services", ["GPS", "GLONASS", "GALILEO", "BeiDou"]);
  await setOptions(trx500.id, "gnss-antenna-type", "External");
  await setOptions(trx500.id, "gnss-external-antenna-connector-type", "SMA Male");
  await setNumber(trx500.id, "tracking-channels", 72);
  await setNumber(trx500.id, "acquisition-channels", 99);
  await setNumber(trx500.id, "tracking-sensitivity", -165);
  await setNumber(trx500.id, "acquisition-sensitivity", -148);
  await setNumber(trx500.id, "update-rate", 10);
  await setNumber(trx500.id, "cold-start-time", 26);
  await setNumber(trx500.id, "warm-start-time", 5);
  await setNumber(trx500.id, "hot-start-time", 1);
  await setNumber(trx500.id, "positional-accuracy", 2.5);
  await setNumber(trx500.id, "velocity-accuracy", 0.1);

  // -- Storage --
  await setRange(trx500.id, "internal-memory-size", 8, 32);
  await setNumber(trx500.id, "logging-capacity", 50);
  await setBool(trx500.id, "data-compression", true);
  await setBool(trx500.id, "external-memory-slot", true);
  await setText(trx500.id, "external-memory-slot-quantity", "2");
  await setOptions(trx500.id, "external-memory-card-type", ["SD", "SDHC"]);
  await setNumber(trx500.id, "external-memory-size", 32000);
  await setNumber(trx500.id, "maximum-sd-card-size", 128000);

  // -- Input / Output / Interfaces --
  await setRange(trx500.id, "analog_input", 2, 4);
  await setText(trx500.id, "analog_measuring_resolution", "8-bit ADC (256 levels)");
  await setRange(trx500.id, "digital_input", 4, 8);
  await setRange(trx500.id, "digital_output", 4, 8);
  await setRange(trx500.id, "relay_output", 1, 2);
  await setBool(trx500.id, "one_wire", true);
  await setBool(trx500.id, "one_wire_power", true);
  await setBool(trx500.id, "configurable_input", true);
  await setRange(trx500.id, "configurable_input_quantity", 2, 4);
  await setBool(trx500.id, "configurable_output", true);
  await setRange(trx500.id, "configurable_output_quantity", 2, 4);
  await setBool(trx500.id, "negative_input_gnd_sense", true);
  await setRange(trx500.id, "negative_input_gnd_sense_quantity", 1, 2);
  await setBool(trx500.id, "can_bus", true);
  await setText(trx500.id, "can_type", "External");
  await setBool(trx500.id, "can_adaptor", true);
  await setText(trx500.id, "can_input", "2");
  await setOptions(trx500.id, "can_protocol", ["J1939", "OBD-II"]);
  await setBool(trx500.id, "kline", true);
  await setBool(trx500.id, "rs232", true);
  await setRange(trx500.id, "rs232_quantity", 1, 2);
  await setBool(trx500.id, "rs485", true);
  await setRange(trx500.id, "rs485_quantity", 1, 1);
  await setBool(trx500.id, "uart", true);
  await setBool(trx500.id, "impulse_input", true);
  await setBool(trx500.id, "pulse_input", true);
  await setBool(trx500.id, "frequency_input", true);
  await setBool(trx500.id, "usb", true);
  await setOptions(trx500.id, "usb_purpose", ["Data Transfer", "Firmware Update", "Charging"]);
  await setText(trx500.id, "usb_type", "USB-C");
  await setBool(trx500.id, "audio_in", true);
  await setBool(trx500.id, "audio_out", true);

  // -- Device Management --
  await setBool(trx500.id, "desktop_device_management_software", true);
  await setBool(trx500.id, "web_based_device_management_software", true);
  await setBool(trx500.id, "mobile_app_device_management_software", true);
  await setOptions(trx500.id, "mobile_app_dms", ["iOS", "Android"]);
  await setBool(trx500.id, "ota_commands_sms", true);
  await setBool(trx500.id, "ota_commands_data", true);
  await setBool(trx500.id, "ota_configuration_sms", true);
  await setBool(trx500.id, "ota_configuration_data", true);
  await setBool(trx500.id, "software_development_kit_sdk", true);
  await setBool(trx500.id, "sdk_algorithm", true);
  await setOptions(trx500.id, "firmware_update", ["OTA", "USB"]);

  // -- Certification & Compliance --
  await setBool(trx500.id, "ce", true);
  await setBool(trx500.id, "fcc", true);
  await setBool(trx500.id, "rohs", true);
  await setBool(trx500.id, "emark", true);
  await setBool(trx500.id, "anatel", true);
  await setBool(trx500.id, "atex", true);
  await setBool(trx500.id, "ic", true);
  await setBool(trx500.id, "weee", true);
  await setBool(trx500.id, "eac", true);
  await setBool(trx500.id, "tdra", true);
  await setBool(trx500.id, "ip", true);
  await setBool(trx500.id, "ptcrb", true);

  // -- Warranty & Support --
  await setNumber(trx500.id, "warranty-value", 36);
  await setBool(trx500.id, "document-portal", true);

  // -- Country of Origin & Distribution --
  await setOptions(trx500.id, "country-of-origin", ["China", "Taiwan"]);
  await setOptions(trx500.id, "regional-offices", ["USA", "UK", "UAE"]);
  await setBool(trx500.id, "distribution-channels", true);

  console.log("Created TRX500");

  // =========================================================================
  // TRX310 — Mid-range OBD-plug vehicle tracker with internal CAN-bus reading and backup battery.
  // =========================================================================
  const trx310 = await prisma.product.create({
    data: {
      title: "TRX310",
      description: "Mid-range OBD-plug vehicle tracker with internal CAN-bus reading and backup battery.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(trx310.id, "length", 65);
  await setNumber(trx310.id, "width", 56);
  await setNumber(trx310.id, "height", 20);
  await setNumber(trx310.id, "weight", 58);
  await setOptions(trx310.id, "color", "Black");
  await setOptions(trx310.id, "casing-material", "Plastic");
  await setOptions(trx310.id, "mounting-option", "Zip tie");
  await setText(trx310.id, "connector-type", "OBD Plug");

  // -- Environmental --
  await setRange(trx310.id, "operating-temperature", -20, 70);
  await setRange(trx310.id, "storage-temperature", -20, 75);
  await setRange(trx310.id, "operating-temperature-without-battery", -20, 85);
  await setRange(trx310.id, "storage-temperature-without-battery", -20, 90);
  await setRange(trx310.id, "humidity", 10, 90);
  await setRange(trx310.id, "ip-rating", 54, 54);

  // -- Electrical --
  await setRange(trx310.id, "input-voltage-range", 9, 32);
  await setBool(trx310.id, "solar-powered", false);
  await setNumber(trx310.id, "power-consumption-active-mode", 90);
  await setNumber(trx310.id, "power-consumption-sleep-mode", 9);
  await setNumber(trx310.id, "power-consumption-deep-sleep-mode", 2);
  await setNumber(trx310.id, "current-draw-active-mode", 22);
  await setNumber(trx310.id, "current-draw-sleep-mode", 3);
  await setBool(trx310.id, "internal-battery", true);
  await setOptions(trx310.id, "internal-battery-type", "Li-Po");
  await setRange(trx310.id, "internal-battery-size", 200, 250);
  await setBool(trx310.id, "replaceable-internal-battery", false);
  await setBool(trx310.id, "rechargeable-internal-battery", true);
  await setOptions(trx310.id, "recharge-options", "Wired");
  await setNumber(trx310.id, "battery-shelf-life", 18);
  await setNumber(trx310.id, "battery-service-life", 24);
  await setRange(trx310.id, "battery-charging-temperature", -60, 40);
  await setRange(trx310.id, "battery-discharging-temperature", -60, 55);
  await setNumber(trx310.id, "battery-charging-time", 130);
  await setBool(trx310.id, "power-saving", false);
  await setBool(trx310.id, "power-surge-alert", false);
  await setBool(trx310.id, "surge-protection", false);
  await setBool(trx310.id, "reverse-polarity-protection", true);
  await setBool(trx310.id, "leds", true);
  await setOptions(trx310.id, "led-options", ["GNSS", "Cellular"]);

  // -- Connectivity --
  await setOptions(trx310.id, "connectivity", "4G");
  await setOptions(trx310.id, "4g-type", "LTE-M");
  await setOptions(trx310.id, "fallback-option", "2G");
  await setText(trx310.id, "module-name", "Quectel BG95");
  await setText(trx310.id, "number-of-sim-slots", "1");
  await setOptions(trx310.id, "sim-slot-option", "Nano");
  await setBool(trx310.id, "esim", false);
  await setText(trx310.id, "cellular-antenna-type", "Internal");
  await setBool(trx310.id, "cellular-external-antenna-port", false);
  await setRange(trx310.id, "antenna-gain", 1, 2);
  await setOptions(trx310.id, "gprs-frequency-bands", ["900 MHz", "1800 MHz"]);
  await setBool(trx310.id, "satellite-modem", false);
  await setOptions(trx310.id, "satcomm-prevalence", "SatComm Only (No GNSS)");
  await setBool(trx310.id, "wifi", false);
  await setBool(trx310.id, "bluetooth", false);
  await setBool(trx310.id, "nb-iot", false);
  await setBool(trx310.id, "lorawan", false);
  await setBool(trx310.id, "nfc", false);

  // -- GNSS --
  await setOptions(trx310.id, "gnss-services", ["GPS", "GLONASS"]);
  await setOptions(trx310.id, "gnss-antenna-type", "Internal");
  await setNumber(trx310.id, "tracking-channels", 33);
  await setNumber(trx310.id, "acquisition-channels", 40);
  await setNumber(trx310.id, "tracking-sensitivity", -157);
  await setNumber(trx310.id, "acquisition-sensitivity", -144);
  await setNumber(trx310.id, "update-rate", 1);
  await setNumber(trx310.id, "cold-start-time", 35);
  await setNumber(trx310.id, "warm-start-time", 8);
  await setNumber(trx310.id, "hot-start-time", 2);
  await setNumber(trx310.id, "positional-accuracy", 3.0);
  await setNumber(trx310.id, "velocity-accuracy", 0.2);

  // -- Storage --
  await setRange(trx310.id, "internal-memory-size", 4, 16);
  await setNumber(trx310.id, "logging-capacity", 20);
  await setBool(trx310.id, "data-compression", false);
  await setBool(trx310.id, "external-memory-slot", false);

  // -- Input / Output / Interfaces --
  await setRange(trx310.id, "analog_input", 1, 2);
  await setText(trx310.id, "analog_measuring_resolution", "10-bit ADC (1024 levels)");
  await setRange(trx310.id, "digital_input", 2, 4);
  await setRange(trx310.id, "digital_output", 1, 2);
  await setRange(trx310.id, "relay_output", 1, 1);
  await setBool(trx310.id, "one_wire", true);
  await setBool(trx310.id, "one_wire_power", false);
  await setBool(trx310.id, "configurable_input", false);
  await setBool(trx310.id, "configurable_output", false);
  await setBool(trx310.id, "negative_input_gnd_sense", false);
  await setBool(trx310.id, "can_bus", true);
  await setText(trx310.id, "can_type", "Internal");
  await setText(trx310.id, "can_input", "1");
  await setOptions(trx310.id, "can_protocol", "OBD-II");
  await setBool(trx310.id, "kline", true);
  await setBool(trx310.id, "rs232", true);
  await setRange(trx310.id, "rs232_quantity", 1, 1);
  await setBool(trx310.id, "rs485", false);
  await setBool(trx310.id, "uart", true);
  await setBool(trx310.id, "impulse_input", false);
  await setBool(trx310.id, "pulse_input", false);
  await setBool(trx310.id, "frequency_input", false);
  await setBool(trx310.id, "usb", true);
  await setOptions(trx310.id, "usb_purpose", "Firmware Update");
  await setText(trx310.id, "usb_type", "Micro-USB");
  await setBool(trx310.id, "audio_in", false);
  await setBool(trx310.id, "audio_out", false);

  // -- Device Management --
  await setBool(trx310.id, "desktop_device_management_software", false);
  await setBool(trx310.id, "web_based_device_management_software", true);
  await setBool(trx310.id, "mobile_app_device_management_software", false);
  await setBool(trx310.id, "ota_commands_sms", true);
  await setBool(trx310.id, "ota_commands_data", true);
  await setBool(trx310.id, "ota_configuration_sms", true);
  await setBool(trx310.id, "ota_configuration_data", false);
  await setBool(trx310.id, "software_development_kit_sdk", false);
  await setBool(trx310.id, "sdk_algorithm", false);
  await setOptions(trx310.id, "firmware_update", "OTA");

  // -- Certification & Compliance --
  await setBool(trx310.id, "ce", true);
  await setBool(trx310.id, "fcc", true);
  await setBool(trx310.id, "rohs", true);
  await setBool(trx310.id, "emark", true);
  await setBool(trx310.id, "anatel", false);
  await setBool(trx310.id, "atex", false);
  await setBool(trx310.id, "ic", true);
  await setBool(trx310.id, "weee", true);
  await setBool(trx310.id, "eac", false);
  await setBool(trx310.id, "tdra", false);
  await setBool(trx310.id, "ip", false);
  await setBool(trx310.id, "ptcrb", false);

  // -- Warranty & Support --
  await setNumber(trx310.id, "warranty-value", 12);
  await setBool(trx310.id, "document-portal", true);

  // -- Country of Origin & Distribution --
  await setOptions(trx310.id, "country-of-origin", "China");
  await setOptions(trx310.id, "regional-offices", "USA");
  await setBool(trx310.id, "distribution-channels", true);

  console.log("Created TRX310");

  // =========================================================================
  // TRX150 — Compact wireless asset tracker with rechargeable battery and microSD logging.
  // =========================================================================
  const trx150 = await prisma.product.create({
    data: {
      title: "TRX150",
      description: "Compact wireless asset tracker with rechargeable battery and microSD logging.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(trx150.id, "length", 58);
  await setNumber(trx150.id, "width", 38);
  await setNumber(trx150.id, "height", 15);
  await setNumber(trx150.id, "weight", 42);
  await setOptions(trx150.id, "color", "White");
  await setOptions(trx150.id, "casing-material", "Plastic");
  await setOptions(trx150.id, "mounting-option", "Adhesive");
  await setText(trx150.id, "connector-type", "Wireless");

  // -- Environmental --
  await setRange(trx150.id, "operating-temperature", -20, 60);
  await setRange(trx150.id, "storage-temperature", -20, 65);
  await setRange(trx150.id, "operating-temperature-without-battery", -20, 75);
  await setRange(trx150.id, "storage-temperature-without-battery", -20, 80);
  await setRange(trx150.id, "humidity", 15, 95);
  await setRange(trx150.id, "ip-rating", 65, 65);

  // -- Electrical --
  await setRange(trx150.id, "input-voltage-range", 3, 4);
  await setBool(trx150.id, "solar-powered", false);
  await setNumber(trx150.id, "power-consumption-active-mode", 40);
  await setNumber(trx150.id, "power-consumption-sleep-mode", 3);
  await setNumber(trx150.id, "power-consumption-deep-sleep-mode", 1);
  await setNumber(trx150.id, "current-draw-active-mode", 11);
  await setNumber(trx150.id, "current-draw-sleep-mode", 1);
  await setBool(trx150.id, "internal-battery", true);
  await setOptions(trx150.id, "internal-battery-type", "Li-Po");
  await setRange(trx150.id, "internal-battery-size", 400, 500);
  await setBool(trx150.id, "replaceable-internal-battery", false);
  await setBool(trx150.id, "rechargeable-internal-battery", true);
  await setOptions(trx150.id, "recharge-options", "Wireless");
  await setNumber(trx150.id, "battery-shelf-life", 12);
  await setNumber(trx150.id, "battery-service-life", 24);
  await setRange(trx150.id, "battery-charging-temperature", -60, 40);
  await setRange(trx150.id, "battery-discharging-temperature", -10, 90);
  await setNumber(trx150.id, "battery-charging-time", 180);
  await setBool(trx150.id, "power-saving", true);
  await setOptions(trx150.id, "power-saving-options", "Sleep Mode");
  await setBool(trx150.id, "power-surge-alert", false);
  await setBool(trx150.id, "surge-protection", false);
  await setBool(trx150.id, "reverse-polarity-protection", false);
  await setBool(trx150.id, "leds", true);
  await setOptions(trx150.id, "led-options", "Power");

  // -- Connectivity --
  await setOptions(trx150.id, "connectivity", "4G");
  await setOptions(trx150.id, "4g-type", "NB-IoT");
  await setOptions(trx150.id, "fallback-option", "2G");
  await setText(trx150.id, "module-name", "u-blox M10");
  await setText(trx150.id, "number-of-sim-slots", "1");
  await setOptions(trx150.id, "sim-slot-option", "Standard/Normal");
  await setBool(trx150.id, "esim", true);
  await setText(trx150.id, "cellular-antenna-type", "Internal");
  await setBool(trx150.id, "cellular-external-antenna-port", false);
  await setRange(trx150.id, "antenna-gain", 1, 1);
  await setOptions(trx150.id, "gprs-frequency-bands", ["900 MHz", "1800 MHz"]);
  await setBool(trx150.id, "satellite-modem", false);
  await setOptions(trx150.id, "satcomm-prevalence", "SatComm Only (No GNSS)");
  await setBool(trx150.id, "wifi", false);
  await setBool(trx150.id, "bluetooth", true);
  await setOptions(trx150.id, "bluetooth-version", "5.0");
  await setOptions(trx150.id, "bluetooth-features", "BLE Beacon Scanning");
  await setBool(trx150.id, "nb-iot", true);
  await setBool(trx150.id, "lorawan", false);
  await setBool(trx150.id, "nfc", false);

  // -- GNSS --
  await setOptions(trx150.id, "gnss-services", "GPS");
  await setOptions(trx150.id, "gnss-antenna-type", "Internal");
  await setNumber(trx150.id, "tracking-channels", 22);
  await setNumber(trx150.id, "acquisition-channels", 28);
  await setNumber(trx150.id, "tracking-sensitivity", -150);
  await setNumber(trx150.id, "acquisition-sensitivity", -140);
  await setNumber(trx150.id, "update-rate", 1);
  await setNumber(trx150.id, "cold-start-time", 30);
  await setNumber(trx150.id, "warm-start-time", 5);
  await setNumber(trx150.id, "hot-start-time", 1);
  await setNumber(trx150.id, "positional-accuracy", 3.5);
  await setNumber(trx150.id, "velocity-accuracy", 0.3);

  // -- Storage --
  await setRange(trx150.id, "internal-memory-size", 2, 8);
  await setNumber(trx150.id, "logging-capacity", 12);
  await setBool(trx150.id, "data-compression", false);
  await setBool(trx150.id, "external-memory-slot", true);
  await setText(trx150.id, "external-memory-slot-quantity", "1");
  await setOptions(trx150.id, "external-memory-card-type", "SD");
  await setNumber(trx150.id, "external-memory-size", 8000);
  await setNumber(trx150.id, "maximum-sd-card-size", 32000);

  // -- Input / Output / Interfaces --
  await setRange(trx150.id, "analog_input", 1, 1);
  await setText(trx150.id, "analog_measuring_resolution", "12-bit ADC (4096 levels)");
  await setRange(trx150.id, "digital_input", 1, 2);
  await setRange(trx150.id, "digital_output", 1, 1);
  await setRange(trx150.id, "relay_output", 0, 1);
  await setBool(trx150.id, "one_wire", false);
  await setBool(trx150.id, "one_wire_power", false);
  await setBool(trx150.id, "configurable_input", false);
  await setBool(trx150.id, "configurable_output", false);
  await setBool(trx150.id, "negative_input_gnd_sense", false);
  await setBool(trx150.id, "can_bus", false);
  await setBool(trx150.id, "kline", false);
  await setBool(trx150.id, "rs232", false);
  await setBool(trx150.id, "rs485", false);
  await setBool(trx150.id, "uart", false);
  await setBool(trx150.id, "impulse_input", false);
  await setBool(trx150.id, "pulse_input", false);
  await setBool(trx150.id, "frequency_input", false);
  await setBool(trx150.id, "usb", true);
  await setOptions(trx150.id, "usb_purpose", ["Charging", "Firmware Update"]);
  await setText(trx150.id, "usb_type", "USB-C");
  await setBool(trx150.id, "audio_in", false);
  await setBool(trx150.id, "audio_out", false);

  // -- Device Management --
  await setBool(trx150.id, "desktop_device_management_software", false);
  await setBool(trx150.id, "web_based_device_management_software", true);
  await setBool(trx150.id, "mobile_app_device_management_software", true);
  await setOptions(trx150.id, "mobile_app_dms", ["iOS", "Android"]);
  await setBool(trx150.id, "ota_commands_sms", false);
  await setBool(trx150.id, "ota_commands_data", true);
  await setBool(trx150.id, "ota_configuration_sms", false);
  await setBool(trx150.id, "ota_configuration_data", true);
  await setBool(trx150.id, "software_development_kit_sdk", false);
  await setBool(trx150.id, "sdk_algorithm", false);
  await setOptions(trx150.id, "firmware_update", "OTA");

  // -- Certification & Compliance --
  await setBool(trx150.id, "ce", true);
  await setBool(trx150.id, "fcc", true);
  await setBool(trx150.id, "rohs", true);
  await setBool(trx150.id, "emark", false);
  await setBool(trx150.id, "anatel", false);
  await setBool(trx150.id, "atex", false);
  await setBool(trx150.id, "ic", false);
  await setBool(trx150.id, "weee", true);
  await setBool(trx150.id, "eac", false);
  await setBool(trx150.id, "tdra", false);
  await setBool(trx150.id, "ip", false);
  await setBool(trx150.id, "ptcrb", true);

  // -- Warranty & Support --
  await setNumber(trx150.id, "warranty-value", 12);
  await setBool(trx150.id, "document-portal", false);

  // -- Country of Origin & Distribution --
  await setOptions(trx150.id, "country-of-origin", "Taiwan");
  await setOptions(trx150.id, "regional-offices", "UK");
  await setBool(trx150.id, "distribution-channels", false);

  console.log("Created TRX150");

  // =========================================================================
  // TRX820 — Industrial heavy-duty tracker with dual SIM, external CAN adaptor, and full RS232/RS485 I/O.
  // =========================================================================
  const trx820 = await prisma.product.create({
    data: {
      title: "TRX820",
      description: "Industrial heavy-duty tracker with dual SIM, external CAN adaptor, and full RS232/RS485 I/O.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(trx820.id, "length", 112);
  await setNumber(trx820.id, "width", 80);
  await setNumber(trx820.id, "height", 33);
  await setNumber(trx820.id, "weight", 215);
  await setOptions(trx820.id, "color", "Black");
  await setOptions(trx820.id, "casing-material", "Metal");
  await setOptions(trx820.id, "mounting-option", ["Screw", "Zip tie"]);
  await setText(trx820.id, "connector-type", "Wired");

  // -- Environmental --
  await setRange(trx820.id, "operating-temperature", -40, 85);
  await setRange(trx820.id, "storage-temperature", -40, 90);
  await setRange(trx820.id, "operating-temperature-without-battery", -40, 105);
  await setRange(trx820.id, "storage-temperature-without-battery", -40, 110);
  await setRange(trx820.id, "humidity", 0, 100);
  await setRange(trx820.id, "ip-rating", 68, 69);

  // -- Electrical --
  await setRange(trx820.id, "input-voltage-range", 9, 32);
  await setBool(trx820.id, "solar-powered", false);
  await setNumber(trx820.id, "power-consumption-active-mode", 230);
  await setNumber(trx820.id, "power-consumption-sleep-mode", 24);
  await setNumber(trx820.id, "power-consumption-deep-sleep-mode", 5);
  await setNumber(trx820.id, "current-draw-active-mode", 62);
  await setNumber(trx820.id, "current-draw-sleep-mode", 8);
  await setBool(trx820.id, "internal-battery", true);
  await setOptions(trx820.id, "internal-battery-type", "Li-Ion");
  await setRange(trx820.id, "internal-battery-size", 900, 1000);
  await setBool(trx820.id, "replaceable-internal-battery", true);
  await setBool(trx820.id, "rechargeable-internal-battery", true);
  await setOptions(trx820.id, "recharge-options", "Wired");
  await setNumber(trx820.id, "battery-shelf-life", 36);
  await setNumber(trx820.id, "battery-service-life", 60);
  await setRange(trx820.id, "battery-charging-temperature", -40, 45);
  await setRange(trx820.id, "battery-discharging-temperature", -20, 60);
  await setNumber(trx820.id, "battery-charging-time", 320);
  await setBool(trx820.id, "power-saving", true);
  await setOptions(trx820.id, "power-saving-options", "Deep Mode");
  await setBool(trx820.id, "power-surge-alert", true);
  await setBool(trx820.id, "surge-protection", true);
  await setBool(trx820.id, "reverse-polarity-protection", true);
  await setBool(trx820.id, "leds", true);
  await setOptions(trx820.id, "led-options", ["Power", "GNSS", "Cellular", "Battery"]);

  // -- Connectivity --
  await setOptions(trx820.id, "connectivity", ["2G", "4G"]);
  await setOptions(trx820.id, "4g-type", "LTE-M");
  await setOptions(trx820.id, "fallback-option", ["3G", "2G"]);
  await setText(trx820.id, "module-name", "Quectel EG915N-EA");
  await setText(trx820.id, "number-of-sim-slots", "2");
  await setOptions(trx820.id, "sim-slot-options", ["Micro", "Nano"]);
  await setBool(trx820.id, "esim", false);
  await setText(trx820.id, "cellular-antenna-type", "External");
  await setOptions(trx820.id, "cellular-antenna-connector-type", ["N-Type", "TNC"]);
  await setBool(trx820.id, "cellular-external-antenna-port", true);
  await setRange(trx820.id, "antenna-gain", 3, 6);
  await setOptions(trx820.id, "gprs-frequency-bands", ["850 MHz", "900 MHz", "1800 MHz", "1900 MHz"]);
  await setBool(trx820.id, "satellite-modem", false);
  await setOptions(trx820.id, "satcomm-prevalence", "Primary Manual Switching");
  await setBool(trx820.id, "wifi", true);
  await setOptions(trx820.id, "wifi-standard", "802.11n");
  await setOptions(trx820.id, "wifi-frequency-bands", "2.4 GHz");
  await setBool(trx820.id, "wifi-data-sending", true);
  await setBool(trx820.id, "wifi-positioning", false);
  await setBool(trx820.id, "wifi-hotspot", true);
  await setBool(trx820.id, "wifi-hub-to-hub", true);
  await setRange(trx820.id, "hotspot-range", 15, 40);
  await setBool(trx820.id, "bluetooth", true);
  await setOptions(trx820.id, "bluetooth-version", "4.2");
  await setOptions(trx820.id, "bluetooth-features", "BLE Beacon Scanning");
  await setBool(trx820.id, "nb-iot", false);
  await setBool(trx820.id, "lorawan", true);
  await setBool(trx820.id, "nfc", false);

  // -- GNSS --
  await setOptions(trx820.id, "gnss-services", ["GPS", "GLONASS", "BeiDou"]);
  await setOptions(trx820.id, "gnss-antenna-type", "Both");
  await setOptions(trx820.id, "gnss-external-antenna-connector-type", ["SMA Male", "FAKRA"]);
  await setNumber(trx820.id, "tracking-channels", 66);
  await setNumber(trx820.id, "acquisition-channels", 88);
  await setNumber(trx820.id, "tracking-sensitivity", -163);
  await setNumber(trx820.id, "acquisition-sensitivity", -147);
  await setNumber(trx820.id, "update-rate", 5);
  await setNumber(trx820.id, "cold-start-time", 28);
  await setNumber(trx820.id, "warm-start-time", 6);
  await setNumber(trx820.id, "hot-start-time", 1);
  await setNumber(trx820.id, "positional-accuracy", 2.0);
  await setNumber(trx820.id, "velocity-accuracy", 0.1);

  // -- Storage --
  await setRange(trx820.id, "internal-memory-size", 8, 16);
  await setNumber(trx820.id, "logging-capacity", 45);
  await setBool(trx820.id, "data-compression", true);
  await setBool(trx820.id, "external-memory-slot", true);
  await setText(trx820.id, "external-memory-slot-quantity", "2");
  await setOptions(trx820.id, "external-memory-card-type", ["SDHC", "SDXC"]);
  await setNumber(trx820.id, "external-memory-size", 64000);
  await setNumber(trx820.id, "maximum-sd-card-size", 256000);

  // -- Input / Output / Interfaces --
  await setRange(trx820.id, "analog_input", 2, 6);
  await setText(trx820.id, "analog_measuring_resolution", "16-bit ADC (65,536 levels)");
  await setRange(trx820.id, "digital_input", 4, 12);
  await setRange(trx820.id, "digital_output", 4, 8);
  await setRange(trx820.id, "relay_output", 2, 4);
  await setBool(trx820.id, "one_wire", true);
  await setBool(trx820.id, "one_wire_power", true);
  await setBool(trx820.id, "configurable_input", true);
  await setRange(trx820.id, "configurable_input_quantity", 4, 8);
  await setBool(trx820.id, "configurable_output", true);
  await setRange(trx820.id, "configurable_output_quantity", 2, 4);
  await setBool(trx820.id, "negative_input_gnd_sense", true);
  await setRange(trx820.id, "negative_input_gnd_sense_quantity", 2, 4);
  await setBool(trx820.id, "can_bus", true);
  await setText(trx820.id, "can_type", "External");
  await setBool(trx820.id, "can_adaptor", true);
  await setText(trx820.id, "can_input", "2");
  await setOptions(trx820.id, "can_protocol", ["J1939", "J1708", "OBD-II"]);
  await setBool(trx820.id, "kline", true);
  await setBool(trx820.id, "rs232", true);
  await setRange(trx820.id, "rs232_quantity", 1, 2);
  await setBool(trx820.id, "rs485", true);
  await setRange(trx820.id, "rs485_quantity", 1, 2);
  await setBool(trx820.id, "uart", true);
  await setBool(trx820.id, "impulse_input", true);
  await setBool(trx820.id, "pulse_input", true);
  await setBool(trx820.id, "frequency_input", true);
  await setBool(trx820.id, "usb", true);
  await setOptions(trx820.id, "usb_purpose", ["Data Transfer", "Firmware Update"]);
  await setText(trx820.id, "usb_type", "USB-A");
  await setBool(trx820.id, "audio_in", false);
  await setBool(trx820.id, "audio_out", false);

  // -- Device Management --
  await setBool(trx820.id, "desktop_device_management_software", true);
  await setBool(trx820.id, "web_based_device_management_software", true);
  await setBool(trx820.id, "mobile_app_device_management_software", true);
  await setOptions(trx820.id, "mobile_app_dms", "Android");
  await setBool(trx820.id, "ota_commands_sms", true);
  await setBool(trx820.id, "ota_commands_data", true);
  await setBool(trx820.id, "ota_configuration_sms", true);
  await setBool(trx820.id, "ota_configuration_data", true);
  await setBool(trx820.id, "software_development_kit_sdk", true);
  await setBool(trx820.id, "sdk_algorithm", false);
  await setOptions(trx820.id, "firmware_update", ["OTA", "USB"]);

  // -- Certification & Compliance --
  await setBool(trx820.id, "ce", true);
  await setBool(trx820.id, "fcc", true);
  await setBool(trx820.id, "rohs", true);
  await setBool(trx820.id, "emark", true);
  await setBool(trx820.id, "anatel", true);
  await setBool(trx820.id, "atex", true);
  await setBool(trx820.id, "ic", true);
  await setBool(trx820.id, "weee", true);
  await setBool(trx820.id, "eac", true);
  await setBool(trx820.id, "tdra", true);
  await setBool(trx820.id, "ip", true);
  await setBool(trx820.id, "ptcrb", true);

  // -- Warranty & Support --
  await setNumber(trx820.id, "warranty-value", 24);
  await setBool(trx820.id, "document-portal", true);

  // -- Country of Origin & Distribution --
  await setOptions(trx820.id, "country-of-origin", ["China", "South Korea"]);
  await setOptions(trx820.id, "regional-offices", ["USA", "UAE"]);
  await setBool(trx820.id, "distribution-channels", true);

  console.log("Created TRX820");

  // =========================================================================
  // TRX075 — Budget entry-level tracker with core GPS tracking and no frills.
  // =========================================================================
  const trx075 = await prisma.product.create({
    data: {
      title: "TRX075",
      description: "Budget entry-level tracker with core GPS tracking and no frills.",
      price: 0.0,
      categoryId: CATEGORY_ID,
      userId: user.id,
    },
  });

  // -- Physical --
  await setNumber(trx075.id, "length", 60);
  await setNumber(trx075.id, "width", 40);
  await setNumber(trx075.id, "height", 16);
  await setNumber(trx075.id, "weight", 45);
  await setOptions(trx075.id, "color", "Black");
  await setOptions(trx075.id, "casing-material", "Plastic");
  await setOptions(trx075.id, "mounting-option", "Zip tie");
  await setText(trx075.id, "connector-type", "OBD Plug");

  // -- Environmental --
  await setRange(trx075.id, "operating-temperature", -10, 55);
  await setRange(trx075.id, "storage-temperature", -10, 60);
  await setRange(trx075.id, "operating-temperature-without-battery", -10, 70);
  await setRange(trx075.id, "storage-temperature-without-battery", -10, 75);
  await setRange(trx075.id, "humidity", 20, 85);
  await setRange(trx075.id, "ip-rating", 42, 42);

  // -- Electrical --
  await setRange(trx075.id, "input-voltage-range", 9, 32);
  await setBool(trx075.id, "solar-powered", false);
  await setNumber(trx075.id, "power-consumption-active-mode", 55);
  await setNumber(trx075.id, "power-consumption-sleep-mode", 5);
  await setNumber(trx075.id, "power-consumption-deep-sleep-mode", 1);
  await setNumber(trx075.id, "current-draw-active-mode", 14);
  await setNumber(trx075.id, "current-draw-sleep-mode", 2);
  await setBool(trx075.id, "internal-battery", false);
  await setBool(trx075.id, "power-saving", false);
  await setBool(trx075.id, "power-surge-alert", false);
  await setBool(trx075.id, "surge-protection", false);
  await setBool(trx075.id, "reverse-polarity-protection", false);
  await setBool(trx075.id, "leds", false);

  // -- Connectivity --
  await setOptions(trx075.id, "connectivity", "2G");
  await setOptions(trx075.id, "fallback-option", "2G");
  await setText(trx075.id, "module-name", "Quectel BG96");
  await setText(trx075.id, "number-of-sim-slots", "1");
  await setOptions(trx075.id, "sim-slot-option", "Standard/Normal");
  await setBool(trx075.id, "esim", false);
  await setText(trx075.id, "cellular-antenna-type", "Internal");
  await setBool(trx075.id, "cellular-external-antenna-port", false);
  await setRange(trx075.id, "antenna-gain", 0, 1);
  await setOptions(trx075.id, "gprs-frequency-bands", ["900 MHz", "1800 MHz"]);
  await setBool(trx075.id, "satellite-modem", false);
  await setOptions(trx075.id, "satcomm-prevalence", "SatComm Only (No GNSS)");
  await setBool(trx075.id, "wifi", false);
  await setBool(trx075.id, "bluetooth", false);
  await setBool(trx075.id, "nb-iot", false);
  await setBool(trx075.id, "lorawan", false);
  await setBool(trx075.id, "nfc", false);

  // -- GNSS --
  await setOptions(trx075.id, "gnss-services", "GPS");
  await setOptions(trx075.id, "gnss-antenna-type", "Internal");
  await setNumber(trx075.id, "tracking-channels", 12);
  await setNumber(trx075.id, "acquisition-channels", 16);
  await setNumber(trx075.id, "tracking-sensitivity", -148);
  await setNumber(trx075.id, "acquisition-sensitivity", -138);
  await setNumber(trx075.id, "update-rate", 1);
  await setNumber(trx075.id, "cold-start-time", 42);
  await setNumber(trx075.id, "warm-start-time", 10);
  await setNumber(trx075.id, "hot-start-time", 2);
  await setNumber(trx075.id, "positional-accuracy", 5.0);
  await setNumber(trx075.id, "velocity-accuracy", 0.5);

  // -- Storage --
  await setRange(trx075.id, "internal-memory-size", 1, 4);
  await setNumber(trx075.id, "logging-capacity", 8);
  await setBool(trx075.id, "data-compression", false);
  await setBool(trx075.id, "external-memory-slot", false);

  // -- Input / Output / Interfaces --
  await setRange(trx075.id, "analog_input", 0, 1);
  await setText(trx075.id, "analog_measuring_resolution", "24-bit ADC (16.7 million levels)");
  await setRange(trx075.id, "digital_input", 0, 1);
  await setRange(trx075.id, "digital_output", 0, 1);
  await setRange(trx075.id, "relay_output", 0, 0);
  await setBool(trx075.id, "one_wire", false);
  await setBool(trx075.id, "one_wire_power", false);
  await setBool(trx075.id, "configurable_input", false);
  await setBool(trx075.id, "configurable_output", false);
  await setBool(trx075.id, "negative_input_gnd_sense", false);
  await setBool(trx075.id, "can_bus", false);
  await setBool(trx075.id, "kline", false);
  await setBool(trx075.id, "rs232", false);
  await setBool(trx075.id, "rs485", false);
  await setBool(trx075.id, "uart", false);
  await setBool(trx075.id, "impulse_input", false);
  await setBool(trx075.id, "pulse_input", false);
  await setBool(trx075.id, "frequency_input", false);
  await setBool(trx075.id, "usb", false);
  await setBool(trx075.id, "audio_in", false);
  await setBool(trx075.id, "audio_out", false);

  // -- Device Management --
  await setBool(trx075.id, "desktop_device_management_software", false);
  await setBool(trx075.id, "web_based_device_management_software", true);
  await setBool(trx075.id, "mobile_app_device_management_software", false);
  await setBool(trx075.id, "ota_commands_sms", true);
  await setBool(trx075.id, "ota_commands_data", false);
  await setBool(trx075.id, "ota_configuration_sms", true);
  await setBool(trx075.id, "ota_configuration_data", false);
  await setBool(trx075.id, "software_development_kit_sdk", false);
  await setBool(trx075.id, "sdk_algorithm", false);
  await setOptions(trx075.id, "firmware_update", "OTA");

  // -- Certification & Compliance --
  await setBool(trx075.id, "ce", true);
  await setBool(trx075.id, "fcc", false);
  await setBool(trx075.id, "rohs", true);
  await setBool(trx075.id, "emark", false);
  await setBool(trx075.id, "anatel", false);
  await setBool(trx075.id, "atex", false);
  await setBool(trx075.id, "ic", false);
  await setBool(trx075.id, "weee", true);
  await setBool(trx075.id, "eac", false);
  await setBool(trx075.id, "tdra", false);
  await setBool(trx075.id, "ip", false);
  await setBool(trx075.id, "ptcrb", false);

  // -- Warranty & Support --
  await setNumber(trx075.id, "warranty-value", 6);
  await setBool(trx075.id, "document-portal", false);

  // -- Country of Origin & Distribution --
  await setOptions(trx075.id, "country-of-origin", "China");
  await setOptions(trx075.id, "regional-offices", "USA");
  await setBool(trx075.id, "distribution-channels", false);

  console.log("Created TRX075");
}