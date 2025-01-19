import { Github, Linkedin, Mail, Terminal } from 'lucide-react'

interface SocialBarProps {
  onEmailClick: () => void
  setActiveFile: (fileName: string) => void
}

export default function SocialBar({
  onEmailClick,
  setActiveFile,
}: SocialBarProps) {
  const handleExplorerClick = () => {
    setActiveFile('Home.jsx') // Open Home.jsx view
  }

  const handleTerminalClick = () => {
    setActiveFile('Terminal') // Open the terminal
  }

  return (
    <div className="w-12 bg-[#1e1e1e] border-r border-gray-700 h-full flex flex-col items-center py-4 space-y-6 justify-between">
      {/* Top Section */}
      <div className="flex flex-col items-center space-y-6">
        {/* Explorer Icon */}
        <button
          onClick={handleExplorerClick}
          className="text-gray-400 hover:text-white"
          title="Explorer"
        >
          <img
            src="/explorer.svg"
            alt="Explorer"
            className="w-6 h-6"
          />
        </button>
        {/* Social Icons */}
        <a
          href="https://github.com/danielhergil"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white"
        >
          <Github className="w-6 h-6" />
        </a>
        <a
          href="https://www.linkedin.com/in/daniel-hern%C3%A1ndez-gil-259877105/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white"
        >
          <Linkedin className="w-6 h-6" />
        </a>
        <button
          onClick={onEmailClick}
          className="text-gray-400 hover:text-white"
        >
          <Mail className="w-6 h-6" />
        </button>
      </div>

      {/* Terminal Icon */}
      <button
        onClick={handleTerminalClick}
        className="text-gray-400 hover:text-white mb-4"
        title="Terminal"
      >
        <img
            src="/terminal.svg"
            alt="Explorer"
            className="w-8 h-8 transition-all hover:brightness-200"
          />
      </button>
    </div>
  )
}
