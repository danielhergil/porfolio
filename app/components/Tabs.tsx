"use client"

import { X } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface Tab {
  name: string
  icon: string
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onTabClick: (tab: string) => void
  onTabClose: (tab: string) => void
  onTabsReorder: (newTabs: Tab[]) => void
}

export default function Tabs({ tabs, activeTab, onTabClick, onTabClose, onTabsReorder }: TabsProps) {
  const [draggedTab, setDraggedTab] = useState<string | null>(null)

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, tabName: string) => {
    setDraggedTab(tabName)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", tabName)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetTabName: string) => {
    e.preventDefault()
    if (draggedTab && draggedTab !== targetTabName) {
      const newTabs = [...tabs]
      const draggedIndex = newTabs.findIndex((tab) => tab.name === draggedTab)
      const targetIndex = newTabs.findIndex((tab) => tab.name === targetTabName)
      const [draggedTabItem] = newTabs.splice(draggedIndex, 1)
      newTabs.splice(targetIndex, 0, draggedTabItem)
      onTabsReorder(newTabs)
    }
    setDraggedTab(null)
  }

  return (
    <div className="flex h-9 bg-[#252526] border-b border-gray-700 overflow-x-auto">
      {tabs.map((tab) => (
        <div
          key={tab.name}
          className={`flex items-center px-3 border-r border-gray-700 min-w-[150px] cursor-pointer group
            ${activeTab === tab.name ? "bg-[#1e1e1e]" : "bg-[#2d2d2d] hover:bg-[#2d2d2d]"}
            ${draggedTab === tab.name ? "opacity-50" : ""}`}
          onClick={() => onTabClick(tab.name)}
          draggable
          onDragStart={(e) => handleDragStart(e, tab.name)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, tab.name)}
          aria-label={`${tab.name} tab`}
          role="tab"
          aria-selected={activeTab === tab.name}
        >
          <Image
            src={tab.icon || "/placeholder.svg"}
            alt={`${tab.name} icon`}
            width={16}
            height={16}
            className="mr-2"
          />
          <span className="text-sm flex-1">{tab.name}</span>
          <button
            className="opacity-0 group-hover:opacity-100 hover:bg-gray-600 rounded p-0.5"
            onClick={(e) => {
              e.stopPropagation()
              onTabClose(tab.name)
            }}
            aria-label={`Close ${tab.name} tab`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}

