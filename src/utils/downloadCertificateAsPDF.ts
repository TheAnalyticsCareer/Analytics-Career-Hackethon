// Utility to download a DOM node as PDF (uses html2canvas + jsPDF)
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function downloadCertificateAsPDF(elementId: string, filename: string) {
  const element = document.getElementById(elementId);
  if (!element) return;
  const canvas = await html2canvas(element, { backgroundColor: '#fff', scale: 2 });
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [800, 600] });
  pdf.addImage(imgData, 'PNG', 0, 0, 800, 600);
  pdf.save(filename);
}

// New utility to get PDF as Blob for upload
export async function getCertificatePDFBlob(elementId: string): Promise<Blob | null> {
  const element = document.getElementById(elementId);
  if (!element) return null;
  const canvas = await html2canvas(element, { backgroundColor: '#fff', scale: 2 });
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [800, 600] });
  pdf.addImage(imgData, 'PNG', 0, 0, 800, 600);
  return pdf.output('blob');
}
