"use client"
import { useQuery } from "@tanstack/react-query"
import { ActivitySubmission } from "@/components/activity-form/activity-form"

type Props = {
    submittedActivity: ActivitySubmission | null
}

export const Autopilot = ({ submittedActivity }: Props) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["autopilot", submittedActivity],
        queryFn: async (): Promise<any> => {
            const res = await fetch(`/api/suggest`, {
                method: "POST",
                body: JSON.stringify(submittedActivity),
                headers: {
                    'cache-control': 'no-store'
                }
            })

            return res.json()
        },
        enabled: !!submittedActivity?.activity && !!submittedActivity?.measurement,
    })

    if (isLoading) {
        return (
            <div className="bg-white border rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-center py-8">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <div className="text-gray-600 font-medium">Beregner utslipp...</div>
                        <div className="text-sm text-gray-500">Dette kan ta noen sekunder</div>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-white border rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-center py-8">
                    <div className="flex flex-col items-center space-y-4 text-center">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <div className="text-red-800 font-medium">Noe gikk galt</div>
                        <div className="text-sm text-red-600">Kunne ikke beregne utslipp. Prøv igjen.</div>
                    </div>
                </div>
            </div>
        )
    }

    if (data?.error) {
        return (
            <div className="bg-white border rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-center py-8">
                    <div className="flex flex-col items-center space-y-4 text-center">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="text-orange-800 font-medium">Kunne ikke finne utslippsfaktor</div>
                        <div className="text-sm text-orange-600 max-w-md">
                            {data.error_message || "Fant ikke passende utslippsfaktor for denne aktiviteten. Prøv å være mer spesifikk i beskrivelsen."}
                        </div>
                        {data.error_code && (
                            <div className="text-xs text-orange-500 font-mono">
                                Feilkode: {data.error_code}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    if (!data || !data.estimate) return null

    const { estimate } = data

    return (
        <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resultat</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">Total CO₂ Equivalent</h4>
                    <div className="text-2xl font-bold text-green-900">
                        {estimate.co2e?.toLocaleString()} {estimate.co2e_unit}
                    </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Emission Factor</h4>
                    <div className="text-sm text-blue-900">
                        <div className="font-semibold mb-1">{estimate.emission_factor?.name}</div>
                        <div className="text-xs text-blue-600 font-mono break-words">
                            ID: {estimate.emission_factor?.activity_id}
                        </div>
                    </div>
                </div>
            </div>

            {data.calculation_details && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Confidence: <span className="font-medium capitalize">{data.calculation_details.confidence}</span></span>
                        <span>Similarity Score: <span className="font-medium">{(data.calculation_details.similarity_score * 100).toFixed(0)}%</span></span>
                    </div>
                </div>
            )}
        </div>
    )
}