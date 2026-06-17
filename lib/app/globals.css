@tailwind base;
@tailwind components;
@tailwind utilities;

@media print {
  /* Hide the dashboard completely during printing */
  body * {
    visibility: hidden;
  }
  
  /* Render only the receipt element */
  #thermal-receipt, #thermal-receipt * {
    visibility: visible;
  }
  
  #thermal-receipt {
    position: absolute;
    left: 0;
    top: 0;
    width: 80mm;
    margin: 0;
    padding: 4mm;
  }

  /* Force the browser page setup to match an 80mm continuous roll */
  @page {
    margin: 0;
    size: 80mm auto;
  }
}
