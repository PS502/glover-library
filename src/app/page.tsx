import React from 'react';
import { Search, Camera, Bookmark, Sparkles } from 'lucide-react';

export default function Home() {
  const facultyPicks = [
    { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", recommendedBy: "Prof. Adam Grant", category: "Behavioral Economics", year: "2011" },
    { title: "Principles for Dealing with the Changing World Order", author: "Ray Dalio", recommendedBy: "Wharton Finance Dept", category: "Macroeconomics", year: "2021" },
    { title: "The Intelligent Investor", author: "Benjamin Graham", recommendedBy: "Alumni Circle '18", category: "Investing", year: "1949" },
  ];

  return (
    <div className="min-h-screen bg-canvas text-charcoal font-sans selection:bg-wharton-red selection:text-white">
      {/* Header / Brand Nav */}
      <header className="border-b border-wharton-navy/10 px-6 py-8 md:px-16 flex justify-between items-end">
        <div>
          <span className="text-xs uppercase tracking-widest text-wharton-red font-semibold">Penn Campus Collection</span>
          <h1 className="font-serif text-4xl md:text-5xl text-wharton-navy tracking-tight mt-1">Glover Library</h1>
        </div>
        <div className="flex gap-6 text-sm font-medium">
          <button className="flex items-center gap-2 hover:text-wharton-red transition-colors">
            <Camera className="w-4 h-4" /> PennID Verify
          </button>
          <button className="bg-wharton-navy text-canvas px-4 py-2 text-xs tracking-wider uppercase hover:bg-wharton-red transition-colors">
            Digital Pass
          </button>
        </div>
      </header>

      {/* Editorial Hero / Search Bar */}
      <section className="px-6 py-16 md:px-16 max-w-5xl mx-auto text-center">
        <h2 className="font-serif text-3xl md:text-5xl leading-tight text-wharton-navy mb-6">
          A physical archive curated for modern scholarship.
        </h2>
        <div className="relative max-w-2xl mx-auto">
          <input 
            type="text" 
            placeholder="Search by Title, Author, ISBN, or Faculty Recommendation..."
            className="w-full bg-white/80 border border-wharton-navy/20 py-4 pl-12 pr-4 font-serif placeholder:font-sans placeholder:text-subtle focus:outline-none focus:border-wharton-navy text-lg shadow-sm"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-wharton-navy/50" />
        </div>
      </section>

      {/* "Spotify for Books" Curated Feeds */}
      <section className="px-6 py-12 md:px-16 max-w-7xl mx-auto border-t border-wharton-navy/10">
        <div className="flex justify-between items-baseline mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-wharton-navy/60">Curated Playlists</span>
            <h3 className="font-serif text-2xl text-wharton-navy mt-1 flex items-center gap-2">
              Faculty & Alumni Recommendations <Sparkles className="w-4 h-4 text-wharton-red" />
            </h3>
          </div>
          <a href="#" className="text-xs uppercase tracking-wider text-wharton-red hover:underline">Explore All Feeds →</a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {facultyPicks.map((book, idx) => (
            <div key={idx} className="bg-white p-6 border border-wharton-navy/10 hover:border-wharton-navy transition-all group flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start text-xs text-subtle mb-4">
                  <span>{book.category}</span>
                  <span>{book.year}</span>
                </div>
                <h4 className="font-serif text-xl text-wharton-navy group-hover:text-wharton-red transition-colors mb-1">{book.title}</h4>
                <p className="text-sm text-charcoal/80 mb-6">{book.author}</p>
              </div>
              <div className="pt-4 border-t border-canvas flex justify-between items-center text-xs">
                <span className="text-wharton-navy font-medium">Curated by: {book.recommendedBy}</span>
                <button className="text-wharton-red hover:text-wharton-navy">
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
