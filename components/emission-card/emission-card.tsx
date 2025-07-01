import { CustomMessage } from '@/lib/ai';

type EmissionLoadingCardProps = {
    activity_id?: string;
};

const EmissionLoadingCard = ({ activity_id }: EmissionLoadingCardProps) => {
    return (
        <div className="bg-gradient-to-br from-blue-50 to-sky-100 border border-blue-200 rounded-xl p-4 shadow-lg">
            <div className="flex items-center space-x-4">
                <div className="text-4xl animate-pulse">
                    🧮
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            💨 Emission Calculation
                        </h3>
                        <div className="text-2xl font-bold text-gray-400">
                            --
                        </div>
                    </div>
                    <div className="text-gray-600 text-sm mt-1 leading-5">
                        Activity ID: {activity_id || 'Unknown'}
                    </div>
                    <div className="h-3 bg-gray-300 rounded animate-pulse mt-2"></div>
                </div>
            </div>
            <div className="mt-3 pt-3 border-t border-blue-200/50">
                <div className="flex items-center text-xs text-gray-500">
                    <div className="inline-block w-2 h-2 bg-orange-400 rounded-full mr-2 animate-pulse"></div>
                    Calculating CO₂ emissions...
                </div>
            </div>
        </div>
    );
};

type EmissionCardProps = {
    activity_id?: string;
    result: {
        co2e: number;
        unit: string;
        activity_name: string;
        activity_id: string;
    };
};

const EmissionCard = ({ result }: EmissionCardProps) => {
    return (
        <div className="bg-gradient-to-br from-blue-50 to-sky-100 border border-blue-200 rounded-xl p-4 shadow-lg">
            <div className="flex items-center space-x-4">
                <div className="text-4xl">
                    🌤️
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            💨 Resultat
                        </h3>
                        <div className="text-xl font-bold text-blue-600">
                            {result.co2e?.toLocaleString()} {result.unit}
                        </div>
                    </div>
                    <div className="text-gray-600 text-sm mt-1 leading-5">
                        Activity: {result.activity_name}
                    </div>
                    <div className="text-gray-500 text-xs mt-1 font-mono">
                        ID: {result.activity_id}
                    </div>
                </div>
            </div>
            <div className="mt-3 pt-3 border-t border-blue-200/50">
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                        <div className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                        Calculation complete
                    </div>
                    <div className="text-xs text-gray-400">
                        Raw: {result.co2e.toFixed(6)} {result.unit}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Extract the calculateEmission tool part type from CustomMessage
type CalculateEmissionToolPart = Extract<CustomMessage['parts'][number], { type: 'tool-calculateEmission' }>;

type Props = {
    part: CalculateEmissionToolPart;
};

export const CalculateEmissionToolCard = ({ part }: Props) => {
    // Handle loading states (input-streaming or input-available)
    if (part.state === 'input-streaming' || part.state === 'input-available') {
        return (
            <EmissionLoadingCard
                activity_id={part.input?.activity_id}
            />
        );
    }

    // Handle successful output
    if (part.state === 'output-available') {
        return (
            <EmissionCard
                activity_id={part.input?.activity_id}
                result={part.output}
            />
        );
    }

    // Handle error state
    if (part.state === 'output-error') {
        const displayActivityId = part.input?.activity_id || 'Unknown';

        return (
            <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-4 shadow-lg">
                <div className="flex items-center space-x-4">
                    <div className="text-4xl">❌</div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            💨 Emission Calculation
                        </h3>
                        <div className="text-gray-600 text-sm mt-1 leading-5">
                            Activity ID: {displayActivityId}
                        </div>
                        <div className="text-red-600 text-sm mt-1 leading-5 min-h-[20px]">
                            Failed to calculate emissions
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}; 