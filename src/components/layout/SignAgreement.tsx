"use client"

import SignatureCanvas from 'react-signature-canvas'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'

export default function SignAgreement({ user, organizer }: { user: string, organizer: string }) {
  const sigCanvas = useRef<SignatureCanvas>(null)
  const [isSigned, setIsSigned] = useState(false)

  const clear = () => {
    sigCanvas.current?.clear()
    setIsSigned(false)
  }

  const saveSignature = async () => {
    if (sigCanvas.current?.isEmpty()) {
      alert("Please provide a signature first!")
      return
    }

    const signatureImage = sigCanvas.current?.toDataURL()

    // Send the signature image to your dynamic PDF route
    const res = await fetch(`/api/generate-agreement`, {
      method: "POST",
      body: JSON.stringify({ user, organizer, signatureImage }),
      headers: {
        "Content-Type": "application/json",
      },
    })

    const blob = await res.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "event-agreement.pdf"
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Sign the Agreement</h3>
      <SignatureCanvas
        ref={sigCanvas}
        penColor="black"
        canvasProps={{ width: 500, height: 200, className: "border rounded" }}
        onEnd={() => setIsSigned(true)}
      />
      <div className="flex gap-4">
        <Button variant="outline" onClick={clear}>
          Clear
        </Button>
        <Button onClick={saveSignature} disabled={!isSigned}>
          Submit & Download PDF
        </Button>
      </div>
    </div>
  )
}
