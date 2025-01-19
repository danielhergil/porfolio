"use client"

import { useState, useRef, useEffect } from "react"
import Sidebar from "./components/Sidebar"
import SocialBar from "./components/SocialBar"
import Tabs from "./components/Tabs"
import WindowControls from "./components/WindowControls"
import Home from "./components/Home"
import Experience from "./components/Experience"
import Projects from "./components/Projects"
import Contact from "./components/Contact"
import MobileNav from "./components/MobileNav"
import TerminalComponent from "./components/TerminalComponent"

const fileIcons = {
  "Home.jsx": "https://raw.githubusercontent.com/material-extensions/vscode-material-icon-theme/main/icons/react.svg",
  "Experience.py":
    "https://raw.githubusercontent.com/material-extensions/vscode-material-icon-theme/main/icons/python.svg",
  "Projects.json":
    "https://raw.githubusercontent.com/material-extensions/vscode-material-icon-theme/main/icons/json.svg",
  "Contact.js":
    "https://raw.githubusercontent.com/material-extensions/vscode-material-icon-theme/main/icons/javascript.svg",
}

interface Tab {
  name: string
  icon: string
}

export default function VSCodePortfolio() {
  const [openTabs, setOpenTabs] = useState<Tab[]>([{ name: "Home.jsx", icon: fileIcons["Home.jsx"] }])
  const [activeTab, setActiveTab] = useState("Home.jsx")
  const [isTerminalOpen, setIsTerminalOpen] = useState(false)
  const [terminalHeight, setTerminalHeight] = useState(200)
  const mainContentRef = useRef<HTMLDivElement>(null)
  const [contentWidth, setContentWidth] = useState(0)

  useEffect(() => {
    const updateContentWidth = () => {
      if (mainContentRef.current) {
        setContentWidth(mainContentRef.current.offsetWidth)
      }
    }

    updateContentWidth()
    window.addEventListener("resize", updateContentWidth)
    return () => window.removeEventListener("resize", updateContentWidth)
  }, [])

  useEffect(() => {
    const body = document.body
    if (isTerminalOpen) {
      body.style.overflow = "hidden"
    } else {
      body.style.overflow = ""
    }

    return () => {
      body.style.overflow = ""
    }
  }, [isTerminalOpen])

  const handleTabClick = (fileName: string) => {
    if (!openTabs.some((tab) => tab.name === fileName)) {
      setOpenTabs([...openTabs, { name: fileName, icon: fileIcons[fileName] }])
    }
    setActiveTab(fileName)
  }

  const handleTabClose = (fileName: string) => {
    const newTabs = openTabs.filter((tab) => tab.name !== fileName)
    setOpenTabs(newTabs)
    if (activeTab === fileName) {
      setActiveTab(newTabs[newTabs.length - 1]?.name || "")
    }
  }

  const handleTabsReorder = (newTabs: Tab[]) => {
    setOpenTabs(newTabs)
  }

  const renderContent = () => {
    switch (activeTab) {
      case "Home.jsx":
        return <Home />
      case "Experience.py":
        return <Experience />
      case "Projects.json":
        return <Projects />
      case "Contact.js":
        return <Contact />
      default:
        return null
    }
  }

  const handleTerminalResize = (e: React.MouseEvent<HTMLDivElement>) => {
    const startY = e.clientY
    const startHeight = terminalHeight

    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = startY - e.clientY
      const newHeight = Math.max(100, Math.min(startHeight + deltaY, window.innerHeight - 100))
      setTerminalHeight(newHeight)
    }

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  return (
    <div className="flex flex-col h-screen text-gray-300 bg-[#1e1e1e]">
      <WindowControls />
      <div className="flex flex-1 overflow-hidden">
        {/* SocialBar */}
        <div className="hidden md:flex flex-col h-full">
          <SocialBar
            onEmailClick={() => handleTabClick("Contact.js")}
            setActiveFile={(fileName) => {
              if (fileName === "Terminal") {
                setIsTerminalOpen(true)
              } else {
                handleTabClick(fileName)
              }
            }}
          />
        </div>
        {/* Sidebar */}
        <div className="hidden md:flex flex-col h-full">
          <Sidebar activeFile={activeTab} setActiveFile={handleTabClick} />
        </div>
        {/* Main Content */}
        <div ref={mainContentRef} className="flex flex-col flex-1 overflow-hidden">
          <Tabs
            tabs={openTabs}
            activeTab={activeTab}
            onTabClick={setActiveTab}
            onTabClose={handleTabClose}
            onTabsReorder={handleTabsReorder}
          />
          <div className="flex-1 overflow-auto custom-scrollbar">{renderContent()}</div>
        </div>
      </div>
      {/* Terminal */}
      {isTerminalOpen && (
        <div
          className="absolute bottom-0 left-[19rem] right-0 bg-[#1e1e1e] border-t border-gray-700 z-50"
          style={{
            height: `${terminalHeight}px`,
            pointerEvents: "auto",
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-1 bg-gray-700 cursor-row-resize"
            onMouseDown={handleTerminalResize}
          />
          <div className="flex justify-between items-center bg-[#2d2d2d] text-gray-400 px-4 py-1 border-b border-gray-700">
            <span>Terminal</span>
            <button onClick={() => setIsTerminalOpen(false)} className="text-gray-400 hover:text-red-500">
              ✕
            </button>
          </div>
          <div className="h-[calc(100%-32px)] w-full overflow-hidden">
            <TerminalComponent height={terminalHeight - 32} />
          </div>
        </div>
      )}
      <MobileNav activeTab={activeTab} setActiveTab={handleTabClick} />
    </div>
  )
}

