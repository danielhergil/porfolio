'use client';

import { useEffect, useRef } from 'react';

// Dynamically import xterm.js and addons to avoid SSR issues
let Terminal: any;
let FitAddon: any;

if (typeof window !== 'undefined') {
  Terminal = require('xterm').Terminal;
  FitAddon = require('xterm-addon-fit').FitAddon;
}

import 'xterm/css/xterm.css';

export default function TerminalComponent() {
  const terminalRef = useRef<HTMLDivElement>(null); // Reference to the terminal container
  const terminalInstance = useRef<any>(null); // Terminal instance
  const fitAddonInstance = useRef<any>(null); // FitAddon instance

  const commands = {
    ls: 'Desktop Documents Downloads Pictures Videos',
    pwd: '/home/danihg',
    echo: (args: string[]) => args.join(' '),
    clear: () => {
      terminalInstance.current?.clear();
      printWelcomeMessage();
    },
  };

  const printPrompt = () => {
    terminalInstance.current?.write('\r\ndanihg@my-macbook % ');
  };

  const printWelcomeMessage = () => {
    terminalInstance.current?.writeln('Welcome to the VSCode Terminal!');
    terminalInstance.current?.writeln('Type some commands to explore.');
    terminalInstance.current?.writeln('Available commands:');
    terminalInstance.current?.writeln('  ls       - List directory contents');
    terminalInstance.current?.writeln('  pwd      - Print working directory');
    terminalInstance.current?.writeln('  echo     - Echo input text');
    terminalInstance.current?.writeln('  clear    - Clear the terminal');
    printPrompt();
  };

  const handleCommand = (command: string) => {
    const trimmedCommand = command.trim();
  
    // If the command is empty, just print the prompt again
    if (!trimmedCommand) {
      printPrompt();
      return;
    }
  
    const [cmd, ...args] = trimmedCommand.split(' ');
  
    if (cmd in commands) {
      if (cmd === 'echo') {
        terminalInstance.current?.write(`\r\n${commands[cmd](args)}`);
      } else if (cmd === 'clear') {
        commands[cmd]();
      } else {
        terminalInstance.current?.write(`\r\n${commands[cmd]}`);
      }
    } else {
      terminalInstance.current?.write(`\r\nCommand not found: ${cmd}`);
    }
  
    printPrompt();
  };

  useEffect(() => {
    if (!Terminal || !FitAddon || !terminalRef.current) return;

    const terminal = new Terminal({
      theme: {
        background: '#1e1e1e',
        foreground: '#d4d4d4',
      },
      cursorBlink: true,
      fontFamily: 'monospace',
      scrollback: 1000,
    });

    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);

    terminal.open(terminalRef.current);
    terminalInstance.current = terminal;
    fitAddonInstance.current = fitAddon;

    requestAnimationFrame(() => {
      fitAddon.fit();
    });

    printWelcomeMessage();

    let currentCommand = '';

    terminal.onData((data: string) => {
      switch (data) {
        case '\r': // Enter
          handleCommand(currentCommand);
          currentCommand = '';
          break;
        case '\u007F': // Backspace
          if (currentCommand.length > 0) {
            currentCommand = currentCommand.slice(0, -1);
            terminal.write('\b \b');
          }
          break;
        default:
          currentCommand += data;
          terminal.write(data);
          break;
      }
    });

    return () => {
      terminal.dispose();
      terminalInstance.current = null;
      fitAddonInstance.current = null;
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (terminalInstance.current && fitAddonInstance.current) {
        fitAddonInstance.current.fit();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      ref={terminalRef}
      className="w-full h-full pb-5 terminal-scrollbar"
      style={{ overflow: 'auto' }} // Enable scrolling
    />
  );
}
