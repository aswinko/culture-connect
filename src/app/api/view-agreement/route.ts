import { NextRequest } from "next/server"
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"

export async function POST(req: NextRequest) {
  const { user, organizer } = await req.json()

  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([600, 800])
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

  const drawText = (text: string, x: number, y: number, size = 12) => {
    page.drawText(text, { x, y, size, font, color: rgb(0, 0, 0) })
  }

  let y = 770
  drawText("CultureConnect Event Agreement (Preview)", 20, y, 16)
  y -= 30
  drawText(`User: ${user}`, 20, y)
  y -= 20
  drawText(`Organizer: ${organizer}`, 20, y)
  y -= 30

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
  ]

  const wrapText = (text: string, maxWidth: number): string[] => {
    const words = text.split(' ')
    let line = ''
    const lines: string[] = []

    for (const word of words) {
      const testLine = line + word + ' '
      const width = font.widthOfTextAtSize(testLine, 10)
      if (width > maxWidth) {
        lines.push(line.trim())
        line = word + ' '
      } else {
        line = testLine
      }
    }

    if (line.trim()) lines.push(line.trim())
    return lines
  }

  for (let i = 0; i < terms.length; i++) {
    const lines = wrapText(terms[i], 550)
    for (const line of lines) {
      if (y < 40) {
        page.drawText("...continued on next page", { x: 20, y: 20, size: 10, font })
        const newPage = pdfDoc.addPage([600, 800])
        y = 770
        page.drawText("Continued Terms", { x: 20, y, size: 14, font })
        y -= 30
      }
      y -= 15
      drawText(line, 20, y, 10)
    }
    y -= 10
  }

  y -= 20
  drawText("Acknowledgment", 20, y, 12)
  y -= 15
  drawText("By confirming this booking, both parties agree to the above terms.", 20, y, 10)
  y -= 12
  drawText("This agreement is governed by the policies of the CultureConnect platform.", 20, y, 10)

  const pdfBytes = await pdfDoc.save()

  return new Response(pdfBytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=agreement-preview.pdf",
    },
  })
}
