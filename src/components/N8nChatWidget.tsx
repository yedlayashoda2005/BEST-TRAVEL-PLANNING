import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Settings,
  Minimize2,
  ExternalLink,
  MapPin,
  Wallet,
  Calendar,
  Share2,
} from 'lucide-react';
import { useTravel } from '../context/TravelContext';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'system';
  text: string;
  timestamp: string;
  isError?: boolean;
}

const DEFAULT_WEBHOOK_URL =
  'https://yedlayashoda2005.app.n8n.cloud/webhook/5ff5b172-ea78-4fcc-853e-7fb556121a18/chat';
const DEFAULT_INSTANCE_ID =
  '7cb9ad4b9167dcd8570ff9648a423a06ae6c47be941766854b7fa1d60633da39';

export const N8nChatWidget: React.FC = () => {
  const {
    selectedDestination,
    searchParams,
    budgetBreakdown,
    selectedHotelId,
    selectedFlightId,
    selectedAttractionIds,
  } = useTravel();

  const [isOpen, setIsOpen] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState(DEFAULT_WEBHOOK_URL);
  const [instanceId, setInstanceId] = useState(DEFAULT_INSTANCE_ID);
  const [sessionId, setSessionId] = useState<string>(() => {
    return (
      localStorage.getItem('tm_chat_session') ||
      `session_${Date.now()}_${Math.random().toString(36).substring(7)}`
    );
  });
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const selectedHotel = selectedDestination.hotels.find((h) => h.id === selectedHotelId);
  const selectedFlight = selectedDestination.flights.find((f) => f.id === selectedFlightId);
  const selectedAttractions = selectedDestination.popularAttractions.filter((a) =>
    selectedAttractionIds.includes(a.id)
  );

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'msg-welcome',
        sender: 'bot',
        text: `Hello! 👋 Welcome to **TravelMate AI**, connected to your personal **n8n AI Agent**!\n\nI am synchronized with your active website workspace. Ask me about **${selectedDestination.name}**, budget optimization (Target: **₹${searchParams.budget.toLocaleString('en-IN')}**), flights, hotels, or your day-by-day itinerary!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('tm_chat_session', sessionId);
  }, [sessionId]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);

  const quickPrompts = [
    `Review my current ${selectedDestination.name} trip plan`,
    `How can I save ₹2,000 on my ₹${searchParams.budget.toLocaleString('en-IN')} budget?`,
    `Suggest day-by-day itinerary for ${selectedDestination.name}`,
    `Which hotel is best: ${selectedHotel?.name || 'Selected Stay'}?`,
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Build full website context to send to n8n AI agent
      const websiteContext = {
        websiteName: 'TravelMate',
        websiteUrl: typeof window !== 'undefined' ? window.location.href : '',
        activeDestination: {
          name: selectedDestination.name,
          state: selectedDestination.state,
          idealDays: selectedDestination.idealDays,
          bestTime: selectedDestination.bestTimeToVisit,
        },
        searchParams: {
          startingCity: searchParams.startingCity,
          startDate: searchParams.startDate,
          endDate: searchParams.endDate,
          travelers: searchParams.travelers,
          targetBudget: searchParams.budget,
          travelStyle: searchParams.preference,
        },
        currentSelections: {
          hotel: selectedHotel ? `${selectedHotel.name} (₹${selectedHotel.pricePerNight}/night)` : 'None',
          flight: selectedFlight ? `${selectedFlight.airline} (${selectedFlight.flightNumber}, ₹${selectedFlight.pricePerPerson}/person)` : 'None',
          attractions: selectedAttractions.map((a) => a.name).join(', '),
        },
        financials: {
          estimatedTotalCost: budgetBreakdown.totalEstimatedCost,
          targetBudget: searchParams.budget,
          remainingBudget: budgetBreakdown.remainingBudget,
          isOverBudget: budgetBreakdown.isOverBudget,
          overBudgetAmount: budgetBreakdown.overBudgetAmount,
        },
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Instance-Id': instanceId,
        },
        body: JSON.stringify({
          action: 'sendMessage',
          chatInput: text,
          message: text,
          sessionId,
          metadata: websiteContext,
        }),
      });

      const responseText = await response.text();
      let botReply = '';

      if (response.ok) {
        try {
          const data = JSON.parse(responseText);
          botReply =
            data.output ||
            data.text ||
            data.message ||
            (Array.isArray(data) && data[0]?.json?.output) ||
            (Array.isArray(data) && data[0]?.output) ||
            JSON.stringify(data, null, 2);
        } catch {
          botReply = responseText || 'Received response from n8n agent.';
        }
      } else {
        try {
          const errData = JSON.parse(responseText);
          if (errData.hint && errData.hint.includes('workflow must be active')) {
            botReply = `⚠️ **n8n Workflow Notice:**\nPlease turn on the **Active** toggle switch in the top-right corner of your n8n workflow editor so your cloud agent executes queries.`;
          } else {
            botReply = errData.message || responseText;
          }
        } catch {
          botReply = `Error from n8n (${response.status}): ${responseText}`;
        }
      }

      const botMsg: ChatMessage = {
        id: `msg_bot_${Date.now()}`,
        sender: 'bot',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `msg_err_${Date.now()}`,
        sender: 'bot',
        text: `⚠️ **Connection Error:** Could not connect to n8n webhook (\`${err.message || 'Network issue'}\`). Verify that your n8n cloud instance is online.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendFullContext = () => {
    const summary = `Here is my current trip setup from the TravelMate website:
- Destination: ${selectedDestination.name}, ${selectedDestination.state}
- Route: ${searchParams.startingCity} → ${selectedDestination.name}
- Dates: ${searchParams.startDate} to ${searchParams.endDate} (${searchParams.travelers} travelers)
- Budget: ₹${searchParams.budget.toLocaleString('en-IN')} (Estimated Cost: ₹${budgetBreakdown.totalEstimatedCost.toLocaleString('en-IN')})
- Selected Hotel: ${selectedHotel?.name || 'Not selected'}
- Selected Sights: ${selectedAttractions.map((a) => a.name).join(', ')}

Please analyze my plan and suggest any optimizations or must-see places!`;
    handleSendMessage(summary);
  };

  const handleResetSession = () => {
    const newSession = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    setSessionId(newSession);
    setMessages([
      {
        id: `msg_welcome_${Date.now()}`,
        sender: 'bot',
        text: `New conversation started! How can I assist you with your trip to **${selectedDestination.name}** today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="fixed bottom-22 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end">
      {/* Floating Chat Launcher Button (when closed) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-gradient-to-r from-sky-600 via-indigo-600 to-amber-500 text-white font-bold shadow-2xl shadow-sky-600/40 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          aria-label="Open n8n AI Chatbot"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white animate-bounce" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-white animate-pulse" />
          </div>
          <span className="text-xs sm:text-sm tracking-wide font-heading">
            Ask TravelMate AI
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/20 text-white font-semibold uppercase">
            n8n
          </span>
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center shadow">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Expanded Chat Window */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[440px] h-[600px] max-h-[85vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-sky-600 via-indigo-600 to-amber-600 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-heading font-extrabold text-sm sm:text-base leading-tight">
                    TravelMate AI Agent
                  </h3>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-bold uppercase">
                    n8n Connected
                  </span>
                </div>
                <p className="text-[11px] text-sky-100 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  <span>Synced: {selectedDestination.name} (₹{searchParams.budget.toLocaleString('en-IN')})</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition"
                title="Webhook Configuration"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetSession}
                className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition"
                title="New Chat Session"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition"
                title="Minimize Chat"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Website Context Banner */}
          <div className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/80 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2 truncate">
              <span className="font-bold text-sky-600 dark:text-sky-400">Live Website Context:</span>
              <span className="truncate">
                {selectedDestination.name} • {searchParams.travelers} ppl • ₹{budgetBreakdown.totalEstimatedCost.toLocaleString('en-IN')}
              </span>
            </div>
            <button
              onClick={handleSendFullContext}
              className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950 border border-sky-300 dark:border-sky-800 text-sky-700 dark:text-sky-300 hover:bg-sky-100 shrink-0"
              title="Send your currently chosen hotel, flights, and sights to AI"
            >
              Sync Plan
            </button>
          </div>

          {/* Settings Drawer (Webhook URL / Session) */}
          {showSettings && (
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 dark:text-slate-200">
                  n8n Cloud Webhook Config
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  Session: {sessionId.slice(0, 12)}...
                </span>
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block mb-0.5">Webhook URL</label>
                <input
                  type="text"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-[11px] font-mono focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block mb-0.5">X-Instance-Id Header</label>
                <input
                  type="text"
                  value={instanceId}
                  onChange={(e) => setInstanceId(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-[11px] font-mono focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>
          )}

          {/* Messages List Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50 dark:bg-slate-950/50 text-xs">
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';

              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}
                >
                  {isBot && (
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[84%] rounded-2xl p-3 shadow-xs space-y-1.5 ${
                      isBot
                        ? msg.isError
                          ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-900'
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700'
                        : 'bg-sky-600 text-white'
                    }`}
                  >
                    <div className="whitespace-pre-wrap leading-relaxed break-words">
                      {msg.text}
                    </div>
                    <div
                      className={`text-[9px] text-right font-medium ${
                        isBot ? 'text-slate-400' : 'text-sky-200'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>

                  {!isBot && (
                    <div className="w-7 h-7 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse delay-150" />
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse delay-300" />
                  <span className="text-[11px] ml-1">n8n Agent is crafting answer...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          <div className="px-3 py-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
                className="text-[10px] px-2.5 py-1 rounded-full whitespace-nowrap bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-sky-50 hover:text-sky-700 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Message Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              placeholder={`Ask about ${selectedDestination.name}, budget, itinerary...`}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isLoading}
              className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="p-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white transition shadow-sm cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
