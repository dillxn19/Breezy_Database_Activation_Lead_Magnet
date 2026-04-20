"use client";

import { useState } from "react";
import { Sparkles, Send, UploadCloud, FileText, CheckCircle, CalendarCheck, UserX, MessageSquare } from "lucide-react";

interface Message {
  role: "ai" | "customer" | "system" | "action";
  contact?: string;
  content: string;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Home() {
  const [ticketPrice, setTicketPrice] = useState<number>(250);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [pastClients, setPastClients] = useState<number>(0);
  const [reactivatedClients, setReactivatedClients] = useState<number>(0);

  const [messages, setMessages] = useState<Message[]>([]);
  const [isCampaignRunning, setIsCampaignRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("All");

  const recoveredRevenue = reactivatedClients * ticketPrice;

  // Dynamically extract unique contact names from the messages array
  const contacts = Array.from(new Set(messages.map((m) => m.contact).filter(Boolean))) as string[];

  // Filter messages based on the currently selected tab
  const displayedMessages = messages.filter((msg) => {
    if (activeTab === "All") return true;
    // Strictly filter to only show messages (including actions) that belong to this contact
    return msg.contact === activeTab;
  });

  const simulateFileUpload = async () => {
    setIsUploading(true);
    await delay(2000);
    setIsUploading(false);
    setUploadComplete(true);
    setPastClients(850);
    setReactivatedClients(42);
  };

  const startCampaign = async () => {
    setIsCampaignRunning(true);
    setMessages([]);
    setActiveTab("All"); // Reset to live feed view when starting

    const addMsg = (msg: Message) => setMessages((prev) => [...prev, msg]);

    // System initializes (No contact attached, will only show in 'All')
    addMsg({ role: "system", content: `Initiating outreach to ${pastClients} contacts...` });
    await delay(1200);

    // Thread 1: The easy booking
    addMsg({ role: "ai", contact: "John Davis", content: "Hi John! It's Breezy from the office. We're doing free winterization checks this week. Want me to put you on the schedule?" });
    await delay(1800);

    // Thread 2: The ghost / pending reply
    addMsg({ role: "ai", contact: "Sarah Jenkins", content: "Hi Sarah! It's Breezy. It's been 6 months since your last service. Reply YES if you'd like a free inspection." });
    await delay(1500);

    // Thread 1: Reply & Action
    addMsg({ role: "customer", contact: "John Davis", content: "Yeah tomorrow morning works." });
    await delay(1200);
    
    addMsg({ role: "ai", contact: "John Davis", content: "Perfect. You are booked for tomorrow between 8-10 AM!" });
    await delay(800);
    // FIX: Added contact to action message
    addMsg({ role: "action", contact: "John Davis", content: `Appointment Booked: John Davis (+$${ticketPrice})` });
    await delay(2000);

    // Thread 3: The opt-out
    addMsg({ role: "ai", contact: "Marcus Chen", content: "Hi Marcus, Breezy here. We're offering our past clients a discount on maintenance today!" });
    await delay(1500);

    addMsg({ role: "customer", contact: "Marcus Chen", content: "Stop" });
    await delay(1000);

    addMsg({ role: "ai", contact: "Marcus Chen", content: "You have been unsubscribed. Have a great day!" });
    await delay(600);
    // FIX: Added contact to action message
    addMsg({ role: "action", contact: "Marcus Chen", content: "CRM Updated: Marcus Chen opted out." });
    await delay(1500);

    // Conclude simulation (No contact attached, will only show in 'All')
    setIsCampaignRunning(false);
    addMsg({ role: "system", content: "Campaign paused. Awaiting more responses..." });
  };

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4 md:p-8 font-sans text-slate-100">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* Left Panel: ROI Calculator & Upload */}
        <div className="flex flex-col space-y-8 bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-800">
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">Database Reactivation</h1>
            <p className="text-slate-400 text-lg">
              Upload your client list. We will automatically parse the data and initiate friendly outreach to recover dormant revenue.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Average Ticket Price ($)</label>
              <input
                type="number"
                value={ticketPrice}
                onChange={(e) => setTicketPrice(Number(e.target.value))}
                className="w-full text-lg p-3 bg-slate-950 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-white transition"
              />
            </div>

            {!uploadComplete ? (
              <div
                onClick={!isUploading ? simulateFileUpload : undefined}
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition ${isUploading ? 'border-slate-600 bg-slate-800/50' : 'border-slate-600 hover:border-emerald-500 hover:bg-slate-800/50'}`}
              >
                {isUploading ? (
                  <div className="animate-pulse flex flex-col items-center">
                    <UploadCloud className="w-12 h-12 text-slate-400 mb-4" />
                    <p className="text-slate-300 font-medium">Parsing client records...</p>
                  </div>
                ) : (
                  <>
                    <FileText className="w-12 h-12 text-slate-400 mb-4" />
                    <p className="text-slate-300 font-medium">Click to upload your client spreadsheet</p>
                    <p className="text-slate-500 text-sm mt-2">Supports CSV and Excel files</p>
                  </>
                )}
              </div>
            ) : (
              <div className="bg-emerald-950/30 border border-emerald-900/50 rounded-xl p-6 flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-emerald-400 font-medium text-lg">Upload Successful</h3>
                  <p className="text-slate-300 mt-1">We found {pastClients} past clients in your database.</p>
                  <p className="text-slate-300 mt-1">Estimated reactivated clients: {reactivatedClients}</p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-slate-800">
            <p className="text-sm font-medium text-slate-400 mb-1">Potential Recovered Revenue</p>
            <p className="text-6xl font-extrabold text-emerald-400">
              ${recoveredRevenue.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Right Panel: Phone Simulator */}
        <div className="flex justify-center">
          <div className="w-[360px] h-[720px] border-[12px] border-slate-950 rounded-[3rem] overflow-hidden flex flex-col relative bg-slate-900 shadow-2xl ring-1 ring-slate-800">

            {/* Phone Header */}
            <div className="bg-slate-800 pt-12 pb-3 border-b border-slate-700 flex flex-col items-center shadow-sm z-10 shrink-0">
              <div className="w-10 h-10 bg-emerald-900/50 rounded-full flex items-center justify-center mb-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="font-semibold text-white">Breezy AI Assistant</h3>
            </div>

            {/* Dynamic Tab Bar */}
            {messages.length > 0 && (
              <div className="flex overflow-x-auto bg-slate-800/80 border-b border-slate-700 px-3 py-2 space-x-2 shrink-0 no-scrollbar items-center">
                <button
                  onClick={() => setActiveTab("All")}
                  className={`flex items-center space-x-1 whitespace-nowrap px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                    activeTab === "All" ? "bg-emerald-600 text-white shadow-sm" : "bg-slate-700/50 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>Live Feed</span>
                </button>
                {contacts.map((contact) => (
                  <button
                    key={contact}
                    onClick={() => setActiveTab(contact)}
                    className={`whitespace-nowrap px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                      activeTab === contact ? "bg-emerald-600 text-white shadow-sm" : "bg-slate-700/50 text-slate-300 hover:bg-slate-600"
                    }`}
                  >
                    {contact}
                  </button>
                ))}
              </div>
            )}

            {/* Chat Area */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col space-y-5 bg-slate-900 scroll-smooth">
              {displayedMessages.map((msg, index) => {
                if (msg.role === "system") {
                  return (
                    <div key={index} className="flex justify-center">
                      <span className="text-[11px] text-slate-400 font-medium bg-slate-800 px-3 py-1 rounded-full border border-slate-700 shadow-sm text-center max-w-[90%]">
                        {msg.content}
                      </span>
                    </div>
                  );
                }
                
                if (msg.role === "action") {
                  const isBooking = msg.content.includes("Booked");
                  return (
                    <div key={index} className="flex justify-center my-2">
                      <div className={`flex items-center space-x-2 text-xs font-medium px-4 py-2 rounded-xl border shadow-sm ${
                        isBooking 
                          ? "bg-emerald-950/40 text-emerald-400 border-emerald-900/50" 
                          : "bg-slate-800 text-slate-300 border-slate-700"
                      }`}>
                        {isBooking ? <CalendarCheck className="w-4 h-4 shrink-0" /> : <UserX className="w-4 h-4 shrink-0" />}
                        <span className="text-center">{msg.content}</span>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={index} className={`flex flex-col ${msg.role === "customer" ? "items-end" : "items-start"}`}>
                    {/* Only show the "To/From" labels if we are in the "All" tab */}
                    {activeTab === "All" && (
                      <span className="text-[10px] text-slate-500 mb-1 px-1">
                        {msg.role === "ai" ? `To: ${msg.contact}` : `From: ${msg.contact}`}
                      </span>
                    )}
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm leading-relaxed ${
                      msg.role === "customer"
                        ? "bg-emerald-600 text-white rounded-br-sm"
                        : "bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-sm"
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                );
              })}
              
              {isCampaignRunning && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex space-x-1 items-center h-10">
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Action Button */}
            <div className="p-4 bg-slate-800 border-t border-slate-700 shrink-0">
              <button
                onClick={startCampaign}
                disabled={isCampaignRunning || !uploadComplete}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-medium py-4 rounded-xl transition-colors flex items-center justify-center space-x-2"
              >
                <span>{isCampaignRunning ? "Campaign Active..." : "Launch Campaign"}</span>
                {!isCampaignRunning && <Send className="w-4 h-4" />}
              </button>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}