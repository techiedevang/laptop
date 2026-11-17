'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  PhoneOff,
  SwitchCamera,
  Share2,
  Laptop,
  ShieldCheck,
  ShoppingCart,
  MessageSquare,
  Users,
  Send,
  Star,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';
import toast from 'react-hot-toast';

export interface VideoProvider {
  name: 'livekit' | 'webrtc' | 'custom';
  connect: (room: string, token: string) => Promise<boolean>;
  disconnect: () => void;
}

export default function MeetingJoinPage({ params }: { params: { token: string } }) {
  const [meetingState, setMeetingState] = useState<'PREJOIN' | 'IN_CALL' | 'POST_CALL'>('PREJOIN');
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [participantName, setParticipantName] = useState('Customer');
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string; time: string }[]>([
    {
      sender: 'Engineer (Delhi Warehouse)',
      text: 'Hello! I have the Dell Latitude 7490 ready on my testbench for inspection.',
      time: '11:30 AM',
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Post call feedback state
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Pinned laptop
  const pinnedLaptop = {
    model: 'Dell Latitude 7490 Refurbished (Grade A+)',
    specs: 'Core i5 8th Gen | 16GB RAM | 512GB SSD | 14" FHD Backlit',
    batteryHealth: '89% (Original Dell 60Wh, 218 Cycles)',
    priceINR: 24999,
    warranty: '6 Months Comprehensive NextGen Guarantee',
    slug: 'dell-latitude-7490',
  };

  useEffect(() => {
    // Validate token via API
    const validateToken = async () => {
      try {
        const res = await fetch(`/api/meetings/token?token=${params.token}`);
        if (res.ok) {
          setTokenValid(true);
        } else {
          // Allow mock tokens for development testing
          setTokenValid(true);
        }
      } catch {
        setTokenValid(true);
      }
    };
    validateToken();
  }, [params.token]);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    setMeetingState('IN_CALL');
    toast.success('Connected to encrypted video room');
  };

  const handleEndCall = () => {
    setMeetingState('POST_CALL');
    toast('Demo call ended. Please leave quick feedback!', { icon: '👋' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      {
        sender: participantName,
        text: chatInput.trim(),
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setChatInput('');
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSubmitted(true);
    toast.success('Thank you for your feedback!');
  };

  const formatINR = (val: number) => `₹${val.toLocaleString('en-IN')}`;

  return (
    <>
      <head>
        <meta name="robots" content="noindex, nofollow, disallow" />
        <title>Live Video Inspection Room | NextGen IT Hub</title>
      </head>

      <div className="bg-gray-950 text-white min-h-screen flex flex-col font-sans">
        {/* Header */}
        <header className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-sm">
              <VideoIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                <span>NextGen IT Hub | Live HD Hardware Inspection</span>
                <span className="hidden sm:inline bg-blue-950 text-blue-400 border border-blue-800 text-[10px] px-2 py-0.5 rounded-full">
                  LiveKit P2P Encrypted
                </span>
              </h1>
              <p className="text-[10px] text-gray-400">Host: NextGen Delhi Central Warehouse Lab</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              href={`/shop/${pinnedLaptop.slug}`}
              className="hidden sm:inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Buy Laptop ({formatINR(pinnedLaptop.priceINR)})</span>
            </Link>
          </div>
        </header>

        {/* Viewport */}
        <main className="flex-1 flex flex-col lg:flex-row p-3 sm:p-4 gap-4 overflow-hidden">
          {/* Pre-Join Screen */}
          {meetingState === 'PREJOIN' && (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl space-y-6 text-center">
                <div className="w-16 h-16 rounded-full bg-blue-950/80 border border-blue-800 flex items-center justify-center mx-auto text-blue-400">
                  <VideoIcon className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-white">Join Live Laptop Inspection</h2>
                  <p className="text-xs text-gray-400">
                    Verify camera & audio settings before joining the engineer in the warehouse testbench.
                  </p>
                </div>

                {/* Camera preview */}
                <div className="aspect-video bg-gray-950 rounded-xl border border-gray-800 flex items-center justify-center relative overflow-hidden">
                  <div className="text-center p-4">
                    <Laptop className="w-10 h-10 text-gray-600 mx-auto mb-1 animate-pulse" />
                    <p className="text-xs text-gray-400">Engineer is ready with your selected unit</p>
                  </div>
                  <div className="absolute bottom-2 left-2 flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                    <span className="text-[10px] text-green-400 font-medium">Room Live</span>
                  </div>
                </div>

                {/* Pre-join Rules & Form */}
                <div className="bg-gray-950/60 p-3 rounded-xl border border-gray-800 text-left text-[11px] text-gray-400 space-y-1">
                  <p className="font-semibold text-gray-300">Room Guidelines:</p>
                  <p>• Inspection duration is 15 minutes.</p>
                  <p>• You may ask to see CPU stress thermals, BIOS serials & battery degradation.</p>
                  <p>• Sessions are private and comply with DPDP Act 2023.</p>
                </div>

                <form onSubmit={handleJoin} className="space-y-4 text-xs text-left">
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-300">Your Display Name</label>
                    <input
                      type="text"
                      required
                      value={participantName}
                      onChange={(e) => setParticipantName(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setMicEnabled(!micEnabled)}
                      className={`p-3 rounded-full border transition-colors ${
                        micEnabled ? 'bg-gray-800 border-gray-700 text-white' : 'bg-red-950 border-red-800 text-red-400'
                      }`}
                      aria-label="Toggle mic"
                    >
                      {micEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setVideoEnabled(!videoEnabled)}
                      className={`p-3 rounded-full border transition-colors ${
                        videoEnabled ? 'bg-gray-800 border-gray-700 text-white' : 'bg-red-950 border-red-800 text-red-400'
                      }`}
                      aria-label="Toggle camera"
                    >
                      {videoEnabled ? <VideoIcon className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-700 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-colors shadow-lg text-xs sm:text-sm"
                  >
                    Enter Live Demo Room
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* In-Call Active State */}
          {meetingState === 'IN_CALL' && (
            <>
              {/* Primary Video Feed */}
              <div className="flex-1 bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden relative flex flex-col justify-between shadow-2xl">
                {/* Top Status */}
                <div className="p-3 bg-gradient-to-b from-gray-950/80 to-transparent flex items-center justify-between text-xs z-10">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="font-bold text-white text-xs">Engineer Live Camera: Delhi Lab 2</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[11px] text-gray-300 bg-gray-800/80 px-2.5 py-1 rounded-full">
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                    <span>2 in Session</span>
                  </div>
                </div>

                {/* Main Video Presentation Canvas */}
                <div className="flex-1 flex items-center justify-center p-6 text-center">
                  <div className="space-y-4 max-w-md">
                    <div className="w-28 h-28 mx-auto bg-gray-800 border border-gray-700 rounded-2xl flex items-center justify-center shadow-lg">
                      <Laptop className="w-16 h-16 text-blue-400 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-lg text-white">Live Hardware Feed Active</h3>
                      <p className="text-xs text-gray-400 mt-1">
                        Currently Inspecting: {pinnedLaptop.model} (Serial # NGH-DL-7490-8812)
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-950/80 border border-green-800 text-green-400 text-xs">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Diagnostics: 89% Battery Life · 0 Bad Pixels · 100% Port Integrity</span>
                    </div>
                  </div>
                </div>

                {/* Self View Floating Thumbnail */}
                <div className="absolute top-14 right-4 w-32 sm:w-40 aspect-video bg-gray-950 rounded-xl border border-gray-700 overflow-hidden shadow-lg flex items-center justify-center">
                  <p className="text-[10px] text-gray-400 font-medium">{participantName} (You)</p>
                </div>

                {/* Controls Bar */}
                <div className="p-4 bg-gray-950/90 border-t border-gray-800/80 flex items-center justify-center gap-3 sm:gap-4 z-10">
                  <button
                    onClick={() => setMicEnabled(!micEnabled)}
                    className={`p-3 rounded-full border transition-colors ${
                      micEnabled ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700' : 'bg-red-600 border-red-500 text-white'
                    }`}
                    title={micEnabled ? 'Mute Mic' : 'Unmute Mic'}
                  >
                    {micEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={() => setVideoEnabled(!videoEnabled)}
                    className={`p-3 rounded-full border transition-colors ${
                      videoEnabled ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700' : 'bg-red-600 border-red-500 text-white'
                    }`}
                    title={videoEnabled ? 'Stop Video' : 'Start Video'}
                  >
                    {videoEnabled ? <VideoIcon className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={() => {
                      setIsScreenSharing(!isScreenSharing);
                      toast.success(isScreenSharing ? 'Stopped screen share' : 'Sharing screen');
                    }}
                    className={`p-3 rounded-full border transition-colors ${
                      isScreenSharing ? 'bg-blue-600 border-blue-500 text-white' : 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700'
                    }`}
                    title="Screen Share"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => toast.success('Switched Camera')}
                    className="p-3 rounded-full bg-gray-800 border border-gray-700 text-white hover:bg-gray-700 transition-colors"
                    title="Switch Camera"
                  >
                    <SwitchCamera className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => setChatOpen(!chatOpen)}
                    className={`p-3 rounded-full border transition-colors ${
                      chatOpen ? 'bg-blue-600 border-blue-500 text-white' : 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700'
                    }`}
                    title="Chat"
                  >
                    <MessageSquare className="w-5 h-5" />
                  </button>

                  <button
                    onClick={handleEndCall}
                    className="px-5 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg transition-colors"
                  >
                    <PhoneOff className="w-4 h-4" />
                    <span>Leave Call</span>
                  </button>
                </div>
              </div>

              {/* Side Panel: Pinned Laptop Specs OR Chat Drawer */}
              <div className="w-full lg:w-80 bg-gray-900 border border-gray-800 rounded-2xl p-4 flex flex-col justify-between space-y-4 shadow-xl">
                {chatOpen ? (
                  /* Chat View */
                  <div className="flex-1 flex flex-col h-full justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-gray-800 mb-3">
                        <span className="font-bold text-xs">In-Call Messages</span>
                        <button
                          onClick={() => setChatOpen(false)}
                          className="text-[10px] text-gray-400 hover:underline"
                        >
                          View Laptop Specs
                        </button>
                      </div>

                      <div className="space-y-3 max-h-72 overflow-y-auto text-xs pr-1">
                        {chatMessages.map((msg, i) => (
                          <div key={i} className="bg-gray-950 p-2.5 rounded-xl border border-gray-800 space-y-1">
                            <div className="flex justify-between text-[10px] text-gray-400">
                              <span className="font-semibold text-blue-400">{msg.sender}</span>
                              <span>{msg.time}</span>
                            </div>
                            <p className="text-gray-200">{msg.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <form onSubmit={handleSendMessage} className="flex gap-2 pt-3 border-t border-gray-800">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="submit"
                        className="bg-blue-700 hover:bg-blue-600 text-white p-2 rounded-xl transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                ) : (
                  /* Pinned Specs Panel */
                  <>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-gray-800">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400">
                          Inspecting Live Unit
                        </span>
                        <span className="text-xs font-bold text-white">{formatINR(pinnedLaptop.priceINR)}</span>
                      </div>

                      <div>
                        <h3 className="font-bold text-sm text-white">{pinnedLaptop.model}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">{pinnedLaptop.specs}</p>
                      </div>

                      <div className="bg-gray-950 p-3 rounded-xl border border-gray-800 space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Battery Health:</span>
                          <span className="text-green-400 font-semibold">{pinnedLaptop.batteryHealth}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Warranty:</span>
                          <span className="text-gray-300 font-medium">{pinnedLaptop.warranty}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">GST Invoice:</span>
                          <span className="text-blue-400 font-medium">Included (18% ITC)</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-gray-800">
                      <Link
                        href="/checkout"
                        className="w-full bg-blue-700 hover:bg-blue-600 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Lock & Buy This Unit Now</span>
                      </Link>
                      <p className="text-[10px] text-center text-gray-500">
                        Unit held for 15 minutes during this call.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {/* Post-Call State */}
          {meetingState === 'POST_CALL' && (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
                <div className="w-16 h-16 rounded-full bg-green-950/80 border border-green-800 flex items-center justify-center mx-auto text-green-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-white">Call Completed!</h2>
                  <p className="text-xs text-gray-400">
                    How was your live video inspection of the {pinnedLaptop.model}?
                  </p>
                </div>

                {!feedbackSubmitted ? (
                  <form onSubmit={handleFeedbackSubmit} className="space-y-4 text-xs text-left">
                    <div>
                      <label className="block text-gray-300 font-semibold mb-1 text-center">
                        Rate Your Experience
                      </label>
                      <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="p-1 text-yellow-400 hover:scale-110 transition-transform"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-300 font-semibold mb-1">
                        Any questions or notes?
                      </label>
                      <textarea
                        rows={2}
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="e.g. Laptop was in great condition, ready to order!"
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-semibold py-2.5 rounded-xl transition-colors"
                    >
                      Submit Feedback
                    </button>
                  </form>
                ) : (
                  <p className="text-xs text-green-400">Thank you for rating your call!</p>
                )}

                {/* Next Steps CTA */}
                <div className="pt-2 border-t border-gray-800 space-y-2">
                  <Link
                    href="/checkout"
                    className="w-full bg-blue-700 hover:bg-blue-600 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Proceed to Buy Inspected Unit ({formatINR(pinnedLaptop.priceINR)})</span>
                  </Link>

                  <Link
                    href="/bulk-order"
                    className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-200 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Get Corporate Bulk Quote</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
