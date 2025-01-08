import { Github, Linkedin, Mail } from 'lucide-react'
import Link from 'next/link'

interface SocialBarProps {
  onEmailClick: () => void
}

export default function SocialBar({ onEmailClick }: SocialBarProps) {
  return (
    <div className="w-12 bg-[#1e1e1e] border-r border-gray-700 h-full flex flex-col items-center py-4 space-y-4">
      <Link href="https://github.com/yourusername" target="_blank" className="text-gray-400 hover:text-white">
        <Github className="w-6 h-6" />
      </Link>
      <Link href="https://linkedin.com/in/yourusername" target="_blank" className="text-gray-400 hover:text-white">
        <Linkedin className="w-6 h-6" />
      </Link>
      <button onClick={onEmailClick} className="text-gray-400 hover:text-white">
        <Mail className="w-6 h-6" />
      </button>
    </div>
  )
}

