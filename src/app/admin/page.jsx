"use client";

import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { QRCodeCanvas } from "qrcode.react";

export default function AdminDashboard() {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [device, setDevice] = useState("");
  const [issue, setIssue] = useState("");
  
  const [activeTicket, setActiveTicket] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName || !device || !issue) return;

    setLoading(true);
    try {
      // 1. Save data to Firestore
      const docRef = await addDoc(collection(db, "tickets"), {
        customerName,
        phone,
        device,
        issue,
        status: "Received",
        createdAt: serverTimestamp(),
      });

      // 2. State configuration for receipt generation
      const ticketInfo = {
        id: docRef.id,
        customerName,
        phone,
        device,
        issue,
        date: new Date().toLocaleDateString(),
      };
      
      setActiveTicket(ticketInfo);

      // 3. Trigger printer window automatically after DOM updates
      setTimeout(() => {
        window.print();
        // Clear form fields safely
        setCustomerName("");
        setPhone("");
        setDevice("");
        setIssue("");
      }, 500);

    } catch (error) {
      console.error("Error creating ticket: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 print:bg-white print:p-0">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow print:hidden">
        <h1 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">New Intake Ticket</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Customer Name</label>
            <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full border rounded p-2 text-sm focus:outline-none focus:border-blue-500" required />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Phone Number</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border rounded p-2 text-sm focus:outline-none focus:border-blue-500" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Device Model / Type</label>
            <input type="text" value={device} onChange={(e) => setDevice(e.target.value)} placeholder="e.g., PS5, Custom PC, Laptop" className="w-full border rounded p-2 text-sm focus:outline-none focus:border-blue-500" required />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Issue Description</label>
            <textarea value={issue} onChange={(e) => setIssue(e.target.value)} rows="3" className="w-full border rounded p-2 text-sm focus:outline-none focus:border-blue-500" required></textarea>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 px-4 rounded font-medium text-sm hover:bg-blue-700 transition disabled:opacity-50">
            {loading ? "Saving Ticket..." : "Register Device & Print Receipt"}
          </button>
        </form>
      </div>

      {/* Hidden layout rendered exclusively during hardware printing calls */}
      {activeTicket && (
        <div id="thermal-receipt" className="hidden print:block text-black bg-white font-mono text-xs leading-tight">
          <div className="text-center mb-4">
            <h2 className="text-base font-bold tracking-wide uppercase">SERVICE ROOM</h2>
            <p className="text-[10px]">Repair & Diagnostic Center</p>
            <p className="mt-1">--------------------------------</p>
          </div>

          <div className="space-y-1 mb-4">
            <p><span className="font-bold">TICKET ID:</span> {activeTicket.id}</p>
            <p><span className="font-bold">DATE:</span> {activeTicket.date}</p>
            <p><span className="font-bold">CLIENT:</span> {activeTicket.customerName}</p>
            {activeTicket.phone && <p><span className="font-bold">PHONE:</span> {activeTicket.phone}</p>}
            <p><span className="font-bold">DEVICE:</span> {activeTicket.device}</p>
            <p className="font-bold mt-2">FAULT DESCRIPTION:</p>
            <p className="italic pl-2">{activeTicket.issue}</p>
          </div>

          <p className="text-center mb-2">--------------------------------</p>

          <div className="flex flex-col items-center my-4">
            <p className="font-bold mb-2 uppercase text-[10px]">Scan to Track Order</p>
            <QRCodeCanvas value={`${window.location.origin}/track/${activeTicket.id}`} size={140} level="M" />
          </div>

          <div className="text-center space-y-1 text-[10px] mt-4">
            <p>--------------------------------</p>
            <p>Please present receipt upon pickup.</p>
            <p>Thank you for choosing our service!</p>
          </div>
        </div>
      )}
    </div>
  );
}
