"use client";

import { useState, useEffect } from "react";
import { X, Sparkles } from "lucide-react";

interface AnnouncementData {
  text: string;
  enabled: boolean;
  linkText?: string;
  linkUrl?: string;
}

const DEFAULT_ANNOUNCEMENT: AnnouncementData = {
  text: "🚀 Festive B2B & Retail Sale: Flat ₹2,000 Off on all Grade A+ Laptops | Use Code: FESTIVE2000",
  enabled: true,
  linkText: "Shop Sale",
  linkUrl: "/shop?grade=A_PLUS",
};

export function AnnouncementBar() {
  const [announcement, setAnnouncement] = useState<AnnouncementData>(DEFAULT_ANNOUNCEMENT);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check session storage to see if user dismissed it in this session
    const isDismissed = sessionStorage.getItem("announcement_dismissed");
    if (isDismissed === "true") {
      setDismissed(true);
      return;
    }

    // Try fetching dynamic announcement
    async function fetchAnnouncement() {
      try {
        const res = await fetch("/api/settings/announcement");
        if (res.ok) {
          const data = await res.json();
          if (data && data.text) {
            setAnnouncement(data);
          }
        }
      } catch {
        // Fallback to default announcement
      }
    }

    fetchAnnouncement();
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("announcement_dismissed", "true");
  };

  if (dismissed || !announcement.enabled) {
    return null;
  }

  return (
    <aside
      aria-label="Announcement"
      className="relative z-50 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white text-xs sm:text-sm py-2 px-4 shadow-sm"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <div className="flex-1 flex items-center justify-center gap-2 text-center font-medium">
          <Sparkles className="w-3.5 h-3.5 text-yellow-300 shrink-0 hidden sm:inline" />
          <span>{announcement.text}</span>
          {announcement.linkUrl && announcement.linkText && (
            <a
              href={announcement.linkUrl}
              className="underline hover:text-blue-100 font-bold ml-1 inline-flex items-center"
            >
              {announcement.linkText} &rarr;
            </a>
          )}
        </div>
        <button
          onClick={handleDismiss}
          className="p-1 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors shrink-0"
          aria-label="Dismiss announcement"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
