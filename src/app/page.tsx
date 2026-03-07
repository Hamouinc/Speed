import Link from "next/link";

export default function Home() {
  const tools = [
    {
      id: "speed-test",
      name: "Internet Speed Test",
      description: "Check your internet connection speed, including ping, download, and upload speeds.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      ),
      href: "/speed-test",
      color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      hoverColor: "hover:border-blue-500/50 hover:bg-blue-500/20"
    },
    // Add more tools here in the future
  ];

  return (
    <main className="min-h-screen bg-neutral-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-white mb-6 tracking-tight">
            Web Tools Collection
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
            A growing collection of useful web tools to help you with your daily tasks. 
            Choose a tool below to get started.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link 
              key={tool.id} 
              href={tool.href}
              className={`group relative rounded-2xl border p-8 transition-all duration-300 ${tool.color} ${tool.hoverColor}`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-neutral-800/50 shadow-inner">
                  {tool.icon}
                </div>
                <h2 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                  {tool.name}
                </h2>
              </div>
              <p className="text-neutral-400 leading-relaxed">
                {tool.description}
              </p>
              
              <div className="mt-6 flex items-center text-sm font-medium text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                Open Tool
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
