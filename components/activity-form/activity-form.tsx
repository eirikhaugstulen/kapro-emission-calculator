"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectLabel, SelectGroup } from "@/components/ui/select"
import { ArrowUp, Plus, X } from "lucide-react"
import { DOMAIN_LABELS, UNITS_BY_DOMAIN, rawMeasurementSchema } from "@/lib/measurements"

const formSchema = z.object({
    activity: z.string().min(1, {
        message: "Vennligst skriv inn en aktivitet",
    }),
    amount: z.string().refine((val) => {
        const trimmedVal = val.trim();
        const num = Number(trimmedVal.replace(/\s/g, ''));
        if (isNaN(num)) {
            return false;
        }
        return num > 0;
    }, {
        message: "Mengde må være et positivt tall",
    }),
    unit: z.string().min(1, {
        message: "Vennligst velg en enhet",
    }),
})

export type FormValues = z.infer<typeof formSchema>

export type ActivitySubmission = {
    activity: string
    measurement: z.infer<typeof rawMeasurementSchema>
}

type ActivityFormProps = {
    onSubmit: (data: ActivitySubmission) => void
}

export function ActivityForm({ onSubmit }: ActivityFormProps) {
    const [isExpanded, setIsExpanded] = useState(true)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            activity: "",
            amount: "",
            unit: "",
        },
    })

    const handleSubmit = (data: FormValues) => {
        const [domain, unit] = data.unit.split(':');
        const submission: ActivitySubmission = {
            activity: data.activity,
            measurement: {
                amount: Number(data.amount.trim().replace(/\s/g, '')),
                unit,
                domain,
            }
        };
        onSubmit(submission);
        form.reset();
        setIsExpanded(false);
    }

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded)
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 w-full z-10">
            <div className="max-w-xl mx-auto p-4">
                {!isExpanded && (
                    <div className="flex justify-center">
                        <Button
                            onClick={toggleExpanded}
                            size="lg"
                            className="rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 ease-in-out transform hover:scale-105"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Ny aktivitet
                        </Button>
                    </div>
                )}

                {isExpanded && (
                    <Card className="shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
                        <CardContent className="px-6 py-2">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Legg til aktivitet</h3>
                                <Button
                                    onClick={toggleExpanded}
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleSubmit)} className="grid md:grid-cols-2 gap-x-2 gap-y-4 items-start">
                                    <FormField
                                        control={form.control}
                                        name="activity"
                                        render={({ field }) => (
                                            <FormItem className="md:col-span-2">
                                                <FormLabel>Aktivitet</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="For eksempel, 'Elektrisitet' eller 'Plantevernmiddel'"
                                                        className="min-h-[80px] resize-y"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="amount"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Mengde</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        placeholder="1300"
                                                        {...field}
                                                        onChange={(e) => field.onChange(e.target.value)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="unit"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Enhet</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Velg enhet" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {Object.entries(UNITS_BY_DOMAIN).map(([domain, units]) => (
                                                            <SelectGroup key={domain}>
                                                                <SelectLabel>{DOMAIN_LABELS[domain as keyof typeof DOMAIN_LABELS]}</SelectLabel>
                                                                {Object.entries(units).map(([key, value]) => (
                                                                    <SelectItem key={key} value={`${domain}:${value}`}>
                                                                        {key}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectGroup>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="md:col-span-2 flex justify-end">
                                        <Button type="submit" className="w-full md:w-auto mt-2">
                                            <ArrowUp className="h-4 w-4" /> Regn ut
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
