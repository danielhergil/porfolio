'use client';

import { useState, useRef, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import SocialBar from './components/SocialBar';
import Tabs from './components/Tabs';
import WindowControls from './components/WindowControls';
import Home from './components/Home';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Contact from './components/Contact';
import MobileNav from './components/MobileNav';
import TerminalComponent from './components/TerminalComponent';

const fileIcons = {
  'Home.jsx': 'https://raw.githubusercontent.com/material-extensions/vscode-material-icon-theme/main/icons/react.svg',
  'Experience.py': 'https://raw.githubusercontent.com/material-extensions/vscode-material-icon-theme/main/icons/python.svg',
  'Projects.json': 'https://raw.githubusercontent.com/material-extensions/vscode-material-icon-theme/main/icons/json.svg',
  'Contact.js': 'https://raw.githubusercontent.com/material-extensions/vscode-material-icon-theme/main/icons/javascript.svg',
};

export default function VSCodePortfolio() {
  const [openTabs, setOpenTabs] = useState(['Home.jsx']);
  const [activeTab, setActiveTab] = useState('Home.jsx');
  const [isTerminalOpen, setIsTerminalOpen] = useState(false); // Track terminal visibility
  const mainContentRef = useRef<HTMLDivElement>(null); // Ref to measure main content width
  const [contentWidth, setContentWidth] = useState(0);

  useEffect(() => {
    const updateContentWidth = () => {
      if (mainContentRef.current) {
        setContentWidth(mainContentRef.current.offsetWidth);
      }
    };

    updateContentWidth();
    window.addEventListener('resize', updateContentWidth);
    return () => window.removeEventListener('resize', updateContentWidth);
  }, []);

  // Toggle body scrolling based on terminal state
  useEffect(() => {
    const body = document.body;
    if (isTerminalOpen) {
      body.style.overflow = 'hidden'; // Prevent site scrolling
    } else {
      body.style.overflow = ''; // Restore scrolling
    }

    return () => {
      body.style.overflow = ''; // Ensure cleanup on unmount
    };
  }, [isTerminalOpen]);

  const handleTabClick = (fileName: string) => {
    if (!openTabs.includes(fileName)) {
      setOpenTabs([...openTabs, fileName]);
    }
    setActiveTab(fileName);
  };

  const handleTabClose = (fileName: string) => {
    const newTabs = openTabs.filter((tab) => tab !== fileName);
    setOpenTabs(newTabs);
    if (activeTab === fileName) {
      setActiveTab(newTabs[newTabs.length - 1] || '');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Home.jsx':
        return <Home />;
      case 'Experience.py':
        return <Experience />;
      case 'Projects.json':
        return <Projects />;
      case 'Contact.js':
        return <Contact />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen text-gray-300 bg-[#1e1e1e]">
      <WindowControls />
      <div
        className={`flex flex-1 overflow-hidden ${
          isTerminalOpen ? 'h-[calc(100%-200px)]' : 'h-full'
        }`}
      >
        {/* SocialBar */}
        <div className="hidden md:flex flex-col h-full">
          <SocialBar
            onEmailClick={() => handleTabClick('Contact.js')}
            setActiveFile={(fileName) => {
              if (fileName === 'Terminal') {
                setIsTerminalOpen(true); // Open terminal
              } else {
                handleTabClick(fileName);
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
            tabs={openTabs.map((tab) => ({ name: tab, icon: fileIcons[tab] }))}
            activeTab={activeTab}
            onTabClick={handleTabClick}
            onTabClose={handleTabClose}
          />
          <div className="flex-1 overflow-auto custom-scrollbar">{renderContent()}</div>
        </div>
      </div>
      {/* Terminal */}
      {isTerminalOpen && (
        <div
          className="absolute bottom-10 left-[19rem] right-0 bg-[#1e1e1e] border-t border-gray-700 z-50"
          style={{
            height: '180px', // Fixed height
            pointerEvents: 'auto',
          }}
        >
          <div className="flex justify-between items-center bg-[#2d2d2d] text-gray-400 px-4 py-1 border-b border-gray-700">
            <span>Terminal</span>
            <button
              onClick={() => setIsTerminalOpen(false)}
              className="text-gray-400 hover:text-red-500"
            >
              ✕
            </button>
          </div>
          <div className="h-full w-full overflow-hidden">
            <TerminalComponent />
          </div>
        </div>
      )}

      <MobileNav activeTab={activeTab} setActiveTab={handleTabClick} />
    </div>
  );
}
