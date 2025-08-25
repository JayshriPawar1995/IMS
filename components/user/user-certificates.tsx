"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Eye, Award } from "lucide-react"

interface Certificate {
  id: string
  courseName: string
  issueDate: string
  certificateId: string
  status: "issued" | "pending"
  downloadUrl?: string
}

export function UserCertificates() {
  const [certificates] = useState<Certificate[]>([
    {
      id: "1",
      courseName: "Customer Service Excellence",
      issueDate: "2024-01-15",
      certificateId: "CERT-2024-001",
      status: "issued",
      downloadUrl: "/certificates/cert-001.pdf",
    },
    {
      id: "2",
      courseName: "Digital Marketing Basics",
      issueDate: "2024-01-10",
      certificateId: "CERT-2024-002",
      status: "issued",
      downloadUrl: "/certificates/cert-002.pdf",
    },
    {
      id: "3",
      courseName: "Basics of Building Village Digital Booth",
      issueDate: "",
      certificateId: "",
      status: "pending",
    },
  ])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">My Certificates</h2>
        <p className="text-gray-600">View and download your course completion certificates</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((certificate) => (
          <Card key={certificate.id}>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{certificate.courseName}</CardTitle>
                  <Badge
                    variant={certificate.status === "issued" ? "default" : "secondary"}
                    className={certificate.status === "issued" ? "bg-green-100 text-green-800" : ""}
                  >
                    {certificate.status === "issued" ? "Issued" : "Pending"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {certificate.status === "issued" ? (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Certificate ID:</span>
                        <span className="font-medium">{certificate.certificateId}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Issue Date:</span>
                        <span className="font-medium">{new Date(certificate.issueDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm" className="flex-1">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm">Complete the course to receive your certificate</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {certificates.filter((c) => c.status === "issued").length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Certificates Yet</h3>
            <p className="text-gray-500">Complete courses to earn certificates</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
