import { useState, useEffect } from 'react'
import './index.css'

function App() {
  const [currentStep, setCurrentStep] = useState('login')
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    problem: '',
    details: ''
  })
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })
  const [message, setMessage] = useState('')
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [hasUsedFreeMessage, setHasUsedFreeMessage] = useState(false)

  // Device fingerprinting
  const generateDeviceFingerprint = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    ctx.textBaseline = 'top'
    ctx.font = '14px Arial'
    ctx.fillText('Device fingerprint', 2, 2)
    const fingerprint = canvas.toDataURL()
    return fingerprint
  }

  // Initialize user
  useEffect(() => {
    const deviceFingerprint = generateDeviceFingerprint()
    const storedUser = localStorage.getItem(`user_${deviceFingerprint}`)
    
    if (storedUser) {
      const user = JSON.parse(storedUser)
      setCurrentUser(user)
      setHasUsedFreeMessage(user.hasUsedFreeMessage || false)
    }
  }, [])

  // Update user data
  const updateUserData = (data) => {
    const deviceFingerprint = generateDeviceFingerprint()
    const updatedUser = { ...currentUser, ...data }
    localStorage.setItem(`user_${deviceFingerprint}`, JSON.stringify(updatedUser))
    setCurrentUser(updatedUser)
  }

  // Generate emotional message
  const generateEmotionalMessage = (name, age, problem, details) => {
    const ageGroups = {
      teens: 'teens',
      twenties: 'twenties', 
      thirties: 'thirties',
      forties_plus: 'forties_plus'
    }

    const ageGroup = ageGroups[age] || 'twenties'
    
    const messages = {
      Love: {
        teens: `Dear ${name}, I see you at ${age} struggling with matters of the heart. What feels like your entire world right now - this love, this heartbreak, this uncertainty - is actually preparing you for something beautiful. The person you're becoming through this experience is someone I'm incredibly proud of. The wisdom you're gaining about love, boundaries, and self-worth will become your greatest gift. Five years from now, you'll look back at this moment and realize this wasn't just about finding love - it was about finding yourself. The strength you're building now will help you create the most beautiful love story I've ever seen.`,
        twenties: `My dear ${name}, at ${age}, you're learning that love isn't just grand gestures - it's the quiet moments, the understanding, the growth. What feels like confusion now is actually clarity in disguise. You're not just learning about someone else; you're learning about the depth of your own heart. The vulnerability you're showing, the courage to love deeply even when it's scary - that's the superpower that will transform your relationships. I see the beautiful partnership you're building, and it started with the courage you're showing right now.`,
        thirties: `Beloved ${name}, at ${age}, you understand that real love is about partnership, growth, and choosing each other every day. The challenges you're facing aren't signs to give up - they're invitations to deepen your connection. You're learning to love not just the easy parts, but the complicated, messy, beautiful whole of another person. The wisdom you're gaining about compromise, communication, and unconditional support is creating a love story that will inspire others. Your future self is grateful for the work you're doing now.`,
        forties_plus: `My cherished ${name}, at ${age}, you've discovered that love evolves, deepens, and becomes more profound with time. The issues you're navigating aren't obstacles - they're opportunities to love more authentically. You're teaching those around you what enduring love looks like. The grace you're showing, the patience you're cultivating, the commitment to growth - these are creating a legacy of love that will ripple through generations. Your heart has never been more beautiful.`
      },
      Career: {
        teens: `Dear ${name}, at ${age}, you're already thinking about your future - that's extraordinary. The uncertainty you feel about your career path isn't a sign that you're lost; it's a sign that you're thoughtful. You're gathering experiences and insights that will serve you in ways you can't yet imagine. The curiosity you have, the willingness to explore different paths - that's the foundation of a remarkable career. I see the professional you're becoming, and they're confident, creative, and deeply fulfilled.`,
        twenties: `My ambitious ${name}, at ${age}, you're building the foundation of your career. The challenges, the learning curves, the moments of doubt - they're all shaping you into someone remarkable. You're not just accumulating skills; you're developing resilience and wisdom that will set you apart. The risks you're taking now, the courage to pursue work that matters - that's creating a career that will be both successful and meaningful. Your future self is proud of the professional you're becoming.`,
        thirties: `My accomplished ${name}, at ${age}, you're stepping into your power professionally. The leadership you're developing, the expertise you're cultivating - these are opening doors you haven't even imagined yet. You're learning that success isn't just about achievement; it's about impact, about creating value, about lifting others as you climb. The wisdom you're gaining about navigating complex professional environments is making you a leader others naturally follow.`,
        forties_plus: `My respected ${name}, at ${age}, you're not just succeeding - you're leading with wisdom and integrity. The experience you've accumulated, the perspective you've gained - these are your greatest assets. You're mentoring others, shaping your industry, creating opportunities for the next generation. The balance you've found between ambition and authenticity, success and service - that's the hallmark of a truly remarkable career. Your professional legacy is just beginning.`
      },
      Money: {
        teens: `Dear ${name}, at ${age}, you're already developing a healthy relationship with money - that's rare and valuable. The financial habits you're building now, the mindset you're developing about abundance and security - these will serve you your entire life. You're learning that money isn't just about spending; it's about creating options, about building freedom, about supporting the life you want to live. The financial wisdom you're gaining now will give you choices others won't have.`,
        twenties: `My smart ${name}, at ${age}, you're making financial decisions that will shape your future. The discipline you're showing, the long-term thinking - these are building a foundation of financial security that will give you freedom and options. You're learning that wealth isn't just about earning; it's about growing, about protecting, about using money as a tool to create the life you want. The financial habits you're building now will compound into extraordinary abundance.`,
        thirties: `My wise ${name}, at ${age}, you're moving beyond just earning to truly building wealth. The investment strategies you're developing, the understanding you're gaining about risk and reward - these are creating financial security that will support your dreams and protect your loved ones. You're learning that true wealth isn't just about having money; it's about having money work for you, about creating passive income, about building generational wealth.`,
        forties_plus: `My financially savvy ${name}, at ${age}, you've achieved a level of financial wisdom that comes from experience and thoughtful planning. The wealth you've built isn't just impressive - it's meaningful because of what it enables you to do. You're supporting causes you care about, helping family members, creating opportunities for others. The financial freedom you've achieved is allowing you to live with purpose and generosity. Your relationship with money has become a tool for creating positive impact.`
      },
      Life: {
        teens: `Dear ${name}, at ${age}, you're already asking the big questions - that's the beginning of wisdom. The confusion you feel about life direction isn't a problem; it's the natural state of someone growing into their potential. You're gathering experiences, developing self-awareness, learning what matters to you. The curiosity you have, the willingness to be vulnerable, the courage to explore - these are creating a life that will be rich with meaning and purpose.`,
        twenties: `My thoughtful ${name}, at ${age}, you're navigating the complexity of adult life with remarkable grace. You're learning that life isn't about having all the answers; it's about asking the right questions and being open to growth. The self-awareness you're developing, the values you're clarifying - these are becoming your compass through life's challenges. You're building a life that will be authentic, meaningful, and deeply satisfying.`,
        thirties: `My wise ${name}, at ${age}, you're integrating life's lessons into a beautiful philosophy of living. The challenges you've overcome have given you depth, the joys you've experienced have given you gratitude, the growth you've achieved has given you wisdom. You're learning to balance ambition with presence, achievement with relationships, doing with being. The life you're creating is one of purpose, meaning, and deep fulfillment.`,
        forties_plus: `My enlightened ${name}, at ${age}, you've achieved a level of life wisdom that radiates from everything you do. The peace you've found, the purpose you've discovered, the joy you cultivate - these are inspiring everyone around you. You're not just living well; you're showing others what's possible. The life you've built is beautiful not because it's perfect, but because it's authentic, meaningful, and filled with love and purpose.`
      },
      Other: {
        teens: `Dear ${name}, at ${age}, you're facing challenges that are uniquely yours, and you're meeting them with courage I deeply admire. Whatever you're going through, know that you have the strength, the resilience, and the wisdom to navigate it successfully. The person you're becoming through this experience is someone I'm incredibly proud of. You're learning lessons that will serve you your entire life, developing strengths that will help you handle whatever comes your way.`,
        twenties: `My resilient ${name}, at ${age}, you're navigating complex challenges with remarkable strength. Whatever you're facing, know that you have everything you need within you to handle it successfully. The skills you're developing, the character you're building, the wisdom you're gaining - these are preparing you for the amazing future that awaits you. You're becoming someone who can handle anything life throws at you with grace and confidence.`,
        thirties: `My capable ${name}, at ${age}, you have the experience and wisdom to handle whatever life brings. The challenges you're facing aren't obstacles; they're opportunities to demonstrate the remarkable strength and resilience you've developed. You're learning to trust your instincts, to lean on your support system, to use your past experiences as fuel for future success. Whatever you're going through, you're becoming stronger and wiser through it.`,
        forties_plus: `My wise ${name}, at ${age}, you have a depth of strength and wisdom that comes from navigating life's challenges successfully. Whatever you're facing now, you have the resources, the experience, and the perspective to handle it beautifully. You're not just surviving challenges; you're transforming them into growth opportunities. The grace and resilience you demonstrate are inspiring everyone around you.`
      }
    }

    return messages[problem]?.[ageGroup] || `Dear ${name}, I see you navigating this journey of life with courage and grace. The challenges you're facing are temporary, but the strength you're building is permanent. You're becoming someone remarkable, and I'm incredibly proud of the person you're becoming. Trust the process, believe in yourself, and know that everything is working out for your highest good.`
  }

  // Handle login
  const handleLogin = (e) => {
    e.preventDefault()
    
    // Admin bypass for testing
    if (loginData.email === 'khairanardurgesh@gmail.com' && loginData.password === 'dkk') {
      setCurrentUser({
        email: loginData.email,
        hasUsedFreeMessage: true
      })
      setHasUsedFreeMessage(true)
      setCurrentStep('form')
      return
    }

    const deviceFingerprint = generateDeviceFingerprint()
    const storedUser = localStorage.getItem(`user_${deviceFingerprint}`)
    
    if (storedUser) {
      const user = JSON.parse(storedUser)
      if (user.email === loginData.email) {
        setCurrentUser(user)
        setHasUsedFreeMessage(user.hasUsedFreeMessage || false)
        setCurrentStep('form')
      } else {
        alert('This device is already registered with a different email.')
      }
    } else {
      const newUser = {
        email: loginData.email,
        hasUsedFreeMessage: false,
        messageCount: 0
      }
      localStorage.setItem(`user_${deviceFingerprint}`, JSON.stringify(newUser))
      setCurrentUser(newUser)
      setHasUsedFreeMessage(false)
      setCurrentStep('form')
    }
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    
    setTimeout(() => {
      const generatedMessage = generateEmotionalMessage(formData.name, formData.age, formData.problem, formData.details)
      setMessage(generatedMessage)
      setLoading(false)
      setCurrentStep('message')
      
      if (!hasUsedFreeMessage) {
        updateUserData({ hasUsedFreeMessage: true, messageCount: (currentUser?.messageCount || 0) + 1 })
        setHasUsedFreeMessage(true)
      } else {
        updateUserData({ messageCount: (currentUser?.messageCount || 0) + 1 })
      }
    }, 2000)
  }

  // Handle payment
  const handlePayment = () => {
    if (!window.Razorpay) {
      alert('Payment system is loading. Please wait a moment and try again.')
      return
    }

    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID
    
    if (!razorpayKey || razorpayKey === 'your_razorpay_key_id_here') {
      alert('Please add your Razorpay key to the .env file. Contact support for assistance.')
      return
    }

    const options = {
      key: razorpayKey,
      amount: 900,
      currency: 'INR',
      name: 'Future Message AI',
      description: 'Unlock your future message',
      handler: function (response) {
        updateUserData({ messageCount: (currentUser?.messageCount || 0) + 1 })
        const generatedMessage = generateEmotionalMessage(formData.name, formData.age, formData.problem, formData.details)
        const premiumContent = `\n\n🌟 **Premium Wisdom from Your Future:**\n\nI want to share something extra special with you since you've invested in this connection: I can see exactly how this ${formData.problem} situation resolves. The outcome is more beautiful than you can imagine - it brings you to a place of deeper self-understanding and opens doors you didn't even know existed.\n\nThe specific wisdom you're gaining right now? It becomes your superpower. Five years from now, you'll be helping others navigate similar situations with the grace you're learning now. Your current struggle is actually becoming your greatest strength and your gift to the world.\n\nRemember this moment. This is when everything started shifting. This is when you chose to believe in yourself, to invest in your own wisdom, to trust that you were worthy of guidance. That choice? It changed everything.\n\nI'm so proud of you for choosing this path. For choosing to believe. For choosing to love yourself enough to seek this connection. You're creating something magical.`
        setMessage(generatedMessage + premiumContent)
        setIsUnlocked(true)
        setCurrentStep('message')
      },
      prefill: {
        name: formData.name,
        email: currentUser?.email || '',
        contact: ''
      },
      theme: {
        color: '#c084fc',
        backdrop_color: '#1a1a2e'
      }
    }

    try {
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      alert('Payment system error. Please refresh and try again.')
    }
  }

  // Handle unlock
  const handleUnlock = () => {
    if (!window.Razorpay) {
      alert('Payment system is loading. Please wait a moment and try again.')
      return
    }

    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID
    
    if (!razorpayKey || razorpayKey === 'your_razorpay_key_id_here') {
      alert('Please add your Razorpay key to the .env file. Contact support for assistance.')
      return
    }

    const options = {
      key: razorpayKey,
      amount: 900,
      currency: 'INR',
      name: 'Future Message AI',
      description: 'Unlock your full future message',
      handler: function (response) {
        setIsUnlocked(true)
        updateUserData({ messageCount: (currentUser?.messageCount || 0) + 1 })
      },
      prefill: {
        name: formData.name,
        email: currentUser?.email || '',
        contact: ''
      },
      theme: {
        color: '#c084fc',
        backdrop_color: '#1a1a2e'
      }
    }

    try {
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      alert('Payment system error. Please refresh and try again.')
    }
  }

  // Render login page
  if (currentStep === 'login') {
    return (
      <div className="container">
        <div className="glass-card">
          <h1 className="title">✨ Future Message 💕</h1>
          <p className="subtitle">A message from your future self awaits...</p>
          
          <form onSubmit={handleLogin} className="form">
            <div className="input-group">
              <input
                type="email"
                placeholder="Enter your email"
                value={loginData.email}
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                className="input-field"
                required
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Create a password"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                className="input-field"
                required
              />
            </div>
            <button type="submit" className="btn-primary">Unlock Your Future</button>
          </form>
          
          <p className="info-text">
            🔐 Your messages are private and secure
          </p>
        </div>
      </div>
    )
  }

  // Render form page
  if (currentStep === 'form') {
    return (
      <div className="container">
        <div className="glass-card">
          <h1 className="title">🌟 Your Future Awaits</h1>
          <p className="subtitle">Sometimes the voice you need to hear most isn't from an expert... it's from someone who's already walked your path.</p>
          
          {!hasUsedFreeMessage ? (
            <p className="info-text">💫 Your future self has more wisdom to share...</p>
          ) : (
            <p className="info-text">💰 Your next message requires payment (₹9)</p>
          )}
          
          <form onSubmit={handleSubmit} className="form">
            <div className="input-group">
              <input
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="input-field"
                required
              />
            </div>
            <div className="input-group">
              <select
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
                className="input-field"
                required
              >
                <option value="">Select your age group</option>
                <option value="teens">13-19 (Teens)</option>
                <option value="twenties">20-29 (Twenties)</option>
                <option value="thirties">30-39 (Thirties)</option>
                <option value="forties_plus">40+ (Forties and beyond)</option>
              </select>
            </div>
            <div className="input-group">
              <select
                value={formData.problem}
                onChange={(e) => setFormData({...formData, problem: e.target.value})}
                className="input-field"
                required
              >
                <option value="">What's on your mind?</option>
                <option value="Love">💕 Love & Relationships</option>
                <option value="Career">🚀 Career & Success</option>
                <option value="Money">💰 Money & Finance</option>
                <option value="Life">🌟 Life & Purpose</option>
                <option value="Other">🎯 Other Challenges</option>
              </select>
            </div>
            <div className="input-group">
              <textarea
                placeholder="Tell me more about your situation..."
                value={formData.details}
                onChange={(e) => setFormData({...formData, details: e.target.value})}
                className="input-field textarea"
                rows="4"
                required
              />
            </div>
            
            {hasUsedFreeMessage ? (
              <button type="button" onClick={handlePayment} className="btn-primary">
                Pay ₹9 - Get Message
              </button>
            ) : (
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Connecting to future...' : 'Get Your Free Message'}
              </button>
            )}
          </form>
        </div>
      </div>
    )
  }

  // Render message page
  if (currentStep === 'message') {
    const messageLines = message.split('\n')
    const previewLines = messageLines.slice(0, 3)
    const remainingLines = messageLines.slice(3)
    
    return (
      <div className="container">
        <div className="glass-card">
          <h1 className="title">💌 Your Message From The Future</h1>
          
          <div className="message-content">
            {previewLines.map((line, index) => (
              <p key={index} className="message-line">{line}</p>
            ))}
            
            {!isUnlocked && remainingLines.length > 0 && (
              <div className="blur-text">
                {remainingLines.map((line, index) => (
                  <p key={index} className="message-line">{line}</p>
                ))}
              </div>
            )}
            
            {isUnlocked && remainingLines.length > 0 && (
              <div className="full-text">
                {remainingLines.map((line, index) => (
                  <p key={index} className="message-line">{line}</p>
                ))}
              </div>
            )}
          </div>
          
          {!isUnlocked && (
            <button onClick={handleUnlock} className="btn-primary">
              🔓 Unlock Full Message (₹9)
            </button>
          )}
          
          <div className="action-buttons">
            <button onClick={() => setCurrentStep('form')} className="btn-secondary">
              Get Another Message
            </button>
          </div>
          
          <p className="info-text">
            💫 Your future self believes in you
          </p>
        </div>
      </div>
    )
  }

  return null
}

export default App
