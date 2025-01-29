"use client"

import { useEffect, useRef } from "react"

// Dynamically import xterm.js and addons to avoid SSR issues
let Terminal: any
let FitAddon: any

if (typeof window !== "undefined") {
  Terminal = require("xterm").Terminal
  FitAddon = require("xterm-addon-fit").FitAddon
}

import "xterm/css/xterm.css"

interface TerminalComponentProps {
  height: number
}

export default function TerminalComponent({ height }: TerminalComponentProps) {
  const terminalRef = useRef<HTMLDivElement>(null)
  const terminalInstance = useRef<any>(null)
  const fitAddonRef = useRef<any>(null)

  const commands = {
    ls: "Desktop Documents Downloads Pictures Videos",
    pwd: "/home/danihg",
    echo: (args: string[]) => args.join(" "),
    clear: () => {
      terminalInstance.current?.clear()
      printWelcomeMessage()
    },
  }

  const printPrompt = () => {
    terminalInstance.current?.write("\r\ndanihg@my-macbook % ")
  }

  const printWelcomeMessage = () => {
    terminalInstance.current?.writeln("Welcome to the VSCode Terminal.")
    terminalInstance.current?.writeln("Type a command to get started.")
    terminalInstance.current?.writeln("Available commands:")
    terminalInstance.current?.writeln("  ls    - List the contents of the directory")
    terminalInstance.current?.writeln("  pwd   - Print the current directory")
    terminalInstance.current?.writeln("  echo  - Display a line of text")
    terminalInstance.current?.writeln("  clear - Clear the terminal")
    printPrompt()
  }

  const handleCommand = (command: string) => {
    const trimmedCommand = command.trim()

    if (!trimmedCommand) {
      printPrompt()
      return
    }

    const [cmd, ...args] = trimmedCommand.split(" ")

    if (cmd in commands) {
      if (cmd === "echo") {
        terminalInstance.current?.write(`\r\n${commands[cmd](args)}`)
      } else if (cmd === "clear") {
        commands[cmd]()
      } else {
        terminalInstance.current?.write(`\r\n${commands[cmd]}`)
      }
    } else {
      terminalInstance.current?.write(`\r\nCommand not found: ${cmd}`)
    }

    printPrompt()
  }

  useEffect(() => {
    if (!Terminal || !FitAddon || !terminalRef.current) return

    const terminal = new Terminal({
      theme: {
        background: "#1e1e1e",
        foreground: "#d4d4d4",
      },
      cursorBlink: true,
      fontFamily: "monospace",
      scrollback: 1000,
    })

    const fitAddon = new FitAddon()
    terminal.loadAddon(fitAddon)

    terminal.open(terminalRef.current)
    terminalInstance.current = terminal
    fitAddonRef.current = fitAddon

    fitAddon.fit()

    printWelcomeMessage()

    let currentCommand = ""

    terminal.onData((data: string) => {
      switch (data) {
        case "\r": // Enter
          handleCommand(currentCommand)
          currentCommand = ""
          break
        case "\u007F": // Backspace
          if (currentCommand.length > 0) {
            currentCommand = currentCommand.slice(0, -1)
            terminal.write("\b \b")
          }
          break
        default:
          currentCommand += data
          terminal.write(data)
          break
      }
    })

    return () => {
      terminal.dispose()
      terminalInstance.current = null
      fitAddonRef.current = null
    }
  }, [])

  useEffect(() => {
    if (terminalInstance.current && fitAddonRef.current) {
      fitAddonRef.current.fit()
    }
  }, [height])

  return <div ref={terminalRef} className="w-full h-full" style={{ overflow: "hidden" }} />
}
