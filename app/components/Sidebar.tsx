import { useState } from "react"

const files = [
  {
    name: "Home.jsx",
    icon: "https://raw.githubusercontent.com/material-extensions/vscode-material-icon-theme/main/icons/react.svg",
    iconAlt: "React",
  },
  {
    name: "Experience.py",
    icon: "https://raw.githubusercontent.com/material-extensions/vscode-material-icon-theme/main/icons/python.svg",
    iconAlt: "Python",
  },
  {
    name: "Projects.json",
    icon: "https://raw.githubusercontent.com/material-extensions/vscode-material-icon-theme/main/icons/json.svg",
    iconAlt: "JSON",
  },
  {
    name: "Contact.js",
    icon: "https://raw.githubusercontent.com/material-extensions/vscode-material-icon-theme/main/icons/javascript.svg",
    iconAlt: "JavaScript",
  },
  {
    name: "Demofile",
    icon: "https://raw.githubusercontent.com/material-extensions/vscode-material-icon-theme/main/icons/docker.svg",
    iconAlt: "Docker",
  },
]

export default function Sidebar({ activeFile, setActiveFile }) {
  const [isCollapsed, setIsCollapsed] = useState(false) // State to toggle folder visibility

  return (
    <div className="w-64 bg-[#1e1e1e] border-r border-gray-700 h-full bg-zinc-950">
      <div className="p-4 text-sm font-semibold text-gray-400">EXPLORER</div>
      <div className="px-4">
        {/* Portfolio Folder */}
        <div
          className="flex items-center justify-between py-2 cursor-pointer text-gray-400 hover:text-white"
          onClick={() => setIsCollapsed((prev) => !prev)}
        >
          <div className="flex items-center">
            <span className={`transition-transform ${isCollapsed ? "rotate-0" : "rotate-90"}`}>▶</span>
            <span className="ml-2">Portfolio</span>
          </div>
        </div>
        {/* Collapsible Files */}
        {!isCollapsed && (
          <div className="ml-6">
            {files.map((file) => (
              <div
                key={file.name}
                className={`flex items-center py-1 cursor-pointer ${
                  activeFile === file.name ? "text-white" : "text-gray-400"
                } hover:text-white`}
                onClick={() => setActiveFile(file.name)}
              >
                <img src={file.icon || "/placeholder.svg"} alt={file.iconAlt} className="w-4 h-4 mr-2" />
                <span>{file.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

