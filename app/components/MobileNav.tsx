import { Home, Briefcase, FolderOpen, Mail } from 'lucide-react'

interface MobileNavProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function MobileNav({ activeTab, setActiveTab }: MobileNavProps) {
  const navItems = [
    { name: 'Home.jsx', icon: Home },
    { name: 'Experience.py', icon: Briefcase },
    { name: 'Projects.json', icon: FolderOpen },
    { name: 'Contact.js', icon: Mail },
  ]

  return (
    <div className="md:hidden flex justify-around items-center h-16 bg-[#1e1e1e] border-t border-gray-700">
      {navItems.map((item) => {
        const Icon = item.icon
        return (
          <button
            key={item.name}
            onClick={() => setActiveTab(item.name)}
            className={`flex flex-col items-center justify-center w-full h-full ${
              activeTab === item.name ? 'text-white' : 'text-gray-400'
            }`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs mt-1">{item.name.split('.')[0]}</span>
          </button>
        )
      })}
    </div>
  )
}

