'use client';

import React, { useState, useEffect } from 'react';
import { Search, Camera, Sparkles, MapPin, HeartHandshake, CheckCircle2, X, Radio, Upload, AlertCircle, RotateCcw, PlusCircle, Gift } from 'lucide-react';

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
  // User Identity & Persistent Verification State
  const [user, setUser] = useState({
    name: '',
    pennId: '',
    cohort: "WG'26",
    email: '',
    phone: '',
    isVerified: false,
    pennIdPhoto: null as string | null,
  });

  // Load saved verification on app mount
  useEffect(() => {
    const savedUser = localStorage.getItem('glover_library_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.isVerified) {
          setUser(parsed);
        }
      } catch (e) {
        console.error("Failed to parse saved user state", e);
      }
    }
  }, []);

  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [isScanningPhoto, setIsScanningPhoto] = useState(false);
  const [activeModal, setActiveModal] = useState<'verify' | 'pdp' | 'rfid-scanning' | 'return-scanning' | 'checkout' | 'return-confirm' | 'donate' | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState('All');

  // Donation Form State
  const [donationForm, setDonationForm] = useState({
    title: '',
    author: '',
    tag: 'Strategic Management',
    donorName: '',
    donorCohort: "WG'26"
  });

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

  // Book Catalog
  const [books, setBooks] = useState<Book[]>([
    { 
      id: '1', 
      title: "The Truth About Immigration", 
      author: "Zeke Hernandez", 
      tags: ["Wharton Faculty", "Macroeconomics", "Strategic Management"], 
      shelf: "Dewey 325 - Migration", 
      isWhartonFaculty: true, 
      recommendedBy: "Prof. Zeke Hernandez", 
      isCheckedOut: true,
      checkedOutBy: "Gerald Glover"
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
    }
  ]);

  // Handle Photo Upload with Simulated OCR Extraction
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsScanningPhoto(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const photoDataUrl = reader.result as string;
        setUploadPreview(photoDataUrl);

        setTimeout(() => {
          setUser(prev => ({
            ...prev,
            name: prev.name || 'Gerald Glover',
            pennId: prev.pennId || '84920134',
            pennIdPhoto: photoDataUrl
          }));
          setIsScanningPhoto(false);
        }, 1200);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Verification Data & Persist to LocalStorage
  const handleSaveVerification = () => {
    if (!uploadPreview && !user.pennIdPhoto) {
      alert("Mandatory: Please upload a photo of your physical PennID card.");
      return;
    }
    if (!user.name || !user.pennId || !user.cohort || !user.email || !user.phone) {
      alert("Mandatory: All fields (Name, PennID, Program/Cohort, Email, Phone Number) are required to complete verification.");
      return;
    }

    const updatedUser = {
      ...user,
      pennIdPhoto: uploadPreview || user.pennIdPhoto,
      isVerified: true
    };
    setUser(updatedUser);
    localStorage.setItem('glover_library_user', JSON.stringify(updatedUser));
    
    if (selectedBook) {
      setActiveModal('checkout');
    } else {
      setActiveModal(null);
    }
  };

  // Trigger RFID Checkout Scanner
  const handleSimulateScan = (book: Book) => {
    setSelectedBook(book);
    setActiveModal('rfid-scanning');
    
    setTimeout(() => {
      const savedUser = localStorage.getItem('glover_library_user');
      const isVerified = user.isVerified || (savedUser && JSON.parse(savedUser).isVerified);

      if (isVerified) {
        setActiveModal('checkout');
      } else {
        setActiveModal('verify');
      }
    }, 1500);
  };

  // Trigger RFID Return Scanner
  const handleSimulateReturnScan = (book?: Book) => {
    const targetBook = book || books.find(b => b.isCheckedOut) || books[0];
    setSelectedBook(targetBook);
    setActiveModal('return-scanning');
    
    setTimeout(() => {
      setActiveModal('return-confirm');
    }, 1500);
  };

  // Confirm Final Return
  const handleConfirmReturn = (bookId: string) => {
    setBooks(prev => prev.map(b => b.id === bookId ? { ...b, isCheckedOut: false, checkedOutBy: undefined } : b));
    setActiveModal(null);
  };

  // Handle Final Book Checkout
  const handleCheckout = (bookId: string) => {
    setBooks(prev => prev.map(b => b.id === bookId ? { ...b, isCheckedOut: true, checkedOutBy: user.name } : b));
    setActiveModal(null);
  };

  // Submit Book Donation
  const handleDonateBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donationForm.title || !donationForm.author || !donationForm.donorName) {
      alert("Please fill in the book title, author, and donor name.");
      return;
    }

    const newBook: Book = {
      id: Date.now().toString(),
      title: donationForm.title,
      author: donationForm.author,
      tags: [donationForm.tag],
      shelf: "Dewey 658 - General Executive",
      recommendedBy: `Donated by ${donationForm.donorName} (${donationForm.donorCohort})`,
      isCheckedOut: false
    };

    setBooks(prev => [newBook, ...prev]);
    setDonationForm({ title: '', author: '', tag: 'Strategic Management', donorName: '', donorCohort: "WG'26" });
    setActiveModal(null);
    alert(`Thank you! "${newBook.title}" has been registered. Please send or drop off your book at 2 Harrison St, Fl 6!`);
  };

  // Filter Matching Logic
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
        <div className="flex flex-wrap gap-2 md:gap-3 text-sm font-medium">
          <button 
            onClick={() => setActiveModal('donate')}
            className="flex items-center gap-2 border border-wharton-navy/20 text-wharton-navy px-3.5 py-2 text-xs tracking-wider uppercase hover:bg-wharton-navy hover:text-white transition-colors"
          >
            <Gift className="w-4 h-4 text-wharton-red" /> Donate Book
          </button>
          <button 
            onClick={() => handleSimulateReturnScan()}
            className="flex items-center gap-2 border border-wharton-navy/20 text-wharton-navy px-3.5 py-2 text-xs tracking-wider uppercase hover:bg-wharton-navy hover:text-white transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-wharton-red" /> Return Book
          </button>
          <button 
            onClick={() => setActiveModal('verify')}
            className={`flex items-center gap-2 border px-3.5 py-2 text-xs tracking-wider uppercase transition-colors ${user.isVerified ? 'border-emerald-700 text-emerald-800 bg-emerald-50' : 'border-wharton-navy/20 text-wharton-navy hover:bg-wharton-navy hover:text-white'}`}
          >
            <Camera className="w-4 h-4 text-wharton-red" /> {user.isVerified ? '✓ PennID Verified' : 'PennID Verify'}
          </button>
        </div>
      </header>

      {/* Editorial Hero */}
      <section className="px-6 py-12 md:px-16 max-w-5xl mx-auto text-center">
        <span className="inline-block border border-wharton-navy/20 px-3 py-1 text-xs uppercase tracking-widest text-wharton-navy mb-4">
          By WEMBA, For WEMBA
        </span>
        <h2 className="font-serif text-3xl md:text-5xl leading-tight text-wharton-navy mb-4">
          Where community meets access — extending learning beyond the classroom.
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

      {/* Operational Highlight */}
      <section className="bg-wharton-navy text-canvas py-8 px-6 md:px-16 my-6">
        <div className="max-w-3xl mx-auto text-center flex flex-col md:flex-row items-center justify-center gap-4">
          <HeartHandshake className="w-8 h-8 text-wharton-red shrink-0" />
          <div>
            <h4 className="font-serif text-xl text-white">Borrow freely. Return thoughtfully.</h4>
            <p className="text-xs text-canvas/70 mt-1">Every timely return ensures your classmates have access when they need it.</p>
          </div>
        </div>
      </section>

      {/* Catalog Grid */}
      <section className="px-6 py-10 md:px-16 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-baseline mb-8 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-wharton-navy/60">6th Floor Break Area</span>
            <h3 className="font-serif text-2xl text-wharton-navy mt-1 flex items-center gap-2">
              Collection ({filteredBooks.length}) <Sparkles className="w-4 h-4 text-wharton-red" />
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

                {/* Uniform Tag Styling */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {book.tags.map((t, idx) => (
                    <span 
                      key={idx} 
                      className="text-[10px] px-2 py-0.5 border bg-canvas text-wharton-navy border-wharton-navy/10"
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
                {book.isCheckedOut ? (
                  <button 
                    onClick={() => handleSimulateReturnScan(book)}
                    className="bg-emerald-700 text-white px-3 py-1.5 text-xs uppercase tracking-wider hover:bg-emerald-800 transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Return
                  </button>
                ) : (
                  <button 
                    onClick={() => handleSimulateScan(book)}
                    className="bg-wharton-navy text-white px-3 py-1.5 text-xs uppercase tracking-wider hover:bg-wharton-red transition-colors flex items-center gap-1.5"
                  >
                    <Radio className="w-3.5 h-3.5" /> Scan
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL 1: Donate a Book Modal */}
      {activeModal === 'donate' && (
        <div className="fixed inset-0 bg-wharton-navy/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-canvas border border-wharton-navy max-w-md w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-wharton-navy/50 hover:text-wharton-navy"><X className="w-5 h-5" /></button>
            <div className="flex items-center gap-2 text-wharton-red text-xs uppercase tracking-widest font-semibold mb-1">
              <Gift className="w-4 h-4" /> Cohort Contribution
            </div>
            <h3 className="font-serif text-2xl text-wharton-navy mb-1">Donate a Book</h3>
            <p className="text-xs text-subtle mb-4">Enrich our Floor 6 collection by contributing a book from your executive shelf.</p>

            {/* Drop-Off & Mailing Address Box */}
            <div className="bg-white p-3.5 border-l-2 border-wharton-red border-y border-r border-wharton-navy/15 mb-5 text-xs">
              <span className="text-[10px] uppercase tracking-widest text-wharton-red font-bold block mb-1">Ship or Drop Off Books To:</span>
              <p className="font-serif text-sm font-semibold text-wharton-navy">Glover Library / Pooja</p>
              <p className="text-charcoal/90 mt-0.5">2 Harrison St, Fl 6</p>
              <p className="text-charcoal/90">San Francisco, CA 94105</p>
            </div>

            <form onSubmit={handleDonateBookSubmit} className="space-y-3 text-sm">
              <div>
                <label className="block text-[10px] uppercase text-subtle mb-1 font-semibold">Book Title *</label>
                <input 
                  type="text" 
                  value={donationForm.title} 
                  onChange={(e) => setDonationForm({...donationForm, title: e.target.value})} 
                  placeholder="e.g. Good to Great"
                  className="w-full bg-white border border-wharton-navy/20 p-2 font-serif text-wharton-navy" 
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-subtle mb-1 font-semibold">Author Name *</label>
                <input 
                  type="text" 
                  value={donationForm.author} 
                  onChange={(e) => setDonationForm({...donationForm, author: e.target.value})} 
                  placeholder="e.g. Jim Collins"
                  className="w-full bg-white border border-wharton-navy/20 p-2 font-serif text-wharton-navy" 
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-subtle mb-1 font-semibold">Category / Primary Tag *</label>
                <select 
                  value={donationForm.tag} 
                  onChange={(e) => setDonationForm({...donationForm, tag: e.target.value})}
                  className="w-full bg-white border border-wharton-navy/20 p-2 font-serif text-wharton-navy"
                >
                  {whartonTags.filter(t => t !== 'All').map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-wharton-navy/10">
                <div>
                  <label className="block text-[10px] uppercase text-subtle mb-1 font-semibold">Your Name (Donor Credit) *</label>
                  <input 
                    type="text" 
                    value={donationForm.donorName || user.name} 
                    onChange={(e) => setDonationForm({...donationForm, donorName: e.target.value})} 
                    placeholder="e.g. Gerald Glover"
                    className="w-full bg-white border border-wharton-navy/20 p-2 font-serif text-wharton-navy" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-subtle mb-1 font-semibold">Cohort / Program *</label>
                  <input 
                    type="text" 
                    value={donationForm.donorCohort} 
                    onChange={(e) => setDonationForm({...donationForm, donorCohort: e.target.value})} 
                    placeholder="e.g. WG'26"
                    className="w-full bg-white border border-wharton-navy/20 p-2 font-serif text-wharton-navy" 
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full mt-6 bg-wharton-navy text-white py-3 text-xs uppercase tracking-wider hover:bg-wharton-red transition-colors flex items-center justify-center gap-2"
              >
                <Gift className="w-4 h-4" /> Register & Submit Donation
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: RFID Checkout Scanning Modal */}
      {activeModal === 'rfid-scanning' && selectedBook && (
        <div className="fixed inset-0 bg-wharton-navy/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white border-2 border-wharton-navy max-w-sm w-full p-8 shadow-2xl text-center">
            <Radio className="w-12 h-12 text-wharton-red mx-auto mb-4 animate-pulse" />
            <h3 className="font-serif text-2xl text-wharton-navy mb-2">Scanning RFID Tag...</h3>
            <p className="text-xs text-subtle">Hold device near the RFID tag on inside cover of <strong>"{selectedBook.title}"</strong>.</p>
          </div>
        </div>
      )}

      {/* MODAL 3: RFID Return Scanning Modal */}
      {activeModal === 'return-scanning' && selectedBook && (
        <div className="fixed inset-0 bg-wharton-navy/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white border-2 border-wharton-navy max-w-sm w-full p-8 shadow-2xl text-center">
            <RotateCcw className="w-12 h-12 text-emerald-700 mx-auto mb-4 animate-spin" />
            <h3 className="font-serif text-2xl text-wharton-navy mb-2">Scanning Tag for Return...</h3>
            <p className="text-xs text-subtle">Reading RFID drop-off tag for <strong>"{selectedBook.title}"</strong>.</p>
          </div>
        </div>
      )}

      {/* MODAL 4: PennID Verification Modal */}
      {activeModal === 'verify' && (
        <div className="fixed inset-0 bg-wharton-navy/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-canvas border border-wharton-navy max-w-md w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-wharton-navy/50 hover:text-wharton-navy"><X className="w-5 h-5" /></button>
            <div className="flex items-center gap-2 text-wharton-red text-xs uppercase tracking-widest font-semibold mb-1">
              <Camera className="w-4 h-4" /> Patron Identity Verification
            </div>
            <h3 className="font-serif text-2xl text-wharton-navy mb-2">PennID Verification</h3>
            <p className="text-xs text-subtle mb-4">Upload a photo of your physical PennID card. The app will automatically extract your Name and PennID number.</p>
            
            <div className="mb-6">
              <label className="block text-xs uppercase text-subtle mb-2 font-semibold">1. Upload Physical PennID Photo *</label>
              <div className="border-2 border-dashed border-wharton-navy/30 bg-white p-4 text-center hover:border-wharton-navy transition-colors relative">
                {isScanningPhoto ? (
                  <div className="py-6">
                    <Sparkles className="w-8 h-8 text-wharton-red mx-auto mb-2 animate-spin" />
                    <span className="text-xs text-wharton-navy font-semibold block">Scanning PennID card & extracting text...</span>
                  </div>
                ) : uploadPreview || user.pennIdPhoto ? (
                  <div className="relative">
                    <img src={uploadPreview || user.pennIdPhoto!} alt="PennID Preview" className="h-32 mx-auto object-cover border border-wharton-navy/20" />
                    <span className="block text-[10px] text-emerald-700 font-semibold mt-2">✓ Photo Scanned & Stored for Librarian Audit</span>
                  </div>
                ) : (
                  <div className="py-4">
                    <Upload className="w-8 h-8 text-wharton-navy/40 mx-auto mb-2" />
                    <span className="text-xs text-wharton-navy font-medium block">Click to upload or capture PennID</span>
                    <span className="text-[10px] text-subtle block mt-1">Automatically extracts Name & PennID Number</span>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            </div>

            <div className="space-y-3 text-sm border-t border-wharton-navy/10 pt-4">
              <label className="block text-xs uppercase text-subtle font-semibold">2. Auto-Extracted & Mandatory Fields *</label>
              
              <div>
                <label className="block text-[10px] uppercase text-subtle mb-1">Full Name (Auto-Extracted) *</label>
                <input 
                  type="text" 
                  value={user.name} 
                  onChange={(e) => setUser({...user, name: e.target.value})} 
                  placeholder="Extracted from photo..."
                  className="w-full bg-white border border-wharton-navy/20 p-2 font-serif text-wharton-navy" 
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-subtle mb-1">PennID Number (Auto-Extracted) *</label>
                <input 
                  type="text" 
                  value={user.pennId} 
                  onChange={(e) => setUser({...user, pennId: e.target.value})} 
                  placeholder="Extracted from photo..."
                  className="w-full bg-white border border-wharton-navy/20 p-2 font-serif text-wharton-navy" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase text-subtle mb-1">Program / Cohort *</label>
                  <input 
                    type="text" 
                    value={user.cohort} 
                    onChange={(e) => setUser({...user, cohort: e.target.value})} 
                    placeholder="e.g. WG'26"
                    className="w-full bg-white border border-wharton-navy/20 p-2 font-serif text-wharton-navy" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-subtle mb-1">Phone Number *</label>
                  <input 
                    type="tel" 
                    value={user.phone} 
                    onChange={(e) => setUser({...user, phone: e.target.value})} 
                    placeholder="(415) 000-0000"
                    className="w-full bg-white border border-wharton-navy/20 p-2 font-serif text-wharton-navy" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-subtle mb-1">Email *</label>
                <input 
                  type="email" 
                  value={user.email} 
                  onChange={(e) => setUser({...user, email: e.target.value})} 
                  placeholder="username@wharton.upenn.edu"
                  className="w-full bg-white border border-wharton-navy/20 p-2 font-serif text-wharton-navy" 
                />
              </div>
            </div>

            <button 
              onClick={handleSaveVerification}
              className="w-full mt-6 bg-wharton-navy text-white py-3 text-xs uppercase tracking-wider hover:bg-wharton-red transition-colors"
            >
              Save Verification & Confirm Borrow
            </button>

            <div className="mt-4 pt-3 border-t border-wharton-navy/10 text-center">
              <a 
                href="mailto:pooja502@upenn.edu?subject=Glover%20Library%20PennID%20Support" 
                className="text-[11px] text-wharton-red hover:underline flex items-center justify-center gap-1.5"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                Don't have access to PennID or ran into issues? Reach out to support
              </a>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: Product Detail Page (PDP) */}
      {activeModal === 'pdp' && selectedBook && (
        <div className="fixed inset-0 bg-wharton-navy/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-canvas border border-wharton-navy max-w-lg w-full p-8 shadow-2xl relative">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-wharton-navy/50 hover:text-wharton-navy"><X className="w-5 h-5" /></button>
            
            <div className="flex justify-between items-start text-xs text-subtle mb-2">
              <span className="text-wharton-red font-semibold">{selectedBook.shelf}</span>
            </div>

            <h2 className="font-serif text-3xl text-wharton-navy mb-1">{selectedBook.title}</h2>
            <p className="text-base text-charcoal/80 mb-4">{selectedBook.author}</p>

            <div className="flex flex-wrap gap-2 mb-6">
              {selectedBook.tags.map((t, idx) => (
                <span key={idx} className="bg-white px-2.5 py-1 text-xs text-wharton-navy border border-wharton-navy/20">
                  {t}
                </span>
              ))}
            </div>

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
              {selectedBook.isCheckedOut ? (
                <button 
                  onClick={() => handleSimulateReturnScan(selectedBook)}
                  className="bg-emerald-700 text-white px-4 py-2 text-xs uppercase tracking-wider hover:bg-emerald-800 transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Scan to Return
                </button>
              ) : (
                <button 
                  onClick={() => handleSimulateScan(selectedBook)}
                  className="bg-wharton-navy text-white px-4 py-2 text-xs uppercase tracking-wider hover:bg-wharton-red transition-colors flex items-center gap-2"
                >
                  <Radio className="w-4 h-4" /> Scan Tag to Borrow
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: Checkout Confirmation Modal */}
      {activeModal === 'checkout' && selectedBook && (
        <div className="fixed inset-0 bg-wharton-navy/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-canvas border border-wharton-navy max-w-md w-full p-6 shadow-2xl relative">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-wharton-navy/50 hover:text-wharton-navy"><X className="w-5 h-5" /></button>
            
            <div className="flex items-center gap-2 text-emerald-700 text-xs uppercase tracking-widest font-semibold mb-1">
              <CheckCircle2 className="w-4 h-4" /> Tag Recognized
            </div>
            <h3 className="font-serif text-2xl text-wharton-navy mt-1 mb-4">{selectedBook.title}</h3>

            <div className="bg-white p-4 border border-wharton-navy/10 space-y-2 text-xs mb-6">
              <div className="flex justify-between"><span className="text-subtle">Author:</span> <span className="font-medium">{selectedBook.author}</span></div>
              <div className="flex justify-between"><span className="text-subtle">Shelf Location:</span> <span className="font-medium text-wharton-red">{selectedBook.shelf}</span></div>
              <div className="flex justify-between"><span className="text-subtle">Patron:</span> <span className="font-medium">{user.name || 'Gerald Glover'} ({user.cohort})</span></div>
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

      {/* MODAL 7: Return Confirmation Modal */}
      {activeModal === 'return-confirm' && selectedBook && (
        <div className="fixed inset-0 bg-wharton-navy/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-canvas border border-wharton-navy max-w-md w-full p-6 shadow-2xl relative">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-wharton-navy/50 hover:text-wharton-navy"><X className="w-5 h-5" /></button>
            
            <div className="flex items-center gap-2 text-emerald-700 text-xs uppercase tracking-widest font-semibold mb-1">
              <CheckCircle2 className="w-4 h-4" /> Return Tag Recognized
            </div>
            <h3 className="font-serif text-2xl text-wharton-navy mt-1 mb-4">{selectedBook.title}</h3>

            <div className="bg-white p-4 border border-wharton-navy/10 space-y-2 text-xs mb-6">
              <div className="flex justify-between"><span className="text-subtle">Author:</span> <span className="font-medium">{selectedBook.author}</span></div>
              <div className="flex justify-between"><span className="text-subtle">Shelf Location:</span> <span className="font-medium text-wharton-red">{selectedBook.shelf}</span></div>
              <div className="flex justify-between"><span className="text-subtle">Current Borrower:</span> <span className="font-medium">{selectedBook.checkedOutBy || 'Patron'}</span></div>
            </div>

            <button 
              onClick={() => handleConfirmReturn(selectedBook.id)}
              className="w-full bg-emerald-700 text-white py-3 text-xs uppercase tracking-wider hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Confirm Return to Shelf
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
