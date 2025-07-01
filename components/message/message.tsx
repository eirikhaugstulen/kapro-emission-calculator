import { CustomMessage } from '@/lib/ai';
import { WeatherToolCard } from '@/components/weather-card';
import { FindActivityIdToolCard } from '@/components/activity-card';
import { CalculateEmissionToolCard } from '@/components/emission-card';
import { marked } from 'marked';
import { memo, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function parseMarkdownIntoBlocks(markdown: string): string[] {
    const tokens = marked.lexer(markdown);
    return tokens.map(token => token.raw);
}

const MemoizedMarkdownBlock = memo(
    ({ content }: { content: string }) => {
        return (
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    // Headings
                    h1: ({ children }) => (
                        <h1 className="text-2xl font-bold mb-4 mt-6 text-gray-900 border-b border-gray-200 pb-2">
                            {children}
                        </h1>
                    ),
                    h2: ({ children }) => (
                        <h2 className="text-xl font-semibold mb-3 mt-5 text-gray-900 border-b border-gray-100 pb-1">
                            {children}
                        </h2>
                    ),
                    h3: ({ children }) => (
                        <h3 className="text-lg font-semibold mb-2 mt-4 text-gray-900">
                            {children}
                        </h3>
                    ),
                    h4: ({ children }) => (
                        <h4 className="text-base font-semibold mb-2 mt-3 text-gray-900">
                            {children}
                        </h4>
                    ),
                    h5: ({ children }) => (
                        <h5 className="text-sm font-semibold mb-1 mt-2 text-gray-900">
                            {children}
                        </h5>
                    ),
                    h6: ({ children }) => (
                        <h6 className="text-sm font-medium mb-1 mt-2 text-gray-700">
                            {children}
                        </h6>
                    ),
                    // Paragraphs
                    p: ({ children }) => (
                        <p className="mb-4 text-gray-800 leading-relaxed">
                            {children}
                        </p>
                    ),
                    // Lists
                    ul: ({ children }) => (
                        <ul className="mb-4 pl-6 space-y-1 list-disc marker:text-gray-400">
                            {children}
                        </ul>
                    ),
                    ol: ({ children }) => (
                        <ol className="mb-4 pl-6 space-y-1 list-decimal marker:text-gray-400">
                            {children}
                        </ol>
                    ),
                    li: ({ children }) => (
                        <li className="text-gray-800 leading-relaxed">
                            {children}
                        </li>
                    ),
                    // Code
                    code: ({ children, className }) => {
                        const isInline = !className;
                        if (isInline) {
                            return (
                                <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono border">
                                    {children}
                                </code>
                            );
                        }
                        return (
                            <code className="block bg-gray-50 text-gray-800 p-4 rounded-lg text-sm font-mono overflow-x-auto border border-gray-200">
                                {children}
                            </code>
                        );
                    },
                    pre: ({ children }) => (
                        <pre className="mb-4 bg-gray-50 p-4 rounded-lg overflow-x-auto border border-gray-200">
                            {children}
                        </pre>
                    ),
                    // Blockquotes
                    blockquote: ({ children }) => (
                        <blockquote className="mb-4 pl-4 border-l-4 border-blue-200 bg-blue-50/50 py-2 pr-4 text-gray-700 italic">
                            {children}
                        </blockquote>
                    ),
                    // Tables
                    table: ({ children }) => (
                        <div className="mb-4 overflow-x-auto">
                            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                                {children}
                            </table>
                        </div>
                    ),
                    thead: ({ children }) => (
                        <thead className="bg-gray-50">
                            {children}
                        </thead>
                    ),
                    tbody: ({ children }) => (
                        <tbody className="divide-y divide-gray-200">
                            {children}
                        </tbody>
                    ),
                    tr: ({ children }) => (
                        <tr className="hover:bg-gray-50/50">
                            {children}
                        </tr>
                    ),
                    th: ({ children }) => (
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-r border-gray-200 last:border-r-0">
                            {children}
                        </th>
                    ),
                    td: ({ children }) => (
                        <td className="px-4 py-3 text-sm text-gray-800 border-r border-gray-200 last:border-r-0">
                            {children}
                        </td>
                    ),
                    // Links
                    a: ({ children, href }) => (
                        <a
                            href={href}
                            className="text-blue-600 hover:text-blue-800 underline decoration-blue-300 hover:decoration-blue-500 transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {children}
                        </a>
                    ),
                    // Strong and emphasis
                    strong: ({ children }) => (
                        <strong className="font-semibold text-gray-900">
                            {children}
                        </strong>
                    ),
                    em: ({ children }) => (
                        <em className="italic text-gray-700">
                            {children}
                        </em>
                    ),
                    // Strikethrough (GFM)
                    del: ({ children }) => (
                        <del className="line-through text-gray-500">
                            {children}
                        </del>
                    ),
                    // Horizontal rule
                    hr: () => (
                        <hr className="my-6 border-0 border-t border-gray-200" />
                    ),
                    // Task lists (GFM)
                    input: ({ checked, type }) => {
                        if (type === 'checkbox') {
                            return (
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    readOnly
                                    className="mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                />
                            );
                        }
                        return <input type={type} />;
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        );
    },
    (prevProps, nextProps) => {
        if (prevProps.content !== nextProps.content) return false;
        return true;
    },
);

MemoizedMarkdownBlock.displayName = 'MemoizedMarkdownBlock';

const MemoizedMarkdown = memo(
    ({ content, id }: { content: string; id: string }) => {
        const blocks = useMemo(() => parseMarkdownIntoBlocks(content), [content]);

        return (
            <div className="prose prose-sm max-w-none">
                {blocks.map((block, index) => (
                    <MemoizedMarkdownBlock content={block} key={`${id}-block_${index}`} />
                ))}
            </div>
        );
    },
);

MemoizedMarkdown.displayName = 'MemoizedMarkdown';

type Props = {
    message: CustomMessage;
    isLastMessage: boolean;
};

export const Message = ({ message, isLastMessage }: Props) => {
    const isUser = message.role === 'user';

    return (
        <>
            {message.parts.map((part, index) => {
                if (part.type === 'step-start') {
                    return null;
                }

                // if (part.type === 'tool-getWeather') {
                //     return (
                //         <div key={index} className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
                //             <div className="max-w-[80%] md:max-w-[70%] lg:max-w-[60%]">
                //                 <WeatherToolCard part={part} />
                //             </div>
                //         </div>
                //     );
                // }

                if (part.type === 'tool-calculateEmission') {
                    return (
                        <div key={index} className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
                            <div className="max-w-[80%] md:max-w-[70%] lg:max-w-[60%]">
                                <CalculateEmissionToolCard part={part} />
                            </div>
                        </div>
                    );
                }

                if (part.type === 'tool-findActivityId') {
                    return (
                        <div key={index} className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
                            <div className="max-w-[80%] md:max-w-[70%] lg:max-w-[60%]">
                                <FindActivityIdToolCard part={part} />
                            </div>
                        </div>
                    );
                }

                if (part.type === 'reasoning') {
                    return (
                        <div key={index} className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
                            <div className="max-w-[80%] md:max-w-[70%] lg:max-w-[60%]">
                                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                                    {part.text}
                                </p>
                            </div>
                        </div>
                    );
                }

                // Render text and other content in message bubble
                return (
                    <div key={index} className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
                        <div className="max-w-[80%] md:max-w-[70%]">
                            <div
                                className={`
                                px-4 py-3 rounded-lg shadow-sm
                                ${isUser
                                        ? 'bg-white border border-gray-200 text-gray-800'
                                        : 'bg-gray-100 text-gray-800'}
                            `}
                            >
                                {part.type === 'text' && (
                                    <div className="text-sm leading-relaxed">
                                        <MemoizedMarkdown content={part.text} id={`message-${index}`} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </>
    );
};