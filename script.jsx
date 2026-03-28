import OpenAI from 'openai';

// Initialize OpenAI
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
console.log('API Key loaded:', apiKey ? 'Yes' : 'No');
console.log('Razorpay Key loaded:', razorpayKeyId ? 'Yes' : 'No');

const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
});

// DOM Elements
const inputSection = document.getElementById('inputSection');
const loadingSection = document.getElementById('loadingSection');
const messageSection = document.getElementById('messageSection');
const messageForm = document.getElementById('messageForm');
const submitBtn = document.getElementById('submitBtn');
const previewText = document.getElementById('previewText');
const lockedContent = document.getElementById('lockedContent');
const remainingText = document.getElementById('remainingText');
const fullText = document.getElementById('fullText');
const typingIndicator = document.getElementById('typingIndicator');
const actionButtons = document.getElementById('actionButtons');
const unlockBtn = document.getElementById('unlockBtn');
const tryAgainBtn = document.getElementById('tryAgainBtn');
const shareBtn = document.getElementById('shareBtn');

// State
let currentMessage = '';
let isUnlocked = false;
let hasUsedFreeMessage = false;

// Generate unique user ID if not exists
function generateUserId() {
    // Create a more robust ID using multiple factors
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('User fingerprint', 2, 2);
    
    const fingerprint = canvas.toDataURL();
    const userAgent = navigator.userAgent;
    const language = navigator.language;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const screenResolution = `${screen.width}x${screen.height}`;
    const colorDepth = screen.colorDepth;
    
    const combinedString = `${fingerprint}-${userAgent}-${language}-${timezone}-${screenResolution}-${colorDepth}`;
    
    // Create hash from combined string
    let hash = 0;
    for (let i = 0; i < combinedString.length; i++) {
        const char = combinedString.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    
    return `user_${Math.abs(hash)}_${Date.now()}`;
}

// Get or create user ID
function getUserId() {
    let userId = localStorage.getItem('userId');
    if (!userId) {
        userId = generateUserId();
        localStorage.setItem('userId', userId);
        localStorage.setItem('userIdCreated', Date.now().toString());
    }
    return userId;
}

// Enhanced user tracking with multiple methods
function trackUserUsage() {
    const userId = getUserId();
    const usageData = JSON.parse(localStorage.getItem('usageData') || '{}');
    
    // Check if user has used free message
    if (usageData[userId] && usageData[userId].hasUsedFreeMessage) {
        hasUsedFreeMessage = true;
        
        // Additional server-side verification would go here
        // For now, we'll add timestamp validation
        const lastUsed = usageData[userId].lastUsed;
        const now = Date.now();
        
        // If it's been more than 30 days, allow another free message (optional)
        if (now - lastUsed > 30 * 24 * 60 * 60 * 1000) {
            hasUsedFreeMessage = false;
        }
    }
    
    return userId;
}

// Mark free message as used with enhanced tracking
function markFreeMessageUsed(userId) {
    const usageData = JSON.parse(localStorage.getItem('usageData') || '{}');
    
    usageData[userId] = {
        hasUsedFreeMessage: true,
        lastUsed: Date.now(),
        ip: 'client_side_only', // Would be server IP in production
        deviceFingerprint: userId,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('usageData', JSON.stringify(usageData));
    localStorage.setItem('hasUsedFreeMessage', 'true');
    hasUsedFreeMessage = true;
    
    // Also set additional tracking cookies as backup
    document.cookie = `fm_used=true; max-age=${30 * 24 * 60 * 60}; path=/; samesite=strict`;
    document.cookie = `user_id=${userId}; max-age=${30 * 24 * 60 * 60}; path=/; samesite=strict`;
}

// Check and update free message usage on page load
function checkFreeMessageStatus() {
    const userId = trackUserUsage();
    
    if (hasUsedFreeMessage) {
        // User has already used free message, update button text
        submitBtn.textContent = 'Generate Message';
    }
    
    // Additional verification - check cookies as backup
    const cookies = document.cookie.split(';');
    const hasCookie = cookies.some(cookie => cookie.trim().startsWith('fm_used=true'));
    
    if (hasCookie && !hasUsedFreeMessage) {
        hasUsedFreeMessage = true;
        submitBtn.textContent = 'Generate Message';
    }
}

// Initialize free message status
checkFreeMessageStatus();

// Razorpay payment function
function initiateRazorpayPayment(onSuccess) {
    if (!razorpayKeyId || razorpayKeyId === 'rzp_test_1234567890abcdef') {
        // For demo/testing - simulate successful payment
        console.log('Using demo Razorpay payment');
        setTimeout(() => {
            onSuccess();
        }, 2000);
        return;
    }

    const options = {
        key: razorpayKeyId,
        amount: 90000, // ₹9 in paise
        currency: 'INR',
        name: 'Future Message AI',
        description: 'Unlock your future message',
        image: 'https://example.com/your-logo.png', // Add your logo URL
        handler: function(response) {
            console.log('Payment successful:', response);
            onSuccess();
        },
        prefill: {
            name: '',
            email: '',
            contact: ''
        },
        theme: {
            color: '#9333ea'
        }
    };

    const rzp = new Razorpay(options);
    rzp.open();
}

// Generate future message using OpenAI
async function generateFutureMessage(formData) {
    // Create rich personal context
    const personalContext = [];
    
    if (formData.lifeStage) {
        const stageDescriptions = {
            'student': 'still figuring things out in school/college',
            'earlyCareer': 'just starting your professional journey',
            'midCareer': 'established but seeking more meaning',
            'seniorCareer': 'experienced and contemplating legacy',
            'entrepreneur': 'building something from scratch',
            'freelancer': 'forging your own path',
            'homemaker': 'creating a beautiful home and life',
            'retired': 'enjoying the fruits of your labor',
            'gapYear': 'taking time to find yourself'
        };
        personalContext.push(`you're ${stageDescriptions[formData.lifeStage]}`);
    }
    
    if (formData.relationshipStatus) {
        const relationshipDescriptions = {
            'single': 'flying solo and learning to love yourself',
            'singleSearching': 'seeking that special connection',
            'newRelationship': 'navigating the excitement of new love',
            'establishedRelationship': 'building something lasting',
            'engaged': 'planning your forever',
            'married': 'committed and growing together',
            'divorced': 'rebuilding and rediscovering yourself',
            'complicated': 'navigating complex emotions'
        };
        personalContext.push(`when it comes to love, you're ${relationshipDescriptions[formData.relationshipStatus]}`);
    }
    
    if (formData.personality) {
        const personalityTraits = {
            'dreamer': 'someone who sees magic in possibilities',
            'planner': 'someone who finds comfort in structure',
            'adventurer': 'someone who craves new experiences',
            'nurturer': 'someone who naturally cares for others',
            'thinker': 'someone who analyzes everything deeply',
            'creator': 'someone who needs to express themselves',
            'leader': 'someone who naturally guides others',
            'freeSpirit': 'someone who dances to their own rhythm'
        };
        personalContext.push(`you're ${personalityTraits[formData.personality]}`);
    }
    
    if (formData.hobbies) {
        personalContext.push(`you find joy in ${formData.hobbies}`);
    }
    
    if (formData.dreams) {
        personalContext.push(`you dream of ${formData.dreams}`);
    }
    
    if (formData.fears) {
        personalContext.push(`you're afraid of ${formData.fears}`);
    }
    
    const challengeContext = formData.mainChallenge ? `you're struggling with ${formData.mainChallenge}` : 'you\'re facing some challenges';
    const personalDetails = personalContext.length > 0 ? personalContext.join(', ') + ', and' : '';
    
    const prompt = `Write as someone who actually lived through what they're describing. Be warm, personal, and surprisingly specific. Sound like a real person sharing wisdom with someone you love.

To ${formData.name}, who at age ${formData.age} is ${personalDetails} ${challengeContext}. Here's what's on their mind: "${formData.currentSituation}"

Write a message that feels like it's coming from someone who truly knows them. Include:
- One specific, surprising thing that happens related to their challenge
- One gentle warning about something they're overthinking
- One hopeful observation about their journey
- A warm, personal closing that makes them feel understood

Make it 180-220 words. Write conversationally, like you're talking to a close friend. If they mentioned hobbies, dreams, or personality, weave these in naturally.

Example: "Hey Sarah, remember how you used to stay up late painting? Five years from now, you've got your own studio downtown. That art show you did last month? People actually love your work..."

Make this feel intimate, wise, and deeply personal.`;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "Write as your future self. Be warm, personal, and specific. 150-180 words."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 280, // Reduced for faster response
            temperature: 0.9,
        });

        return completion.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error generating message:', error);
        throw new Error('Failed to generate your future message. Please try again.');
    }
}

// Typing animation
function typeMessage(message, element, callback) {
    const words = message.split(' ');
    let currentIndex = 0;
    
    const typingInterval = setInterval(() => {
        if (currentIndex < words.length) {
            element.textContent = words.slice(0, currentIndex + 1).join(' ');
            currentIndex++;
        } else {
            clearInterval(typingInterval);
            if (callback) callback();
        }
    }, 50);
}

// Show loading state
function showLoading() {
    inputSection.classList.add('hidden');
    loadingSection.classList.remove('hidden');
    messageSection.classList.add('hidden');
}

// Show message with typing animation
function showMessage(message) {
    currentMessage = message;
    isUnlocked = false;
    
    loadingSection.classList.add('hidden');
    messageSection.classList.remove('hidden');
    
    // Reset states
    lockedContent.classList.add('hidden');
    fullText.classList.add('hidden');
    typingIndicator.classList.remove('hidden');
    actionButtons.classList.add('hidden');
    
    // Start typing animation
    typeMessage(message, previewText, () => {
        typingIndicator.classList.add('hidden');
        
        // Split message for preview (first 3-4 lines)
        const lines = message.split('\n');
        const previewLines = lines.slice(0, 3).join('\n');
        const remainingLines = lines.slice(3).join('\n');
        
        if (hasUsedFreeMessage) {
            // Paid user - show locked content
            previewText.textContent = previewLines;
            remainingText.textContent = remainingLines;
            lockedContent.classList.remove('hidden');
            actionButtons.classList.remove('hidden');
        } else {
            // First free user - show full message
            previewText.textContent = previewLines;
            if (remainingLines.trim()) {
                fullText.textContent = remainingLines;
                fullText.classList.remove('hidden');
            }
            actionButtons.classList.remove('hidden');
            
            // Mark free message as used
            const userId = getUserId();
            markFreeMessageUsed(userId);
        }
    });
}

// Handle form submission
messageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        age: document.getElementById('age').value,
        lifeStage: document.getElementById('lifeStage').value,
        relationshipStatus: document.getElementById('relationshipStatus').value,
        mainChallenge: document.getElementById('mainChallenge').value,
        personality: document.getElementById('personality').value,
        hobbies: document.getElementById('hobbies').value,
        dreams: document.getElementById('dreams').value,
        fears: document.getElementById('fears').value,
        currentSituation: document.getElementById('currentSituation').value
    };
    
    // Update button text
    submitBtn.textContent = 'Revealing Your Future...';
    
    // Disable submit button
    submitBtn.disabled = true;
    
    try {
        showLoading();
        
        // Check if API key is available
        if (!apiKey || apiKey === 'your_openai_api_key_here') {
            console.log('Using demo message - no API key');
            // Create personalized demo message
            const personalDetails = [];
            if (formData.personality) personalDetails.push(formData.personality);
            if (formData.hobbies) personalDetails.push(formData.hobbies);
            if (formData.lifeStage) personalDetails.push(formData.lifeStage);
            if (formData.dreams) personalDetails.push(formData.dreams);
            
            const personalNote = personalDetails.length > 0 ? ` I know you're ${personalDetails.join(' and ')}.` : '';
            const challengeNote = formData.mainChallenge ? ` This whole ${formData.mainChallenge} situation you're worried about?` : ' This challenge you are facing?';
            
            const demoMessage = `Hey ${formData.name}, 

It's me - you, but 5 years wiser and with way better hair. Remember${challengeNote} Funny story about that...

I know you're lying awake at night wondering if you're making right choices.${personalNote} I'm not going to spoil everything, but I will tell you this: that thing you're overthinking right now? It's not going to matter nearly as much as you think it does.

Warning: Stop trying to have everything figured out. Some of the best things that happen to you come from moments you're completely lost.

You have no idea how capable you actually are. The version of me sitting here right now is living proof that you survive all the scary parts and end up somewhere surprisingly good.

Keep going. You're doing better than you think.

With love from your future self`;

            // Fast loading - no delay
            showMessage(demoMessage);
        } else {
            console.log('Using real OpenAI API');
            // Use real API
            generateFutureMessage(formData).then(message => {
                showMessage(message);
            }).catch(error => {
                console.error('API Error:', error);
                // Fallback to demo message
                showMessage(demoMessage);
            });
        }
    } catch (error) {
        console.error('Full error details:', error);
        console.error('Error message:', error.message);
        
        // Always show something to user
        const fallbackMessage = `Hey ${formData.name || 'Friend'},

Sometimes the universe takes time to connect. But I want you to know that everything you're going through right now will make sense one day.

You're stronger than you think, and the future you is already proud of the choices you're making.

Keep going. Your future self is waiting.

With love,
Your Future Self`;

        showMessage(fallbackMessage);
    } finally {
        // Reset submit button
        submitBtn.disabled = false;
        submitBtn.textContent = hasUsedFreeMessage ? 'Generate Message' : 'Reveal My Future Message';
    }
});

// Handle unlock button
unlockBtn.addEventListener('click', () => {
    unlockBtn.textContent = 'Opening payment...';
    unlockBtn.disabled = true;
    
    initiateRazorpayPayment(() => {
        // Payment successful callback
        isUnlocked = true;
        lockedContent.classList.add('hidden');
        fullText.textContent = currentMessage;
        fullText.classList.remove('hidden');
        fullText.classList.add('animate-fade-in');
        
        // Reset unlock button
        unlockBtn.textContent = 'Unlock Full Message – ₹9';
        unlockBtn.disabled = false;
    });
});

// Handle try again button
tryAgainBtn.addEventListener('click', () => {
    // Reset all states
    messageSection.classList.add('hidden');
    loadingSection.classList.add('hidden');
    inputSection.classList.remove('hidden');
    
    // Reset form
    messageForm.reset();
    
    // Reset message states
    currentMessage = '';
    isUnlocked = false;
    
    // Reset UI elements
    previewText.textContent = '';
    remainingText.textContent = '';
    fullText.textContent = '';
    lockedContent.classList.add('hidden');
    fullText.classList.add('hidden');
    typingIndicator.classList.add('hidden');
    actionButtons.classList.add('hidden');
    
    // Reset submit button based on free message status
    submitBtn.disabled = false;
    submitBtn.textContent = hasUsedFreeMessage ? 'Generate Message' : 'Reveal My Future Message';
});

// Handle share button
shareBtn.addEventListener('click', () => {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(currentMessage);
        alert('Message copied to clipboard!');
    } else {
        alert('Could not copy message to clipboard.');
    }
});

// Add fade-in animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    .animate-fade-in {
        animation: fadeIn 0.5s ease-in;
    }
`;
document.head.appendChild(style);
