import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  ProposalOutput,
  Invoice,
  ContractAnalysis,
  ClientReply,
  GigOptimization,
  ProfileOptimization,
  PriceEstimate,
  TimeEstimate,
  ScamDetection,
  ClientSentiment,
  ProposalScoreResult,
  PortfolioReview,
  ResumeReview,
  LinkedInOptimization,
  Task,
  Client,
  Note,
  HistoryItem,
  PromptTemplate,
  Currency,
} from '../types';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  language: 'English' | 'Roman Urdu';
  setLanguage: (lang: 'English' | 'Roman Urdu') => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  
  // Storage Collections
  proposals: ProposalOutput[];
  invoices: Invoice[];
  contracts: ContractAnalysis[];
  tasks: Task[];
  clients: Client[];
  notes: Note[];
  history: HistoryItem[];
  savedPrompts: PromptTemplate[];
  
  // Actions
  addProposal: (p: ProposalOutput) => void;
  addInvoice: (inv: Invoice) => void;
  updateInvoiceStatus: (id: string, status: 'Paid' | 'Pending' | 'Overdue') => void;
  addContract: (c: ContractAnalysis) => void;
  addTask: (t: Omit<Task, 'id'>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  addClient: (c: Omit<Client, 'id'>) => void;
  updateClient: (c: Client) => void;
  deleteClient: (id: string) => void;
  addNote: (n: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (n: Note) => void;
  deleteNote: (id: string) => void;
  addToHistory: (module: string, title: string, previewText: string, fullData: any) => void;
  toggleFavoriteHistory: (id: string) => void;
  deleteHistoryItem: (id: string) => void;
  
  // Toasts & Command Palette
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isVoiceAssistantOpen: boolean;
  setIsVoiceAssistantOpen: (open: boolean) => void;
  
  // AI Proxy Runner
  runAiPrompt: (
    prompt: string,
    systemInstruction?: string,
    isJson?: boolean,
    responseSchema?: any
  ) => Promise<{ success: boolean; text: string; isFallback?: boolean }>;
}

const defaultUser: User = {
  id: 'usr_1',
  name: 'Hamza Khan',
  email: 'hamza@freelanceiq.ai',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'Full-Stack Developer & Freelancer',
  country: 'Pakistan 🇵🇰',
  currency: 'USD',
  isLoggedIn: true,
  streakDays: 7,
  aiTasksCompleted: 42,
  productivityScore: 94,
};

const initialTasks: Task[] = [
  { id: 't1', title: 'Send Upwork Proposal for Fintech Mobile App', priority: 'high', dueDate: '2026-07-23', status: 'in_progress', category: 'Proposals', isAiSuggested: true },
  { id: 't2', title: 'Review NDA Contract for European Client', priority: 'high', dueDate: '2026-07-24', status: 'todo', category: 'Contracts' },
  { id: 't3', title: 'Send Invoice #108 to Digital Studio LLC', priority: 'medium', dueDate: '2026-07-25', status: 'completed', category: 'Invoices' },
  { id: 't4', title: 'Optimize Fiverr Gig SEO Keywords', priority: 'medium', dueDate: '2026-07-26', status: 'todo', category: 'SEO', isAiSuggested: true },
];

const initialClients: Client[] = [
  { id: 'c1', name: 'Alexander Wright', company: 'Apex Digital Inc (USA)', email: 'alex@apexdigital.com', platform: 'Upwork', status: 'Active', totalBilled: 4500, revenue: 4500, country: 'United States', notes: 'Loves quick turnaround on React & UI tasks.', followUpDate: '2026-07-28', lastContacted: '2026-07-20' },
  { id: 'c2', name: 'Sarah Jenkins', company: 'SaaSify Studio (UK)', email: 'sarah@saasify.co.uk', platform: 'Direct Client', status: 'Active', totalBilled: 3200, revenue: 3200, country: 'United Kingdom', notes: 'Ongoing monthly retainer for frontend support.', followUpDate: '2026-08-01', lastContacted: '2026-07-22' },
  { id: 'c3', name: 'Tariq Al-Mansoor', company: 'Dubai Tech Ventures', email: 'tariq@dtv.ae', platform: 'LinkedIn', status: 'Completed', totalBilled: 2100, revenue: 2100, country: 'UAE', notes: 'Completed MVP for Real Estate Portal.', followUpDate: '2026-08-15', lastContacted: '2026-07-15' },
];

const initialNotes: Note[] = [
  { id: 'n1', title: 'Upwork Top Rated Plus Criteria 2026', content: '# Requirements\n- Over $10k earnings in 12 months\n- Maintain 90%+ Job Success Score\n- Top tier enterprise contract history\n\n### Strategy\nTarget high budget fixed-price projects with explicit milestones.', folder: 'Strategy', createdAt: '2026-07-20', updatedAt: '2026-07-21' },
  { id: 'n2', title: 'Client Negotiation Cheatsheet', content: '### Price Increase Script\n"Based on the expanded scope and new API integrations, our revised investment will be $2,400 to ensure full test coverage and top performance."', folder: 'Templates', createdAt: '2026-07-18', updatedAt: '2026-07-19' },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('freelanceiq_user');
    return saved ? JSON.parse(saved) : defaultUser;
  });

  const [darkMode, setDarkModeState] = useState<boolean>(() => {
    const saved = localStorage.getItem('freelanceiq_theme');
    return saved ? saved === 'dark' : true; // Default dark
  });

  const [language, setLanguage] = useState<'English' | 'Roman Urdu'>('English');
  const [currency, setCurrencyState] = useState<Currency>('USD');

  const [proposals, setProposals] = useState<ProposalOutput[]>(() => {
    const saved = localStorage.getItem('freelanceiq_proposals');
    return saved ? JSON.parse(saved) : [];
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('freelanceiq_invoices');
    return saved ? JSON.parse(saved) : [];
  });

  const [contracts, setContracts] = useState<ContractAnalysis[]>(() => {
    const saved = localStorage.getItem('freelanceiq_contracts');
    return saved ? JSON.parse(saved) : [];
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('freelanceiq_tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('freelanceiq_clients');
    return saved ? JSON.parse(saved) : initialClients;
  });

  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('freelanceiq_notes');
    return saved ? JSON.parse(saved) : initialNotes;
  });

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('freelanceiq_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [savedPrompts, setSavedPrompts] = useState<PromptTemplate[]>([]);

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);

  // Persistence side effects
  useEffect(() => {
    localStorage.setItem('freelanceiq_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('freelanceiq_theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('freelanceiq_proposals', JSON.stringify(proposals));
  }, [proposals]);

  useEffect(() => {
    localStorage.setItem('freelanceiq_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('freelanceiq_contracts', JSON.stringify(contracts));
  }, [contracts]);

  useEffect(() => {
    localStorage.setItem('freelanceiq_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('freelanceiq_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('freelanceiq_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('freelanceiq_history', JSON.stringify(history));
  }, [history]);

  const setDarkMode = (val: boolean) => setDarkModeState(val);
  const setCurrency = (c: Currency) => setCurrencyState(c);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const incrementAiTaskCount = () => {
    setUser((prev) => ({
      ...prev,
      aiTasksCompleted: prev.aiTasksCompleted + 1,
      productivityScore: Math.min(100, prev.productivityScore + 1),
    }));
  };

  const addProposal = (p: ProposalOutput) => {
    setProposals((prev) => [p, ...prev]);
    addToHistory('AI Proposal Generator', p.title, p.outputs.professional.slice(0, 100) + '...', p);
    incrementAiTaskCount();
    showToast('Proposal generated & saved!');
  };

  const addInvoice = (inv: Invoice) => {
    setInvoices((prev) => [inv, ...prev]);
    addToHistory('Invoice Generator', `Invoice #${inv.invoiceNumber} - ${inv.clientName}`, `${inv.currency} ${inv.total}`, inv);
    showToast('Invoice generated & saved!');
  };

  const updateInvoiceStatus = (id: string, status: 'Paid' | 'Pending' | 'Overdue') => {
    setInvoices((prev) => prev.map((inv) => (inv.id === id ? { ...inv, status } : inv)));
    showToast(`Invoice status updated to ${status}`);
  };

  const addContract = (c: ContractAnalysis) => {
    setContracts((prev) => [c, ...prev]);
    addToHistory('Contract Analyzer', c.title, `Risk Score: ${c.riskScore}% (${c.riskLevel})`, c);
    incrementAiTaskCount();
    showToast('Contract analysis complete & saved!');
  };

  const addTask = (t: Omit<Task, 'id'>) => {
    const newTask: Task = { ...t, id: 'task_' + Date.now() };
    setTasks((prev) => [newTask, ...prev]);
    showToast('Task added');
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: t.status === 'completed' ? 'todo' : 'completed' } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast('Task deleted', 'info');
  };

  const addClient = (c: Omit<Client, 'id'>) => {
    const newClient: Client = { ...c, id: 'cli_' + Date.now() };
    setClients((prev) => [newClient, ...prev]);
    showToast('Client added to CRM');
  };

  const updateClient = (c: Client) => {
    setClients((prev) => prev.map((item) => (item.id === c.id ? c : item)));
    showToast('Client updated');
  };

  const deleteClient = (id: string) => {
    setClients((prev) => prev.filter((item) => item.id !== id));
    showToast('Client deleted', 'info');
  };

  const addNote = (n: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const date = new Date().toISOString().split('T')[0];
    const newNote: Note = {
      ...n,
      id: 'note_' + Date.now(),
      createdAt: date,
      updatedAt: date,
    };
    setNotes((prev) => [newNote, ...prev]);
    showToast('Note created');
  };

  const updateNote = (n: Note) => {
    const date = new Date().toISOString().split('T')[0];
    setNotes((prev) => prev.map((item) => (item.id === n.id ? { ...n, updatedAt: date } : item)));
    showToast('Note saved');
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((item) => item.id !== id));
    showToast('Note deleted', 'info');
  };

  const addToHistory = (moduleName: string, title: string, previewText: string, fullData: any) => {
    const newItem: HistoryItem = {
      id: 'hist_' + Date.now(),
      module: moduleName,
      title,
      previewText,
      fullData,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      favorite: false,
    };
    setHistory((prev) => [newItem, ...prev]);
  };

  const toggleFavoriteHistory = (id: string) => {
    setHistory((prev) => prev.map((item) => (item.id === id ? { ...item, favorite: !item.favorite } : item)));
  };

  const deleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    showToast('History item removed', 'info');
  };

  // Run AI Prompt through backend proxy
  const runAiPrompt = async (
    prompt: string,
    systemInstruction?: string,
    isJson?: boolean,
    responseSchema?: any
  ): Promise<{ success: boolean; text: string; isFallback?: boolean }> => {
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, systemInstruction, isJson, responseSchema }),
      });

      if (!res.ok) {
        let errorMessage = `Server error (${res.status})`;
        try {
          const errJson = await res.json();
          if (errJson && errJson.error) {
            errorMessage = errJson.error;
          }
        } catch (_) {
          // ignore json parse error
        }

        showToast(errorMessage, 'error');

        return {
          success: false,
          text: `Unable to generate AI content: ${errorMessage}`,
          isFallback: true,
        };
      }

      const data = await res.json();
      return {
        success: data.success ?? true,
        text: data.text || '',
        isFallback: data.isFallback ?? false,
      };
    } catch (err: any) {
      const msg = err?.message || 'Network error connecting to AI API';
      showToast(msg, 'error');
      return {
        success: false,
        text: `Network error: ${msg}`,
        isFallback: true,
      };
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        darkMode,
        setDarkMode,
        language,
        setLanguage,
        currency,
        setCurrency,
        proposals,
        invoices,
        contracts,
        tasks,
        clients,
        notes,
        history,
        savedPrompts,
        addProposal,
        addInvoice,
        updateInvoiceStatus,
        addContract,
        addTask,
        toggleTask,
        deleteTask,
        addClient,
        updateClient,
        deleteClient,
        addNote,
        updateNote,
        deleteNote,
        addToHistory,
        toggleFavoriteHistory,
        deleteHistoryItem,
        toasts,
        showToast,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isVoiceAssistantOpen,
        setIsVoiceAssistantOpen,
        runAiPrompt,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
