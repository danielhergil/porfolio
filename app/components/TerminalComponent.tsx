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
  onRunPipeline: () => void
  isUserInfoFilled: () => boolean
}

export default function TerminalComponent({ height, onRunPipeline, isUserInfoFilled }: TerminalComponentProps) {
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
    pipeline: () => {
      if (isUserInfoFilled()) {
        terminalInstance.current?.writeln("\r\nFasten your seatbelts! Initiating the CI/CD rollercoaster ride...")
        onRunPipeline()
      } else {
        terminalInstance.current?.writeln(
          "\r\nOops! Looks like we're missing some crucial ingredients for our deployment potion.",
        )
        terminalInstance.current?.writeln(
          "Please fill in your Superhero Name and Project's Secret Identity in the Demofile first!",
        )
      }
    },
  }

  const printPrompt = () => {
    terminalInstance.current?.write("\r\ndanihg@my-macbook % ")
  }

  const printWelcomeMessage = () => {
    terminalInstance.current?.writeln("Welcome to the VSCode Terminal of Wonders!")
    terminalInstance.current?.writeln("Type some magical commands to explore this digital realm.")
    terminalInstance.current?.writeln("Available spells:")
    terminalInstance.current?.writeln("  ls       - List the secrets of this directory")
    terminalInstance.current?.writeln("  pwd      - Reveal your current location in the digital universe")
    terminalInstance.current?.writeln("  echo     - Make the terminal repeat after you (it's a bit of a copycat)")
    terminalInstance.current?.writeln("  clear    - Wipe the slate clean (perfect for hiding evidence)")
    terminalInstance.current?.writeln("  pipeline - Initiate the Spectacular CI/CD Adventure!")
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
      } else if (cmd === "pipeline") {
        commands[cmd]()
      } else {
        terminalInstance.current?.write(`\r\n${commands[cmd]}`)
      }
    } else {
      terminalInstance.current?.write(`\r\nUnknown spell: ${cmd}. Are you sure you're pronouncing it correctly?`)
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

