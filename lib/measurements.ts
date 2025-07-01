import { z } from "zod"

export const DOMAINS = {
    "ENERGY": "ENERGY",
    "VOLUME": "VOLUME",
    "MONEY": "MONEY",
    "NUMBER": "NUMBER",
} as const

export const rawMeasurementSchema = z.object({
    amount: z.number(),
    unit: z.string(),
    domain: z.string(),
})

export const DOMAIN_LABELS = {
    [DOMAINS.ENERGY]: "Energi",
    [DOMAINS.VOLUME]: "Volum",
    [DOMAINS.MONEY]: "Valuta",
    [DOMAINS.NUMBER]: "Antall",
} as const

export const UNITS_BY_DOMAIN = {
    [DOMAINS.ENERGY]: {
        "kWh": "kWh",
        "MWh": "MWh",
    },
    [DOMAINS.VOLUME]: {
        "m3": "m³",
        "L": "L",
    },
    [DOMAINS.MONEY]: {
        "NOK": "nok",
        "EUR": "eur",
        "USD": "dollar",
    },
    [DOMAINS.NUMBER]: {
        "NUMBER": "Antall",
    },
} as const

export const measurementSchema = z.union([
    z.object({
        energy: z.number(),
        energy_unit: z.enum(["kWh", "MWh"]),
    }),
    z.object({
        volume: z.number(),
        volume_unit: z.enum(["m3", "L"]),
    }),
    z.object({
        money: z.number(),
        money_unit: z.enum(["nok", "eur", "usd"]),
    }),
    z.object({
        number: z.number(),
    }),
])

export type Measurement = z.infer<typeof measurementSchema>

export const convertRawMeasurement = (rawMeasurement: z.infer<typeof rawMeasurementSchema>): Measurement => {
    const { amount, unit, domain } = rawMeasurement;

    switch (domain) {
        case DOMAINS.ENERGY:
            return { energy: amount, energy_unit: unit as "kWh" | "MWh" }
        case DOMAINS.VOLUME:
            return { volume: amount, volume_unit: unit as "m3" | "L" }
        case DOMAINS.MONEY:
            return { money: amount, money_unit: unit as "nok" | "eur" | "usd" }
        case DOMAINS.NUMBER:
            return { number: amount }
        default:
            return { number: amount }
    }
} 