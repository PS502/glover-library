'use client';

import React, { useState } from 'react';
import { Search, Camera, Bookmark, Sparkles, MapPin, BookOpen, Clock, HeartHandshake, CheckCircle2, X, CreditCard, Radio, Upload } from 'lucide-react';

interface Book {
  id: string;
  title: string;
  author: string;
  tags: string[];
  shelf: string;
  recommendedBy?: string;
  isWhartonFaculty?: boolean;
  isCheckedOut: boolean;
  checkedOutBy?: string;
}

export default function Home() {
  // User Identity & Stored Card Photo State
  const [user, setUser] = useState({
    name: 'Gerald Glover',
    pennId: '84920134',
    cohort: "WG'26",
    email: 'gglover@wharton.upenn.edu',
    isVerified: false,
    pennIdPhoto: null as string | null,
  });

  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<'verify' | 'pass' | 'pdp' | 'rfid-scanning' | 'checkout' | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState('All');

  // Finalized Wharton Genre & Feature Filter Options
  const whartonTags = [
    'All',
    'Wharton Faculty',
    'Strategic Management',
    'Macroeconomics',
    'Behavioral & Decision Science',
    'Operations',
    'Scaling',
    'Leadership & Culture',
    'Venture & Entrepreneurship',
    'Marketing',
    'AI for Business',
    'Finance',
    'Literature & Society'
  ];

  // Book Catalog with Multi-Tag Arrays
  const [books, setBooks] = useState<Book[]>([
    { 
      id: '1', 
      title: "The Truth About Immigration", 
      author: "Zeke Hernandez", 
      tags: ["Wharton Faculty", "Macroeconomics", "Strategic Management"], 
      shelf: "Dewey 325 - Migration", 
      isWhartonFaculty: true, 
      recommendedBy: "Prof. Zeke Hernandez", 
      isCheckedOut: false 
    },
    { 
      id: '2', 
      title: "Co-Intelligence", 
      author: "Ethan Mollick", 
      tags: ["Wharton Faculty", "AI for Business", "Leadership & Culture"], 
      shelf: "Dewey 006 - AI & Tech", 
      isWhartonFaculty: true, 
      recommendedBy: "Prof. Ethan Mollick", 
      isCheckedOut: false 
    },
    { 
      id: '3', 
      title: "The Leader’s Brain", 
      author: "Michael L. Platt", 
      tags: ["Wharton Faculty", "Leadership & Culture", "Behavioral & Decision Science"], 
      shelf: "Dewey 153 - Neuroscience", 
      isWhartonFaculty: true, 
      recommendedBy: "Prof. Michael Platt", 
      isCheckedOut: false 
    },
    { 
      id: '4', 
      title: "The Art of Woo", 
      author: "G. Richard Shell & Mario Moussa", 
      tags: ["Wharton Faculty", "Behavioral & Decision Science", "Leadership & Culture", "Marketing"], 
      shelf: "Dewey 658 - Leadership", 
      isWhartonFaculty: true, 
      recommendedBy: "Prof. Richard Shell", 
      isCheckedOut: false 
    },
    { 
      id: '5', 
      title: "Clear Thinking", 
      author: "Shane Parrish", 
      tags: ["Behavioral & Decision Science", "Strategic Management"], 
      shelf: "Dewey 153 - Cognition", 
      recommendedBy: "Gerald Glover (WG'26)", 
      isCheckedOut: false 
    },
    { 
      id: '6', 
      title: "Strategy and Tactics of Pricing", 
      author: "Thomas T. Nagle, John Hogan & Joseph Zale", 
      tags: ["Strategic Management", "Marketing", "Finance"], 
      shelf: "Dewey 658 - Pricing", 
      isCheckedOut: false 
    },
    { 
      id: '7', 
      title: "High Output Management", 
      author: "Andrew S. Grove", 
      tags: ["Operations", "Scaling", "Leadership & Culture"], 
      shelf: "Dewey 658 - Operations", 
      isCheckedOut: false 
    },
    { 
      id: '8', 
      title: "Zero to One", 
      author: "Peter Thiel with Blake Masters", 
      tags: ["Venture & Entrepreneurship", "Scaling", "Strategic Management"], 
      shelf: "Dewey 658 - Startups", 
      isCheckedOut: false 
    },
    { 
      id: '9', 
      title: "Billion Dollar Brand Club", 
      author: "Lawrence Ingrassia", 
      tags: ["Marketing", "Venture & Entrepreneurship", "Scaling"], 
      shelf: "Dewey 658 - Branding", 
      isCheckedOut: false 
    },
    { 
      id: '10', 
      title: "Genius Makers", 
      author: "Cade Metz", 
      tags: ["AI for Business", "Literature & Society"], 
      shelf: "Dewey 006 - AI History", 
      isCheckedOut: false 
    },
    { 
      id: '11', 
      title: "The Fund", 
      author: "Rob Copeland", 
      tags: ["Finance", "Macroeconomics"], 
      shelf: "Dewey 332 - Hedge Funds", 
      isCheckedOut: false 
    },
    { 
      id: '12', 
      title: "Pachinko", 
      author: "Min Jin Lee", 
      tags: ["Literature & Society"], 
      shelf: "Dewey 813 - Fiction", 
      isCheckedOut: false 
    }
  ]);

  // Handle Image Upload for PennID
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Verification Data & Store Photo for Librarian
  const handleSaveVerification = () => {
    if (!uploadPreview && !user.pennIdPhoto) {
      alert("Please upload a photo of your physical PennID card to complete verification.");
      return;
    }
    setUser(prev => ({
      ...prev,
      pennIdPhoto: uploadPreview || prev.pennIdPhoto,
      isVerified: true
    }));
    setActiveModal(null);
  };

  // Simulate Physical RFID Tag Scan in Aisle
  const handleSimulateRFIDScan = (book: Book) => {
    setSelectedBook(book);
    setActiveModal('rfid-scanning');
    
    setTimeout(() => {
      setActiveModal('checkout');
    }, 1500);
  };

  // Handle Final Book Checkout
  const handleCheckout = (bookId: string) => {
    setBooks(prev => prev.map(b => b.id === bookId ? { ...b, isCheckedOut: true, checkedOutBy: user.name } : b));
    setActiveModal(null);
  };

  // Multi-Tag Filter Matching Logic
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          book.shelf.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTag = filterTag === 'All' || book.tags.includes(filterTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen bg-canvas text-charcoal font-sans selection:bg-wharton-red selection:text-white">
      {/* Header / Brand Nav */}
      <header className="border-b border-wharton-navy/10 px-6 py-8 md:px-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-wharton-red font-semibold mb-1">
            <span>Wharton Executive MBA</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-wharton-navy/70">
              <MapPin className="w-3 h-3 text-wharton-red" /> 2 Harrison St, Fl 6 (612-615 Break Area)
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-wharton-navy tracking-tight">Glover Library</h1>
        </div>
        <div className="flex gap-3 text-sm font-medium">
          <button 
            onClick={() => setActiveModal('verify')}
            className={`flex items-center gap-2 border px-4 py-2.5 text-xs tracking-wider uppercase transition-colors ${user.isVerified ? 'border-emerald-700 text-emerald-800 bg-emerald-50' : 'border-wharton-navy/20 text-wharton-navy hover:bg-wharton-navy hover:text-white'}`}
          >
            <Camera className="w-4 h-4 text-wharton-red" /> {user.isVerified ? 'PennID Verified' : 'PennID Verify'}
          </button>
          <button 
            onClick={() => setActiveModal('pass')}
            className="bg-wharton-navy text-canvas px-4 py-2.5 text-xs tracking-wider uppercase hover:bg-wharton-red transition-colors flex items-center gap-2"
          >
            <CreditCard className="w-4 h-4" /> Digital Pass
          </button>
        </div>
      </header>

      {/* Editorial Hero */}
      <section className="px-6 py-12 md:px-16 max-w-5xl mx-auto text-center">
        <span className="inline-block border border-wharton-navy/20 px-3 py-1 text-xs uppercase tracking-widest text-wharton-navy mb-4">
          By WEMBA, For WEMBA
        </span>
        <h2 className="font-serif text-3xl md:text-5xl leading-tight text-wharton-navy mb-4">
          A student-driven archive extending learning beyond the classroom.
        </h2>
        <p className="text-sm md:text-base text-charcoal/80 max-w-2xl mx-auto mb-8 leading-relaxed">
          Founded and curated by <strong>Gerald Glover (WG’26)</strong>, Glover Library is a self-sustaining knowledge hub designed for Executive MBA participants.
        </p>

        {/* Smart Search Bar */}
        <div className="relative max-w-2xl mx-auto">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, author, tag, or Dewey classification..."
            className="w-full bg-white/90 border border-wharton-navy/20 py-4 pl-12 pr-4 font-serif placeholder:font-sans placeholder:text-subtle focus:outline-none focus:border-wharton-navy text-lg shadow-sm"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-wharton-navy/50" />
        </div>
      </section>

      {/* Operational Highlights */}
      <section className="bg-wharton-navy text-canvas py-8 px-6 md:px-16 my-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex items-start gap-4">
            <HeartHandshake className="w-6 h-6 text-wharton-red shrink-0 mt-1" />
            <div>
              <h4 className="font-serif text-lg text-white">Honor-Based System</h4>
              <p className="text-xs text-canvas/70 mt-1">Open, self-serve access built on cohort trust and shared accountability.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <BookOpen className="w-6 h-6 text-wharton-red shrink-0 mt-1" />
            <div>
              <h4 className="font-serif text-lg text-white">Dewey Organized</h4>
              <p className="text-xs text-canvas/70 mt-1">Arranged by theme for intuitive browsing on Floor 6.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Clock className="w-6 h-6 text-wharton-red shrink-0 mt-1" />
            <div>
              <h4 className="font-serif text-lg text-white">Automated Reminders</h4>
              <p className="text-xs text-canvas/70 mt-1">Instant digital confirmations keep inventory moving seamlessly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Grid */}
      <section className="px-6 py-10 md:px-16 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-baseline mb-8 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-wharton-navy/60">6th Floor Physical Collection</span>
            <h3 className="font-serif text-2xl text-wharton-navy mt-1 flex items-center gap-2">
              Browse Available Titles ({filteredBooks.length}) <Sparkles className="w-4 h-4 text-wharton-red" />
            </h3>
          </div>
          
          {/* Multi-Tag Filter Bar */}
          <div className="flex flex-wrap gap-2 text-xs">
            {whartonTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setFilterTag(tag)}
                className={`px-3 py-1.5 border transition-colors ${filterTag === tag ? 'bg-wharton-navy text-white border-wharton-navy' : 'bg-white border-wharton-navy/20 text-charcoal hover:border-wharton-navy'}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredBooks.map((book) => (
            <div 
              key={book.id} 
              className={`bg-white p-6 border transition-all flex flex-col justify-between ${book.isCheckedOut ? 'border-dashed border-wharton-navy/30 bg-white/50' : 'border-wharton-navy/10 hover:border-wharton-navy'}`}
            >
              <div>
                <div className="flex justify-between items-start text-xs text-subtle mb-3">
                  <span className="text-wharton-red font-semibold">{book.shelf}</span>
                </div>

                <h4 
                  onClick={() => { setSelectedBook(book); setActiveModal('pdp'); }}
                  className="font-serif text-xl text-wharton-navy mb-1 cursor-pointer hover:text-wharton-red transition-colors"
                >
                  {book.title}
                </h4>
                <p className="text-sm text-charcoal/80 mb-4">{book.author}</p>

                {/* Render Multiple Tags on Card */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {book.tags.map((t, idx) => (
                    <span 
                      key={idx} 
                      className={`text-[10px] px-2 py-0.5 border ${t === 'Wharton Faculty' ? 'bg-wharton-red text-white border-wharton-red font-semibold' : 'bg-canvas text-wharton-navy border-wharton-navy/10'}`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-canvas flex justify-between items-center text-xs">
                <div>
                  {book.isCheckedOut ? (
                    <span className="text-wharton-red font-medium flex items-center gap-1">
                      ● Checked out by {book.checkedOutBy}
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-medium flex items-center gap-1">
                      ● In Stock (Fl 6)
                    </span>
                  )}
                </div>
                {!book.isCheckedOut && (
                  <button 
                    onClick={() => handleSimulateRFIDScan(book)}
                    className="bg-wharton-navy text-white px-3 py-1.5 text-xs uppercase tracking-wider hover:bg-wharton-red transition-colors flex items-center gap-1.5"
                  >
                    <Radio className="w-3.5 h-3.5" /> Scan RFID
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL 1: PennID Verification */}
      {activeModal === 'verify' && (
        <div className="fixed inset-0 bg-wharton-navy/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-canvas border border-wharton-navy max-w-md w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-wharton-navy/50 hover:text-wharton-navy"><X className="w-5 h-5" /></button>
            <div className="flex items-center gap-2 text-wharton-red text-xs uppercase tracking-widest font-semibold mb-1">
              <Camera className="w-4 h-4" /> Patron Identity Verification
            </div>
            <h3 className="font-serif text-2xl text-wharton-navy mb-2">PennID Verification</h3>
            <p className="text-xs text-subtle mb-4">Please upload a photo of your physical PennID card. This photo is securely retained for librarian audit records.</p>
            
            <div className="mb-6">
              <label className="block text-xs uppercase text-subtle mb-2 font-semibold">1. Upload Physical PennID Photo *</label>
              <div className="border-2 border-dashed border-wharton-navy/30 bg-white p-4 text-center hover:border-wharton-navy transition-colors relative">
                {uploadPreview || user.pennIdPhoto ? (
                  <div className="relative">
                    <img src={uploadPreview || user.pennIdPhoto!} alt="PennID Preview" className="h-32 mx-auto object-cover border border-wharton-navy/20" />
                    <span className="block text-[10px] text-emerald-700 font-semibold mt-2">✓ Photo Uploaded (Saved for Librarian Audit)</span>
                  </div>
                ) : (
                  <div className="py-4">
                    <Upload className="w-8 h-8 text-wharton-navy/40 mx-auto mb-2" />
                    <span className="text-xs text-wharton-navy font-medium block">Click to upload photo of PennID</span>
                    <span className="text-[10px] text-subtle block mt-1">Supports JPG, PNG, or mobile camera capture</span>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            </div>

            <div className="space-y-3 text-sm border-t border-wharton-navy/10 pt-4">
              <label className="block text-xs uppercase text-subtle font-semibold">2. Confirm / Edit Details</label>
              <div>
                <label className="block text-[10px] uppercase text-subtle mb-1">Full Name</label>
                <input type="text" value={user.name} onChange={(e) => setUser({...user, name: e.target.value})} className="w-full bg-white border border-wharton-navy/20 p-2 font-serif text-wharton-navy" />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-subtle mb-1">PennID Number</label>
                <input type="text" value={user.pennId} onChange={(e) => setUser({...user, pennId: e.target.value})} className="w-full bg-white border border-wharton-navy/20 p-2 font-serif text-wharton-navy" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase text-subtle mb-1">Program / Cohort</label>
                  <input type="text" value={user.cohort} onChange={(e) => setUser({...user, cohort: e.target.value})} className="w-full bg-white border border-wharton-navy/20 p-2 font-serif text-wharton-navy" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-subtle mb-1">Email</label>
                  <input type="email" value={user.email} onChange={(e) => setUser({...user, email: e.target.value})} className="w-full bg-white border border-wharton-navy/20 p-2 font-serif text-wharton-navy" />
                </div>
              </div>
            </div>

            <button 
              onClick={handleSaveVerification}
              className="w-full mt-6 bg-wharton-navy text-white py-3 text-xs uppercase tracking-wider hover:bg-wharton-red transition-colors"
            >
              Save Verification & Store Card
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: Product Detail Page (PDP) */}
      {activeModal === 'pdp' && selectedBook && (
        <div className="fixed inset-0 bg-wharton-navy/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-canvas border border-wharton-navy max-w-lg w-full p-8 shadow-2xl relative">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-wharton-navy/50 hover:text-wharton-navy"><X className="w-5 h-5" /></button>
            
            <div className="flex justify-between items-start text-xs text-subtle mb-2">
              <span className="text-wharton-red font-semibold">{selectedBook.shelf}</span>
            </div>

            <h2 className="font-serif text-3xl text-wharton-navy mb-1">{selectedBook.title}</h2>
            <p className="text-base text-charcoal/80 mb-4">{selectedBook.author}</p>

            {/* Display All Tags in PDP */}
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedBook.tags.map((t, idx) => (
                <span key={idx} className="bg-white px-2.5 py-1 text-xs text-wharton-navy border border-wharton-navy/20">
                  {t}
                </span>
              ))}
            </div>

            {/* Recommended By Section */}
            {selectedBook.recommendedBy && (
              <div className="bg-white p-4 border-l-2 border-wharton-red border-y border-r border-wharton-navy/10 mb-6 text-xs">
                <span className="text-[10px] uppercase tracking-widest text-wharton-red font-semibold block mb-1">Recommended By</span>
                <p className="font-serif text-sm text-wharton-navy">{selectedBook.recommendedBy}</p>
              </div>
            )}

            <div className="pt-4 border-t border-wharton-navy/10 flex justify-between items-center text-xs">
              <div>
                {selectedBook.isCheckedOut ? (
                  <span className="text-wharton-red font-medium">Checked out by {selectedBook.checkedOutBy}</span>
                ) : (
                  <span className="text-emerald-700 font-medium">● Available at 2 Harrison St (Fl 6)</span>
                )}
              </div>
              {!selectedBook.isCheckedOut && (
                <button 
                  onClick={() => handleSimulateRFIDScan(selectedBook)}
                  className="bg-wharton-navy text-white px-4 py-2 text-xs uppercase tracking-wider hover:bg-wharton-red transition-colors flex items-center gap-2"
                >
                  <Radio className="w-4 h-4" /> Scan RFID Tag to Borrow
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: RFID Scanning Simulation */}
      {activeModal === 'rfid-scanning' && selectedBook && (
        <div className="fixed inset-0 bg-wharton-navy/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white border-2 border-wharton-navy max-w-sm w-full p-8 shadow-2xl text-center">
            <Radio className="w-12 h-12 text-wharton-red mx-auto mb-4 animate-pulse" />
            <h3 className="font-serif text-2xl text-wharton-navy mb-2">Reading RFID Tag...</h3>
            <p className="text-xs text-subtle">Hold device close to the inside cover tag of <strong>"{selectedBook.title}"</strong>.</p>
          </div>
        </div>
      )}

      {/* MODAL 4: RFID Book Recognized -> Checkout Option */}
      {activeModal === 'checkout' && selectedBook && (
        <div className="fixed inset-0 bg-wharton-navy/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-canvas border border-wharton-navy max-w-md w-full p-6 shadow-2xl relative">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-wharton-navy/50 hover:text-wharton-navy"><X className="w-5 h-5" /></button>
            
            <div className="flex items-center gap-2 text-emerald-700 text-xs uppercase tracking-widest font-semibold mb-1">
              <CheckCircle2 className="w-4 h-4" /> RFID Tag Recognized
            </div>
            <h3 className="font-serif text-2xl text-wharton-navy mt-1 mb-4">{selectedBook.title}</h3>

            <div className="bg-white p-4 border border-wharton-navy/10 space-y-2 text-xs mb-6">
              <div className="flex justify-between"><span className="text-subtle">Author:</span> <span className="font-medium">{selectedBook.author}</span></div>
              <div className="flex justify-between"><span className="text-subtle">Shelf Location:</span> <span className="font-medium text-wharton-red">{selectedBook.shelf}</span></div>
              <div className="flex justify-between"><span className="text-subtle">Patron:</span> <span className="font-medium">{user.name} ({user.cohort})</span></div>
            </div>

            <button 
              onClick={() => handleCheckout(selectedBook.id)}
              className="w-full bg-wharton-navy text-white py-3 text-xs uppercase tracking-wider hover:bg-wharton-red transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Confirm Honor Checkout
            </button>
          </div>
        </div>
      )}

      {/* MODAL 5: Digital Pass */}
      {activeModal === 'pass' && (
        <div className="fixed inset-0 bg-wharton-navy/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border-2 border-wharton-navy max-w-sm w-full p-6 shadow-2xl relative">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-wharton-navy/50 hover:text-wharton-navy"><X className="w-5 h-5" /></button>
            <div className="text-center border-b border-wharton-navy/10 pb-4 mb-4">
              <span className="text-[10px] uppercase tracking-widest text-wharton-red font-bold">Wharton Executive MBA</span>
              <h3 className="font-serif text-2xl text-wharton-navy">Glover Library Pass</h3>
              <p className="text-xs text-subtle mt-1">2 Harrison St • 6th Floor</p>
            </div>

            <div className="space-y-2 text-center my-6">
              <p className="font-serif text-xl text-wharton-navy">{user.name}</p>
              <p className="text-xs text-subtle">PennID: {user.pennId} • {user.cohort}</p>
            </div>

            <div className="bg-canvas p-4 text-center border border-wharton-navy/10">
              <div className="h-12 bg-charcoal/80 w-full mb-2 flex items-center justify-center text-white text-[10px] tracking-widest font-mono">
                ||| | |||| || ||| |||| | |||
              </div>
              <span className="text-[10px] text-subtle font-mono">{user.pennId}-WEMBA-2026</span>
            </div>

            <button 
              onClick={() => setActiveModal(null)}
              className="w-full mt-6 border border-wharton-navy text-wharton-navy py-2 text-xs uppercase tracking-wider hover:bg-wharton-navy hover:text-white transition-colors"
            >
              Close Pass
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-wharton-navy/10 py-8 px-6 md:px-16 text-center text-xs text-subtle">
        <p>Glover Library • WEMBA Executive MBA Program • 2 Harrison St, San Francisco</p>
        <p className="mt-1 font-medium text-wharton-navy">App developed by Pooja S • Curated by Gerald Glover (WG’26)</p>
      </footer>
    </div>
  );
}
