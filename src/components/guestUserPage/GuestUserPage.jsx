"use client"

import { useState, useEffect } from "react"
import { Button } from "@mui/material"
import { Card, CardContent } from "@mui/material"
import { AccessTime, Mail, CheckCircle, Visibility, Shield, Group } from "@mui/icons-material"

export default function TeamReviewPage() {
  const [mounted, setMounted] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const reviewSteps = [
    { icon: Visibility, label: "Under Review", completed: false, active: true },
    { icon: Shield, label: "Security Check", completed: false },
    { icon: CheckCircle, label: "Approval Complete", completed: false },
  ]

  useEffect(() => {
    setMounted(true)

    // Simulate review progress animation
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 3)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4 relative">
      {/* Animated background elements - Fixed positioning */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <Card
        className={`w-full max-w-lg relative z-10 border-0 shadow-2xl bg-white/80 backdrop-blur-sm transition-all duration-1000 ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
      >
        <CardContent className="p-8 text-center">
          {/* Animated team icon */}
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto bg-gradient-to-r from-indigo-500 to-cyan-600 rounded-full flex items-center justify-center shadow-lg">
              <Group className="w-12 h-12 text-white" />
            </div>
            {/* Animated dots around the icon */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce animation-delay-200"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce animation-delay-400"></div>
              </div>
            </div>
          </div>

          {/* Main heading */}
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            Review in Progress
          </h1>

          <p className="text-gray-600 mb-8 leading-relaxed">
            Our team is carefully reviewing your details. You'll receive an email notification once the review is
            complete.
          </p>

          {/* Review process steps */}
          <div className="space-y-4 mb-8">
            {reviewSteps.map((step, index) => {
              const Icon = step.icon
              return (
                <div
                  key={index}
                  className={`flex items-center p-4 rounded-lg border transition-all duration-500 ${
                    step.completed
                      ? "bg-green-50 border-green-200"
                      : step.active
                        ? "bg-indigo-50 border-indigo-200"
                        : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 transition-all duration-300 ${
                      step.completed ? "bg-green-500" : step.active ? "bg-indigo-500" : "bg-gray-300"
                    }`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <span
                      className={`font-medium ${
                        step.completed ? "text-green-700" : step.active ? "text-indigo-700" : "text-gray-500"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {step.completed && <CheckCircle className="w-5 h-5 text-green-500" />}
                  {step.active && <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>}
                </div>
              )
            })}
          </div>

          {/* Estimated time */}
          <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 p-6 rounded-xl border border-indigo-100 mb-8">
            <div className="flex items-center justify-center mb-3">
              <AccessTime className="w-5 h-5 text-indigo-600 mr-2" />
              <span className="font-semibold text-indigo-700">Estimated Review Time</span>
            </div>
            <div className="text-2xl font-bold text-indigo-600 mb-2">24-48 Hours</div>
            <p className="text-sm text-indigo-600">We'll notify you as soon as we're done!</p>
          </div>

          {/* Email notification info */}
          <div className="flex items-center justify-center p-4 bg-cyan-50 rounded-lg border border-cyan-200 mb-6">
            <Mail className="w-5 h-5 text-cyan-600 mr-3" />
            <div className="text-left">
              <p className="text-sm font-medium text-cyan-700">Email Notification</p>
              <p className="text-xs text-cyan-600">You'll receive an update at your registered email</p>
            </div>
          </div>

          {/* Action button */}
          <Button
            variant="outline"
            className="w-full border-2 border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-300 mb-6"
          >
            Return to Dashboard
          </Button>

          {/* Help section */}
          <div className="pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-2">Need help or have questions?</p>
            <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium underline underline-offset-2">
              Contact our support team
            </button>
          </div>

          {/* Animated progress indicator */}
          <div className="mt-6">
            <div className="flex justify-center space-x-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === currentStep ? "bg-indigo-500 scale-125" : "bg-gray-300"
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
