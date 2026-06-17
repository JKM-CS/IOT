// Extract React hooks from the global object
const { useState } = React;

// ---------------------------------------------------------
// STEP 1: Data Upload
// ---------------------------------------------------------
function DataUploadStep({ rows, setRows }) {
  return (
    <div className="bg-white p-8 rounded-lg border border-[#D9CEBC] shadow-sm text-center">
      <h2 className="text-xl font-bold font-space-grotesk mb-4">Upload Table Data</h2>
      <p className="text-[#8A7F6E] mb-6">Import your CSV containing the URLs and Table Numbers.</p>
      <button 
        onClick={() => setRows([{ id: 1, url: 'https://cafe.com/t/1', label: 'Table 01' }])}
        className="px-6 py-3 bg-[#F7F3ED] border border-[#D9CEBC] rounded-md hover:bg-[#EDE7DC] transition-colors"
      >
        Load Sample Data (Simulated)
      </button>
    </div>
  );
}

// ---------------------------------------------------------
// STEP 2: Template & Zones
// ---------------------------------------------------------
function TemplateZonesStep({ template, setTemplate, zones, setZones }) {
  return (
    <div className="bg-white p-8 rounded-lg border border-[#D9CEBC] shadow-sm">
      <h2 className="text-xl font-bold font-space-grotesk mb-4">Configure Template Zones</h2>
      <p className="text-[#8A7F6E] mb-6">Define where the QR code and text should be placed.</p>
      <button 
        onClick={() => setZones({ qr: { x: 100, y: 100 }, name: { x: 100, y: 300 } })}
        className="px-6 py-3 bg-[#F7F3ED] border border-[#D9CEBC] rounded-md hover:bg-[#EDE7DC] transition-colors"
      >
        Simulate Zone Configuration
      </button>
    </div>
  );
}

// ---------------------------------------------------------
// STEP 3: Style Configuration
// ---------------------------------------------------------
function StyleConfigStep({ style, setStyle }) {
  return (
    <div className="bg-white p-8 rounded-lg border border-[#D9CEBC] shadow-sm">
      <h2 className="text-xl font-bold font-space-grotesk mb-4">Styling Parameters</h2>
      <p className="text-[#8A7F6E] mb-6">Set QR code colors, error correction level, and font sizes.</p>
      <div className="text-sm text-[#8A7F6E] p-4 bg-[#F7F3ED] rounded-md border border-[#D9CEBC]">
        Configuration controls will go here.
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// STEP 4: Final Generator
// ---------------------------------------------------------
function GeneratorStep({ rows, template, zones, style }) {
  return (
    <div className="bg-white p-8 rounded-lg border border-[#D9CEBC] shadow-sm">
      <h2 className="text-xl font-bold font-space-grotesk mb-4">Generate Output</h2>
      <p className="text-[#8A7F6E] mb-6">Ready to process {rows.length} records.</p>
      <button className="px-6 py-3 bg-[#27AE60] text-white rounded-md hover:bg-[#1E8449] transition-colors font-medium">
        Export PDF
      </button>
    </div>
  );
}

// ---------------------------------------------------------
// MAIN APPLICATION
// ---------------------------------------------------------
function App() {
  const [step, setStep] = useState(1);
  const [rows, setRows] = useState([]);
  const [template, setTemplate] = useState(null);
  const [zones, setZones] = useState({ qr: null, name: null });
  const [style, setStyle] = useState({});

  return (
    <div className="min-h-screen pb-24">
      <header className="p-6 bg-white border-b border-[#D9CEBC]">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center text-xl font-bold font-space-grotesk">
            <span className="text-[#B8960C] mr-2">⬡</span>
            <span>QR<em className="font-normal not-italic text-[#8A7F6E]">forge</em></span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 mt-6">
        {step === 1 && <DataUploadStep rows={rows} setRows={setRows} />}
        {step === 2 && <TemplateZonesStep template={template} setTemplate={setTemplate} zones={zones} setZones={setZones} />}
        {step === 3 && <StyleConfigStep style={style} setStyle={setStyle} />}
        {step === 4 && <GeneratorStep rows={rows} template={template} zones={zones} style={style} />}
      </main>

      <nav className="fixed bottom-0 w-full bg-white border-t border-[#D9CEBC] p-4 flex justify-between items-center shadow-[0_-2px_12px_rgba(0,0,0,0.08)]">
        {step > 1 ? (
          <button 
            onClick={() => setStep(step - 1)} 
            className="px-5 py-2 border border-[#D9CEBC] text-[#1A1410] rounded-md hover:bg-[#EDE7DC] transition-colors font-medium"
          >
            ← Back
          </button>
        ) : <div />}
        
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
            className="px-6 py-2 bg-[#B8960C] text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#7A6308] transition-colors font-medium"
          >
            Next →
          </button>
        )}
      </nav>
    </div>
  );
}

// ---------------------------------------------------------
// INITIALIZE REACT DOM
// ---------------------------------------------------------
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
