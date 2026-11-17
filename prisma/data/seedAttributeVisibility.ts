import { PrismaClient } from "@prisma/client";

export async function seedAttributeVisibility(prisma: PrismaClient) {
  const get = async (slug: string) =>
    prisma.attribute.findUnique({
      where: { slug },
    });

  const [
    internalBattery,
    batteryType,
    batterySize,
    replaceableBattery,
    rechargeableBattery,
    rechargeOptions,

    powerSaving,
    powerSavingOptions,

    leds,
    ledOptions,

    // Cellular
    connectivity,
    fourGType,
    numberOfSimSlots,
    simSlotOption,
    simSlotOptions,
    cellularAntennaType,
    cellularAntennaConnectorType,

    // Satellite Communication
    satelliteModem,
    satelliteService,

    // WiFi
    wifi,
    wifiStandard,
    wifiFrequencyBands,
    wifiDataSending,
    wifiPositioning,
    wifiHotspot,
    wifiHubToHub,
    hotspotRange,

    // Bluetooth
    bluetooth,
    bluetoothVersion,
    bluetoothFeatures,

    // GNSS
    gnssAntennaType,
    gnssExternalAntennaConnectorType,

    // Storage
    externalMemorySlot,
    externalMemorySlotQuantity,
    externalMemoryCardType,
    externalMemoryCardTypes,
    externalMemorySize,
    maximumSdCardSize,

    // Input / Output / Interfaces
    configurableInput,
    configurableInputQuantity,
    configurableOutput,
    configurableOutputQuantity,
    negativeInputGndSense,
    negativeInputGndSenseQuantity,

    canBus,
    canType,
    canAdaptor,
    canInput,
    canProtocol,

    rs232,
    rs232Quantity,
    rs485,
    rs485Quantity,

    usb,
    usbPurpose,
    usbType,

    // Device Management
    mobileAppDeviceManagementSoftware,
    mobileAppDms,
  ] = await Promise.all([
    get("internal-battery"),
    get("internal-battery-type"),
    get("internal-battery-size"),
    get("replaceable-internal-battery"),
    get("rechargeable-internal-battery"),
    get("recharge-options"),

    get("power-saving"),
    get("power-saving-options"),

    get("leds"),
    get("led-options"),

    get("connectivity"),
    get("4g-type"),
    get("number-of-sim-slots"),
    get("sim-slot-option"),
    get("sim-slot-options"),
    get("cellular-antenna-type"),
    get("cellular-antenna-connector-type"),

    get("satellite-modem"),
    get("satellite-service"),

    get("wifi"),
    get("wifi-standard"),
    get("wifi-frequency-bands"),
    get("wifi-data-sending"),
    get("wifi-positioning"),
    get("wifi-hotspot"),
    get("wifi-hub-to-hub"),
    get("hotspot-range"),

    get("bluetooth"),
    get("bluetooth-version"),
    get("bluetooth-features"),

    get("gnss-antenna-type"),
    get("gnss-external-antenna-connector-type"),

    get("external-memory-slot"),
    get("external-memory-slot-quantity"),
    get("external-memory-card-type"),
    get("external-memory-card-types"),
    get("external-memory-size"),
    get("maximum-sd-card-size"),

    // Input / Output / Interfaces
    get("configurable_input"),
    get("configurable_input_quantity"),
    get("configurable_output"),
    get("configurable_output_quantity"),
    get("negative_input_gnd_sense"),
    get("negative_input_gnd_sense_quantity"),

    get("can_bus"),
    get("can_type"),
    get("can_adaptor"),
    get("can_input"),
    get("can_protocol"),

    get("rs232"),
    get("rs232_quantity"),
    get("rs485"),
    get("rs485_quantity"),

    get("usb"),
    get("usb_purpose"),
    get("usb_type"),

    // Device Management
    get("mobile_app_device_management_software"),
    get("mobile_app_dms"),
  ]);

  const required = [
    internalBattery,
    batteryType,
    batterySize,
    replaceableBattery,
    rechargeableBattery,
    rechargeOptions,
    powerSaving,
    powerSavingOptions,
    leds,
    ledOptions,
    connectivity,
    fourGType,
    numberOfSimSlots,
    simSlotOption,
    simSlotOptions,
    cellularAntennaType,
    cellularAntennaConnectorType,
    satelliteModem,
    satelliteService,
    wifi,
    wifiStandard,
    wifiFrequencyBands,
    wifiDataSending,
    wifiPositioning,
    wifiHotspot,
    wifiHubToHub,
    hotspotRange,
    bluetooth,
    bluetoothVersion,
    bluetoothFeatures,
    gnssAntennaType,
    gnssExternalAntennaConnectorType,
    externalMemorySlot,
    externalMemorySlotQuantity,
    externalMemoryCardType,
    externalMemoryCardTypes,
    externalMemorySize,
    maximumSdCardSize,

    configurableInput,
    configurableInputQuantity,
    configurableOutput,
    configurableOutputQuantity,
    negativeInputGndSense,
    negativeInputGndSenseQuantity,

    canBus,
    canType,
    canAdaptor,
    canInput,
    canProtocol,

    rs232,
    rs232Quantity,
    rs485,
    rs485Quantity,

    usb,
    usbPurpose,
    usbType,

    mobileAppDeviceManagementSoftware,
    mobileAppDms,
  ];

  if (required.some((a) => !a)) {
    throw new Error("Required attributes not found");
  }

  await prisma.attributeVisibility.createMany({
    data: [
      // =========================
      // Internal Battery = Yes
      // =========================
      {
        attributeId: batteryType!.id,
        dependsOnAttributeId: internalBattery!.id,
        operator: "equals",
        value: "true",
      },
      {
        attributeId: batterySize!.id,
        dependsOnAttributeId: internalBattery!.id,
        operator: "equals",
        value: "true",
      },
      {
        attributeId: replaceableBattery!.id,
        dependsOnAttributeId: internalBattery!.id,
        operator: "equals",
        value: "true",
      },
      {
        attributeId: rechargeableBattery!.id,
        dependsOnAttributeId: internalBattery!.id,
        operator: "equals",
        value: "true",
      },

      // =========================
      // Rechargeable Internal Battery = Yes
      // =========================
      {
        attributeId: rechargeOptions!.id,
        dependsOnAttributeId: rechargeableBattery!.id,
        operator: "equals",
        value: "true",
      },

      // =========================
      // Power Saving = Yes
      // =========================
      {
        attributeId: powerSavingOptions!.id,
        dependsOnAttributeId: powerSaving!.id,
        operator: "equals",
        value: "true",
      },

      // =========================
      // LEDs = Yes
      // =========================
      {
        attributeId: ledOptions!.id,
        dependsOnAttributeId: leds!.id,
        operator: "equals",
        value: "true",
      },

      // =========================
      // Connectivity = 4G
      // =========================
      {
        attributeId: fourGType!.id,
        dependsOnAttributeId: connectivity!.id,
        operator: "equals",
        value: "4G",
      },

      // =========================
      // Number of SIM Slots = 1 or 2
      // =========================
      {
        attributeId: simSlotOption!.id,
        dependsOnAttributeId: numberOfSimSlots!.id,
        operator: "equals",
        value: "1",
      },
      {
        attributeId: simSlotOptions!.id,
        dependsOnAttributeId: numberOfSimSlots!.id,
        operator: "equals",
        value: "2",
      },

      // =========================
      // Cellular Antenna Type = External
      // =========================
      {
        attributeId: cellularAntennaConnectorType!.id,
        dependsOnAttributeId: cellularAntennaType!.id,
        operator: "equals",
        value: "External",
      },

      {
        attributeId: cellularAntennaConnectorType!.id,
        dependsOnAttributeId: cellularAntennaType!.id,
        operator: "equals",
        value: "Both",
      },

      // =========================
      // Satellite Modem = Yes
      // =========================
      {
        attributeId: satelliteService!.id,
        dependsOnAttributeId: satelliteModem!.id,
        operator: "equals",
        value: "true",
      },

      // =========================
      // WiFi = Yes
      // =========================
      {
        attributeId: wifiStandard!.id,
        dependsOnAttributeId: wifi!.id,
        operator: "equals",
        value: "true",
      },
      {
        attributeId: wifiFrequencyBands!.id,
        dependsOnAttributeId: wifi!.id,
        operator: "equals",
        value: "true",
      },
      {
        attributeId: wifiDataSending!.id,
        dependsOnAttributeId: wifi!.id,
        operator: "equals",
        value: "true",
      },
      {
        attributeId: wifiPositioning!.id,
        dependsOnAttributeId: wifi!.id,
        operator: "equals",
        value: "true",
      },
      {
        attributeId: wifiHotspot!.id,
        dependsOnAttributeId: wifi!.id,
        operator: "equals",
        value: "true",
      },
      {
        attributeId: wifiHubToHub!.id,
        dependsOnAttributeId: wifi!.id,
        operator: "equals",
        value: "true",
      },

      // =========================
      // WiFi Hotspot = Yes
      // =========================
      {
        attributeId: hotspotRange!.id,
        dependsOnAttributeId: wifiHotspot!.id,
        operator: "equals",
        value: "true",
      },

      // =========================
      // Bluetooth = Yes
      // =========================
      {
        attributeId: bluetoothVersion!.id,
        dependsOnAttributeId: bluetooth!.id,
        operator: "equals",
        value: "true",
      },
      {
        attributeId: bluetoothFeatures!.id,
        dependsOnAttributeId: bluetooth!.id,
        operator: "equals",
        value: "true",
      },

      // =========================
      // GNSS Antenna Type = External or Both
      // =========================
      {
        attributeId: gnssExternalAntennaConnectorType!.id,
        dependsOnAttributeId: gnssAntennaType!.id,
        operator: "equals",
        value: "External",
      },
      {
        attributeId: gnssExternalAntennaConnectorType!.id,
        dependsOnAttributeId: gnssAntennaType!.id,
        operator: "equals",
        value: "Both",
      },

      // =========================
      // External Memory Slot = Yes
      // =========================
      {
        attributeId: externalMemorySlotQuantity!.id,
        dependsOnAttributeId: externalMemorySlot!.id,
        operator: "equals",
        value: "true",
      },
      // =========================
      // External Memory Slot Quantity = 1 or 2
      // =========================
      {
        attributeId: externalMemoryCardType!.id,
        dependsOnAttributeId: externalMemorySlotQuantity!.id,
        operator: "equals",
        value: "1",
      },
      {
        attributeId: externalMemoryCardTypes!.id,
        dependsOnAttributeId: externalMemorySlotQuantity!.id,
        operator: "equals",
        value: "2",
      },
      {
        attributeId: externalMemorySize!.id,
        dependsOnAttributeId: externalMemorySlot!.id,
        operator: "equals",
        value: "true",
      },
      {
        attributeId: maximumSdCardSize!.id,
        dependsOnAttributeId: externalMemorySlot!.id,
        operator: "equals",
        value: "true",
      },

      // =========================
      // Configurable Input = Yes
      // =========================
      {
        attributeId: configurableInputQuantity!.id,
        dependsOnAttributeId: configurableInput!.id,
        operator: "equals",
        value: "true",
      },

      // =========================
      // Configurable Output = Yes
      // =========================
      {
        attributeId: configurableOutputQuantity!.id,
        dependsOnAttributeId: configurableOutput!.id,
        operator: "equals",
        value: "true",
      },

      // =========================
      // Negative Input / GND Sense = Yes
      // =========================
      {
        attributeId: negativeInputGndSenseQuantity!.id,
        dependsOnAttributeId: negativeInputGndSense!.id,
        operator: "equals",
        value: "true",
      },

      // =========================
      // Can-Bus = Yes
      // =========================
      {
        attributeId: canType!.id,
        dependsOnAttributeId: canBus!.id,
        operator: "equals",
        value: "true",
      },
      {
        attributeId: canInput!.id,
        dependsOnAttributeId: canBus!.id,
        operator: "equals",
        value: "true",
      },
      {
        attributeId: canProtocol!.id,
        dependsOnAttributeId: canBus!.id,
        operator: "equals",
        value: "true",
      },

      // =========================
      // Can Type = External
      // Can Adaptor becomes active
      // =========================
      {
        attributeId: canAdaptor!.id,
        dependsOnAttributeId: canType!.id,
        operator: "equals",
        value: "External",
      },

      // =========================
      // RS232 = Yes
      // =========================
      {
        attributeId: rs232Quantity!.id,
        dependsOnAttributeId: rs232!.id,
        operator: "equals",
        value: "true",
      },

      // =========================
      // RS485 = Yes
      // =========================
      {
        attributeId: rs485Quantity!.id,
        dependsOnAttributeId: rs485!.id,
        operator: "equals",
        value: "true",
      },

      // =========================
      // USB = Yes
      // =========================
      {
        attributeId: usbPurpose!.id,
        dependsOnAttributeId: usb!.id,
        operator: "equals",
        value: "true",
      },
      {
        attributeId: usbType!.id,
        dependsOnAttributeId: usb!.id,
        operator: "equals",
        value: "true",
      },

      // =========================
      // Mobile App Device Management Software = Yes
      // =========================
      {
        attributeId: mobileAppDms!.id,
        dependsOnAttributeId: mobileAppDeviceManagementSoftware!.id,
        operator: "equals",
        value: "true",
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Attribute visibility seeded");
}
