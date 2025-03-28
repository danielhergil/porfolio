'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function Home() {
  const [typedText, setTypedText] = useState('') // Holds the typed text
  const [showCursor, setShowCursor] = useState(true)

  // Define the complete text to type
  const fullText = 'Automation Engineer with CI/CD and Cloud.'

  useEffect(() => {
    let currentIndex = 0;

    const intervalId = setInterval(() => {
      if (currentIndex < fullText.length) {
        setTypedText(fullText.substring(0, currentIndex + 1)); // Update typedText correctly
        currentIndex++;
      } else {
        clearInterval(intervalId);
        setShowCursor(false); // Hide cursor after typing is complete
      }
    }, 100); // Typing speed in milliseconds

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)

    return () => clearInterval(cursorInterval)
  }, [])

  // Function to dynamically format the typed text with JSX
  const formatText = (text: string) => {
    // Match keywords only when they are fully typed
    const parts = text.split(/(CI\/CD|Cloud)/g) // Match "CI/CD" and "Cloud"
    return parts.map((part, index) => {
      if (part === 'CI/CD' || part === 'Cloud') {
        return (
          <span key={index} className="font-bold text-blue-500">
            {part}
          </span>
        )
      }
      return part // Return plain text parts
    })
  }

  return (
    <div className="relative min-h-full p-4 md:p-8">
      <div className="absolute inset-0 flex flex-col items-center justify-center opacity-5 pointer-events-none">
        <span className="text-[10rem] md:text-[20rem] font-bold">I BUILD</span>
        <span className="text-[5rem] md:text-[10rem] font-bold mt-4">WITH <span className="text-red-500">&lt;3</span></span>
      </div>
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
        <div className="space-y-4 md:space-y-8 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold text-white">Dani HG</h1>
          <div className="text-xl md:text-2xl text-gray-300">
            {formatText(typedText)}
            {showCursor && <span className="animate-pulse">|</span>}
          </div>
          <p className="text-lg text-gray-400 max-w-2xl">
            Passionate about improving workflows and ensuring quality through automation. With 5+ years of experience in test automation using JavaScript and Python, I also enjoy working on CI/CD and infrastructure automation with tools like Argo, Kubernetes, and Docker to support seamless deployments.
          </p>
          <div className="flex justify-center md:justify-start space-x-4 md:space-x-6">
            <img
              src="https://raw.githubusercontent.com/material-extensions/vscode-material-icon-theme/main/icons/playwright.svg"
              alt="Playwright"
              className="w-8 h-8 md:w-16 md:h-16"
            />
            <img
              src="https://raw.githubusercontent.com/material-extensions/vscode-material-icon-theme/main/icons/nodejs.svg"
              alt="Node.js"
              className="w-8 h-8 md:w-16 md:h-16"
            />
            <img
              src="https://raw.githubusercontent.com/material-extensions/vscode-material-icon-theme/main/icons/docker.svg"
              alt="Docker"
              className="w-8 h-8 md:w-16 md:h-16"
            />
            <img
              src="https://raw.githubusercontent.com/material-extensions/vscode-material-icon-theme/main/icons/python.svg"
              alt="Python"
              className="w-8 h-8 md:w-16 md:h-16"
            />
            <img
              src="https://raw.githubusercontent.com/material-extensions/vscode-material-icon-theme/main/icons/kubernetes.svg"
              alt="Kubernetes"
              className="w-8 h-8 md:w-16 md:h-16"
            />
          </div>
        </div>
        <div className="relative flex items-center justify-center mt-8 md:mt-0 w-48 h-48 md:w-96 md:h-96 md:-left-4">
          {/* Outer Glow Effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse blur-lg"></div>
          
          {/* Inner Container */}
          <div className="relative w-full h-full rounded-full bg-gradient-to-b from-gray-800 to-gray-900 p-2 shadow-2xl">
            <div className="w-full h-full rounded-full bg-gray-900 p-1 border-4 border-gray-700">
              <Image
                src="/avatar.png?height=400&width=400"
                alt="Developer Avatar"
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
