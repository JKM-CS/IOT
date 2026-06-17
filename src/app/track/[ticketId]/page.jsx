"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams } from "next/navigation";

export default function CustomerTracking() {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        const docRef = doc(db, "tickets", ticketId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setTicket(docSnap.data());
        } else {
          console.error("No matches found for Ticket ID.");
        }
      } catch (err) {
        console.error("Error retrieving Firestore entry:", err);
      } finally {
        setLoading(false);
      }
    };

    if (ticketId) fetchTicketData();
  }, [ticketId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <p className="text-sm text-gray-500 animate-pulse font-medium">Fetching real-time processing records...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded shadow max-w-sm w-full text-center">
          <p className="text-red-500 font-bold mb-2">Ticket Not Found</p>
          <p className="text-xs text-gray-500">Verify the receipt QR code or contact support directly if error persists.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-900 px-6 py-4 text-white">
          <h1 className="text-lg font-bold tracking-wide">Repair Status Tracker</h1>
          <p className="text-xs text-gray-400 mt-0.5">Ticket reference: #{ticketId}</p>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Current Status</span>
            <div className="inline-block bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold border border-blue-200 uppercase">
              {ticket.status}
            </div>
          </div>

          <div className="border-t pt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Device</span>
              <span className="font-semibold text-gray-800">{ticket.device}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Customer</span>
              <span className="font-semibold text-gray-800">{ticket.customerName}</span>
            </div>
          </div>

          <div className="border-t pt-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Reported Diagnostic Issue</span>
            <p className="text-gray-700 mt-1 text-sm bg-gray-50 p-3 rounded border border-dashed italic">
              "{ticket.issue}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
