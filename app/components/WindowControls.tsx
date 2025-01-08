export default function WindowControls() {
  return (
    <div className="flex items-center justify-between h-[28px] bg-[#1e1e1e] w-full border-b border-gray-700 px-4">
      <div className="flex items-center space-x-2">
        <button className="w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff5f57]/80" />
        <button className="w-3 h-3 rounded-full bg-[#febc2e] hover:bg-[#febc2e]/80" />
        <button className="w-3 h-3 rounded-full bg-[#28c840] hover:bg-[#28c840]/80" />
      </div>
      <div className="flex items-center">
        <div className="px-6 py-1 text-xs text-gray-400 border border-gray-600 rounded-md md:w-80 text-center">
          Dani HG - Visual Studio Code
        </div>
      </div>
      <div className="w-[52px]" /> {/* Spacer to balance the layout */}
    </div>
  )
}

