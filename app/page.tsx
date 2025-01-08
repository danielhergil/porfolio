'use client'

import { useState } from 'react'
import Sidebar from './components/Sidebar'
import SocialBar from './components/SocialBar'
import Tabs from './components/Tabs'
import WindowControls from './components/WindowControls'
import Home from './components/Home'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Contact from './components/Contact'
import MobileNav from './components/MobileNav'

const fileIcons = {
  'Home.jsx': 'https://raw.githubusercontent.com/material-extensions/vscode-material-icon-theme/main/icons/react.svg',
  'Experience.py': 'https://raw.githubusercontent.com/material-extensions/vscode-material-icon-theme/main/icons/python.svg',
  'Projects.json': 'https://raw.githubusercontent.com/material-extensions/vscode-material-icon-theme/main/icons/json.svg',
  'Contact.js': 'https://raw.githubusercontent.com/material-extensions/vscode-material-icon-theme/main/icons/javascript.svg',
}

export default function VSCodePortfolio() {
  const [openTabs, setOpenTabs] = useState(['Home.jsx'])
  const [activeTab, setActiveTab] = useState('Home.jsx')

  const handleTabClick = (fileName: string) => {
    if (!openTabs.includes(fileName)) {
      setOpenTabs([...openTabs, fileName])
    }
    setActiveTab(fileName)
  }

  const handleTabClose = (fileName: string) => {
    const newTabs = openTabs.filter(tab => tab !== fileName)
    setOpenTabs(newTabs)
    if (activeTab === fileName) {
      setActiveTab(newTabs[newTabs.length - 1] || '')
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'Home.jsx':
        return <Home />
      case 'Experience.py':
        return <Experience />
      case 'Projects.json':
        return <Projects />
      case 'Contact.js':
        return <Contact />
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col h-screen text-gray-300 bg-[#1e1e1e]">
      <WindowControls />
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:flex flex-col h-full">
          <SocialBar onEmailClick={() => handleTabClick('Contact.js')} setActiveFile={handleTabClick} />
        </div>
        <div className="hidden md:flex flex-col h-full">
          <Sidebar activeFile={activeTab} setActiveFile={handleTabClick} />
        </div>
        <div className="flex flex-col flex-1 overflow-hidden">
          <Tabs
            tabs={openTabs.map(tab => ({ name: tab, icon: fileIcons[tab] }))}
            activeTab={activeTab}
            onTabClick={handleTabClick}
            onTabClose={handleTabClose}
          />
          <div className="flex-1 overflow-auto">
            {renderContent()}
          </div>
        </div>
      </div>
      <MobileNav activeTab={activeTab} setActiveTab={handleTabClick} />
    </div>
  )
}

