import { useState, useRef, useEffect } from 'react'
import type { ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { getHighlighter } from 'shiki'
import type { Components } from 'react-markdown'
import {
  Compass,
  Monitor,
  Plus,
  Search,
  ChevronDown,
  Calculator,
  Mic,
  Briefcase,
  Sparkles,
  LineChart,
  Layers,
  TrendingUp,
  FileText,
  GraduationCap,
  FileEdit,
  Code,
  X,
  ArrowRight,
  PenTool,
  Video,
  MessageSquare,
  Bookmark,
  Check,
  Globe,
  Image as ImageIcon,
  MoreHorizontal,
  Share2,
  Lock,
  ArrowUp
} from 'lucide-react'
import './App.css'

// Custom sleek Lucidity geometric logo - woven star asterisk
const PerplexityLogo = () => (
  <svg className="perplexity-logo-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2v20M2 12h20M5.64 5.64l12.72 12.72M5.64 18.36L18.36 5.64" />
    <path d="M12 6.5l3.89 5.5-3.89 5.5-3.89-5.5z" />
    <path d="M6.5 12l5.5-3.89 5.5 3.89-5.5 3.89z" />
  </svg>
)

const ChatbotMonitorIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <rect x="3" y="5" width="18" height="11" rx="2" />
    <path d="M9 20h6M12 16v4" />
    <circle cx="9" cy="10" r="0.8" fill="currentColor" />
    <circle cx="15" cy="10" r="0.8" fill="currentColor" />
    <path d="M10 13h4" />
  </svg>
)

const OverlappingFoldersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <path d="M19 19H7c-1.1 0-2-.9-2-2V7" />
    <path d="M17 15H9c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h3l2 2h3c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2z" />
  </svg>
)

const GridSpacesIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <rect x="4" y="4" width="16" height="16" rx="2.5" />
    <path d="M10 4v16M10 12h10" />
  </svg>
)

const HexagonSettingsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <path d="M12 2l8.66 5v10L12 22l-8.66-5V7z" />
    <circle cx="12" cy="12" r="2.5" />
  </svg>
)

const HistoryClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5M12 7v5l4 2" />
  </svg>
)

const BellNotificationIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
)

const UserPlusInviteIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M19 8v6M16 11h6" />
  </svg>
)

// Custom high-fidelity brand SVGs for citations
const RenderLogo = () => (
  <svg viewBox="0 0 24 24" fill="#00ecbc" width="16" height="16" className="source-logo-svg">
    <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm8 5.5v7l-8 4-8-4v-7l8-4 8 4z" />
  </svg>
)

const DevToLogo = () => (
  <svg viewBox="0 0 24 24" fill="#000000" width="16" height="16" className="source-logo-svg">
    <rect width="24" height="24" rx="4" />
    <path d="M7.5 7h-2v10h2c1.4 0 2.5-1.1 2.5-2.5V9.5C10 8.1 8.9 7 7.5 7zm.5 7.5c0 .3-.2.5-.5.5h-1V9h1c.3 0 .5.2.5.5v5zM12 7h3v2h-2v2.5h2v2h-2v2.5h2v2h-3V7zm6 0h2v10h-2V7z" fill="#ffffff" />
  </svg>
)

const RedditLogo = () => (
  <svg viewBox="0 0 24 24" fill="#ff4500" width="16" height="16" className="source-logo-svg">
    <circle cx="12" cy="12" r="10" />
    <path d="M17.2 11.2c-.3 0-.6.1-.9.3-.7-.5-1.7-.8-2.7-.9l.6-2.6 1.8.4c0 .5.4.9.9.9.5 0 .9-.4.9-.9s-.4-.9-.9-.9c-.4 0-.8.3-.9.7l-2-.4c-.1 0-.3.1-.3.2l-.7 3c-1.1 0-2 .3-2.7.9-.3-.2-.6-.3-.9-.3-.6 0-1.1.5-1.1 1.1 0 .4.2.8.5 1-.1.2-.1.5-.1.8 0 1.6 1.9 2.9 4.3 2.9s4.3-1.3 4.3-2.9c0-.3 0-.5-.1-.8.3-.2.5-.5.5-1 0-.6-.5-1.1-1.1-1.1zm-7 2.2c0-.5.4-.9.9-.9.5 0 .9.4.9.9s-.4.9-.9.9c-.5 0-.9-.4-.9-.9zm5.3.9c-.8.8-2.3.8-3.1 0-.1-.1-.1-.3 0-.4.1-.1.3-.1.4 0 .6.6 1.7.6 2.3 0 .1-.1.3-.1.4 0 .1.1.1.3 0 .4zm-.4-1.8c-.5 0-.9-.4-.9-.9s.4-.9.9-.9c.5 0 .9.4.9.9s-.4.9-.9.9z" fill="#ffffff" />
  </svg>
)

const SearchGlobeIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="16"
    height="16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20" />
    <path d="M19 19a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" fill="var(--page-bg)" stroke="currentColor" strokeWidth="1.5" />
    <path d="M21 21l-1.5-1.5" />
  </svg>
)

const IBMLogo = () => (
  <div className="source-icon-ibm" style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 16,
    height: 16,
    borderRadius: 4,
    backgroundColor: '#eceae4',
    color: '#5c5a56',
    fontSize: '8px',
    fontWeight: 800,
    fontFamily: 'monospace',
    lineHeight: 1
  }}>
    IBM
  </div>
)

const WikipediaLogo = () => (
  <div className="source-icon-wikipedia" style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 16,
    height: 16,
    borderRadius: '50%',
    backgroundColor: '#eceae4',
    color: '#5c5a56',
    fontSize: '9px',
    fontWeight: 800,
    fontFamily: 'Georgia, serif',
    lineHeight: 1
  }}>
    W
  </div>
)

const TimesLogo = () => (
  <div className="source-icon-times" style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 16,
    height: 16,
    borderRadius: 4,
    backgroundColor: '#cc0000',
    color: '#ffffff',
    fontSize: '9px',
    fontWeight: 900,
    fontFamily: 'serif',
    lineHeight: 1
  }}>
    T
  </div>
)

const ExpressLogo = () => (
  <div className="source-icon-express" style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 16,
    height: 16,
    borderRadius: 4,
    backgroundColor: '#005580',
    color: '#ffffff',
    fontSize: '9px',
    fontWeight: 900,
    fontFamily: 'sans-serif',
    lineHeight: 1
  }}>
    E
  </div>
)

const EsquireLogo = () => (
  <div className="source-icon-esquire" style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 16,
    height: 16,
    borderRadius: 4,
    backgroundColor: '#000000',
    color: '#ffffff',
    fontSize: '8px',
    fontWeight: 900,
    fontFamily: 'serif',
    lineHeight: 1
  }}>
    Esq
  </div>
)

const Mem0Logo = () => (
  <div className="source-icon-mem0" style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 16,
    height: 16,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 50%, #f59e0b 100%)',
    padding: '2px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
  }}>
    <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '10px', height: '10px' }}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  </div>
)

const GithubLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" className="source-logo-svg" style={{ color: 'var(--text-primary)' }}>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
)

const FollowUpArrow = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="14"
    height="14"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17 16l4-4-4-4" />
    <path d="M3 4v6a2 2 0 0 0 2 2h16" />
  </svg>
)

const GlobeSourceLogo = () => (
  <div className="generic-globe-logo">
    <Globe size={13} />
  </div>
)

interface SuggestionItem {
  id: string
  text: string
  label: string
  icon: any
}

interface CitationItem {
  id: number
  domain: string
  url: string
  title?: string
  snippet?: string
  logo?: string
}

interface StepItem {
  title: string
  query: string
  links: Array<{
    title: string
    url: string
    domain: string
    logo: string
    snippet?: string
  }>
}

interface ResultData {
  title: string
  tab: string
  steps: StepItem[]
  answer: string
  citations: CitationItem[]
  related: string[]
  images: Array<{ title: string; url: string }>
}

interface ChatTurn {
  id: string
  query: string
  status: 'searching' | 'analyzing' | 'thinking' | 'typing' | 'completed'
  resultData: ResultData | null
  streamedAnswer: string
  thinkingProcess?: string
  preToolThinking?: string
  postToolThinking?: string
  thinkingExpanded?: boolean
  visibleLinksCount: number
  stepsExpanded: boolean
  toolsUsed?: boolean
  webSearchUsed?: boolean
}

const SHIKI_THEME = 'github-light'
const SHIKI_LANGS = ['bash', 'css', 'html', 'javascript', 'json', 'markdown', 'python', 'tsx', 'typescript', 'yaml', 'text']

let shikiHighlighterPromise: ReturnType<typeof getHighlighter> | null = null

const getSharedHighlighter = () => {
  if (!shikiHighlighterPromise) {
    shikiHighlighterPromise = getHighlighter({
      themes: [SHIKI_THEME],
      langs: SHIKI_LANGS
    })
  }
  return shikiHighlighterPromise
}

type CodeBlockProps = {
  inline?: boolean
  className?: string
  children?: ReactNode
}

const ShikiCodeBlock = ({ inline, className, children }: CodeBlockProps) => {
  const [highlighted, setHighlighted] = useState<string | null>(null)
  const [hasError, setHasError] = useState(false)
  const rawCode = String(children ?? '').replace(/\n$/, '')
  const language = className?.replace('language-', '') || 'text'

  useEffect(() => {
    if (inline) return
    let cancelled = false
    setHighlighted(null)
    setHasError(false)

    getSharedHighlighter()
      .then((highlighter) => {
        if (cancelled) return
        let html = ''
        try {
          html = highlighter.codeToHtml(rawCode, { lang: language, theme: SHIKI_THEME })
        } catch {
          html = highlighter.codeToHtml(rawCode, { lang: 'text', theme: SHIKI_THEME })
        }
        if (!cancelled) {
          setHighlighted(html)
        }
      })
      .catch(() => {
        if (!cancelled) setHasError(true)
      })

    return () => {
      cancelled = true
    }
  }, [inline, language, rawCode])

  if (inline) {
    return <code className="inline-code">{children}</code>
  }

  if (highlighted && !hasError) {
    return <div className="shiki-wrapper" dangerouslySetInnerHTML={{ __html: highlighted }} />
  }

  return (
    <pre className="code-fallback">
      <code className={className}>{rawCode}</code>
    </pre>
  )
}

function App() {
  const [view, setView] = useState<'home' | 'results'>('home')
  const [searchQuery, setSearchQuery] = useState('')
  const [prompt, setPrompt] = useState('')
  const [activeTopic, setActiveTopic] = useState('Discover')
  const [selectedFocus, setSelectedFocus] = useState('Search')
  const [selectedModel, setSelectedModel] = useState('Default')
  const [isComputerMode, setIsComputerMode] = useState(false)

  // Dropdown states
  const [isFocusOpen, setIsFocusOpen] = useState(false)
  const [isModelOpen, setIsModelOpen] = useState(false)
  const [isSlashOpen, setIsSlashOpen] = useState(false)

  // Modal State
  const [showSignIn, setShowSignIn] = useState(false)

  // Suggestion Shuffle State
  const [suggestionsPool, setSuggestionsPool] = useState<'A' | 'B'>('A')
  const [isShuffling, setIsShuffling] = useState(false)

  // Navigation states
  const [activeSidebarItem, setActiveSidebarItem] = useState('new')

  // Search Results States
  const [stepsExpanded, setStepsExpanded] = useState(true)
  const [activeResultTab, setActiveResultTab] = useState<'Answer' | 'Links' | 'Images'>('Answer')
  const [searchResultData, setSearchResultData] = useState<ResultData | null>(null)

  // High fidelity live streaming states
  const [searchStatus, setSearchStatus] = useState<'searching' | 'typing' | 'completed'>('searching')
  const [streamedAnswer, setStreamedAnswer] = useState('')
  const [visibleLinksCount, setVisibleLinksCount] = useState(0)
  const [turns, setTurns] = useState<ChatTurn[]>([])

  // Hover link preview card state
  const [hoverCard, setHoverCard] = useState<{
    x: number
    y: number
    turnId: string
    domain: string
    currentIndex: number
    links: Array<{
      title: string
      url: string
      domain: string
      logo: string
      snippet?: string
    }>
    visible: boolean
  } | null>(null)

  const hoverTimeoutRef = useRef<any>(null)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const followUpTextareaRef = useRef<HTMLTextAreaElement>(null)
  const focusDropdownRef = useRef<HTMLDivElement>(null)
  const modelDropdownRef = useRef<HTMLDivElement>(null)

  const modelOptions = [
    { id: 'Default', label: 'Default', desc: 'Fast, reliable default model' },
    { id: 'gemma-4-31b-it', label: 'Gemma 4 31B', desc: 'Google GenAI gemma-4-31b-it' },
    { id: 'mistral-small-latest', label: 'Mistral Small', desc: 'mistral-small-latest via Mistral' }
  ]

  const selectedModelLabel = selectedModel === 'Default'
    ? 'Model'
    : (modelOptions.find((option) => option.id === selectedModel)?.label || selectedModel)

  // Auto-resize textarea on input
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [prompt])

  // Handle clicking outside dropdowns to close them
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (focusDropdownRef.current && !focusDropdownRef.current.contains(event.target as Node)) {
        setIsFocusOpen(false)
      }
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target as Node)) {
        setIsModelOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle slash `/` command overlay
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    setPrompt(val)

    if (val.endsWith('/')) {
      setIsSlashOpen(true)
    } else {
      setIsSlashOpen(false)
    }
  }

  // Suggestions pools
  const poolA: SuggestionItem[] = [
    { id: '1', text: 'Automate a workflow', label: 'Automate a workflow', icon: Sparkles },
    { id: '2', text: 'Apply for a job', label: 'Apply for a job', icon: Briefcase },
    { id: '3', text: 'Build a personal assistant', label: 'Build a personal assistant', icon: Code },
    { id: '4', text: 'Visualise my data', label: 'Visualise my data', icon: LineChart },
    { id: '5', text: 'Connect your apps', label: 'Connect your apps', icon: Layers },
    { id: '6', text: 'Create a side hustle', label: 'Create a side hustle', icon: TrendingUp },
  ]

  const poolB: SuggestionItem[] = [
    { id: '7', text: 'Research a competitor', label: 'Research competitor metrics', icon: TrendingUp },
    { id: '8', text: 'Analyze a contract PDF', label: 'Extract terms from a PDF', icon: FileText },
    { id: '9', text: 'Summarize academic research', label: 'Summarize study papers', icon: GraduationCap },
    { id: '10', text: 'Draft a technical proposal', label: 'Create a project draft', icon: FileEdit },
    { id: '11', text: 'Generate React components', label: 'Write structured UI code', icon: Code },
    { id: '12', text: 'Plan a 3-day weekend trip', label: 'Curate a travel itinerary', icon: Compass },
  ]

  const currentSuggestions = suggestionsPool === 'A' ? poolA : poolB

  const handleShuffle = () => {
    setIsShuffling(true)
    setTimeout(() => {
      setSuggestionsPool((prev) => (prev === 'A' ? 'B' : 'A'))
      setIsShuffling(false)
    }, 450)
  }

  const handleSuggestionClick = (text: string) => {
    triggerSearch(text)
  }

  const handleFocusSelect = (focus: string) => {
    setSelectedFocus(focus)
    setIsFocusOpen(false)
    setIsSlashOpen(false)
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  const handleModelSelect = (model: string) => {
    setSelectedModel(model)
    setIsModelOpen(false)
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  const handleSlashSelect = (focus: string) => {
    if (prompt.endsWith('/')) {
      setPrompt((prev) => prev.slice(0, -1))
    }
    setSelectedFocus(focus)
    setIsSlashOpen(false)
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  // High-fidelity search trigger with live streaming from real backend SSE API
  const triggerSearch = (queryText: string) => {
    if (!queryText.trim()) return
    setPrompt('')

    const newTurnId = Math.random().toString(36).substring(7)
    const newTurn: ChatTurn = {
      id: newTurnId,
      query: queryText,
      status: 'searching',
      resultData: getResultData(queryText),
      streamedAnswer: '',
      thinkingProcess: '',
      preToolThinking: '',
      postToolThinking: '',
      thinkingExpanded: true,
      visibleLinksCount: 0,
      stepsExpanded: false,
      toolsUsed: false,
      webSearchUsed: false
    }

    let updatedTurns: ChatTurn[] = []
    if (view === 'home') {
      updatedTurns = [newTurn]
      setSearchQuery(queryText)
      setView('results')
    } else {
      updatedTurns = [...turns, newTurn]
    }
    setTurns(updatedTurns)
    setActiveResultTab('Answer')

    // Scroll viewport to the new turn
    setTimeout(() => {
      document.getElementById(`turn-${newTurnId}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }, 100)

    const formatToolLabel = (name: string) => {
      switch (name) {
        case 'web_search':
          return 'Web Search'
        case 'calculator':
          return 'Calculator'
        case 'fetch_url':
          return 'Fetch URL'
        case 'code_execution':
          return 'Code Execution'
        case 'chart_visualization':
          return 'Chart Visualization'
        default:
          return name.replace(/_/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase())
      }
    }

    const parseSearchLinksFromOutput = (output: string): Array<{ title: string; url: string; domain: string; logo: string }> => {
      const urls: string[] = []
      const regex = /\[\d+\]\s+(https?:\/\/[^\s]+)/g
      let match
      while ((match = regex.exec(output)) !== null) {
        urls.push(match[1])
      }

      if (urls.length === 0) {
        const urlRegex = /(https?:\/\/[^\s]+)/g
        let urlMatch
        while ((urlMatch = urlRegex.exec(output)) !== null) {
          urls.push(urlMatch[1])
        }
      }

      const seen = new Set<string>()
      return urls
        .filter(url => {
          if (seen.has(url)) return false
          seen.add(url)
          return true
        })
        .map((url, idx) => {
          const parts = url.split('//')
          const domain = (parts[1] || parts[0]).split('/')[0].replace('www.', '')
          const cleanDomain = domain.charAt(0).toUpperCase() + domain.slice(1)
          const title = `${cleanDomain} Reference [${idx + 1}]`

          const getLogo = (dom: string) => {
            const domLower = dom.toLowerCase()
            if (domLower.includes('reddit')) return 'reddit'
            if (domLower.includes('wikipedia')) return 'wikipedia'
            if (domLower.includes('ibm')) return 'ibm'
            if (domLower.includes('github')) return 'github'
            if (domLower.includes('dev.to')) return 'dev'
            if (domLower.includes('render')) return 'render'
            return 'globe'
          }

          return {
            title,
            url,
            domain,
            logo: getLogo(domain)
          }
        })
    }

    const updateTurn = (updater: (turn: ChatTurn) => ChatTurn) => {
      setTurns((prev) =>
        prev.map((t) => (t.id === newTurnId ? updater(t) : t))
      )
    }

    let linkIntervalId: any = null

    // Connect to the backend Server-Sent Events (SSE) streaming API
    const eventSource = new EventSource(
      `http://localhost:8000/search/stream?q=${encodeURIComponent(queryText)}&model=${encodeURIComponent(selectedModel)}`
    )

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)

      switch (data.type) {
        case 'message_start':
          if (data.node === 'model') {
            updateTurn(t => ({
              ...t,
              status: t.status === 'searching' || t.status === 'thinking' ? 'typing' : t.status,
              stepsExpanded: false
            }))
          }
          break

        case 'thought':
          updateTurn(t => {
            const nextThinkingProcess = (t.thinkingProcess || '') + data.thought
            if (t.toolsUsed) {
              return {
                ...t,
                status: 'thinking',
                thinkingProcess: nextThinkingProcess,
                postToolThinking: (t.postToolThinking || '') + data.thought,
                thinkingExpanded: true
              }
            } else {
              return {
                ...t,
                status: 'thinking',
                thinkingProcess: nextThinkingProcess,
                preToolThinking: (t.preToolThinking || '') + data.thought,
                thinkingExpanded: true
              }
            }
          })
          break

        case 'token':
          updateTurn(t => {
            // Clear default mock steps and citations if no tools were executed
            const resultData = !t.toolsUsed && t.resultData
              ? { ...t.resultData, steps: [], citations: [] }
              : t.resultData

            return {
              ...t,
              status: 'typing',
              stepsExpanded: false,
              thinkingExpanded: false,
              resultData,
              streamedAnswer: t.streamedAnswer + data.token
            }
          })

          // Auto-scroll viewport during streaming
          document.getElementById(`turn-${newTurnId}`)?.scrollIntoView({
            behavior: 'auto',
            block: 'nearest'
          })
          break

        case 'tool_start':
          const toolLabel = formatToolLabel(data.tool)
          const isWebSearch = data.tool === 'web_search'
          updateTurn(t => {
            const steps = t.resultData && t.resultData.steps.length > 0
              ? [...t.resultData.steps]
              : [{ title: toolLabel, query: t.query, links: [] }]

            steps[0] = { ...steps[0], title: toolLabel }

            // Clear default mock placeholders immediately on web search start
            if (isWebSearch && steps[0]) {
              steps[0] = { ...steps[0], links: [] }
            }

            return {
              ...t,
              status: isWebSearch ? 'searching' : 'thinking',
              stepsExpanded: true,
              toolsUsed: true,
              visibleLinksCount: isWebSearch ? 0 : t.visibleLinksCount,
              webSearchUsed: t.webSearchUsed || isWebSearch,
              resultData: t.resultData ? { ...t.resultData, steps } : null
            }
          })
          break

        case 'search_links':
          const liveLinks = data.links || []
          updateTurn(t => {
            if (!t.resultData) return t

            const steps = [...t.resultData.steps]
            if (steps[0]) {
              steps[0] = {
                ...steps[0],
                links: liveLinks
              }
            }

            const citations = liveLinks.map((link: any, idx: number) => ({
              id: idx + 1,
              domain: link.domain,
              url: link.url,
              title: link.title
            }))

            return {
              ...t,
              status: 'analyzing',
              resultData: {
                ...t.resultData,
                steps,
                citations: citations.length > 0 ? citations : t.resultData.citations
              }
            }
          })

          // Progressive Pop Reveal Animation for live real-time SearXNG links
          if (liveLinks.length > 0) {
            if (linkIntervalId) clearInterval(linkIntervalId)
            let currentCount = 0
            linkIntervalId = setInterval(() => {
              currentCount++
              updateTurn(t => {
                const totalLinks = t.resultData?.steps?.[0]?.links?.length || 0
                if (currentCount >= totalLinks) {
                  clearInterval(linkIntervalId)
                }
                return {
                  ...t,
                  visibleLinksCount: Math.min(currentCount, totalLinks)
                }
              })
            }, 300) // pop pop pop every 300ms!
          }
          break

        case 'tool_end':
          if (linkIntervalId) {
            clearInterval(linkIntervalId)
            linkIntervalId = null
          }
          if (data.tool === 'web_search') {
            updateTurn(t => {
              if (!t.resultData) return t

              const steps = [...t.resultData.steps]
              // Reuse already-loaded live links or fallback to output parsed links
              const finalLinks = steps[0]?.links && steps[0].links.length > 0
                ? steps[0].links
                : parseSearchLinksFromOutput(data.output || '')

              if (steps[0]) {
                steps[0] = {
                  ...steps[0],
                  title: 'Web Search',
                  links: finalLinks
                }
              }

              const citations = finalLinks.map((link, idx) => ({
                id: idx + 1,
                domain: link.domain,
                url: link.url,
                title: link.title
              }))

              return {
                ...t,
                status: 'thinking',
                visibleLinksCount: finalLinks.length,
                stepsExpanded: true,
                resultData: {
                  ...t.resultData,
                  steps,
                  citations: citations.length > 0 ? citations : t.resultData.citations
                }
              }
            })
          } else {
            updateTurn(t => ({ ...t, status: 'thinking' }))
          }
          break

        case 'error':
          if (linkIntervalId) {
            clearInterval(linkIntervalId)
            linkIntervalId = null
          }
          const errMsg = data.message || 'An error occurred.'
          updateTurn(t => ({
            ...t,
            streamedAnswer: t.streamedAnswer ? `${t.streamedAnswer}\n\nNotice: ${errMsg}` : `Notice: ${errMsg}`
          }))
          break

        case 'done':
          if (linkIntervalId) {
            clearInterval(linkIntervalId)
            linkIntervalId = null
          }
          updateTurn(t => ({
            ...t,
            status: 'completed',
            stepsExpanded: false
          }))
          eventSource.close()
          break
      }
    }

    eventSource.onerror = () => {
      if (linkIntervalId) {
        clearInterval(linkIntervalId)
        linkIntervalId = null
      }
      updateTurn(t => {
        if (t.status === 'completed') return t
        return {
          ...t,
          status: 'completed',
          streamedAnswer: t.streamedAnswer || 'Streaming failed. Please try again.'
        }
      })
      eventSource.close()
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    triggerSearch(prompt)
  }

  const resetToHome = () => {
    setPrompt('')
    setSearchQuery('')
    setView('home')
    setTurns([])
    setActiveSidebarItem('new')
    if (textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 50)
    }
  }

  const renderCitationsInText = (value: string, citations: CitationItem[], turn: ChatTurn, keyPrefix = 'citation') => {
    const parts = value.split(/(\[\d+\])/g)
    return parts.map((part, index) => {
      const match = part.match(/^\[(\d+)\]$/)
      if (!match) return part
      const citationId = parseInt(match[1], 10)
      const citation = citations.find(c => c.id === citationId)
      if (citation) {
        return (
          <a
            key={`${keyPrefix}-${citationId}-${index}`}
            href={citation.url}
            target="_blank"
            rel="noopener noreferrer"
            className="citation-bubble-link"
            title={citation.url}
            onMouseEnter={(e) => handleTriggerMouseEnter(e, turn, citation.domain)}
            onMouseLeave={handleTriggerMouseLeave}
          >
            {citation.domain}
          </a>
        )
      }
      return <span key={`${keyPrefix}-missing-${index}`} className="citation-bubble-error">{part}</span>
    })
  }

  const renderWithCitations = (children: ReactNode, citations: CitationItem[], turn: ChatTurn, keyPrefix: string) => {
    const nodes = Array.isArray(children) ? children : [children]
    return nodes.flatMap((child, index) => {
      if (typeof child === 'string') {
        return renderCitationsInText(child, citations, turn, `${keyPrefix}-${index}`)
      }
      return child
    })
  }

  const MarkdownAnswer = ({ content, citations, turn }: { content: string; citations: CitationItem[]; turn: ChatTurn }) => {
    if (!content) return null

    const components: Components = {
      code: ({ inline, className, children }) => (
        <ShikiCodeBlock inline={inline} className={className}>
          {children}
        </ShikiCodeBlock>
      ),
      p: ({ children }) => (
        <p>{renderWithCitations(children, citations, turn, 'p')}</p>
      ),
      li: ({ children }) => (
        <li>{renderWithCitations(children, citations, turn, 'li')}</li>
      ),
      h1: ({ children }) => (
        <h1>{renderWithCitations(children, citations, turn, 'h1')}</h1>
      ),
      h2: ({ children }) => (
        <h2>{renderWithCitations(children, citations, turn, 'h2')}</h2>
      ),
      h3: ({ children }) => (
        <h3>{renderWithCitations(children, citations, turn, 'h3')}</h3>
      ),
      h4: ({ children }) => (
        <h4>{renderWithCitations(children, citations, turn, 'h4')}</h4>
      ),
      blockquote: ({ children }) => (
        <blockquote>{renderWithCitations(children, citations, turn, 'blockquote')}</blockquote>
      ),
      td: ({ children }) => (
        <td>{renderWithCitations(children, citations, turn, 'td')}</td>
      ),
      th: ({ children }) => (
        <th>{renderWithCitations(children, citations, turn, 'th')}</th>
      ),
      a: ({ href, children }) => (
        <a href={href ?? ''} target="_blank" rel="noopener noreferrer" className="markdown-link">
          {children}
        </a>
      )
    }

    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={components}
        className="markdown-body"
      >
        {content}
      </ReactMarkdown>
    )
  }

  const FaviconWithFallback = ({ src }: { src: string }) => {
    const [error, setError] = useState(false)
    if (error) {
      return <GlobeSourceLogo />
    }
    return (
      <img
        src={src}
        alt=""
        style={{ width: 14, height: 14, borderRadius: 2, display: 'block', objectFit: 'contain' }}
        onError={() => setError(true)}
      />
    )
  }

  // Dynamic source icon mapper
  const renderSourceIcon = (logo: string) => {
    if (logo && (logo.startsWith('http') || logo.includes('.'))) {
      return <FaviconWithFallback src={logo} />
    }
    switch (logo) {
      case 'render':
        return <RenderLogo />
      case 'dev':
        return <DevToLogo />
      case 'reddit':
        return <RedditLogo />
      case 'ibm':
        return <IBMLogo />
      case 'wikipedia':
        return <WikipediaLogo />
      case 'times':
        return <TimesLogo />
      case 'express':
        return <ExpressLogo />
      case 'esquire':
        return <EsquireLogo />
      case 'mem0':
        return <Mem0Logo />
      case 'github':
        return <GithubLogo />
      default:
        return <GlobeSourceLogo />
    }
  }

  // hand-crafted real world snippets for our mock database
  const getRichSourceMetadata = (url: string, domain: string, queryTitle?: string) => {
    const snippets: Record<string, { title: string; logo: string; snippet: string }[]> = {
      'docs.mem0.ai': [
        {
          title: "Hugging Face Reranker",
          logo: "mem0",
          snippet: ". Model Comparison ; bge-reranker-base, 278M, Good ; bge-reranker-large, 560M, Better ; bge-reranker-v2-gemma, 9B, Best. Mem0 supports various reranking algorithms to optimize search precision and context retrieval."
        },
        {
          title: "Mem0 Memory Architecture",
          logo: "mem0",
          snippet: "A deep dive into Mem0's persistent memory layer for AI agents. Learns and adapts to user preferences over time, automatically updating knowledge profiles."
        }
      ],
      'ibm.com': [
        {
          title: "What is Vibe Coding? | IBM Topics",
          logo: "ibm",
          snippet: "Vibe coding represents a fundamental shift in software engineering where developers leverage high-level natural language instructions. By utilizing LLMs as dynamic translators, creators focus on architectural design and system orchestration rather than syntactical debugging."
        }
      ],
      'reddit.com': [
        {
          title: "What's up with 'vibe coding'? : r/OutOfTheLoop",
          logo: "reddit",
          snippet: "1.2k comments • Posted by u/tech_pioneer. Vibe coding basically means you don't write any actual code lines yourself. You just describe what you want in Cursor or Claude, and let it build the app. It's fast, but people are debating if it's sustainable."
        },
        {
          title: "Any free backend hosting platforms that don't sleep? : r/selfhosted",
          logo: "reddit",
          snippet: "840 comments • Render's free tier sleeps after 15 mins, looking for something that is always on. Koyeb has been highly recommended as it keeps the instance running, though resources are limited to 512MB RAM."
        }
      ],
      'wikipedia.org': [
        {
          title: "Vibe coding - Wikipedia",
          logo: "wikipedia",
          snippet: "Vibe coding is a neologism describing a method of software development where the programmer interacts exclusively through a natural language interface with an AI. It emerged in late 2024 as autonomous code generation tools improved."
        }
      ],
      'en.wikipedia.org': [
        {
          title: "Vibe coding - Wikipedia",
          logo: "wikipedia",
          snippet: "Vibe coding is a neologism describing a method of software development where the programmer interacts exclusively through a natural language interface with an AI. It emerged in late 2024 as autonomous code generation tools improved."
        }
      ],
      'dev.to': [
        {
          title: "FREE Web and Application Hosting For Your Next Project",
          logo: "dev",
          snippet: "Finding a free hosting platform that doesn't put your app to sleep can be challenging. In this guide, we compare Koyeb's microservices tier, Hugging Face Docker Spaces, and Oracle Cloud Compute instances."
        },
        {
          title: "Vibe Coding: The Future of Software Development?",
          logo: "dev",
          snippet: "As AI tools like Claude 3.5 Sonnet and GPT-4o become more capable, developers are shifting to vibe coding. We discuss the transition from code writing to system architecting."
        }
      ],
      'northflank.com': [
        {
          title: "7 Best Render alternatives for simple app hosting in 2026 | Blog",
          logo: "render",
          snippet: "Northflank offers high-performance cloud container hosting. With microservice instances starting at $0, developers migrating from Render get dedicated CPU cores, zero sleep delays, and automatic SSL out of the box."
        }
      ],
      'timesofindia.indiatimes.com': [
        {
          title: "IPL 2026 Eliminator - SRH vs RR Live Match Score & Updates",
          logo: "times",
          snippet: "IPL 2026 Eliminator Highlights: Sunrisers Hyderabad face Rajasthan Royals at Narendra Modi Stadium. SRH won the toss and elected to bowl. Dynamic lineups feature Heinrich Klaasen and Yashasvi Jaiswal."
        },
        {
          title: "IPL Playoffs 2026: Team lineups and pitch report today",
          logo: "times",
          snippet: "IPL playoffs pitch report: A dry deck with significant crack lines, expected to assist spin in the second half. SRH captain Pat Cummins expresses confidence in their chasing abilities under lights."
        }
      ],
      'indianexpress.com': [
        {
          title: "Sunrisers Hyderabad vs Rajasthan Royals Eliminator Standings",
          logo: "express",
          snippet: "Indian Express Sports: Complete player stats and standings for SRH vs RR. Rajasthan Royals' spin duo Ravichandran Ashwin and Yuzvendra Chahal look to contain the high-flying SRH top order in Ahmedabad."
        }
      ],
      'esquireindia.com': [
        {
          title: "SRH vs RR play-offs head-to-head history in IPL playoffs",
          logo: "esquire",
          snippet: "Esquire India: Looking back at historical play-off encounters between Sunrisers Hyderabad and Rajasthan Royals. SRH leads the head-to-head playoff record 3-2, with matches known for high-scoring chases."
        },
        {
          title: "JioHotstar streaming links for IPL playoffs live",
          logo: "esquire",
          snippet: "Streaming guide: How to watch IPL 2026 Eliminator live on JioHotstar. Free HD streams are available for mobile app users, while web platforms require a premium tier subscription starting at ₹299."
        }
      ],
      'github.com': [
        {
          title: "mem0ai/mem0: The memory layer for Personalized AI - GitHub",
          logo: "github",
          snippet: "Mem0 is a developer platform that provides intelligent, self-improving memory for AI agents, assistants, and LLM applications. Over 24k stars on GitHub."
        }
      ]
    }

    const standardDomain = domain.replace(/^www\./, '').toLowerCase()
    const matchGroup = snippets[standardDomain] || snippets[url.replace(/https?:\/\/(www\.)?/, '').split('/')[0]]

    if (matchGroup && matchGroup.length > 0) {
      const found = matchGroup.find(item =>
        (queryTitle && item.title.toLowerCase().includes(queryTitle.split(' ')[0].toLowerCase())) ||
        (url && url.includes(item.title.split(' ')[0].toLowerCase()))
      ) || matchGroup[0]
      return {
        title: found.title,
        logo: found.logo,
        snippet: found.snippet
      }
    }

    const cleanTitle = queryTitle || `${standardDomain} - Latest details and expert guidelines`
    return {
      title: cleanTitle,
      logo: 'globe',
      snippet: `Expert analysis and real-time updates for your search from ${standardDomain}. Detailed discussions, reference links, and professional community reviews covering all facets.`
    }
  }

  const getLinksForDomain = (turn: ChatTurn, domain: string) => {
    if (!turn.resultData) return []
    const links: any[] = []

    // 1. Check in steps first
    turn.resultData.steps.forEach(step => {
      step.links.forEach(link => {
        if (link.domain.toLowerCase() === domain.toLowerCase() ||
          (link.url && link.url.includes(domain.toLowerCase()))) {
          const meta = getRichSourceMetadata(link.url, link.domain, link.title)
          links.push({
            ...link,
            title: link.title || meta.title,
            logo: link.logo || meta.logo,
            snippet: link.snippet || meta.snippet
          })
        }
      })
    })

    // 2. Check in citations if not found in steps
    if (links.length === 0) {
      turn.resultData.citations.forEach(cit => {
        if (cit.domain.toLowerCase() === domain.toLowerCase() ||
          (cit.url && cit.url.includes(domain.toLowerCase()))) {
          const meta = getRichSourceMetadata(cit.url, cit.domain, cit.title)
          links.push({
            title: cit.title || meta.title,
            url: cit.url,
            domain: cit.domain,
            logo: cit.logo || meta.logo,
            snippet: cit.snippet || meta.snippet
          })
        }
      })
    }

    // Remove duplicate URLs
    const seenUrls = new Set()
    return links.filter(link => {
      if (seenUrls.has(link.url)) return false
      seenUrls.add(link.url)
      return true
    })
  }

  const handleTriggerMouseEnter = (e: React.MouseEvent, turn: ChatTurn, domain: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }

    const rect = e.currentTarget.getBoundingClientRect()
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    const x = rect.left + scrollLeft + rect.width / 2
    const y = rect.top + scrollTop - 8 // 8px spacing above

    const domainLinks = getLinksForDomain(turn, domain)

    if (domainLinks.length > 0) {
      setHoverCard({
        x,
        y,
        turnId: turn.id,
        domain,
        currentIndex: 0,
        links: domainLinks,
        visible: true
      })
    }
  }

  const handleTriggerMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoverCard(prev => prev ? { ...prev, visible: false } : null)
    }, 150)
  }

  const handleCardMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
  }

  const handleCardMouseLeave = () => {
    handleTriggerMouseLeave()
  }

  // Database of Mock Search Results
  const getResultData = (query: string): ResultData => {
    const q = query.toLowerCase()

    // Vibe coding exact match matching user screenshot
    if (q.includes('vibe') || q.includes('coding') || q.includes('lucidity') || q.includes('what is vibe')) {
      return {
        title: "what is vibe coding",
        tab: "Answer",
        steps: [
          {
            title: "Searching the web",
            query: "what is vibe coding",
            links: [
              { title: "What is Vibe Coding? | IBM", url: "https://www.ibm.com/topics/vibe-coding", domain: "ibm", logo: "ibm" },
              { title: "What's up with \"vibe coding\"? : r/OutOfTheLoop", url: "https://www.reddit.com/r/OutOfTheLoop/comments/vibe_coding", domain: "reddit", logo: "reddit" },
              { title: "Vibe coding", url: "https://en.wikipedia.org/wiki/Vibe_coding", domain: "wikipedia", logo: "wikipedia" }
            ]
          }
        ],
        answer: `**Vibe coding** is a modern software development trend where a developer writes code primarily using natural language AI assistants (like Claude, ChatGPT, or Cursor) rather than writing lines of code manually. In this paradigm, the developer acts as a high-level system architect or director, while the AI performs the low-level execution. [1]

### Core Characteristics
* **Natural Language Interfaces:** Developers describe their desired features, bugs, or system logic in English, and the AI translates these instructions into fully functional code. [2]
* **Developer as \"Viber\":** The human's role shifts from syntax writing to debugging, architecting, and verifying the AI's outputs, which has been humorously referred to as "just vibing." [3]
* **Accelerated Prototyping:** Projects that traditionally took days or weeks can be built in minutes, enabling rapid iterations and a lower barrier to entry for non-technical creators. [4]

### Origin and Industry Response
The term was popularized in early 2025 by prominent AI researcher Andrej Karpathy and developer communities on platforms like Reddit and X (formerly Twitter). [5] While some software engineers view it as a superficial way to build software, others believe it represents the future of how all software will be created. [6]`,
        citations: [
          { id: 1, domain: "ibm", url: "https://www.ibm.com/topics/vibe-coding" },
          { id: 2, domain: "reddit", url: "https://www.reddit.com/r/OutOfTheLoop/comments/vibe_coding" },
          { id: 3, domain: "wikipedia", url: "https://en.wikipedia.org/wiki/Vibe_coding" },
          { id: 4, domain: "dev", url: "https://dev.to" },
          { id: 5, domain: "reddit", url: "https://www.reddit.com/r/OutOfTheLoop/comments/vibe_coding" },
          { id: 6, domain: "wikipedia", url: "https://en.wikipedia.org/wiki/Vibe_coding" }
        ],
        related: [
          "Is vibe coding suitable for large enterprise applications?",
          "Who coined the term vibe coding?",
          "What are the best tools for vibe coding in 2026?",
          "How does vibe coding impact junior developers?"
        ],
        images: [
          { title: "Artificial Intelligence", url: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=400" },
          { title: "Developer Vibing", url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400" },
          { title: "Typing Code", url: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400" }
        ]
      }
    }

    // IPL query template matching user screenshot
    if (q.includes('ipl') || q.includes('srh') || q.includes('rr') || q.includes('match') || q.includes('eliminator') || q.includes('cricket')) {
      return {
        title: "checking the current IPL match",
        tab: "Answer",
        steps: [
          {
            title: "Searching the web",
            query: "ipl 2026 eliminator srh vs rr match details today",
            links: [
              { title: "IPL 2026 Eliminator - SRH vs RR Live Match Score & Updates", url: "https://timesofindia.indiatimes.com", domain: "timesofindia.indiatimes", logo: "times" },
              { title: "Sunrisers Hyderabad vs Rajasthan Royals Eliminator Standings", url: "https://indianexpress.com", domain: "indianexpress.com", logo: "express" },
              { title: "SRH vs RR play-offs head-to-head history in IPL playoffs", url: "https://esquireindia.com", domain: "esquireindia.com", logo: "esquire" }
            ]
          },
          {
            title: "Looking for free SearXNG deployment options",
            query: "srh vs rr head to head records and team news",
            links: [
              { title: "IPL Playoffs 2026: Team lineups and pitch report today", url: "https://timesofindia.indiatimes.com", domain: "timesofindia.indiatimes", logo: "times" },
              { title: "JioHotstar streaming links for IPL playoffs live", url: "https://esquireindia.com", domain: "esquireindia.com", logo: "esquire" }
            ]
          }
        ],
        answer: `Today's IPL 2026 match is the **Eliminator** between **Sunrisers Hyderabad (SRH)** and **Rajasthan Royals (RR)**. Here are the key details: [1]

### Match Details
* **Match:** IPL 2026 Eliminator — SRH vs RR [2]
* **Venue:** Maharaja Yadavindra Singh International Cricket Stadium, Mullanpur, New Chandigarh [3]
* **Toss Time:** 7:00 PM IST [4]
* **Match Start:** 7:30 PM IST [5]
* **Stakes:** The winner advances to Qualifier 2; the loser is eliminated from the tournament. [6]

### Head-to-Head
In 15 previous encounters, SRH has a slight edge with **8 wins** compared to RR's **7 wins**. [7]

### Where to Watch
* **TV:** Star Sports 1, Star Sports 1 Hindi, Star Sports 1 Tamil, Star Sports 1 Telugu, Star Sports 1 Kannada [8]
* **Live Streaming:** JioHotstar (app & website) [9]

RR had a shaky run toward the end of the league stage but secured their playoff spot with back-to-back victories. SRH has relied heavily on their opening partnership to carry their batting lineup throughout the season.`,
        citations: [
          { id: 1, domain: "timesofindia.indiatimes", url: "https://timesofindia.indiatimes.com" },
          { id: 2, domain: "indianexpress", url: "https://indianexpress.com" },
          { id: 3, domain: "esquireindia", url: "https://esquireindia.com" },
          { id: 4, domain: "timesofindia.indiatimes", url: "https://timesofindia.indiatimes.com" },
          { id: 5, domain: "timesofindia.indiatimes", url: "https://timesofindia.indiatimes.com" },
          { id: 6, domain: "timesofindia.indiatimes", url: "https://timesofindia.indiatimes.com" },
          { id: 7, domain: "facebook", url: "https://facebook.com" },
          { id: 8, domain: "esquireindia", url: "https://esquireindia.com" },
          { id: 9, domain: "esquireindia", url: "https://esquireindia.com" }
        ],
        related: [
          "Who won the toss in the SRH vs RR match?",
          "What is the schedule for IPL 2026 Qualifier 2?",
          "Who is predicted to win between SRH and RR?",
          "What happens to the loser of the Eliminator?"
        ],
        images: [
          { title: "SRH Team", url: "https://images.unsplash.com/photo-1540747737956-37872404a87a?w=400" },
          { title: "RR Team", url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400" },
          { title: "IPL Trophy", url: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=400" }
        ]
      }
    }

    // SearXNG / Deployment queries
    if (q.includes('searxng') || q.includes('deployment') || q.includes('hosting') || q.includes('sleep') || q.includes('free')) {
      return {
        title: "Looking for free SearXNG deployment options",
        tab: "Answer",
        steps: [
          {
            title: "Searching the web",
            query: "best free SearXNG deployment service no sleep",
            links: [
              { title: "7 Best Render alternatives for simple app hosting in 2026 | Blog", url: "https://northflank.com", domain: "northflank", logo: "render" },
              { title: "FREE Web and Application Hosting For Your Next Project", url: "https://dev.to", domain: "dev", logo: "dev" },
              { title: "Any free backend hosting platforms that don't put your app to sleep? - Reddit", url: "https://reddit.com", domain: "reddit", logo: "reddit" }
            ]
          },
          {
            title: "Looking for free SearXNG deployment options",
            query: "Koyeb free tier always on no sleep 2025",
            links: [
              { title: "7 Best Render alternatives for simple app hosting in 2026 | Blog", url: "https://northflank.com", domain: "northflank", logo: "render" },
              { title: "FREE Web and Application Hosting For Your Next Project", url: "https://dev.to", domain: "dev", logo: "dev" },
              { title: "Any free backend hosting platforms that don't put your app to sleep? - Reddit", url: "https://reddit.com", domain: "reddit", logo: "reddit" }
            ]
          }
        ],
        answer: `For deploying **SearXNG** on a free service that **does not put your app to sleep** (avoiding high response times during cold starts), here are the premier choices in 2026: [1]

### 1. Koyeb (Free Tier)
Koyeb offers an extremely powerful free tier with **no automatic sleep/inactivity shutdown**. It includes: [2]
* **Resources:** 512MB RAM, microservices, and auto-deployments from GitHub.
* **Benefit:** Ideal for hosting SearXNG Docker instances with high availability. [3]

### 2. Hugging Face Spaces (Docker Space)
Hugging Face Spaces allows you to run custom Docker containers for free: [4]
* **Deployment:** Deploy SearXNG as a Docker container inside a Space.
* **Benefit:** Provides a completely free **always-on public URL** that does not spin down as long as there is active or recent interest. [5]

### 3. Oracle Cloud Free Tier (Always Free Compute)
For a completely independent, always-on self-hosted SearXNG deployment, Oracle Cloud's **Always Free Ampere A1 Compute** instances are unmatched: [6]
* **Specs:** Up to 4 ARM CPUs and 24GB RAM.
* **Benefit:** It never sleeps, has zero cost, and is perfect for a full-featured SearXNG stack. [7]`,
        citations: [
          { id: 1, domain: "northflank", url: "https://northflank.com" },
          { id: 2, domain: "dev", url: "https://dev.to" },
          { id: 3, domain: "reddit", url: "https://reddit.com" },
          { id: 4, domain: "dev", url: "https://dev.to" },
          { id: 5, domain: "reddit", url: "https://reddit.com" },
          { id: 6, domain: "northflank", url: "https://northflank.com" },
          { id: 7, domain: "reddit", url: "https://reddit.com" }
        ],
        related: [
          "How do I configure SearXNG to prevent rate limits on free hosting?",
          "Can I deploy SearXNG on Vercel or Netlify?",
          "What is the average memory usage of a standard SearXNG container?",
          "How do I setup a custom domain for my free SearXNG instance?"
        ],
        images: [
          { title: "SearXNG Logo", url: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400" },
          { title: "Hosting Server", url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400" },
          { title: "Docker Container", url: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=400" }
        ]
      }
    }

    // Custom Mem0 query matching user screenshot exactly
    if (q.includes('mem0') || q.includes('hugging') || q.includes('reranker')) {
      return {
        title: "Mem0 Hugging Face Reranker comparison",
        tab: "Answer",
        steps: [
          {
            title: "Searching the web",
            query: "mem0 hugging face reranker models performance",
            links: [
              { title: "Hugging Face Reranker - Mem0 Docs", url: "https://docs.mem0.ai/reranker/huggingface", domain: "docs.mem0.ai", logo: "mem0" },
              { title: "Mem0 Memory Architecture Overview - Mem0 Docs", url: "https://docs.mem0.ai/overview", domain: "docs.mem0.ai", logo: "mem0" },
              { title: "mem0ai/mem0: The memory layer for Personalized AI - GitHub", url: "https://github.com/mem0ai/mem0", domain: "github.com", logo: "github" }
            ]
          }
        ],
        answer: `Mem0 supports the **Hugging Face Reranker** to optimize search precision and context retrieval. Reranking helps re-order retrieved documents to ensure the most relevant context is fed into your LLM: [1]

### Hugging Face Reranker Model Comparison
* **bge-reranker-base:** 278M parameters. Fast execution with good accuracy. [2]
* **bge-reranker-large:** 560M parameters. Highly recommended for complex logical retrievals. [3]
* **bge-reranker-v2-gemma:** 9B parameters. State-of-the-art accuracy leveraging Gemma architecture. [4]

Once the base vector database fetches the top candidate chunks, the Hugging Face cross-encoder reranker computes a precise similarity score for each candidate relative to the query. This produces a vastly superior context injection layer compared to semantic cosine similarities alone. [5]`,
        citations: [
          { id: 1, domain: "docs.mem0.ai", url: "https://docs.mem0.ai/reranker/huggingface" },
          { id: 2, domain: "docs.mem0.ai", url: "https://docs.mem0.ai/reranker/huggingface" },
          { id: 3, domain: "docs.mem0.ai", url: "https://docs.mem0.ai/overview" },
          { id: 4, domain: "docs.mem0.ai", url: "https://docs.mem0.ai/reranker/huggingface" },
          { id: 5, domain: "github.com", url: "https://github.com/mem0ai/mem0" }
        ],
        related: [
          "How do I initialize the Hugging Face Reranker in Mem0?",
          "Can I use custom local cross-encoder models with Mem0?",
          "What is the latency overhead of adding a reranking step?",
          "How does Mem0 memory layer differ from LangChain memory?"
        ],
        images: [
          { title: "Mem0 Reranker", url: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=400" },
          { title: "Machine Learning Model", url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400" }
        ]
      }
    }

    // Default Fallback template
    return {
      title: "Searching for options",
      tab: "Answer",
      steps: [
        {
          title: "Searching the web",
          query: query,
          links: [
            { title: `${query} - Latest details and expert guidelines`, url: "https://dev.to", domain: "dev", logo: "dev" },
            { title: `What does the community say about: ${query}`, url: "https://reddit.com", domain: "reddit", logo: "reddit" }
          ]
        }
      ],
      answer: `Here is the simulated analysis for your search query: "**${query}**". [1]

This response is a premium structural placeholder representing a live retrieval answer. Once the backend is fully integrated, this content will be populated with actual real-time vector search results and reasoning outputs. [2]

* **Dynamic Formatting:** Support for lists, inline bold parameters, and citations. [3]
* **Sources Grid:** Click "Links" at the top of the answer card to view all referenced sources. [4]
* **Interactive related questions:** Choose any of the follow-ups listed below to trigger a contextual sub-search! [5]`,
      citations: [
        { id: 1, domain: "dev", url: "https://dev.to" },
        { id: 2, domain: "reddit", url: "https://reddit.com" },
        { id: 3, domain: "dev", url: "https://dev.to" },
        { id: 4, domain: "reddit", url: "https://reddit.com" },
        { id: 5, domain: "dev", url: "https://dev.to" }
      ],
      related: [
        `What is the background architecture for: ${query}?`,
        `Are there any alternative resources for ${query}?`,
        `How do I get started with ${query}?`
      ],
      images: [
        { title: "Information Hub", url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400" },
        { title: "Searching Data", url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400" }
      ]
    }
  }

  return (
    <div className="app">
      {/* LEFT NAVIGATION SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="brand" onClick={resetToHome}>
            <PerplexityLogo />
          </div>

          <button
            className={`new-thread-btn ${activeSidebarItem === 'new' && view === 'home' ? 'active' : ''}`}
            onClick={resetToHome}
            data-tooltip="New Thread (Ctrl + I)"
          >
            <Plus size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-btn ${activeSidebarItem === 'discover' ? 'active' : ''}`}
            onClick={() => setActiveSidebarItem('discover')}
            data-tooltip="Discover"
          >
            <ChatbotMonitorIcon />
          </button>

          <button
            className={`nav-btn ${activeSidebarItem === 'library' ? 'active' : ''}`}
            onClick={() => setActiveSidebarItem('library')}
            data-tooltip="Library"
          >
            <OverlappingFoldersIcon />
          </button>

          <button
            className={`nav-btn ${activeSidebarItem === 'spaces' ? 'active' : ''}`}
            onClick={() => setActiveSidebarItem('spaces')}
            data-tooltip="Spaces"
          >
            <GridSpacesIcon />
          </button>

          <button
            className={`nav-btn ${activeSidebarItem === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveSidebarItem('settings')}
            data-tooltip="Settings"
          >
            <HexagonSettingsIcon />
          </button>

          <button
            className={`nav-btn ${activeSidebarItem === 'history' ? 'active' : ''}`}
            onClick={() => setActiveSidebarItem('history')}
            data-tooltip="History"
          >
            <HistoryClockIcon />
          </button>
        </nav>

        {/* BOTTOM DASHBOARD CONTROLS */}
        <div className="sidebar-footer">
          <button
            className="nav-btn bell-btn"
            onClick={() => alert('Notifications clicked')}
            data-tooltip="Notifications"
          >
            <BellNotificationIcon />
            <span className="bell-dot"></span>
          </button>

          <button
            className="nav-btn invite-btn"
            onClick={() => setShowSignIn(true)}
            data-tooltip="Invite Friends"
          >
            <UserPlusInviteIcon />
          </button>

          <div className="profile-avatar-container" onClick={() => setShowSignIn(true)} data-tooltip="Profile Settings">
            <div className="pro-avatar">
              <div className="avatar-art-gradient"></div>
            </div>
            <span className="pro-badge">Pro</span>
          </div>
        </div>
      </aside>

      {/* ==========================================
         VIEW: 1. HOME SCREEN (LANDING PAGE)
         ========================================== */}
      {view === 'home' && (
        <main className="main-content">
          {/* TOP TOPICS NAVIGATION */}
          <header className="main-header">
            <nav className="topics-nav">
              {['Discover', 'Finance', 'Health', 'Academic', 'Patents'].map((topic) => (
                <button
                  key={topic}
                  className={`topic-link ${activeTopic === topic ? 'active' : ''}`}
                  onClick={() => setActiveTopic(topic)}
                >
                  {topic}
                </button>
              ))}
            </nav>
          </header>

          {/* HERO SECTION */}
          <section className="hero-section">
            <div className="hero-brand-container">
              <h1 className="hero-logo-text">lucidity ai</h1>
            </div>

            {/* SEARCH CONTAINER & TEXTAREA CARD */}
            <form className="search-form-card" onSubmit={handleFormSubmit}>
              <div className="textarea-wrapper">
                <textarea
                  ref={textareaRef}
                  value={prompt}
                  onChange={handleTextareaChange}
                  placeholder="Type / for search modes"
                  rows={1}
                  className="search-textarea"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleFormSubmit(e)
                    }
                  }}
                />

                {/* SLASH COMMAND AUTOCOMPLETE OVERLAY */}
                {isSlashOpen && (
                  <div className="slash-menu-overlay">
                    <div className="slash-menu-header">Search Modes</div>
                    <div className="slash-menu-list">
                      {[
                        { name: 'Search', desc: 'Search across the entire web', icon: Search },
                        { name: 'Writing', desc: 'Generate text & code, no web search', icon: PenTool },
                        { name: 'Academic', desc: 'Search peer-reviewed research papers', icon: GraduationCap },
                        { name: 'YouTube', desc: 'Find and search within videos', icon: Video },
                        { name: 'Reddit', desc: 'Search discussions, reviews & opinions', icon: MessageSquare },
                        { name: 'Wikipedia', desc: 'Search high quality articles & facts', icon: Bookmark },
                      ].map((item) => (
                        <button
                          key={item.name}
                          type="button"
                          className="slash-menu-item"
                          onClick={() => handleSlashSelect(item.name)}
                        >
                          <item.icon size={16} className="item-icon" />
                          <div className="item-text">
                            <span className="item-title">{item.name}</span>
                            <span className="item-desc">{item.desc}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* BOTTOM TOOLBAR */}
              <div className="search-toolbar">
                <div className="toolbar-left">
                  <button type="button" className="toolbar-icon-btn attach-btn" data-tooltip="Attach files or tools">
                    <Plus size={16} />
                  </button>

                  {/* Focus dropdown container */}
                  <div className="dropdown-container" ref={focusDropdownRef}>
                    <button
                      type="button"
                      className={`toolbar-pill-btn focus-pill-btn ${selectedFocus !== 'Search' ? 'has-focus' : ''}`}
                      onClick={() => {
                        setIsFocusOpen(!isFocusOpen)
                        setIsModelOpen(false)
                      }}
                    >
                      <Search size={14} className="pill-icon" />
                      <span>{selectedFocus}</span>
                      <ChevronDown size={12} className="chevron" />
                    </button>

                    {isFocusOpen && (
                      <div className="dropdown-menu focus-dropdown">
                        <div className="dropdown-section-title">Focus Search Modes</div>
                        <div className="dropdown-options">
                          {[
                            { name: 'Search', label: 'All', desc: 'Search across the entire web', icon: Search },
                            { name: 'Writing', label: 'Writing', desc: 'Generate text & code, no web search', icon: PenTool },
                            { name: 'Academic', label: 'Academic', desc: 'Search peer-reviewed papers', icon: GraduationCap },
                            { name: 'YouTube', label: 'YouTube', desc: 'Search and watch videos', icon: Video },
                            { name: 'Reddit', label: 'Reddit', desc: 'Search discussions & opinions', icon: MessageSquare },
                            { name: 'Wikipedia', label: 'Wikipedia', desc: 'Search reliable facts', icon: Bookmark }
                          ].map((item) => (
                            <button
                              key={item.name}
                              type="button"
                              className={`dropdown-option ${selectedFocus === item.name ? 'selected' : ''}`}
                              onClick={() => handleFocusSelect(item.name)}
                            >
                              <item.icon size={16} className="opt-icon" />
                              <div className="opt-meta">
                                <span className="opt-title">{item.name}</span>
                                <span className="opt-desc">{item.desc}</span>
                              </div>
                              {selectedFocus === item.name && <Check size={14} className="check-icon" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Computer Mode switch */}
                  <button
                    type="button"
                    className={`toolbar-pill-btn computer-mode-btn ${isComputerMode ? 'active' : ''}`}
                    onClick={() => setIsComputerMode(!isComputerMode)}
                    data-tooltip="Toggle Lucidity Computer"
                  >
                    <Monitor size={14} className="pill-icon" />
                    <span>Computer</span>
                  </button>
                </div>

                <div className="toolbar-right">
                  {/* Model dropdown container */}
                  <div className="dropdown-container" ref={modelDropdownRef}>
                    <button
                      type="button"
                      className="toolbar-pill-btn model-pill-btn"
                      onClick={() => {
                        setIsModelOpen(!isModelOpen)
                        setIsFocusOpen(false)
                      }}
                    >
                      <span>{selectedModelLabel}</span>
                      <ChevronDown size={12} className="chevron" />
                    </button>

                    {isModelOpen && (
                      <div className="dropdown-menu model-dropdown">
                        <div className="dropdown-section-title">Select Intelligence Model</div>
                        <div className="dropdown-options">
                          {modelOptions.map((model) => (
                            <button
                              key={model.id}
                              type="button"
                              className={`dropdown-option ${selectedModel === model.id ? 'selected' : ''}`}
                              onClick={() => handleModelSelect(model.id)}
                            >
                              <div className="opt-meta">
                                <span className="opt-title">{model.label}</span>
                                <span className="opt-desc">{model.desc}</span>
                              </div>
                              {selectedModel === model.id && <Check size={14} className="check-icon" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Voice button */}
                  <button type="button" className="toolbar-icon-btn voice-dictation" data-tooltip="Use voice dictation">
                    <Mic size={16} />
                  </button>

                  {/* Main Submit Circular Waveform Button */}
                  <button
                    type="submit"
                    disabled={!prompt.trim()}
                    className={`submit-circle-btn ${prompt.trim() ? 'enabled' : ''}`}
                    aria-label="Submit search"
                  >
                    {prompt.trim() ? (
                      <ArrowRight size={18} />
                    ) : (
                      <div className="waveform-container">
                        <span className="wave-bar bar-1"></span>
                        <span className="wave-bar bar-2"></span>
                        <span className="wave-bar bar-3"></span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* TRY OUT SUGGESTIONS CONTAINER */}
            <div className="suggestions-container">
              <div className="suggestions-header">
                <div className="suggestions-title-group">
                  <Sparkles size={16} className="title-icon" />
                  <span>Try out Lucidity Computer</span>
                </div>

                <button
                  type="button"
                  className={`shuffle-btn ${isShuffling ? 'spinning' : ''}`}
                  onClick={handleShuffle}
                  disabled={isShuffling}
                  aria-label="Shuffle starting suggestions"
                >
                  <svg className="shuffle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                    <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M4 4l5 5M15 15l6 6" />
                  </svg>
                  <span>Shuffle starter cards</span>
                </button>
              </div>

              {/* SUGGESTIONS CARDS GRID */}
              <div className={`suggestions-grid ${isShuffling ? 'fade-out' : 'fade-in'}`}>
                {currentSuggestions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="suggestion-card"
                    onClick={() => handleSuggestionClick(item.text)}
                  >
                    <div className="card-icon-wrapper">
                      <item.icon size={16} />
                    </div>
                    <span className="card-label">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        </main>
      )}

      {/* ==========================================
         VIEW: 2. SEARCH RESULTS PRESENTATION
         ========================================== */}
      {view === 'results' && turns.length > 0 && (
        <main className="main-content results-page-main">
          <div className="results-wrapper-column">

            {/* SEARCH RESULTS HEADER: TABS & ACTION BUTTONS */}
            <header className="results-header-actions">
              <div className="header-left-tabs">
                {[
                  { name: 'Answer', icon: PenTool },
                  { name: 'Links', icon: Globe },
                  { name: 'Images', icon: ImageIcon }
                ].map((tabItem) => (
                  <button
                    key={tabItem.name}
                    className={`result-header-tab ${activeResultTab === tabItem.name ? 'active' : ''}`}
                    onClick={() => setActiveResultTab(tabItem.name as any)}
                  >
                    {tabItem.name === 'Answer' ? (
                      <span className="tab-icon answer-tab-brand-icon">
                        <PerplexityLogo />
                      </span>
                    ) : (
                      <tabItem.icon size={14} className="tab-icon" />
                    )}
                    <span>{tabItem.name}</span>
                  </button>
                ))}
              </div>

              <div className="header-right-actions">
                <button className="icon-action-btn" data-tooltip="More actions">
                  <MoreHorizontal size={18} />
                </button>

                <button className="share-pill-btn" onClick={() => alert('Citation Link Copied!')}>
                  <Share2 size={14} className="share-icon" />
                  <span>Share</span>
                  <Lock size={12} className="lock-icon" />
                </button>
              </div>
            </header>

            {/* RESULTS CONTENT RENDER */}
            <div className="results-core-layout">
              {activeResultTab === 'Answer' && (
                <div className="tab-answer-view" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  {turns.map((turn, tIdx) => (
                    <div
                      id={`turn-${turn.id}`}
                      key={turn.id}
                      className="chat-turn-block animate-fade-in"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                        borderBottom: tIdx < turns.length - 1 ? '1px dashed var(--border)' : 'none',
                        paddingBottom: tIdx < turns.length - 1 ? '32px' : '0',
                        minHeight: tIdx === turns.length - 1 ? 'calc(100vh - 160px)' : 'auto'
                      }}
                    >

                      {/* User Query Bubble */}
                      <div className="user-query-bubble-row">
                        <div className="user-query-bubble">{turn.query}</div>
                      </div>

                      {/* PRE-TOOL THINKING TREE VIEW */}
                      {!turn.toolsUsed && turn.preToolThinking && (
                        <div className="search-tree-container">
                          <button
                            type="button"
                            className="tree-header-btn"
                            onClick={() => {
                              setTurns(prev => prev.map(t => t.id === turn.id ? { ...t, thinkingExpanded: !t.thinkingExpanded } : t))
                            }}
                          >
                            <span className="tree-header-text">
                              {turn.status === 'thinking' ? 'Thinking...' : 'Thought'}
                            </span>
                            <ChevronDown size={14} className={`tree-chevron ${turn.thinkingExpanded ? 'expanded' : ''}`} />
                          </button>

                          {turn.thinkingExpanded && (
                            <div className="tree-content-wrapper animate-slide-down">
                              <div className="tree-vertical-line"></div>
                              <div className="tree-items" style={{ paddingLeft: '20px', paddingRight: '20px', boxSizing: 'border-box' }}>
                                <div className="thinking-process-content" style={{ padding: '0 0 12px 0', borderLeft: 'none' }}>
                                  {turn.preToolThinking}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* SEARCHING THE WEB TREE VIEW */}
                      {turn.toolsUsed && (
                        <div className="search-tree-container">
                          <button
                            type="button"
                            className="tree-header-btn"
                            onClick={() => {
                              setTurns(prev => prev.map(t => t.id === turn.id ? { ...t, stepsExpanded: !t.stepsExpanded } : t))
                            }}
                          >
                            {(() => {
                              const stepTitle = turn.resultData?.steps?.[0]?.title?.toLowerCase() || ''
                              if (stepTitle.includes('calc') || stepTitle.includes('math')) {
                                return <Calculator size={15} className="tree-header-icon" style={{ marginRight: 6, color: 'var(--text-primary)' }} />
                              }
                              if (stepTitle.includes('code') || stepTitle.includes('execut')) {
                                return <Code size={15} className="tree-header-icon" style={{ marginRight: 6, color: 'var(--text-primary)' }} />
                              }
                              if (stepTitle.includes('chart') || stepTitle.includes('visual')) {
                                return <LineChart size={15} className="tree-header-icon" style={{ marginRight: 6, color: 'var(--text-primary)' }} />
                              }
                              return <SearchGlobeIcon className="tree-header-icon" />
                            })()}
                            <span className="tree-header-text">
                              {(() => {
                                const title = turn.resultData?.steps?.[0]?.title || 'Searching the web'
                                return turn.status === 'searching' || turn.status === 'thinking' ? `${title}...` : title
                              })()}
                            </span>
                            <ChevronDown size={14} className={`tree-chevron ${turn.stepsExpanded ? 'expanded' : ''}`} />
                          </button>

                          {turn.stepsExpanded && turn.resultData && (
                            <div className="tree-content-wrapper animate-slide-down">
                              <div className="tree-vertical-line"></div>
                              <div className="tree-items">
                                {/* 1. Query Item */}
                                <div className="tree-item query-item">
                                  <Search size={13} className="tree-item-icon query-icon" />
                                  <span className="tree-item-text query-text">{turn.query}</span>
                                </div>

                                {/* 2. Link Items mapped from search step */}
                                {turn.resultData.steps[0] && turn.resultData.steps[0].links.slice(0, Math.min(turn.visibleLinksCount, 3)).map((link, lIdx) => (
                                  <a
                                    key={lIdx}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="tree-item link-item animate-slide-up-gently"
                                    style={{ animationDuration: '0.3s' }}
                                    onMouseEnter={(e) => handleTriggerMouseEnter(e, turn, link.domain)}
                                    onMouseLeave={handleTriggerMouseLeave}
                                  >
                                    <span className="tree-item-icon">
                                      {renderSourceIcon(link.logo)}
                                    </span>
                                    <span className="tree-item-title">{link.title}</span>
                                    <span className="tree-item-domain">{link.domain}</span>
                                  </a>
                                ))}

                                {/* 3. Dynamic remaining links Item */}
                                {turn.resultData.steps[0] && turn.resultData.steps[0].links.length > 3 && turn.visibleLinksCount >= Math.min(turn.resultData.steps[0].links.length, 3) && (
                                  <div className="tree-item more-item animate-slide-up-gently" style={{ animationDuration: '0.3s' }} onClick={() => setActiveResultTab('Links')}>
                                    <span className="more-text">+{turn.resultData.steps[0].links.length - 3} more</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* COLLAPSIBLE THINKING PROCESS BLOCK FOR POST-TOOL THINKING (PREMIUM TREE STYLE) */}
                      {turn.toolsUsed && turn.postToolThinking && (
                        <div className="search-tree-container" style={{ marginTop: '12px' }}>
                          <button
                            type="button"
                            className="tree-header-btn"
                            onClick={() => {
                              setTurns(prev => prev.map(t => t.id === turn.id ? { ...t, thinkingExpanded: !t.thinkingExpanded } : t))
                            }}
                          >
                            <span className="tree-header-text">
                              {turn.status === 'thinking' ? 'Thinking...' : 'Thought'}
                            </span>
                            <ChevronDown size={14} className={`tree-chevron ${turn.thinkingExpanded ? 'expanded' : ''}`} />
                          </button>

                          {turn.thinkingExpanded && (
                            <div className="tree-content-wrapper animate-slide-down">
                              <div className="tree-vertical-line"></div>
                              <div className="tree-items" style={{ paddingLeft: '20px', paddingRight: '20px', boxSizing: 'border-box' }}>
                                <div className="thinking-process-content" style={{ padding: '0 0 12px 0', borderLeft: 'none' }}>
                                  {turn.postToolThinking}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* CITATION RICH LLM ANSWER BODY */}
                      <div className="llm-response-content-card">
                        {(turn.status === 'searching' || turn.status === 'analyzing') && (
                          <div className="live-thinking-shimmer">
                            <span className="thinking-text-stream">
                              {turn.status === 'searching' ? 'Searching...' : 'Analyzing sources...'}
                            </span>
                          </div>
                        )}

                        {turn.status !== 'searching' && turn.status !== 'analyzing' && turn.status !== 'thinking' && (
                          <div className="streaming-answer-body animate-fade-in">
                            <MarkdownAnswer
                              content={turn.streamedAnswer}
                              citations={turn.resultData ? turn.resultData.citations : []}
                              turn={turn}
                            />
                          </div>
                        )}
                      </div>

                      {/* RELATED FOLLOW-UP QUESTIONS CARD */}
                      {turn.status === 'completed' && tIdx === turns.length - 1 && turn.webSearchUsed && turn.resultData && (
                        <div className="related-questions-block animate-slide-up-gently">
                          <div className="related-title-row">
                            <h4>Follow-ups</h4>
                          </div>

                          <div className="related-links-grid">
                            {turn.resultData.related.map((questionText, qIdx) => (
                              <button
                                key={qIdx}
                                type="button"
                                className="related-question-card-btn"
                                onClick={() => triggerSearch(questionText)}
                              >
                                <FollowUpArrow className="related-arrow-icon" />
                                <span className="related-card-lbl">{questionText}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              )}

              {/* TABS: LINKS DASHBOARD */}
              {activeResultTab === 'Links' && turns[turns.length - 1] && (
                <div className="tab-links-view animate-fade-in">
                  <div className="section-intro-text">
                    All referenced source links found for: <strong>"{turns[turns.length - 1].query}"</strong>
                  </div>

                  <div className="referenced-links-grid">
                    {turns[turns.length - 1].resultData?.steps.flatMap(s => s.links).map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cit-reference-link-card"
                      >
                        <div className="ref-card-header">
                          {renderSourceIcon(link.logo)}
                          <span className="ref-domain-lbl">{link.domain}</span>
                        </div>
                        <h4 className="ref-card-title">{link.title}</h4>
                        <div className="ref-card-footer">
                          <span>Visit Source Website</span>
                          <ArrowRight size={12} className="ref-arrow" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* TABS: IMAGES SEARCH GALLERY */}
              {activeResultTab === 'Images' && turns[turns.length - 1] && (
                <div className="tab-images-view animate-fade-in">
                  <div className="section-intro-text">
                    Visual gallery search result results for: <strong>"{turns[turns.length - 1].query}"</strong>
                  </div>

                  <div className="visuals-result-gallery-grid">
                    {turns[turns.length - 1].resultData?.images.map((image, idx) => (
                      <div key={idx} className="gallery-photo-card">
                        <div className="photo-ratio-box">
                          <img src={image.url} alt={image.title} className="gallery-img" />
                        </div>
                        <span className="photo-title-lbl">{image.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* FLOATING PROMPT BAR AT BOTTOM OF COLUMN */}
            <div className="floating-bottom-prompt-bar-container">
              <form
                className="follow-up-search-form"
                onSubmit={(e) => {
                  e.preventDefault()
                  triggerSearch(prompt)
                }}
              >
                <div className="follow-up-wrapper">
                  <textarea
                    ref={followUpTextareaRef}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ask a follow-up..."
                    rows={1}
                    className="follow-up-textarea"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        triggerSearch(prompt)
                      }
                    }}
                  />
                </div>

                <div className="search-toolbar follow-up-toolbar">
                  <div className="toolbar-left">
                    <button type="button" className="toolbar-icon-btn attach-btn" data-tooltip="Attach files or images">
                      <Plus size={16} />
                    </button>

                    <div className="dropdown-container" ref={focusDropdownRef}>
                      <button
                        type="button"
                        className={`toolbar-pill-btn focus-pill-btn ${selectedFocus !== 'Search' ? 'has-focus' : ''}`}
                        onClick={() => {
                          setIsFocusOpen(!isFocusOpen)
                          setIsModelOpen(false)
                        }}
                      >
                        <Search size={14} className="pill-icon" />
                        <span>{selectedFocus}</span>
                        <ChevronDown size={12} className="chevron" />
                      </button>

                      {isFocusOpen && (
                        <div className="dropdown-menu focus-dropdown">
                          <div className="dropdown-section-title">Focus Search Modes</div>
                          <div className="dropdown-options">
                            {[
                              { name: 'Search', label: 'All', desc: 'Search across the entire web', icon: Search },
                              { name: 'Writing', label: 'Writing', desc: 'Generate text & code, no web search', icon: PenTool },
                              { name: 'Academic', label: 'Academic', desc: 'Search peer-reviewed papers', icon: GraduationCap },
                              { name: 'YouTube', label: 'YouTube', desc: 'Search and watch videos', icon: Video },
                              { name: 'Reddit', label: 'Reddit', desc: 'Search discussions & opinions', icon: MessageSquare },
                              { name: 'Wikipedia', label: 'Wikipedia', desc: 'Search reliable facts', icon: Bookmark }
                            ].map((item) => (
                              <button
                                key={item.name}
                                type="button"
                                className={`dropdown-option ${selectedFocus === item.name ? 'selected' : ''}`}
                                onClick={() => handleFocusSelect(item.name)}
                              >
                                <item.icon size={16} className="opt-icon" />
                                <div className="opt-meta">
                                  <span className="opt-title">{item.name}</span>
                                  <span className="opt-desc">{item.desc}</span>
                                </div>
                                {selectedFocus === item.name && <Check size={14} className="check-icon" />}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="toolbar-right">
                    <div className="dropdown-container" ref={modelDropdownRef}>
                      <button
                        type="button"
                        className="toolbar-pill-btn model-pill-btn"
                        onClick={() => {
                          setIsModelOpen(!isModelOpen)
                          setIsFocusOpen(false)
                        }}
                      >
                        <span>{selectedModelLabel}</span>
                        <ChevronDown size={12} className="chevron" />
                      </button>

                      {isModelOpen && (
                        <div className="dropdown-menu model-dropdown">
                          <div className="dropdown-section-title">Select Intelligence Model</div>
                          <div className="dropdown-options">
                            {modelOptions.map((model) => (
                              <button
                                key={model.id}
                                type="button"
                                className={`dropdown-option ${selectedModel === model.id ? 'selected' : ''}`}
                                onClick={() => handleModelSelect(model.id)}
                              >
                                <div className="opt-meta">
                                  <span className="opt-title">{model.label}</span>
                                  <span className="opt-desc">{model.desc}</span>
                                </div>
                                {selectedModel === model.id && <Check size={14} className="check-icon" />}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <button type="button" className="toolbar-icon-btn voice-dictation" data-tooltip="Voice Input">
                      <Mic size={16} />
                    </button>

                    <button
                      type="submit"
                      disabled={!prompt.trim()}
                      className={`submit-arrow-up-btn ${prompt.trim() ? 'active' : ''}`}
                    >
                      <ArrowUp size={16} />
                    </button>
                  </div>
                </div>
              </form>
            </div>

          </div>
        </main>
      )}

      {/* STUNNING SIGN IN GLASSMORPHISM MODAL */}
      {showSignIn && (
        <div className="modal-backdrop" onClick={() => setShowSignIn(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowSignIn(false)} aria-label="Close modal">
              <X size={18} />
            </button>

            <div className="modal-header">
              <PerplexityLogo />
              <h2>Welcome to Lucidity AI</h2>
              <p>Sign in to save search history, customize filters, and explore space integrations.</p>
            </div>

            <div className="modal-body">
              <button type="button" className="auth-provider-btn google-btn">
                <svg className="provider-logo" viewBox="0 0 24 24" width="18" height="18">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              <button type="button" className="auth-provider-btn apple-btn">
                <svg className="provider-logo" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.5-.64.73-1.2 1.87-1.08 2.98 1.12.09 2.27-.57 3.03-1.42z" />
                </svg>
                <span>Continue with Apple</span>
              </button>

              <div className="divider">
                <span className="divider-line"></span>
                <span className="divider-text">or</span>
                <span className="divider-line"></span>
              </div>

              <div className="email-login-field">
                <input type="email" placeholder="Enter your email" className="email-input" />
                <button type="button" className="email-continue-btn">
                  Continue with Email
                </button>
              </div>
            </div>

            <div className="modal-footer">
              By continuing, you agree to Lucidity AI's <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
            </div>
          </div>
        </div>
      )}

      {/* FLOATING HOVER PREVIEW CARD */}
      {hoverCard && hoverCard.visible && hoverCard.links.length > 0 && (
        <div
          className="hover-link-preview-card animate-hover-card-fade-in"
          style={{
            position: 'absolute',
            left: hoverCard.x,
            top: hoverCard.y,
            transform: 'translate(-50%, -100%)',
            zIndex: 1000
          }}
          onMouseEnter={handleCardMouseEnter}
          onMouseLeave={handleCardMouseLeave}
        >
          {/* Header with nav arrows and pagination */}
          <div className="preview-card-header">
            <div className="preview-nav-arrows">
              <button
                type="button"
                className="preview-nav-btn prev-btn"
                disabled={hoverCard.currentIndex === 0}
                onClick={() => setHoverCard(prev => prev ? { ...prev, currentIndex: Math.max(0, prev.currentIndex - 1) } : null)}
              >
                <ArrowRight size={14} style={{ transform: 'rotate(180deg)' }} />
              </button>
              <button
                type="button"
                className="preview-nav-btn next-btn"
                disabled={hoverCard.currentIndex === hoverCard.links.length - 1}
                onClick={() => setHoverCard(prev => prev ? { ...prev, currentIndex: Math.min(prev.links.length - 1, prev.currentIndex + 1) } : null)}
              >
                <ArrowRight size={14} />
              </button>
            </div>
            <div className="preview-pagination">
              {hoverCard.currentIndex + 1}/{hoverCard.links.length}
            </div>
          </div>

          {/* Preview Content */}
          <div className="preview-card-body">
            <div className="preview-site-identity">
              <div className="preview-favicon-container">
                {renderSourceIcon(hoverCard.links[hoverCard.currentIndex].logo)}
              </div>
              <span className="preview-domain-name">{hoverCard.domain}</span>
            </div>

            <a
              href={hoverCard.links[hoverCard.currentIndex].url}
              target="_blank"
              rel="noopener noreferrer"
              className="preview-title-link"
            >
              <h4 className="preview-page-title">
                {hoverCard.links[hoverCard.currentIndex].title}
              </h4>
            </a>

            <p className="preview-page-snippet">
              {hoverCard.links[hoverCard.currentIndex].snippet}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
