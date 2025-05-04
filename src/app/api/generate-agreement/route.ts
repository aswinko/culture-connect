import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function POST(req: NextRequest) {
  const { user, organizer, signatureImage } = await req.json();

  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([595, 842]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pageHeight = page.getSize().height;

  let y = pageHeight - 50;

  // Add new page if needed
  const addNewPage = () => {
    page = pdfDoc.addPage([595, 842]);
    y = page.getSize().height - 50;
  };

  // Check if there's enough space, otherwise add page
  const safeY = (spacing: number) => {
    if (y - spacing < 50) {
      addNewPage();
    }
  };

  const drawLine = () => {
    safeY(20);
    y -= 10;
    page.drawText("------------------------------------------------------------", {
      x: 50,
      y,
      size: 12,
      font,
      color: rgb(0.5, 0.5, 0.5),
    });
    y -= 10;
  };

  const drawText = (text: string, size = 12, spacing = 20) => {
    safeY(spacing);
    y -= spacing;
    page.drawText(text, { x: 50, y, size, font, color: rgb(0, 0, 0) });
  };

  drawText("CultureConnect Booking Agreement", 18, 30);
  drawText("This Agreement is made between:", 14, 20);

  drawText(`Service Provider (Event Manager): ${organizer}`);
  drawText(`Customer (Event Booker): ${user}`);

  drawLine();

  drawText("Terms & Conditions", 14, 30);

  const terms = [
    "1. All performances booked through CultureConnect shall be conducted professionally under the name and profile of the event manager registered on the platform.",
    "2. The full amount agreed upon must be paid to the event manager, of which a fixed percentage (platform fee) is retained by CultureConnect.",
    "3. The advance amount is paid online via the platform at the time of booking. The remaining balance must be paid directly to the event manager on the day of the event.",
    "4. For outstation programs, customers must cover travel, fuel, and food expenses for the performers. Within local limits, vehicle charges are applicable as per standard rates.",
    "5. The customer must be present or have a representative available at the venue on the event day for coordination and verification.",
    "6. The agreed duration of the performance should be strictly followed. Extensions may not be possible due to other bookings or commitments.",
    "7. If required, the customer must arrange basic accommodation for the performers, especially for programs at distant locations.",
    "8. The organizer must provide clean drinking water and hygienic food for the performing team on the event day.",
    "9. If the program requires lighting, sound system, or stage arrangements, it is the responsibility of the customer to arrange these beforehand.",
    "10. In case of cancellation or rescheduling, it must be communicated well in advance. Any expenses or losses incurred due to such changes will be the responsibility of the customer. The advance may not be refundable as per cancellation policy.",
    "11. Any misbehavior, safety concerns, or violation of this agreement will lead to immediate cancellation of the performance without refund.",
  ];

  const maxWidth = 500;

  const drawWrappedText = (text: string, size: number = 10, spacing = 18) => {
    const words = text.split(" ");
    let line = "";
  
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + " ";
      const width = font.widthOfTextAtSize(testLine, size);
  
      if (width > maxWidth) {
        drawText(line.trim(), size, spacing);
        line = words[i] + " ";
      } else {
        line = testLine;
      }
    }
  
    if (line) {
      drawText(line.trim(), size, spacing);
    }
  };
  
  for (const term of terms) {
    drawWrappedText(term, 10, 16);
  }
  

// Add a line before the Acknowledgment
drawLine();

// Acknowledgment heading
drawText("Acknowledgment", 14, 30);

// Wrap the acknowledgment text
const acknowledgmentText = 
  "By confirming this booking, both parties agree to the above terms. This agreement is binding and governed by the policies of the CultureConnect platform.";

// Wrap the acknowledgment text to fit within the page width
drawWrappedText(acknowledgmentText, 10, 16);

  // Add signature image if available
  if (signatureImage) {
    if (y < 180) addNewPage(); // Ensure space for signature

    const signatureImageBytes = signatureImage.split(",")[1];
    const signatureBytes = Uint8Array.from(
      atob(signatureImageBytes),
      (c) => c.charCodeAt(0)
    );
    const signature = await pdfDoc.embedPng(signatureBytes);

    const sigDims = signature.scale(0.3);
    const sigX = 50;
    const sigY = y - 100;

    page.drawImage(signature, {
      x: sigX,
      y: sigY,
      width: sigDims.width,
      height: sigDims.height,
    });

    page.drawText("Signature of Customer:", {
      x: sigX,
      y: sigY - 20,
      size: 11,
      font,
      color: rgb(0, 0, 0),
    });
  }

  const pdfBytes = await pdfDoc.save();

  return new NextResponse(pdfBytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=cultureconnect-agreement.pdf",
    },
  });
}
