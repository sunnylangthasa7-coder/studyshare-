import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

const DEFAULT_NOTES = [
  {
    id: 'note-1',
    title: 'Machine Learning & Deep Learning Cheat Sheet',
    description: 'Comprehensive cheat sheet covering Linear Regression, Neural Networks, Optimizer algorithms (Adam, SGD), and Evaluation metrics. Perfect for exam prep.',
    subject: 'Computer Science',
    university: 'Stanford University',
    college: 'School of Engineering',
    price: 15.00,
    rating: 4.8,
    seller: 'ai_wizard',
    pagesCount: 12,
    previewContent: `STUDYSHARE NOTE PREVIEW (PAGE 1)
----------------------------------
1. LINEAR REGRESSION
Model: f_w,b(x) = w * x + b
Cost Function: J(w,b) = 1/2m * sum(f(x) - y)^2
Gradient Descent: w = w - alpha * dJ/dw

2. NEURAL NETWORKS
Activation Functions:
- ReLU: g(z) = max(0, z)
- Sigmoid: g(z) = 1 / (1 + e^-z)
- Softmax: a_j = e^z_j / sum(e^z_i)`,
    uploadedAt: '2026-05-10',
    reviews: [
      { id: 'r1', user: 'coder_bob', rating: 5, comment: 'Extremely concise, helped me pass my midterm!' },
      { id: 'r2', user: 'jess_ml', rating: 4, comment: 'Very clean math formulas. Wish it had more transformer architecture notes.' }
    ]
  },
  {
    id: 'note-2',
    title: 'Organic Chemistry II Complete Reaction Sheets',
    description: 'Detailed reaction mechanisms for Electrophilic Aromatic Substitution, Aldol Condensation, Grignard reagents, and Enolate chemistry. Hand-drawn diagrams described.',
    subject: 'Chemistry',
    university: 'MIT',
    college: 'School of Science',
    price: 25.00,
    rating: 4.9,
    seller: 'chem_pro',
    pagesCount: 24,
    previewContent: `STUDYSHARE NOTE PREVIEW (PAGE 1)
----------------------------------
REACTION 1: ELECTROPHILIC AROMATIC SUBSTITUTION (EAS)
Reagents: Benzene + HNO3 / H2SO4 -> Nitrobenzene
Mechanism:
1. Generation of electrophile: HNO3 + H2SO4 <=> H2O + NO2+ (Nitronium ion)
2. Nucleophilic attack by Benzene to form the sigma complex (resonance stabilized)
3. Deprotonation by HSO4- to restore aromaticity.`,
    uploadedAt: '2026-05-15',
    reviews: [
      { id: 'r3', user: 'premed_sam', rating: 5, comment: 'Literally saved my grade. EAS mechanism is perfectly drawn.' }
    ]
  },
  {
    id: 'note-3',
    title: 'U.S. Constitutional Law Core Outlines',
    description: 'Highly detailed outline of Article I, II, III powers, commerce clause jurisprudence, and individual liberties (First & Fourteenth Amendments). Perfect for law school finals.',
    subject: 'Law',
    university: 'Harvard University',
    college: 'Harvard Law School',
    price: 30.00,
    rating: 4.7,
    seller: 'law_scholar',
    pagesCount: 45,
    previewContent: `STUDYSHARE NOTE PREVIEW (PAGE 1)
----------------------------------
ARTICLE III: JUDICIAL POWER
1. Standing Requirements:
   - Injury-in-Fact: Concrete and particularized, actual or imminent.
   - Causation: Traceable to the challenged action of the defendant.
   - Redressability: Favorable decision is likely to remedy the injury.
2. Ripeness & Mootness:
   - Ripeness: Threat of harm must be real and immediate.
   - Mootness: Live controversy must exist at all stages of review.`,
    uploadedAt: '2026-05-18',
    reviews: []
  },
  {
    id: 'note-4',
    title: 'Calculus I - Limits, Derivatives & Integrals',
    description: 'Introductory calculus notes covering limits definition, derivative rules (chain rule, product rule), and basic integration techniques with step-by-step examples.',
    subject: 'Mathematics',
    university: 'UC Berkeley',
    college: 'College of Letters & Science',
    price: 10.00,
    rating: 4.5,
    seller: 'math_tutor',
    pagesCount: 15,
    previewContent: `STUDYSHARE NOTE PREVIEW (PAGE 1)
----------------------------------
CHAPTER 1: LIMITS & CONTINUITY
Definition of a Limit:
We write lim (x->c) f(x) = L if for every epsilon > 0 there exists delta > 0 such that if 0 < |x - c| < delta, then |f(x) - L| < epsilon.

Standard Derivative Rules:
- Power Rule: d/dx(x^n) = n * x^(n-1)
- Chain Rule: d/dx(f(g(x))) = f'(g(x)) * g'(x)`,
    uploadedAt: '2026-05-02',
    reviews: [
      { id: 'r4', user: 'freshman_joe', rating: 4, comment: 'Nice examples, but some steps are skipped in integration by parts.' }
    ]
  }
];

export const AppProvider = ({ children }) => {
  // Navigation State
  const [currentPage, setCurrentPage] = useState('marketplace');
  const [currentParams, setCurrentParams] = useState({});

  // Local Storage DB Initialization
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('studyshare_users');
    return saved ? JSON.parse(saved) : [
      { username: 'buyer_test', wallet: 100.00, role: 'buyer', purchasedIds: [] },
      { username: 'ai_wizard', wallet: 54.00, role: 'seller', purchasedIds: [] },
      { username: 'chem_pro', wallet: 90.00, role: 'seller', purchasedIds: [] },
      { username: 'law_scholar', wallet: 120.00, role: 'seller', purchasedIds: [] },
      { username: 'math_tutor', wallet: 40.00, role: 'seller', purchasedIds: [] }
    ];
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('studyshare_current_user');
    return saved ? JSON.parse(saved) : { username: 'buyer_test', wallet: 100.00, role: 'buyer', purchasedIds: [] };
  });

  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('studyshare_notes');
    return saved ? JSON.parse(saved) : DEFAULT_NOTES;
  });

  const [platformEarnings, setPlatformEarnings] = useState(() => {
    const saved = localStorage.getItem('studyshare_platform_earnings');
    return saved ? parseFloat(saved) : 0.00;
  });

  const [cloudConfig, setCloudConfig] = useState(() => {
    const saved = localStorage.getItem('studyshare_cloud_config');
    return saved ? JSON.parse(saved) : { supabaseUrl: '', supabaseKey: '', bucketName: '' };
  });

  const [reports, setReports] = useState(() => {
    const saved = localStorage.getItem('studyshare_reports');
    return saved ? JSON.parse(saved) : [];
  });

  const [toasts, setToasts] = useState([]);

  // Sync state with LocalStorage
  useEffect(() => {
    localStorage.setItem('studyshare_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('studyshare_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('studyshare_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('studyshare_platform_earnings', platformEarnings.toString());
  }, [platformEarnings]);

  useEffect(() => {
    localStorage.setItem('studyshare_cloud_config', JSON.stringify(cloudConfig));
  }, [cloudConfig]);

  useEffect(() => {
    localStorage.setItem('studyshare_reports', JSON.stringify(reports));
  }, [reports]);

  // Handle Supabase OAuth session check on app initialization
  useEffect(() => {
    const checkSupabaseSession = async () => {
      const { supabaseUrl, supabaseKey } = cloudConfig;
      if (supabaseUrl && supabaseKey) {
        try {
          const { createClient } = await import('@supabase/supabase-js');
          const supabase = createClient(supabaseUrl, supabaseKey);
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user) {
            const userEmail = session.user.email;
            const userName = session.user.user_metadata?.full_name || userEmail.split('@')[0];
            const avatarUrl = session.user.user_metadata?.avatar_url || '';
            
            // Register user locally in wallet db if they don't exist
            setUsers(prev => {
              const existingUser = prev.find(u => u.username === userEmail);
              if (!existingUser) {
                const newUser = {
                  username: userEmail,
                  name: userName,
                  avatarUrl: avatarUrl,
                  wallet: 100.00, // Seed buyer wallet with $100 mock money
                  role: 'buyer',
                  purchasedIds: [],
                  isGoogle: true
                };
                return [...prev, newUser];
              }
              return prev;
            });

            // Set current logged in session
            const localUser = localStorage.getItem('studyshare_current_user');
            const parsed = localUser ? JSON.parse(localUser) : null;
            if (!parsed || parsed.username !== userEmail) {
              const u = {
                username: userEmail,
                name: userName,
                avatarUrl: avatarUrl,
                wallet: 100.00,
                role: 'buyer',
                purchasedIds: [],
                isGoogle: true
              };
              setCurrentUser(u);
            }
          }
        } catch (e) {
          console.error("Supabase OAuth session checking failed:", e);
        }
      }
    };
    checkSupabaseSession();
  }, [cloudConfig]);

  // Toast System
  const addToast = (message, type = 'success') => {
    const id = Math.random().toString(36).substring(2, 9) + '-' + Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Custom Router Function
  const navigateTo = (page, params = {}) => {
    setCurrentPage(page);
    setCurrentParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Register or Login
  const loginUser = (username, role = 'buyer') => {
    if (!username.trim()) {
      addToast('Username cannot be empty', 'error');
      return;
    }
    const cleanUsername = username.trim().toLowerCase();
    
    // Check if user exists
    let existingUser = users.find(u => u.username === cleanUsername);
    if (!existingUser) {
      // Create new user
      existingUser = {
        username: cleanUsername,
        wallet: role === 'buyer' ? 100.00 : 0.00, // Seed buyer with $100 mock money
        role: role,
        purchasedIds: []
      };
      setUsers(prev => [...prev, existingUser]);
      addToast(`Created new ${role} account: ${cleanUsername}!`, 'success');
    } else {
      // Toggle role if logged in with a different role selected
      existingUser = { ...existingUser, role: role };
      setUsers(prev => prev.map(u => u.username === cleanUsername ? existingUser : u));
      addToast(`Logged in as ${cleanUsername} (${role})`, 'success');
    }
    setCurrentUser(existingUser);
  };

  // Login with Google (handles mock OAuth and prepares for real Supabase OAuth redirect)
  const loginWithGoogle = (email, name, avatarUrl, role = 'buyer') => {
    const cleanUsername = email.trim().toLowerCase();
    
    // Check if user exists
    let existingUser = users.find(u => u.username === cleanUsername);
    if (!existingUser) {
      // Create new Google User
      existingUser = {
        username: cleanUsername,
        name: name,
        avatarUrl: avatarUrl,
        wallet: role === 'buyer' ? 100.00 : 0.00,
        role: role,
        purchasedIds: [],
        isGoogle: true
      };
      setUsers(prev => [...prev, existingUser]);
      addToast(`Signed up with Google: ${name}!`, 'success');
    } else {
      // Login existing user, update role and profile details
      existingUser = { ...existingUser, role: role, name: name, avatarUrl: avatarUrl };
      setUsers(prev => prev.map(u => u.username === cleanUsername ? existingUser : u));
      addToast(`Logged in with Google as ${name}`, 'success');
    }
    setCurrentUser(existingUser);
  };

  // Logout
  const logoutUser = async () => {
    const { supabaseUrl, supabaseKey } = cloudConfig;
    if (supabaseUrl && supabaseKey) {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseKey);
        await supabase.auth.signOut();
      } catch (e) {
        console.error("Supabase sign out error:", e);
      }
    }
    setCurrentUser(null);
    addToast('Logged out successfully', 'success');
    navigateTo('marketplace');
  };

  // Deposit funds to wallet (for Buyers)
  const depositFunds = (amount) => {
    if (amount <= 0 || isNaN(amount)) {
      addToast('Please enter a valid amount', 'error');
      return;
    }
    const updatedUser = { ...currentUser, wallet: Number((currentUser.wallet + amount).toFixed(2)) };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.username === currentUser.username ? updatedUser : u));
    addToast(`Deposited $${amount.toFixed(2)} to wallet!`, 'success');
  };

  // Purchase note with 15% platform cut
  const purchaseNote = (noteId) => {
    const note = notes.find(n => n.id === noteId);
    if (!note) {
      addToast('Note not found', 'error');
      return;
    }

    if (!currentUser) {
      addToast('Please log in to purchase notes', 'error');
      return;
    }

    if (currentUser.purchasedIds.includes(noteId)) {
      addToast('You have already purchased this note!', 'error');
      return;
    }

    if (currentUser.wallet < note.price) {
      addToast('Insufficient wallet balance!', 'error');
      return;
    }

    // Calculations
    const price = note.price;
    const platformCut = Number((price * 0.15).toFixed(2)); // 15% Platform Fee
    const sellerShare = Number((price - platformCut).toFixed(2)); // 85% Seller Share

    // 1. Deduct from buyer
    const updatedBuyer = {
      ...currentUser,
      wallet: Number((currentUser.wallet - price).toFixed(2)),
      purchasedIds: [...currentUser.purchasedIds, noteId]
    };

    // 2. Add to seller
    let sellerName = note.seller;
    
    // Update seller's wallet in local users array
    setUsers(prevUsers => {
      return prevUsers.map(u => {
        if (u.username === sellerName) {
          return { ...u, wallet: Number((u.wallet + sellerShare).toFixed(2)) };
        }
        if (u.username === currentUser.username) {
          return updatedBuyer;
        }
        return u;
      });
    });

    // 3. Update global states
    setCurrentUser(updatedBuyer);
    setPlatformEarnings(prev => Number((prev + platformCut).toFixed(2)));
    addToast(`Purchase successful! Download unlocked.`, 'success');
    addToast(`Platform Fee: $${platformCut.toFixed(2)} (15%) collected.`, 'success');
    navigateTo('buyer-dashboard');
  };

  // Upload note
  const uploadNote = (noteData) => {
    if (!currentUser) {
      addToast('Please log in to upload notes', 'error');
      return;
    }

    const newNote = {
      id: `note-${Date.now()}`,
      title: noteData.title,
      description: noteData.description,
      subject: noteData.subject,
      university: noteData.university,
      college: noteData.college,
      price: Number(noteData.price),
      rating: 5.0, // Initial rating
      seller: currentUser.username,
      pagesCount: noteData.pagesCount || 5,
      previewContent: noteData.previewContent || `STUDYSHARE NOTE PREVIEW\n-----------------------\nUploaded file content for ${noteData.title}`,
      fileUrl: noteData.fileUrl || '', // Contains either Supabase URL or local object URL
      uploadedAt: new Date().toISOString().split('T')[0],
      reviews: []
    };

    setNotes(prev => [newNote, ...prev]);
    addToast('Note uploaded successfully for sale!', 'success');
    navigateTo('marketplace');
  };

  // Add review to note
  const addReview = (noteId, rating, comment) => {
    if (!currentUser) {
      addToast('Please login to leave reviews', 'error');
      return;
    }
    
    setNotes(prevNotes => {
      return prevNotes.map(n => {
        if (n.id === noteId) {
          const newReview = {
            id: `rev-${Date.now()}`,
            user: currentUser.username,
            rating: Number(rating),
            comment: comment
          };
          const updatedReviews = [...n.reviews, newReview];
          const avgRating = Number((updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1));
          
          return {
            ...n,
            reviews: updatedReviews,
            rating: avgRating
          };
        }
        return n;
      });
    });
    addToast('Thank you for your review!', 'success');
  };

  // Flag copyright reports and handle seller strikes/ban triggers
  const reportNote = (noteId, reason, details, reporterEmail) => {
    const newReport = {
      id: `rep-${Date.now()}`,
      noteId,
      reason,
      details,
      reporterEmail,
      status: 'pending',
      reportedAt: new Date().toISOString().split('T')[0]
    };
    
    setReports(prev => [...prev, newReport]);
    addToast('Note has been flagged. Our team will review the copyright claim.', 'warning');
    
    const note = notes.find(n => n.id === noteId);
    if (note) {
      const uploader = note.seller;
      setUsers(prevUsers => {
        return prevUsers.map(u => {
          if (u.username === uploader) {
            const currentStrikes = u.strikes || 0;
            const nextStrikes = currentStrikes + 1;
            
            if (nextStrikes >= 3) {
              addToast(`Alert: Seller "${uploader}" has received ${nextStrikes} strikes. Account Banned.`, 'error');
            } else {
              addToast(`Warning strike issued to seller: ${uploader} (${nextStrikes}/3)`, 'error');
            }
            return { ...u, strikes: nextStrikes };
          }
          return u;
        });
      });
      
      // Sync currentUser strike state if the uploader is currently logged in
      if (currentUser && currentUser.username === uploader) {
        const nextUserStrikes = (currentUser.strikes || 0) + 1;
        setCurrentUser(prev => ({ ...prev, strikes: nextUserStrikes }));
      }
    }
  };

  // Save Cloud Storage configuration
  const saveCloudConfig = (config) => {
    setCloudConfig(config);
    addToast('Cloud storage settings saved successfully', 'success');
  };

  return (
    <AppContext.Provider value={{
      currentPage,
      currentParams,
      navigateTo,
      currentUser,
      users,
      notes,
      platformEarnings,
      cloudConfig,
      toasts,
      reports,
      reportNote,
      loginUser,
      loginWithGoogle,
      logoutUser,
      depositFunds,
      purchaseNote,
      uploadNote,
      addReview,
      saveCloudConfig,
      addToast
    }}>
      {children}
    </AppContext.Provider>
  );
};
