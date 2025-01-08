import { X } from 'lucide-react'
import Image from 'next/image'

interface Tab {
  name: string
  icon: string
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onTabClick: (tab: string) => void
  onTabClose: (tab: string) => void
}

export default function Tabs({ tabs, activeTab, onTabClick, onTabClose }: TabsProps) {
  return (
    <div className="flex h-9 bg-[#252526] border-b border-gray-700 overflow-x-auto">
      {tabs.map((tab) => (
        <div
          key={tab.name}
          className={`flex items-center px-3 border-r border-gray-700 min-w-[150px] cursor-pointer group
            ${activeTab === tab.name ? 'bg-[#1e1e1e]' : 'bg-[#2d2d2d] hover:bg-[#2d2d2d]'}`}
          onClick={() => onTabClick(tab.name)}
        >
          <Image
            src={tab.icon}
            alt={tab.name}
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
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}

