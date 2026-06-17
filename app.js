import React, { useState } from 'react';
import DataUploadStep from './components/DataUploadStep';
import TemplateZonesStep from './components/TemplateZonesStep';
import StyleConfigStep from './components/StyleConfigStep';
import GeneratorStep from './components/GeneratorStep';

export default function App() {
  // Application State reverse-engineered from the minified build
  const [step, setStep] = useState(1);
  const [rows, setRows] = useState([]);
  const [template, setTemplate] = useState(null);
  const [zones, setZones] = useState({ qr: null, name: null });
  const [style, setStyle] = useState({});

  return (
    <div className="min-h-screen bg-[#F7F3ED] text-[#1A1410] font-sans">
      {/* Header Component */}
      <header className="p-6 bg-white border-b border-[#D9CEBC]">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center text-xl font-bold font-space-grotesk">
            <span className="text-[#B8960C] mr-2">⬡</span>
            <span>QR<em className="font-normal not-italic text-[#8A7F6E]">forge</em></span>
          </div>
          <p className="text-sm text-[#8A7F6E]">Template-based QR PDF generator</p>
        </div>
      </header>

      {/* Main View Router */}
      <main className="max-w-5xl mx-auto p-6 pb-24">
        {step === 1 && <DataUploadStep rows={rows} setRows={setRows} />}
        {step === 2 && <TemplateZonesStep template={template} setTemplate={setTemplate} zones={zones} setZones={setZones} />}
        {step === 3 && <StyleConfigStep style={style} setStyle={setStyle} template={template} zones={zones} sampleRow={rows[0]} />}
        {step === 4 && <GeneratorStep rows={rows} template={template} zones={zones} style={style} />}
      </main>

      {/* Bottom Navigation & Hints */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-[#D9CEBC] p-4 flex justify-between items-center shadow-[0_-2px_12px_rgba(0,0,0,0.08)]">
        {step > 1 ? (
          <button 
            onClick={() => setStep(step - 1)} 
            className="px-5 py-2 border border-[#D9CEBC] text-[#1A1410] rounded-md hover:bg-[#EDE7DC] transition-colors"
          >
            ← Back
          </button>
        ) : <div />}
        
        {/* Dynamic Hints based on current state */}
        <div className="text-sm font-medium text-[#8A7F6E]">
          {step === 1 && rows.length === 0 && <span>Upload your data file to continue</span>}
          {step === 1 && rows.length > 0 && <span className="text-[#27AE60]">{rows.length} rows loaded</span>}
          {step === 2 && (!zones.qr || !zones.name) && <span>Draw both zones on the template</span>}
          {step === 2 && zones.qr && zones.name && <span className="text-[#27AE60]">Zones configured</span>}
        </div>

        {step < 4 && (
          <button 
            onClick={() => setStep(step + 1)} 
            disabled={(step === 1 && rows.length === 0) || (step === 2 && (!zones.qr || !zones.name))}
            className="px-6 py-2 bg-[#B8960C] text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#7A6308] transition-colors"
          >
            Next →
          </button>
        )}
      </nav>
    </div>
  );
}
