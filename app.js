// Extract React hooks globally (No imports allowed in this file)
const { useState, useRef, useEffect } = React;

// ---------------------------------------------------------
// STEP 1: DATA UPLOAD & PARSING
// ---------------------------------------------------------
function DataUploadStep({ rows, setRows }) {
  const [textInput, setTextInput] = useState("");

  const handleLoadSample = () => {
    const sampleData = [
      { id: 1, label: "Table 01", url: "https://cafe.com/menu?table=1" },
      { id: 2, label: "Table 02", url: "https://cafe.com/menu?table=2" },
      { id: 3, label: "Table 03", url: "https://cafe.com/menu?table=3" },
      { id: 4, label: "Table 04", url: "https://cafe.com/menu?table=4" },
      { id: 5, label: "Table 05", url: "https://cafe.com/menu?table=5" }
    ];
    setRows(sampleData);
  };

  const handleParseText = () => {
    const lines = textInput.split("\n");
    const parsed = lines
      .map((line, index) => {
        const parts = line.split(",");
        if (parts.length >= 2) {
          return {
            id: index + 1,
            label: parts[0].trim(),
            url: parts[1].trim()
          };
        }
        return null;
      })
      .filter(row => row !== null);

    if (parsed.length > 0) {
      setRows(parsed);
    } else {
      alert("Invalid format. Please use: Label, URL (one per line)");
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg border border-[#D9CEBC] shadow-sm max-w-2xl mx-auto">
      <h2 className="text-xl font-bold font-space-grotesk mb-2 text-[#1A1410]">1. Data Import</h2>
      <p className="text-[#8A7F6E] mb-6 text-sm">Provide your layout data by pasting comma-separated entries or running our demo template.</p>
      
      <div className="mb-6">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#8A7F6E] mb-2">Paste Table Map Data (Format: Name, URL)</label>
        <textarea
          rows="6"
          className="w-full p-3 font-mono text-xs border border-[#D9CEBC] rounded bg-[#F7F3ED] focus:outline-none focus:border-[#B8960C]"
          placeholder="Table 01, https://cafe.com/table1&#10;Table 02, https://cafe.com/table2"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
        ></textarea>
        <button
          onClick={handleParseText}
          className="mt-2 w-full py-2 bg-[#1A1410] text-white rounded text-sm font-medium hover:bg-black transition-colors"
        >
          Parse Map Data
        </button>
      </div>

      <div className="relative my-6 flex items-center justify-center">
        <div className="absolute inset-0 border-t border-[#D9CEBC]"></div>
        <span className="relative bg-white px-4 text-xs font-bold uppercase tracking-wider text-[#8A7F6E]">Or</span>
      </div>

      <button 
        onClick={handleLoadSample}
        className="w-full px-6 py-3 bg-[#F7F3ED] border border-[#D9CEBC] text-[#1A1410] rounded-md hover:bg-[#EDE7DC] transition-colors font-medium text-sm"
      >
        Load Sandbox Dataset (5 Café Tables)
      </button>

      {rows.length > 0 && (
        <div className="mt-6 border border-[#D9CEBC] rounded bg-[#F7F3ED] p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A1410] mb-2">Loaded Targets ({rows.length})</h3>
          <div className="max-h-36 overflow-y-auto space-y-1 pr-2">
            {rows.map((row) => (
              <div key={row.id} className="flex justify-between text-xs bg-white p-2 rounded border border-[#D9CEBC]">
                <span className="font-bold text-[#1A1410]">{row.label}</span>
                <span className="font-mono text-[#8A7F6E] truncate max-w-xs">{row.url}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------
// STEP 2: INTERACTIVE INTERFACE MAPPING (CANVAS ZONES)
// ---------------------------------------------------------
function TemplateZonesStep({ template, setTemplate, zones, setZones }) {
  const canvasRef = useRef(null);
  const [activeZone, setActiveZone] = useState("qr");
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setTemplate(img);
        setImageDimensions({ width: img.width, height: img.height });
        setZones({
          qr: { x: Math.round(img.width * 0.25), y: Math.round(img.height * 0.2), w: Math.round(img.width * 0.5), h: Math.round(img.width * 0.5) },
          name: { x: Math.round(img.width * 0.1), y: Math.round(img.height * 0.75), w: Math.round(img.width * 0.8), h: Math.round(img.height * 0.1) }
        });
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!template || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = template.width;
    canvas.height = template.height;
    ctx.drawImage(template, 0, 0);

    if (zones.qr) {
      ctx.strokeStyle = activeZone === "qr" ? "#B8960C" : "#8A7F6E";
      ctx.lineWidth = Math.max(4, template.width / 150);
      ctx.strokeRect(zones.qr.x, zones.qr.y, zones.qr.w, zones.qr.h);
      ctx.fillStyle = activeZone === "qr" ? "rgba(184, 150, 12, 0.15)" : "rgba(138, 127, 110, 0.1)";
      ctx.fillRect(zones.qr.x, zones.qr.y, zones.qr.w, zones.qr.h);
    }

    if (zones.name) {
      ctx.strokeStyle = activeZone === "name" ? "#B8960C" : "#8A7F6E";
      ctx.lineWidth = Math.max(4, template.width / 150);
      ctx.strokeRect(zones.name.x, zones.name.y, zones.name.w, zones.name.h);
      ctx.fillStyle = activeZone === "name" ? "rgba(184, 150, 12, 0.15)" : "rgba(138, 127, 110, 0.1)";
      ctx.fillRect(zones.name.x, zones.name.y, zones.name.w, zones.name.h);
    }
  }, [template, zones, activeZone]);

  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: Math.round((e.clientX - rect.left) * scaleX),
      y: Math.round((e.clientY - rect.top) * scaleY)
    };
  };

  const handleMouseDown = (e) => {
    if (!template) return;
    const coords = getCanvasCoords(e);
    setIsDrawing(true);
    setStartPos(coords);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || !template) return;
    const currentCoords = getCanvasCoords(e);
    
    const x = Math.min(startPos.x, currentCoords.x);
    const y = Math.min(startPos.y, currentCoords.y);
    const w = Math.abs(startPos.x - currentCoords.x);
    const h = Math.abs(startPos.y - currentCoords.y);

    setZones(prev => ({
      ...prev,
      [activeZone]: { x, y, w: Math.max(20, w), h: Math.max(20, h) }
    }));
  };

  const handleMouseUp = () => setIsDrawing(false);

  return (
    <div className="bg-white p-8 rounded-lg border border-[#D9CEBC] shadow-sm max-w-4xl mx-auto">
      <h2 className="text-xl font-bold font-space-grotesk mb-2 text-[#1A1410]">2. Canvas Workspace Setup</h2>
      <p className="text-[#8A7F6E] mb-6 text-sm">Upload your background card image design and scale the placement bounds.</p>

      {!template ? (
        <div className="border-2 border-dashed border-[#D9CEBC] rounded-lg p-12 text-center bg-[#F7F3ED] hover:border-[#B8960C] transition-colors relative">
          <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
          <div className="text-4xl mb-2 text-[#8A7F6E]">🖼️</div>
          <p className="text-sm font-medium text-[#1A1410]">Select or Drop Background Card Template</p>
        </div>
      ) : (
        <div>
          <div className="flex gap-4 mb-4 justify-center">
            <button onClick={() => setActiveZone("qr")} className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded border ${activeZone === "qr" ? "bg-[#B8960C] text-white border-[#B8960C]" : "bg-white text-[#8A7F6E] border-[#D9CEBC]"}`}>Configure QR Zone</button>
            <button onClick={() => setActiveZone("name")} className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded border ${activeZone === "name" ? "bg-[#B8960C] text-white border-[#B8960C]" : "bg-white text-[#8A7F6E] border-[#D9CEBC]"}`}>Configure Text Zone</button>
          </div>
          <div className="border border-[#D9CEBC] rounded overflow-hidden max-h-[500px] overflow-auto bg-[#EDE7DC] flex justify-center">
            <canvas ref={canvasRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} className="max-w-full h-auto cursor-crosshair shadow-md" />
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------
// STEP 3: STYLING PARAMS
// ---------------------------------------------------------
function StyleConfigStep({ style, setStyle }) {
  useEffect(() => {
    if (Object.keys(style).length === 0) {
      setStyle({ textColor: "#1A1410", qrColor: "#000000", fontSizeRatio: 0.05, align: "center" });
    }
  }, []);

  const handleChange = (key, val) => setStyle(prev => ({ ...prev, [key]: val }));

  return (
    <div className="bg-white p-8 rounded-lg border border-[#D9CEBC] shadow-sm max-w-2xl mx-auto">
      <h2 className="text-xl font-bold font-space-grotesk mb-2 text-[#1A1410]">3. Graphic Style Rules</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8A7F6E] mb-1">QR Color</label>
            <input type="color" value={style.qrColor || "#000000"} onChange={(e) => handleChange("qrColor", e.target.value)} className="w-full h-10 border border-[#D9CEBC] rounded cursor-pointer" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8A7F6E] mb-1">Text Color</label>
            <input type="color" value={style.textColor || "#1A1410"} onChange={(e) => handleChange("textColor", e.target.value)} className="w-full h-10 border border-[#D9CEBC] rounded cursor-pointer" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#8A7F6E] mb-1">Text Size</label>
          <input type="range" min="0.02" max="0.12" step="0.005" value={style.fontSizeRatio || 0.05} onChange={(e) => handleChange("fontSizeRatio", parseFloat(e.target.value))} className="w-full accent-[#B8960C]" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#8A7F6E] mb-1">Alignment</label>
          <div className="grid grid-cols-3 gap-2">
            {["left", "center", "right"].map((alignment) => (
              <button key={alignment} onClick={() => handleChange("align", alignment)} className={`py-2 text-xs font-bold uppercase tracking-wider rounded border capitalize ${style.align === alignment ? "bg-[#1A1410] text-white border-[#1A1410]" : "bg-white text-[#8A7F6E] border-[#D9CEBC]"}`}>{alignment}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// STEP 4: GENERATOR & PDF EXPORT
// ---------------------------------------------------------
function GeneratorStep({ rows, template, zones, style }) {
  const [status, setStatus] = useState("ready");
  const [progress, setProgress] = useState(0);

  const processOutputPdf = async () => {
    setStatus("processing");
    setProgress(0);

    const { jsPDF } = window.jspdf;
    const imgW = template.width;
    const imgH = template.height;
    
    const pdf = new jsPDF({ orientation: imgW > imgH ? "l" : "p", unit: "px", format: [imgW, imgH] });
    const scratchCanvas = document.createElement("canvas");
    scratchCanvas.width = imgW;
    scratchCanvas.height = imgH;
    const ctx = scratchCanvas.getContext("2d");
    const qrEngineCanvas = document.createElement("canvas");

    for (let i = 0; i < rows.length; i++) {
      setProgress(Math.round(((i) / rows.length) * 100));
      const row = rows[i];

      ctx.clearRect(0, 0, imgW, imgH);
      ctx.drawImage(template, 0, 0);

      new QRious({
        element: qrEngineCanvas,
        value: row.url,
        size: zones.qr.w,
        background: "white",
        foreground: style.qrColor || "#000000",
        level: "H"
      });

      ctx.drawImage(qrEngineCanvas, zones.qr.x, zones.qr.y, zones.qr.w, zones.qr.h);

      ctx.fillStyle = style.textColor || "#1A1410";
      const calculatedFontSize = Math.round(imgW * (style.fontSizeRatio || 0.05));
      ctx.font = `bold ${calculatedFontSize}px Inter, system-ui, sans-serif`;
      ctx.textBaseline = "middle";

      let textX = zones.name.x;
      if (style.align === "center") {
        textX = zones.name.x + (zones.name.w / 2);
        ctx.textAlign = "center";
      } else if (style.align === "right") {
        textX = zones.name.x + zones.name.w;
        ctx.textAlign = "right";
      } else {
        ctx.textAlign = "left";
      }

      ctx.fillText(row.label, textX, zones.name.y + (zones.name.h / 2));

      const frameDataUrl = scratchCanvas.toDataURL("image/jpeg", 0.95);
      if (i > 0) pdf.addPage([imgW, imgH], imgW > imgH ? "l" : "p");
      pdf.addImage(frameDataUrl, "JPEG", 0, 0, imgW, imgH);
    }

    setProgress(100);
    pdf.save(`QR_Batch_Distribution_Manifest.pdf`);
    setStatus("complete");
  };

  return (
    <div className="bg-white p-8 rounded-lg border border-[#D9CEBC] shadow-sm max-w-2xl mx-auto text-center">
      <h2 className="text-xl font-bold font-space-grotesk mb-2 text-[#1A1410]">4. Export Print Document</h2>
      {status === "ready" && (
        <button onClick={processOutputPdf} className="w-full px-6 py-4 bg-[#27AE60] text-white rounded-md hover:bg-[#1E8449] transition-colors font-medium">
          Compile & Download PDF
        </button>
      )}
      {status === "processing" && (
        <div className="w-full">
          <div className="w-full bg-[#EDE7DC] rounded-full h-3 overflow-hidden mb-2">
            <div className="bg-[#B8960C] h-3 transition-all duration-150" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-xs font-mono text-[#8A7F6E]">Compiling layout arrays vector nodes: {progress}% complete</p>
        </div>
      )}
      {status === "complete" && (
        <div>
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#D4EDDA] text-[#155724] rounded-full text-xl mb-3">✓</div>
          <h3 className="text-md font-bold text-[#1A1410] mb-1">Finished! Check your downloads.</h3>
          <button onClick={() => setStatus("ready")} className="text-xs font-bold uppercase tracking-wider text-[#B8960C] underline">Re-run</button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------
// APP COMPONENT & RENDER
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
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center text-xl font-bold font-space-grotesk">
            <span className="text-[#B8960C] mr-2">⬡</span><span>QR<em className="font-normal not-italic text-[#8A7F6E]">forge</em></span>
          </div>
          <span className="text-xs font-bold uppercase bg-[#EDE7DC] px-2.5 py-1 rounded text-[#8A7F6E]">Step {step} of 4</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 mt-4">
        {step === 1 && <DataUploadStep rows={rows} setRows={setRows} />}
        {step === 2 && <TemplateZonesStep template={template} setTemplate={setTemplate} zones={zones} setZones={setZones} />}
        {step === 3 && <StyleConfigStep style={style} setStyle={setStyle} />}
        {step === 4 && <GeneratorStep rows={rows} template={template} zones={zones} style={style} />}
      </main>

      <nav className="fixed bottom-0 w-full bg-white border-t border-[#D9CEBC] p-4 flex justify-between items-center shadow-lg">
        {step > 1 ? <button onClick={() => setStep(step - 1)} className="px-5 py-2 border border-[#D9CEBC] rounded-md font-medium text-sm">← Back</button> : <div />}
        {step < 4 && (
          <button onClick={() => setStep(step + 1)} disabled={(step === 1 && rows.length === 0) || (step === 2 && !template)} className="px-6 py-2 bg-[#B8960C] text-white rounded-md disabled:opacity-40 font-medium text-sm">Next →</button>
        )}
      </nav>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
