import { CustomMessage } from '@/lib/ai';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

type ActivityLoadingCardProps = {
    query?: string;
    category?: string;
};

const ActivityLoadingCard = ({ query, category }: ActivityLoadingCardProps) => {
    const getDisplayQuery = () => {
        const parts = [];
        if (query) parts.push(`Query: "${query}"`);
        if (category) parts.push(`Category: "${category}"`);
        return parts.length > 0 ? parts.join(', ') : 'activities';
    };

    return (
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 rounded-xl p-4 shadow-lg">
            <div className="flex items-center space-x-4">
                <div className="text-4xl animate-pulse">
                    🔍
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            🌱 Activity Search
                        </h3>
                        <div className="text-2xl font-bold text-gray-400">
                            --
                        </div>
                    </div>
                    <div className="text-gray-600 text-sm mt-1 leading-5">
                        Searching for: {getDisplayQuery()}
                    </div>
                    <div className="h-3 bg-gray-300 rounded animate-pulse mt-2"></div>
                </div>
            </div>
            <div className="mt-3 pt-3 border-t border-green-200/50">
                <div className="flex items-center text-xs text-gray-500">
                    <div className="inline-block w-2 h-2 bg-orange-400 rounded-full mr-2 animate-pulse"></div>
                    Searching emission activities...
                </div>
            </div>
        </div>
    );
};

type ActivityCardProps = {
    query?: string;
    category?: string;
    results: Array<{
        activity_id: string;
        name: string;
        category: string;
        sector: string;
        description: string;
    }>;
};

const ActivityCard = ({ query, category, results }: ActivityCardProps) => {
    const getDisplayQuery = () => {
        const parts = [];
        if (query) parts.push(`Query: "${query}"`);
        if (category) parts.push(`Category: "${category}"`);
        return parts.length > 0 ? parts.join(', ') : 'activities';
    };

    const [isExpanded, setIsExpanded] = useState(false);

    // Get icon based on category
    const getCategoryIcon = (cat: string) => {
        const lowercaseCategory = cat?.toLowerCase() || '';
        if (lowercaseCategory.includes('energy')) return '⚡';
        if (lowercaseCategory.includes('transport')) return '🚗';
        if (lowercaseCategory.includes('agriculture')) return '🌾';
        if (lowercaseCategory.includes('waste')) return '♻️';
        if (lowercaseCategory.includes('water')) return '💧';
        if (lowercaseCategory.includes('material')) return '🏗️';
        return '🌍'; // default
    };

    return (
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 rounded-xl px-4 py-2 shadow">
            <div className="flex items-center space-x-4">
                <div className="text-4xl">
                    🌱
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-4 justify-between">
                        <h3 className="font-semibold text-gray-800 flex items-center">
                            🔍 Search
                        </h3>
                        <div className="flex items-center space-x-2">
                            <div className="text-sm font-bold text-green-600">
                                {results.length} result{results.length !== 1 ? 's' : ''}
                            </div>
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="p-1 hover:bg-green-200/50 rounded transition-colors"
                                aria-label={isExpanded ? 'Collapse results' : 'Expand results'}
                            >
                                <ChevronDown
                                    className={`w-4 h-4 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className="space-y-3">
                    <div className="text-gray-600 text-sm leading-5 px-2">
                        {getDisplayQuery()}
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {results.map((result, index) => (
                            <div
                                key={`${index}-${result.activity_id}`}
                                className="bg-white/80 border border-green-200/50 rounded-lg p-3 hover:bg-white/90 transition-colors"
                            >
                                <div className="flex items-start space-x-3">
                                    <div className="text-xl flex-shrink-0">
                                        {getCategoryIcon(result.category)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-gray-800 text-sm">
                                            {result.name}
                                        </h4>
                                        <div className="text-xs text-gray-500 mt-1">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700 mr-2">
                                                {result.category}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-400 font-mono mt-1 truncate">
                                            ID: {result.activity_id}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// Extract the findActivityId tool part type from CustomMessage
type FindActivityIdToolPart = Extract<CustomMessage['parts'][number], { type: 'tool-findActivityId' }>;

type Props = {
    part: FindActivityIdToolPart;
};

export const FindActivityIdToolCard = ({ part }: Props) => {
    // Handle loading states (input-streaming or input-available)
    if (part.state === 'input-streaming' || part.state === 'input-available') {
        return (
            <ActivityLoadingCard
                query={part.input?.query}
                category={part.input?.category}
            />
        );
    }

    // Handle successful output
    if (part.state === 'output-available') {
        return (
            <ActivityCard
                query={part.input?.query}
                category={part.input?.category}
                results={part.output.results}
            />
        );
    }

    // Handle error state
    if (part.state === 'output-error') {
        const getDisplayQuery = () => {
            const parts = [];
            if (part.input?.query) parts.push(`Query: "${part.input.query}"`);
            if (part.input?.category) parts.push(`Category: "${part.input.category}"`);
            return parts.length > 0 ? parts.join(', ') : 'activities';
        };

        return (
            <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-4 shadow-lg">
                <div className="flex items-center space-x-4">
                    <div className="text-4xl">❌</div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            🔍 Activity Search
                        </h3>
                        <div className="text-gray-600 text-sm mt-1 leading-5">
                            Search: {getDisplayQuery()}
                        </div>
                        <div className="text-red-600 text-sm mt-1 leading-5 min-h-[20px]">
                            Failed to find activity data
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}; 