import { CustomMessage } from '@/lib/ai';

type WeatherLoadingCardProps = {
    city: string;
};

const WeatherLoadingCard = ({ city }: WeatherLoadingCardProps) => {
    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4 shadow-lg">
            <div className="flex items-center space-x-4">
                <div className="text-4xl animate-pulse">
                    🌤️
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            📍 {city}
                        </h3>
                        <div className="text-2xl font-bold text-gray-400">
                            --°C
                        </div>
                    </div>
                    <div className="h-5 bg-gray-300 rounded animate-pulse mt-1"></div>
                </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200/50">
                <div className="flex items-center text-xs text-gray-500">
                    <div className="inline-block w-2 h-2 bg-orange-400 rounded-full mr-2 animate-pulse"></div>
                    Fetching weather data...
                </div>
            </div>
        </div>
    );
};

type WeatherCardProps = {
    city: string;
    temperature: number;
    description: string;
};

const WeatherCard = ({ city, temperature, description }: WeatherCardProps) => {
    // Get weather icon based on description
    const getWeatherIcon = (desc: string) => {
        const lowercaseDesc = desc.toLowerCase();
        if (lowercaseDesc.includes('sunny') || lowercaseDesc.includes('clear')) return '☀️';
        if (lowercaseDesc.includes('cloud')) return '☁️';
        if (lowercaseDesc.includes('rain')) return '🌧️';
        if (lowercaseDesc.includes('snow')) return '❄️';
        if (lowercaseDesc.includes('storm')) return '⛈️';
        if (lowercaseDesc.includes('fog') || lowercaseDesc.includes('mist')) return '🌫️';
        return '🌤️'; // default
    };

    // Get temperature color based on value
    const getTempColor = (temp: number) => {
        if (temp < 0) return 'text-blue-600';
        if (temp < 10) return 'text-blue-500';
        if (temp < 20) return 'text-green-500';
        if (temp < 30) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-xl p-4 shadow-lg">
            <div className="flex items-center space-x-4">
                <div className="text-4xl">
                    {getWeatherIcon(description)}
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            📍 {city}
                        </h3>
                        <div className={`text-2xl font-bold ${getTempColor(temperature)}`}>
                            {temperature}°C
                        </div>
                    </div>
                    <div className="text-gray-600 text-sm mt-1 capitalize leading-5 min-h-[20px]">
                        {description}
                    </div>
                </div>
            </div>
            <div className="mt-3 pt-3 border-t border-blue-200/50">
                <div className="flex items-center text-xs text-gray-500">
                    <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    Weather data retrieved successfully
                </div>
            </div>
        </div>
    );
};

// Extract the weather tool part type from CustomMessage
type WeatherToolPart = Extract<CustomMessage['parts'][number], { type: 'tool-getWeather' }>;

type WeatherToolCardProps = {
    part: WeatherToolPart;
};

export const WeatherToolCard = ({ part }: WeatherToolCardProps) => {
    // Handle loading states (input-streaming or input-available)
    if (part.state === 'input-streaming' || part.state === 'input-available') {
        const city = part.input?.city || 'Unknown Location';
        return <WeatherLoadingCard city={city} />;
    }

    // Handle successful output
    if (part.state === 'output-available' && part.output) {
        const city = part.input?.city || 'Unknown Location';
        return (
            <WeatherCard
                city={city}
                temperature={part.output.temperature}
                description={part.output.description}
            />
        );
    }

    if (part.state === 'output-error') {
        const city = part.input?.city || 'Unknown Location';
        return (
            <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-4 shadow-lg">
                <div className="flex items-center space-x-4">
                    <div className="text-4xl">❌</div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            📍 {city}
                        </h3>
                        <div className="text-red-600 text-sm mt-1 leading-5 min-h-[20px]">
                            Failed to fetch weather data
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}; 