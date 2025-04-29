import { NextRequest, NextResponse } from "next/server"
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"

export async function POST(req: NextRequest) {
  const { user, organizer, signatureImage } = await req.json()

  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595, 842])
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

  const { height } = page.getSize()

  page.drawText("Event Booking Agreement", {
    x: 50,
    y: height - 60,
    size: 20,
    font,
    color: rgb(0, 0, 0),
  })

  page.drawText(`This agreement is made between ${organizer} and ${user}.`, {
    x: 50,
    y: height - 100,
    size: 14,
    font,
    color: rgb(0, 0, 0),
  })

  page.drawText("Terms & Conditions:", {
    x: 50,
    y: height - 140,
    size: 14,
    font,
    color: rgb(0, 0, 0),
  })

  page.drawText("- You agree to the event rules.", { x: 70, y: height - 170, size: 12, font })
  page.drawText("- Payment is due after signing.", { x: 70, y: height - 190, size: 12, font })

  // Embed the signature image
  if (signatureImage) {
    const signatureImageBytes = signatureImage.split(",")[1]
    const signatureBytes = Uint8Array.from(atob(signatureImageBytes), c => c.charCodeAt(0))
    const signature = await pdfDoc.embedPng(signatureBytes)

    const sigDims = signature.scale(0.5)
    page.drawImage(signature, {
      x: 50,
      y: height - 300,
      width: sigDims.width,
      height: sigDims.height,
    })
  }

  const pdfBytes = await pdfDoc.save()

  return new NextResponse(pdfBytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=event-agreement.pdf",
    },
  })
}
