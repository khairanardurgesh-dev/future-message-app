import { useState, useEffect } from 'react'
import './index.css'

function App() {
  const [currentStep, setCurrentStep] = useState('landing') // landing, login, form, loading, message
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isUnlocked, setIsUnlocked] = useState(false)
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
  const [currentUser, setCurrentUser] = useState(null)
  const [hasUsedFreeMessage, setHasUsedFreeMessage] = useState(false)

  // Generate device fingerprint
  const generateDeviceFingerprint = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    ctx.textBaseline = 'top'
    ctx.font = '14px Arial'
    ctx.fillText('Device fingerprint', 2, 2)
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL()
    ].join('|')
    
    return btoa(fingerprint).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16)
  }

  // Check for existing user on mount
  useEffect(() => {
    const deviceFingerprint = generateDeviceFingerprint()
    const storedUser = localStorage.getItem(`user_${deviceFingerprint}`)
    
    if (storedUser) {
      const user = JSON.parse(storedUser)
      setCurrentUser(user)
      setHasUsedFreeMessage(user.hasUsedFreeMessage || false)
    }
  }, [])

  // Save user data
  const saveUserData = (email, password) => {
    const deviceFingerprint = generateDeviceFingerprint()
    const userData = {
      email: email.toLowerCase(),
      password: btoa(password), // Basic encoding (not secure for production)
      deviceFingerprint,
      hasUsedFreeMessage: false,
      createdAt: new Date().toISOString(),
      messageCount: 0
    }
    
    localStorage.setItem(`user_${deviceFingerprint}`, JSON.stringify(userData))
    setCurrentUser(userData)
    return userData
  }

  // Update user data
  const updateUserData = (updates) => {
    if (!currentUser) return
    
    const updatedUser = { ...currentUser, ...updates }
    const deviceFingerprint = generateDeviceFingerprint()
    localStorage.setItem(`user_${deviceFingerprint}`, JSON.stringify(updatedUser))
    setCurrentUser(updatedUser)
  }

  const handleLogin = (e) => {
    e.preventDefault()
    
    // Admin bypass for testing
    if (loginData.email.toLowerCase() === 'khairanardurgesh@gmail.com' && loginData.password === 'dkk') {
      const adminUser = {
        email: 'khairanardurgesh@gmail.com',
        password: btoa('dkk'),
        deviceFingerprint: generateDeviceFingerprint(),
        hasUsedFreeMessage: true, // Admin bypass - mark free message as used
        createdAt: new Date().toISOString(),
        messageCount: 0,
        isAdmin: true
      }
      
      localStorage.setItem(`user_${generateDeviceFingerprint()}`, JSON.stringify(adminUser))
      setCurrentUser(adminUser)
      setHasUsedFreeMessage(true)
      setCurrentStep('form')
      return
    }
    
    const deviceFingerprint = generateDeviceFingerprint()
    const storedUser = localStorage.getItem(`user_${deviceFingerprint}`)
    
    if (storedUser) {
      const user = JSON.parse(storedUser)
      
      // Check if email matches (case insensitive)
      if (user.email === loginData.email.toLowerCase()) {
        // Check if password matches
        if (user.password === btoa(loginData.password)) {
          setCurrentUser(user)
          setHasUsedFreeMessage(user.hasUsedFreeMessage || false)
          setCurrentStep('form')
        } else {
          alert('Incorrect password for this email. Please use the correct password.')
          return
        }
      } else {
        alert('This device is already registered with a different email. Each device can only have one account.')
        return
      }
    } else {
      // New user - register
      const newUser = saveUserData(loginData.email, loginData.password)
      setCurrentStep('form')
    }
  }

  const generateEmotionalMessage = (name, age, problem, details) => {
    const ageMessages = {
      'teens': {
        Love: `My precious ${name}, I know at ${age} this ${problem} feels like your whole world is about to shatter. But I'm here to tell you something that will change everything: The person you're becoming through this heartache is someone I admire deeply. This pain is actually carving out space in your heart for a love so much deeper than you can imagine right now. The courage you're showing by facing this feeling? That's the exact quality that will lead you to true happiness. Five years from now, you'll look back and realize this moment was when you learned to love yourself first - and that changed everything.\n\nI remember exactly how this feels - the sleepless nights, the constant checking your phone, the way your stomach drops when you think about them. But my love, what if I told you that this experience is teaching you about boundaries, about self-worth, about what you truly deserve? The person who seems so important right now is actually a messenger showing you what you need in a partner.\n\nThe specific insight I want to share with you: That feeling of not being good enough? It's a lie. You're more than enough. You're learning to recognize your own value, and that's a skill that will serve you your entire life. This heartbreak is actually your heart becoming stronger, more resilient, more capable of giving and receiving real love.\n\nAbout "${details}" - my heart, I see how carefully you're considering this. The thoughtfulness you're bringing shows such beautiful self-awareness. You're not just reacting - you're responding with wisdom beyond your years. That's rare and precious.\n\nI'm wrapping my arms around you from the future. Can you feel it? That warmth, that certainty that you're going to be okay? More than okay - you're going to be radiant. The love you're seeking is already finding its way to you. Trust the process, my love. You're so loved, so supported, so exactly where you need to be.\n\nWith all the love in the universe,\nYour Future Self ✨`,
        
        Career: `My brilliant ${name}, at ${age} this ${problem} feels like you're standing on a stage with everyone watching, waiting for you to fail. But I need you to know something that will shift everything: That pressure you're feeling? It's actually forging you into someone extraordinary. The doubts you're battling right now are the same doubts I had, and overcoming them led me to the most meaningful work I've ever done.\n\nI know you're lying awake at night wondering if you're good enough, if you chose the right path, if you're falling behind everyone else. But my dear, what if I told you that this exact uncertainty is what makes you perfect for your calling? The way you question, the way you care, the way you want to make a difference - that's not weakness, that's leadership in the making.\n\nHere's something that will blow your mind: Five years from now, you're not just successful - you're fulfilled. The skills you're learning now, the connections you're making, the challenges you're facing - they're all weaving together into something beautiful. This ${problem} situation is actually your origin story.\n\nAbout "${details}" - I see how much thought you're putting into this. That careful consideration? That's the sign of someone who's going to create something meaningful. You're not just thinking about a job - you're thinking about impact.\n\nI'm holding your hand from the future, feeling so proud of the person you're becoming. This uncertainty you're feeling? It's the doorway to clarity. This struggle? It's the foundation of your strength. You're exactly where you need to be, learning exactly what you need to learn.\n\nWith infinite pride and belief in you,\nYour Future Self ✨`,
        
        Money: `My wise ${name}, at ${age} worrying about ${problem} feels like you're carrying a weight that's crushing your dreams. But I'm here to tell you something that will light you up: This relationship you're building with money right now is creating the financial freedom I'm enjoying today. Every worry, every doubt, every fear is actually teaching you about abundance in ways you can't see yet.\n\nI know you're comparing yourself to others, feeling like you're behind, wondering if you'll ever have enough. But my love, what if I told you that your current financial challenges are actually your greatest wealth-building education? The lessons you're learning now about budgeting, about value, about what truly matters - these are the secrets that wealthy people pay thousands to learn.\n\nHere's the truth that will change everything: Five years from now, you're not just financially stable - you're financially wise. The way you're learning to live within your means, the way you're questioning every purchase, the way you're planning for the future - that's not scarcity mindset, that's wealth consciousness being born.\n\nAbout "${details}" - I see how much care you're taking with your finances. That thoughtfulness? That's the foundation of true wealth. You're building habits that will serve you your entire life.\n\nI'm sending you so much abundance energy from the future. Can you feel it? That sense of ease, that flow, that knowing that everything is working out? Your relationship with money is transforming right now, and it's leading to the most beautiful financial reality.\n\nWith overflowing abundance,\nYour Future Self ✨`,
        
        Life: `My beautiful ${name}, at ${age} this ${problem} feels like you're standing at a crossroads with no map, no compass, no idea which way to turn. But I need you to know something profound: This confusion you're feeling is actually clarity in disguise. This uncertainty is possibility knocking at your door. This feeling of being lost is actually you finding your true north.\n\nI know you're looking at other people's lives and thinking they have it all figured out. But my dear, what if I told you that this questioning, this searching, this deep yearning for meaning - that's what makes you extraordinary? Most people just follow the path, but you're brave enough to question it. That's not weakness - that's wisdom.\n\nHere's what I want you to hold onto: Five years from now, you're living a life that feels so authentic, so aligned, so YOU that sometimes you have to pinch yourself. The challenges you're facing now are actually the very things that will lead you to that alignment. This ${problem} situation is your soul's way of calling you home to yourself.\n\nAbout "${details}" - I see how deeply you're thinking about this. That soul-searching you're doing? That's rare and precious. You're not just living life - you're crafting it with intention.\n\nI'm wrapping you in so much understanding from the future. This confusion you're feeling? It's the beginning of wisdom. This struggle? It's the birth of your strength. You're exactly where you need to be, becoming exactly who you're meant to be.\n\nWith infinite love for your journey,\nYour Future Self ✨`,
        
        Other: `My precious ${name}, at ${age} this ${problem} feels like it could define everything, like this one challenge could determine your entire future. But I'm here with a perspective that will shift everything: This exact challenge is becoming your greatest strength. The way you're handling this situation with such grace and courage - that's the quality that will define your success in every area of life.\n\nI know you're wondering if you're strong enough, if you're making the right choices, if you'll ever overcome this. But my love, what if I told you that the strength you're building right now is the foundation of everything beautiful that's coming? This challenge is actually your training ground for the life I'm living now.\n\nHere's something that will change how you see this: Five years from now, you'll look back at this exact moment and realize it was the turning point. The wisdom you're gaining, the resilience you're building, the character you're developing - that's the real treasure. This ${problem} is your soul's way of evolving you into someone magnificent.\n\nAbout "${details}" - I see how much heart you're putting into this. That care and consideration? That's the mark of someone who creates beautiful things in life. You're handling this with such depth.\n\nI'm sending you so much strength from the future. Can you feel it? That knowing that you're going to get through this, that you're going to thrive, that this challenge is actually your gift? You're so much stronger than you know.\n\nWith unwavering belief in you,\nYour Future Self ✨`
      },
      'twenties': {
        Love: `My love ${name}, at ${age} navigating this ${problem} feels like learning to dance in the rain while everyone else seems to have sunshine. But I'm here to tell you something that will change your perspective: This relationship journey you're on is teaching you the most important lesson of all - how to love yourself first. And that, my dear, is the key to everything.\n\nI see you trying so hard to get it right, wondering if you're too much or not enough, if you're choosing the right person or making the same mistakes. But what if I told you that every heartbreak, every confusion, every moment of doubt is actually shaping you into someone who loves with incredible depth and wisdom? Your heart is becoming more beautiful through these challenges.\n\nHere's the truth that will set you free: Five years from now, you're in a relationship that feels like coming home to yourself. The boundaries you're learning now, the self-worth you're discovering, the standards you're setting - that's not building walls, that's building the foundation for true intimacy.\n\nAbout "${details}" - I see how thoughtfully you're approaching this. That consideration? That's the sign of someone who will create a love that lasts. You're not just following your heart - you're leading it with wisdom.\n\nI'm holding your heart from the future, feeling so proud of how you're learning to love. This journey you're on? It's not just about finding the right person - it's about becoming the right person. And you're doing such beautiful work.\n\nWith all the love your heart can hold,\nYour Future Self ✨`,
        
        Career: `My brilliant ${name}, at ${age} this ${problem} feels like you're building your career on shifting ground, like the rules keep changing and you're never quite sure if you're on the right path. But I need you to know something that will shift everything: This uncertainty you're experiencing is actually the birthplace of your unique genius. The way you're adapting, learning, questioning - that's not confusion, that's innovation.\n\nI know you're comparing your progress to others, feeling like you should be further ahead, wondering if you chose the right field. But my dear, what if I told you that this exact struggle is what will make you invaluable? The problems you're solving now, the skills you're gaining, the perspective you're developing - that's the foundation of the meaningful work I'm doing.\n\nHere's what will blow your mind: Five years from now, you're not just successful - you're pioneering. The challenges you're facing now are giving you insights that others don't have. This ${problem} situation is actually your competitive advantage, your unique contribution to the world.\n\nAbout "${details}" - I see how much intention you're bringing to your career. That thoughtfulness? That's rare and valuable. You're not just building a career - you're crafting a calling.\n\nI'm cheering you on from the future, knowing exactly where this path leads. This uncertainty you're feeling? It's the doorway to innovation. This struggle? It's the foundation of your expertise. You're becoming someone who changes things.\n\nWith infinite belief in your potential,\nYour Future Self ✨`,
        
        Money: `My wise ${name}, at ${age} dealing with this ${problem} feels like trying to solve a puzzle where the pieces keep changing shape. But I'm here to tell you something that will transform your relationship with money: This financial journey you're on is actually creating the abundance mindset that will serve you your entire life. Every challenge is teaching you something valuable about true wealth.\n\nI know you're feeling pressure to have it all figured out, to be saving more, earning more, investing better. But what if I told you that the lessons you're learning now about value, about work, about what truly matters - these are the secrets that create sustainable wealth? The way you're questioning consumerism, seeking meaning, balancing present needs with future security - that's not indecision, that's wisdom.\n\nHere's the abundance truth: Five years from now, you're not just financially stable - you're financially free in ways that matter most. The relationship you're building with money now - understanding flow, value, purpose - that's creating a foundation of wealth that goes beyond numbers.\n\nAbout "${details}" - I see how consciously you're approaching your finances. That awareness? That's the foundation of true prosperity. You're building a relationship with money that will serve you beautifully.\n\nI'm sending you so much abundance energy from the future. This financial uncertainty you're feeling? It's the birthplace of your financial wisdom. You're learning lessons that will create freedom and flow.\n\nWith overflowing abundance,\nYour Future Self ✨`,
        
        Life: `My beautiful ${name}, at ${age} this ${problem} feels like you're standing at a crossroads with a thousand paths stretching before you, each one promising something different. But I need you to share something profound: This feeling of being at a crossroads is actually you standing in your power. This abundance of choice is actually the sign that you're ready for profound transformation.\n\nI know you're afraid of making the wrong choice, of missing opportunities, of not living up to your potential. But my dear, what if I told you that this very questioning, this deep seeking, this desire for meaning - that's what makes your life extraordinary? Most people just follow the path, but you're brave enough to forge your own.\n\nHere's what will change everything: Five years from now, you're living a life that feels so authentically yours that sometimes it takes your breath away. The challenges you're facing now are actually clarifying what truly matters to you. This ${problem} situation is your soul's way of aligning you with your deepest truth.\n\nAbout "${details}" - I see how deeply you're contemplating this. That soul-searching? That's the mark of someone who lives intentionally. You're not just experiencing life - you're crafting it with purpose.\n\nI'm wrapping you in so much clarity from the future. This confusion you're feeling? It's the beginning of alignment. This uncertainty? It's the doorway to your truth. You're exactly where you need to be.\n\nWith infinite love for your journey,\nYour Future Self ✨`,
        
        Other: `My precious ${name}, at ${age} this ${problem} feels like it could be the defining moment of your twenties, like this one challenge could set the trajectory for everything that follows. But I'm here with a perspective that will empower you: This exact challenge is becoming your defining strength. The way you're showing up for yourself, the resilience you're building, the wisdom you're gaining - that's what will shape your beautiful future.\n\nI know you're wondering if you're strong enough, if you're making the right choices, if you'll ever feel like you have it figured out. But my love, what if I told you that this uncertainty you're feeling is actually the sign that you're growing? The fact that you care so much, that you're trying so hard - that's the quality that creates extraordinary lives.\n\nHere's the truth that will sustain you: Five years from now, you'll look back at this moment and realize it was when you discovered your own strength. The lessons you're learning now, the character you're building, the perspective you're gaining - that's the real treasure. This ${problem} is your soul's way of evolving you.\n\nAbout "${details}" - I see how much heart you're putting into this. That care and consideration? That's rare and beautiful. You're handling this with such depth and grace.\n\nI'm sending you so much strength from the future. This challenge you're facing? It's your training ground for the amazing life I'm living. You're becoming someone I'm so proud to be.\n\nWith unwavering belief in you,\nYour Future Self ✨`
      },
      'thirties': {
        Love: `My love ${name}, at ${age} navigating this ${problem} with the wisdom and experience you've gained is truly beautiful to witness. I see you bringing your whole self to this relationship - your past lessons, your present awareness, your future hopes. And let me tell you something that will shift everything: This love you're creating now is the most authentic you've ever experienced.\n\nI know you're more conscious now about patterns, about compatibility, about what truly matters in partnership. You're not just falling in love - you're choosing love with intention. And my dear, that intentionality is creating something deeply meaningful. Whether this relationship lasts or transforms, you're learning to love with more authenticity than ever before.\n\nHere's what I want you to hold in your heart: Five years from now, you're in a partnership that feels like coming home to yourself. The boundaries you've learned, the self-worth you've cultivated, the communication skills you've developed - that's not just relationship advice, that's the foundation of true intimacy.\n\nAbout "${details}" - I see how much depth you're bringing to this situation. That thoughtfulness? That's the sign of someone who creates lasting love. You're not just loving - you're loving with wisdom.\n\nI'm holding your heart from the future, feeling so proud of the love you're creating. This relationship journey you're on? It's not just about finding a partner - it's about becoming the partner you've always wanted to be.\n\nWith all the love your wise heart holds,\nYour Future Self ✨`,
        
        Career: `My brilliant ${name}, at ${age} this ${problem} feels different now, doesn't it? It's not just about building anymore - it's about refining, about meaning, about impact. And I need you to know something profound: The experience and wisdom you're gaining now is creating the foundation for the most meaningful work of your life. You're not just having a career - you're crafting a calling.\n\nI know you're feeling the pressure of time, wondering if you're on the right path, if you're making the impact you're meant to make. But my dear, what if I told you that this very questioning is the sign of deep purpose? The fact that you care about meaning, about contribution, about leaving something valuable - that's what makes your work extraordinary.\n\nHere's what will inspire you: Five years from now, you're doing work that feels so aligned with your values that work doesn't feel like work anymore. The challenges you're facing now are actually clarifying your unique contribution. This ${problem} situation is your career's way of deepening into its true purpose.\n\nAbout "${details}" - I see how much intention you're bringing to your professional life. That thoughtfulness? That's the mark of someone who creates meaningful impact. You're not just working - you're contributing.\n\nI'm cheering you on from the future, knowing exactly where this professional journey leads. This uncertainty you're feeling? It's the doorway to deeper purpose. This challenge? It's the refinement of your genius.\n\nWith infinite pride in your work,\nYour Future Self ✨`,
        
        Money: `My wise ${name}, at ${age} facing this ${problem} comes with such a different perspective now, doesn't it? You're not just surviving anymore - you're building, you're strategizing, you're thinking about legacy. And I want you to know something that will empower you: This financial wisdom you're developing now is creating the freedom and security I'm enjoying in ways you can't yet imagine.\n\nI know you're thinking about the future in a more concrete way now - retirement, investments, family security, legacy building. But my dear, what if I told you that this deeper relationship with money is actually creating true abundance? The way you're balancing present enjoyment with future security, the way you're thinking about generational impact - that's not just financial planning, that's wealth consciousness.\n\nHere's the abundance truth: Five years from now, you're not just financially comfortable - you're financially free in ways that matter most. The wisdom you're building now about value, about investment, about flow - that's creating a foundation that goes beyond numbers to true security and freedom.\n\nAbout "${details}" - I see how consciously you're approaching your finances. That awareness? That's the foundation of true prosperity. You're building a relationship with money that will serve you beautifully.\n\nI'm sending you so much abundance energy from the future. This financial planning you're doing? It's creating freedom and possibility. You're building wealth that will serve not just you, but generations.\n\nWith overflowing abundance,\nYour Future Self ✨`,
        
        Life: `My beautiful ${name}, at ${age} this ${problem} carries more weight, but you carry it with more grace than ever before. I see you weaving all your experiences into something truly wise, something integrated and whole. And I need to tell you something that will shift your perspective: This integration you're doing now is creating the most beautiful chapter of your life.\n\nI know you're feeling the pull of different directions - career demands, family responsibilities, personal growth, community contribution. But my dear, what if I told you that this very complexity is the sign of a life lived fully? The fact that you're showing up for all of it with such grace - that's not overwhelm, that's abundance.\n\nHere's what will inspire you: Five years from now, you're living a life that feels so integrated and meaningful that it brings tears to my eyes. The challenges you're facing now are actually teaching you the art of living whole. This ${problem} situation is your life's way of deepening into its most beautiful expression.\n\nAbout "${details}" - I see how much depth you're bringing to this. That thoughtfulness? That's the mark of someone who lives with intention. You're not just experiencing life - you're crafting it with wisdom.\n\nI'm wrapping you in so much understanding from the future. This complexity you're feeling? It's the sign of a rich life. This challenge? It's the refinement of your wisdom. You're becoming someone I deeply admire.\n\nWith infinite love for your journey,\nYour Future Self ✨`,
        
        Other: `My precious ${name}, at ${age} this ${problem} feels significant, and it is. But I'm here to tell you that you're handling it with such depth and wisdom that takes my breath away. The person you've become through all your experiences - the resilience, the self-awareness, the compassion - that's what makes you extraordinary.\n\nI know you're approaching this challenge with all the wisdom you've gained, all the lessons you've learned, all the strength you've built. And my dear, what if I told you that this very wisdom is your superpower? The fact that you can handle difficulty with such grace - that's not just experience, that's mastery.\n\nHere's the truth that will sustain you: Five years from now, you'll look back at this moment and realize it was when you fully stepped into your power. The person you're becoming through this challenge is someone I'm so proud to be. This ${problem} is your soul's way of claiming your wisdom.\n\nAbout "${details}" - I see how much heart you're bringing to this. That care and consideration? That's rare and beautiful. You're handling this with such depth and grace.\n\nI'm sending you so much strength from the future. This challenge you're facing? It's your opportunity to shine. You're becoming someone who inspires others through your wisdom.\n\nWith unwavering belief in you,\nYour Future Self ✨`
      },
      'forties_plus': {
        Love: `My love ${name}, at ${age} bringing your whole life experience to this ${problem} is truly beautiful to witness. You love with such depth, such wisdom, such self-awareness now. And let me tell you something that will warm your heart: This love you're creating now is the most authentic, the most meaningful, the most transformative love of your life.\n\nI know you're not just bringing your present self to this relationship - you're bringing all your past lessons, all your future hopes, all the wisdom you've gained through decades of living. And my dear, that richness creates something extraordinary. Whether this relationship deepens or transforms, you're showing up with a heart that knows itself deeply.\n\nHere's what I want you to hold in your heart: Five years from now, you're in a partnership that feels like the culmination of everything you've learned about love. The self-awareness you've cultivated, the boundaries you've mastered, the compassion you've developed - that's not just relationship skills, that's the art of loving.\n\nAbout "${details}" - I see how much depth you're bringing to this. That thoughtfulness? That's the sign of someone who creates transcendent love. You're not just loving - you're loving with the wisdom of a lifetime.\n\nI'm holding your heart from the future, feeling so proud of the love you're creating. This relationship journey you're on? It's not just about partnership - it's about the full expression of your capacity to love.\n\nWith all the love your wise heart holds,\nYour Future Self ✨`,
        
        Career: `My brilliant ${name}, at ${age} this ${problem} feels like it's about legacy now, doesn't it? It's not just about success anymore - it's about meaning, about impact, about what you're leaving behind. And I need you to know something profound: The work you're doing now is creating ripples that extend far beyond what you can see. You're not just having a career - you're making a difference.\n\nI know you're thinking about your impact in a deeper way now - mentoring others, creating systems that will outlast you, contributing to something larger than yourself. But my dear, what if I told you that this very focus on legacy is what makes your work extraordinary? The fact that you're thinking about how your work serves others - that's not just career planning, that's purpose in action.\n\nHere's what will inspire you: Five years from now, you're seeing the tangible impact of your work in ways that bring tears to my eyes. The wisdom you're sharing, the systems you've created, the people you've influenced - that's not just a career, that's a contribution to the world.\n\nAbout "${details}" - I see how much intention you're bringing to your work. That thoughtfulness? That's the mark of someone who creates lasting impact. You're not just working - you're leaving a legacy.\n\nI'm cheering you on from the future, knowing the full scope of your impact. This work you're doing? It's changing lives in ways you can't even imagine. You're creating something that will outlast you.\n\nWith infinite pride in your contribution,\nYour Future Self ✨`,
        
        Money: `My wise ${name}, at ${age} dealing with this ${problem} comes with such beautiful perspective now. You understand that true wealth isn't just numbers - it's the life you've built, the love you've shared, the difference you've made, the freedom you've created. And I want you to know something that will empower you: This financial wisdom you embody now is creating abundance that goes far beyond material wealth.\n\nI know you're thinking about money in terms of legacy now - what you're leaving for the next generation, how you're using your resources to make a difference, what financial freedom truly means at this stage of life. But my dear, what if I told you that this expanded view of wealth is actually creating true richness? The way you're balancing personal security with generous contribution - that's not just financial planning, that's wealth consciousness at its highest expression.\n\nHere's the abundance truth: Five years from now, you're experiencing a level of financial freedom that includes not just security, but the joy of generous giving, the satisfaction of meaningful impact, the peace of knowing you've built something lasting. The wisdom you've developed about value, about flow, about purpose - that's creating abundance in every area of life.\n\nAbout "${details}" - I see how consciously you're approaching your finances. That awareness? That's the foundation of true prosperity. You're managing wealth in a way that serves not just you, but the world.\n\nI'm sending you so much abundance energy from the future. This financial wisdom you've developed? It's creating freedom and flow that extends far beyond your own life. You're building true legacy.\n\nWith overflowing abundance,\nYour Future Self ✨`,
        
        Life: `My beautiful ${name}, at ${age} this ${problem} feels like it's about integration now, doesn't it? It's about weaving all your experiences into something magnificent, something whole, something deeply meaningful. And I need to tell you something that will shift your perspective: This integration you're doing now is creating the most beautiful chapter of your life.\n\nI know you're feeling the full richness of life now - the joy of watching your loved ones grow, the satisfaction of your accomplishments, the wisdom of your experiences, the awareness of time's preciousness. And my dear, what if I told you that this very richness is what makes your life extraordinary? The fact that you can hold all of this with such grace - that's not complexity, that's abundance.\n\nHere's what will inspire you: Five years from now, you're living a life that feels so integrated and meaningful that it takes my breath away. The wisdom you embody, the love you share, the impact you make - that's not just a life well-lived, that's a life that inspires others.\n\nAbout "${details}" - I see how much depth you're bringing to this. That thoughtfulness? That's the mark of someone who lives with profound intention. You're not just experiencing life - you're mastering the art of living.\n\nI'm wrapping you in so much understanding from the future. This richness you're experiencing? It's the sign of a life lived fully. This challenge? It's the refinement of your wisdom. You're becoming someone who embodies the best of humanity.\n\nWith infinite love for your journey,\nYour Future Self ✨`,
        
        Other: `My precious ${name}, at ${age} this ${problem} comes with the full weight and beauty of your life experience. You approach it with a depth of wisdom, a grace of spirit, a resilience of character that only comes from decades of living. And I'm here to tell you something that will empower you: The person you've become is someone I deeply admire.\n\nI know you're bringing all your life lessons to this challenge - the heartbreaks and triumphs, the mistakes and growth, the losses and gains. And my dear, what if I told you that this very richness of experience is your greatest gift? The fact that you can handle difficulty with such perspective and grace - that's not just experience, that's mastery.\n\nHere's the truth that will sustain you: Five years from now, you'll look back at this moment and realize it was when you fully stepped into your wisdom. The person you're becoming through this challenge is someone who inspires others through your very being. This ${problem} is your soul's way of expressing its fullness.\n\nAbout "${details}" - I see how much heart and wisdom you're bringing to this. That care and consideration? That's rare and beautiful. You're handling this with such depth and grace.\n\nI'm sending you so much strength from the future. This challenge you're facing? It's your opportunity to shine with the full radiance of who you've become. You're becoming someone who embodies wisdom.\n\nWith unwavering belief in you,\nYour Future Self ✨`
      }
    }

    // Determine age group
    let ageGroup = 'twenties'
    const ageNum = parseInt(age)
    if (ageNum < 20) ageGroup = 'teens'
    else if (ageNum >= 20 && ageNum < 30) ageGroup = 'twenties'
    else if (ageNum >= 30 && ageNum < 40) ageGroup = 'thirties'
    else ageGroup = 'forties_plus'

    // Get base message
    let baseMessage = ageMessages[ageGroup][problem] || ageMessages[ageGroup]['Other']
    
    // Personalize with name and age
    let message = baseMessage.replace(/\${name}/g, name).replace(/\${age}/g, age).replace(/\${problem}/g, problem.toLowerCase())

    // Add details if provided
    if (details && details.trim()) {
      message += `\n\nAbout "${details}" - my heart, I want you to know that I see how carefully you're considering this. The thoughtfulness you're bringing to this situation shows such beautiful self-awareness. You're not just reacting - you're responding with wisdom.`
    }

    // Add warm closing
    message += `\n\nI'm wrapping my arms around you from the future. Can you feel it? That warmth, that certainty that everything is working out beautifully? You're so loved, so supported, so exactly where you need to be.\n\nWith all the love in the universe,\nYour Future Self ✨`

    return message
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCurrentStep('loading')
    setLoading(true)
    
    // Check if user has used free message
    if (hasUsedFreeMessage) {
      // User needs to pay
      setTimeout(() => {
        setCurrentStep('payment')
        setLoading(false)
      }, 1000)
      return
    }
    
    // Generate free message with emotional intelligence
    setTimeout(() => {
      const generatedMessage = generateEmotionalMessage(formData.name, formData.age, formData.problem, formData.details)
      setMessage(generatedMessage)
      setLoading(false)
      setCurrentStep('message')
      
      // Mark free message as used
      updateUserData({ hasUsedFreeMessage: true, messageCount: (currentUser?.messageCount || 0) + 1 })
      setHasUsedFreeMessage(true)
    }, 2000)
  }

  const handlePayment = () => {
    // Check if Razorpay is loaded
    if (!window.Razorpay) {
      alert('Payment system is loading. Please wait a moment and try again.');
      return;
    }

    // Get Razorpay key from environment
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    
    if (!razorpayKey || razorpayKey === 'your_razorpay_key_id_here') {
      alert('Please add your Razorpay key to the .env file. Contact support for assistance.');
      return;
    }

    // Load Razorpay
    const options = {
      key: razorpayKey,
      amount: 900, // ₹9 in paise (900 paise)
      currency: 'INR',
      name: 'Future Message AI',
      description: 'Unlock your future message',
      image: 'https://example.com/your-logo.png', // Add your logo URL
      handler: function (response) {
        // Payment successful
        console.log('Payment successful:', response);
        
        // Update user data
        updateUserData({ messageCount: (currentUser?.messageCount || 0) + 1 })
        
        // Generate premium message with emotional intelligence
        const generatedMessage = generateEmotionalMessage(formData.name, formData.age, formData.problem, formData.details)
        
        // Add premium content
        const premiumContent = `\n\n🌟 **Premium Wisdom from Your Future:**\n\nI want to share something extra special with you since you've invested in this connection: I can see exactly how this ${formData.problem} situation resolves. The outcome is more beautiful than you can imagine - it brings you to a place of deeper self-understanding and opens doors you didn't even know existed.\n\nThe specific wisdom you're gaining right now? It becomes your superpower. Five years from now, you'll be helping others navigate similar situations with the grace you're learning now. Your current struggle is actually becoming your greatest strength and your gift to the world.\n\nRemember this moment. This is when everything started shifting. This is when you chose to believe in yourself, to invest in your own wisdom, to trust that you were worthy of guidance. That choice? It changed everything.\n\nI'm so proud of you for choosing this path. For choosing to believe. For choosing to love yourself enough to seek this connection. You're creating something magical.`

        setMessage(generatedMessage + premiumContent)
        setIsUnlocked(true)
        setCurrentStep('message')
      },
      prefill: {
        name: formData.name,
        email: currentUser?.email || '',
        contact: '' // Optional phone number
      },
      notes: {
        address: 'Future Message AI Premium Service',
        user_id: currentUser?.email || 'anonymous'
      },
      theme: {
        color: '#c084fc', // Purple to match your theme
        backdrop_color: '#1a1a2e'
      },
      modal: {
        backdropclose: false,
        escape: false,
        handleback: false,
        confirm: true,
        persistent: true
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      
      // Handle payment failure
      rzp.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        alert(`Payment failed: ${response.error.description}. Please try again.`);
      });

      // Open payment modal
      rzp.open();
    } catch (error) {
      console.error('Razorpay initialization error:', error);
      alert('Payment system error. Please refresh and try again.');
    }
  }

  const handleUnlock = () => {
    // Check if Razorpay is loaded
    if (!window.Razorpay) {
      alert('Payment system is loading. Please wait a moment and try again.');
      return;
    }

    // Get Razorpay key from environment
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    
    if (!razorpayKey || razorpayKey === 'your_razorpay_key_id_here') {
      alert('Please add your Razorpay key to the .env file. Contact support for assistance.');
      return;
    }

    // Use Razorpay for payment
    const options = {
      key: razorpayKey,
      amount: 900, // ₹9 in paise (900 paise)
      currency: 'INR',
      name: 'Future Message AI',
      description: 'Unlock your full future message',
      image: 'https://example.com/your-logo.png', // Add your logo URL
      handler: function (response) {
        // Payment successful
        console.log('Payment successful:', response);
        
        // Update user data and unlock message
        setIsUnlocked(true)
        updateUserData({ messageCount: (currentUser?.messageCount || 0) + 1 })
      },
      prefill: {
        name: formData.name,
        email: currentUser?.email || '',
        contact: '' // Optional phone number
      },
      notes: {
        address: 'Future Message AI Premium Service',
        user_id: currentUser?.email || 'anonymous'
      },
      theme: {
        color: '#c084fc', // Purple to match your theme
        backdrop_color: '#1a1a2e'
      },
      modal: {
        backdropclose: false,
        escape: false,
        handleback: false,
        confirm: true,
        persistent: true
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      
      // Handle payment failure
      rzp.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        alert(`Payment failed: ${response.error.description}. Please try again.`);
      });

      // Open payment modal
      rzp.open();
    } catch (error) {
      console.error('Razorpay initialization error:', error);
      alert('Payment system error. Please refresh and try again.');
    }
  }

  const handleTryAgain = () => {
    setCurrentStep('form')
    setMessage('')
    setIsUnlocked(false)
    setFormData({ name: '', age: '', problem: '', details: '' })
  }

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(message)
      alert('Message copied to clipboard!')
    }
  }

  const handleLogout = () => {
    const deviceFingerprint = generateDeviceFingerprint()
    localStorage.removeItem(`user_${deviceFingerprint}`)
    setCurrentUser(null)
    setHasUsedFreeMessage(false)
    setCurrentStep('landing')
    setLoginData({ email: '', password: '' })
  }

  // Landing Page
  if (currentStep === 'landing') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-white mb-2">
              ✨ Future Message 💕
            </h1>
            <p className="text-lg text-purple-200">
              A message from your future self awaits...
            </p>
            <p className="text-purple-300 text-sm leading-relaxed px-4">
              Sometimes the voice you need to hear most isn't from an expert... 
              it's from someone who's already walked your path and found the light on the other side.
            </p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => setCurrentStep('login')}
              className="btn-primary"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Login Page
  if (currentStep === 'login') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card max-w-md w-full">
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            Welcome Back ✨
          </h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={loginData.email}
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                className="input-field"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                className="input-field"
                required
              />
            </div>
            <button type="submit" className="btn-primary">
              Sign In
            </button>
          </form>
          <button
            onClick={() => setCurrentStep('landing')}
            className="w-full mt-4 text-purple-200 hover:text-white transition-colors"
          >
            <span style={{ color: '#c084fc' }}>Back</span>
          </button>
          {currentUser && (
            <div className="mt-4 text-center">
              <p className="text-purple-300 text-xs">
                Messages used: {currentUser.messageCount || 0}
              </p>
              <button
                onClick={handleLogout}
                className="text-purple-400 text-xs hover:text-purple-300 mt-2"
              >
                Not you? Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Payment Page
  if (currentStep === 'payment') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            💰 Unlock Your Message
          </h2>
          <p className="text-purple-200 mb-6">
            You've already used your free message. Get your next future message for just ₹9!
          </p>
          <div className="space-y-4">
            <button
              onClick={handlePayment}
              className="btn-primary"
            >
              Pay ₹9 - Get Message
            </button>
            <button
              onClick={() => setCurrentStep('landing')}
              className="w-full text-purple-200 hover:text-white transition-colors"
            >
              <span style={{ color: '#c084fc' }}>Back</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Form Page
  if (currentStep === 'form') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card max-w-md w-full">
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            🌟 Your Future Awaits
          </h2>
          <p className="text-purple-200 text-center mb-6 text-sm leading-relaxed">
            Sometimes the voice you need to hear most isn't from an expert... 
            it's from someone who's already walked your path.
          </p>
          {hasUsedFreeMessage && (
            <div className="bg-purple-800/30 border border-purple-400/30 rounded-lg p-3 mb-4">
              <p className="text-purple-200 text-sm">
                � Your future self has more wisdom to share...
              </p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="input-field"
                required
              />
            </div>
            
            <div>
              <input
                type="number"
                placeholder="Your Age"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
                className="input-field"
                min="1"
                max="120"
                required
              />
            </div>
            
            <div>
              <select
                value={formData.problem}
                onChange={(e) => setFormData({...formData, problem: e.target.value})}
                className="input-field"
                required
              >
                <option value="">What's your main challenge?</option>
                <option value="Love">Love</option>
                <option value="Career">Career</option>
                <option value="Money">Money</option>
                <option value="Life">Life</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <textarea
                placeholder="What's bothering you? (optional)"
                value={formData.details}
                onChange={(e) => setFormData({...formData, details: e.target.value})}
                className="input-field resize-none"
                rows="4"
              />
            </div>
            
            <button type="submit" className="btn-primary">
              Reveal My Future Message
            </button>
          </form>
          
          <button
            onClick={handleLogout}
            className="w-full mt-4 text-purple-400 text-xs hover:text-purple-300 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    )
  }

  // Loading State
  if (currentStep === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card max-w-md w-full text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-white text-lg">🔮 Connecting through time...</p>
          <p className="text-purple-200 text-sm mt-2">
            Your future self is writing to you
          </p>
        </div>
      </div>
    )
  }

  // Message Display
  if (currentStep === 'message') {
    const messageLines = message.split('\n')
    const previewLines = messageLines.slice(0, 3) // Show only 3 lines instead of 4
    const remainingLines = messageLines.slice(3)

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card max-w-md w-full">
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            💌 A Message From Your Future Self
          </h2>
          
          <div className="space-y-4">
            <div className="text-white leading-relaxed whitespace-pre-wrap">
              {previewLines.join('\n')}
              
              {!isUnlocked && remainingLines.length > 0 && (
                <div className="mt-4">
                  <div className="blur-text text-white/80">
                    {remainingLines.join('\n')}
                  </div>
                  <div className="text-center mt-6">
                    <p className="text-purple-200 mb-4 text-sm">
                      This is just a preview. Unlock your full message for ₹9
                    </p>
                    <button
                      onClick={handleUnlock}
                      className="btn-primary"
                    >
                      Unlock Full Message – ₹9
                    </button>
                  </div>
                </div>
              )}
              
              {isUnlocked && remainingLines.length > 0 && (
                <div className="mt-4 animate-fade-in">
                  {remainingLines.join('\n')}
                </div>
              )}
            </div>
            
            <div className="flex gap-3 justify-center pt-6">
              <button onClick={handleTryAgain} className="btn-secondary">
                Try Again
              </button>
              <button onClick={handleShare} className="btn-secondary">
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Fallback
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card max-w-md w-full text-center">
        <p className="text-white">Something went wrong. Please refresh.</p>
      </div>
    </div>
  )
}

export default App
