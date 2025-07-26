import React, { useState, useRef } from 'react';
import { Copy, Heart, Star, Zap, Users, Briefcase, Laugh, ArrowRight, Sparkles, Upload, X, Image as ImageIcon, Wand2, Download, Share2 } from 'lucide-react';

interface CaptionData {
  id: string;
  text: string;
  rating: number;
  saved: boolean;
}

const platforms = [
  { value: 'instagram', label: 'Instagram', color: 'from-purple-500 to-pink-500', icon: '📸', maxLength: 2200 },
  { value: 'twitter', label: 'Twitter', color: 'from-blue-400 to-blue-600', icon: '🐦', maxLength: 280 },
  { value: 'linkedin', label: 'LinkedIn', color: 'from-blue-600 to-blue-800', icon: '💼', maxLength: 3000 },
  { value: 'facebook', label: 'Facebook', color: 'from-blue-500 to-blue-700', icon: '👥', maxLength: 63206 },
  { value: 'tiktok', label: 'TikTok', color: 'from-black to-gray-800', icon: '🎵', maxLength: 300 }
];

const tones = [
  { value: 'professional', label: 'Professional', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
  { value: 'funny', label: 'Funny', icon: Laugh, color: 'text-yellow-500', bg: 'bg-yellow-50' },
  { value: 'motivational', label: 'Motivational', icon: Zap, color: 'text-orange-500', bg: 'bg-orange-50' },
  { value: 'romantic', label: 'Romantic', icon: Heart, color: 'text-red-500', bg: 'bg-red-50' },
  { value: 'casual', label: 'Casual', icon: Users, color: 'text-green-500', bg: 'bg-green-50' }
];

const moods = [
  { value: 'excited', label: 'Excited', emoji: '🎉' },
  { value: 'grateful', label: 'Grateful', emoji: '🙏' },
  { value: 'adventurous', label: 'Adventurous', emoji: '🌟' },
  { value: 'peaceful', label: 'Peaceful', emoji: '🧘' },
  { value: 'confident', label: 'Confident', emoji: '💪' },
  { value: 'nostalgic', label: 'Nostalgic', emoji: '💭' }
];

function App() {
  const [description, setDescription] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [tone, setTone] = useState('casual');
  const [mood, setMood] = useState('excited');
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [includeCTA, setIncludeCTA] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCaptions, setGeneratedCaptions] = useState<CaptionData[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
  };

  const generateCaptions = async () => {
    if (!description.trim() && !uploadedImage) return;
    
    setIsGenerating(true);
    
    // Simulate API call with realistic delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const sampleCaptions = generateMockCaptions(description, platform, tone, mood, includeHashtags, includeEmojis, includeCTA);
    
    setGeneratedCaptions(sampleCaptions.map((text, index) => ({
      id: `caption-${Date.now()}-${index}`,
      text,
      rating: 0,
      saved: false
    })));
    
    setIsGenerating(false);
  };

  const generateMockCaptions = (desc: string, plat: string, tn: string, md: string, hashtags: boolean, emojis: boolean, cta: boolean) => {
    const baseCaption = desc.trim() || "Sharing this amazing moment";
    const selectedMood = moods.find(m => m.value === md);
    
    const emojiMap = {
      professional: '💼✨📈',
      funny: '😂🤣😄',
      motivational: '💪🔥⚡',
      romantic: '💕❤️🌹',
      casual: '😊🌟👋'
    };
    
    const hashtagMap = {
      instagram: '#photooftheday #instagood #love #beautiful #happy #lifestyle #memories',
      twitter: '#TwitterUpdate #SocialMedia #Content #Trending',
      linkedin: '#Professional #Career #Business #Growth #Success #Leadership',
      facebook: '#Friends #Family #Memories #Life #Grateful #Community',
      tiktok: '#viral #fyp #trending #content #creative #fun'
    };

    const ctaMap = {
      instagram: 'Double tap if you agree! 💖',
      twitter: 'What do you think? Let me know! 👇',
      linkedin: 'What are your thoughts on this? Share in the comments.',
      facebook: 'Tag someone who needs to see this! 👇',
      tiktok: 'Follow for more content like this! ✨'
    };

    const selectedEmojis = emojis ? emojiMap[tn as keyof typeof emojiMap] : '';
    const selectedHashtags = hashtags ? hashtagMap[plat as keyof typeof hashtagMap] : '';
    const selectedCTA = cta ? ctaMap[plat as keyof typeof ctaMap] : '';
    const moodEmoji = selectedMood?.emoji || '';
    
    const captions = [
      `${baseCaption} ${moodEmoji} ${selectedEmojis}\n\n${selectedCTA}\n\n${selectedHashtags}`.trim(),
      `Feeling ${selectedMood?.label.toLowerCase()} about this: ${baseCaption.toLowerCase()} ${moodEmoji} ${selectedEmojis}\n\n${selectedCTA}\n\n${selectedHashtags}`.trim(),
      `${baseCaption}... and I'm absolutely loving every second of it! ${moodEmoji} ${selectedEmojis}\n\n${selectedCTA}\n\n${selectedHashtags}`.trim(),
      `When life gives you moments like this: ${baseCaption.toLowerCase()} ${moodEmoji} ${selectedEmojis}\n\n${selectedCTA}\n\n${selectedHashtags}`.trim(),
      `Just had to share this ${selectedMood?.label.toLowerCase()} moment: ${baseCaption.toLowerCase()} ${moodEmoji} ${selectedEmojis}\n\n${selectedCTA}\n\n${selectedHashtags}`.trim()
    ];

    return captions.slice(0, 4); // Return 4 captions
  };

  const copyToClipboard = async (caption: CaptionData) => {
    try {
      await navigator.clipboard.writeText(caption.text);
      setCopiedId(caption.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const rateCaption = (id: string, rating: number) => {
    setGeneratedCaptions(prev => 
      prev.map(caption => 
        caption.id === id ? { ...caption, rating } : caption
      )
    );
  };

  const toggleSaved = (id: string) => {
    setGeneratedCaptions(prev => 
      prev.map(caption => 
        caption.id === id ? { ...caption, saved: !caption.saved } : caption
      )
    );
  };

  const selectedPlatform = platforms.find(p => p.value === platform);
  const selectedTone = tones.find(t => t.value === tone);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-lg opacity-75 animate-pulse"></div>
              <div className="relative p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
                <Wand2 className="w-10 h-10 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                AI Caption Generator
              </h1>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
                <span className="text-sm text-gray-500 font-medium">Powered by Advanced AI</span>
                <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
              </div>
            </div>
          </div>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
            Transform your content with AI-powered captions that engage, inspire, and convert across all social platforms
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
              <div className="space-y-8">
                {/* Image Upload Section */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Upload Image (Optional)
                  </label>
                  
                  {uploadedImage ? (
                    <div className="relative group">
                      <img 
                        src={uploadedImage} 
                        alt="Uploaded content" 
                        className="w-full h-48 object-cover rounded-2xl shadow-lg"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl flex items-center justify-center">
                        <button
                          onClick={removeImage}
                          className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`border-3 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer ${
                        dragActive 
                          ? 'border-purple-500 bg-purple-50' 
                          : 'border-gray-300 hover:border-purple-400 hover:bg-purple-25'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 font-medium mb-2">
                        Drag & drop an image here, or click to browse
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports JPG, PNG, GIF up to 10MB
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>

                {/* Description Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Describe your content
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., Sunset at the beach with friends, enjoying the perfect evening with amazing vibes..."
                    className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 resize-none text-gray-700 placeholder-gray-400"
                    rows={4}
                  />
                  <div className="mt-2 text-xs text-gray-500">
                    {selectedPlatform && `Max ${selectedPlatform.maxLength} characters for ${selectedPlatform.label}`}
                  </div>
                </div>

                {/* Platform Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Choose Platform
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {platforms.map((p) => (
                      <button
                        key={p.value}
                        onClick={() => setPlatform(p.value)}
                        className={`p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                          platform === p.value
                            ? `bg-gradient-to-r ${p.color} text-white border-transparent shadow-xl scale-105`
                            : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-lg'
                        }`}
                      >
                        <div className="text-2xl mb-2">{p.icon}</div>
                        <div className="text-sm font-medium">{p.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tone and Mood Selection */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                      Select Tone
                    </label>
                    <div className="space-y-2">
                      {tones.map((t) => {
                        const IconComponent = t.icon;
                        return (
                          <button
                            key={t.value}
                            onClick={() => setTone(t.value)}
                            className={`w-full p-3 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${
                              tone === t.value
                                ? `border-purple-500 ${t.bg} shadow-md`
                                : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-sm'
                            }`}
                          >
                            <IconComponent className={`w-5 h-5 ${t.color}`} />
                            <span className="text-sm font-medium">{t.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                      Choose Mood
                    </label>
                    <div className="space-y-2">
                      {moods.map((m) => (
                        <button
                          key={m.value}
                          onClick={() => setMood(m.value)}
                          className={`w-full p-3 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${
                            mood === m.value
                              ? 'border-purple-500 bg-purple-50 shadow-md'
                              : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-sm'
                          }`}
                        >
                          <span className="text-lg">{m.emoji}</span>
                          <span className="text-sm font-medium">{m.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Advanced Preferences */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">Advanced Options</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={includeHashtags}
                        onChange={(e) => setIncludeHashtags(e.target.checked)}
                        className="w-5 h-5 text-purple-600 border-2 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm font-medium text-gray-700 group-hover:text-purple-600 transition-colors">
                        Include Hashtags
                      </span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={includeEmojis}
                        onChange={(e) => setIncludeEmojis(e.target.checked)}
                        className="w-5 h-5 text-purple-600 border-2 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm font-medium text-gray-700 group-hover:text-purple-600 transition-colors">
                        Include Emojis
                      </span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={includeCTA}
                        onChange={(e) => setIncludeCTA(e.target.checked)}
                        className="w-5 h-5 text-purple-600 border-2 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm font-medium text-gray-700 group-hover:text-purple-600 transition-colors">
                        Call-to-Action
                      </span>
                    </label>
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={generateCaptions}
                  disabled={(!description.trim() && !uploadedImage) || isGenerating}
                  className={`w-full py-5 px-6 rounded-2xl font-semibold text-white transition-all duration-300 transform ${
                    (!description.trim() && !uploadedImage) || isGenerating
                      ? 'bg-gray-400 cursor-not-allowed'
                      : `bg-gradient-to-r ${selectedPlatform?.color} hover:shadow-2xl hover:scale-105 active:scale-95 shadow-lg`
                  }`}
                >
                  {isGenerating ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>AI is crafting your captions...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <Wand2 className="w-5 h-5" />
                      Generate AI Captions
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar - Stats & Tips */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Platform</span>
                  <span className="text-sm font-semibold text-gray-800">{selectedPlatform?.label}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tone</span>
                  <span className="text-sm font-semibold text-gray-800">{selectedTone?.label}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Generated</span>
                  <span className="text-sm font-semibold text-purple-600">{generatedCaptions.length} captions</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Saved</span>
                  <span className="text-sm font-semibold text-green-600">
                    {generatedCaptions.filter(c => c.saved).length} captions
                  </span>
                </div>
              </div>
            </div>

            {/* Pro Tips */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl shadow-xl p-6 border border-purple-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-500" />
                Pro Tips
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Upload an image for more contextual captions</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Be specific in your description for better results</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Different platforms have different character limits</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Use CTAs to increase engagement rates</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Generated Captions */}
        {generatedCaptions.length > 0 && (
          <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                AI Generated Captions
              </h2>
              <div className="flex gap-2">
                <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                  <Download className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
            
            <div className="grid gap-6">
              {generatedCaptions.map((caption, index) => (
                <div
                  key={caption.id}
                  className="group p-6 border-2 border-gray-100 rounded-2xl hover:border-purple-200 transition-all duration-300 hover:shadow-lg bg-white/50"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                          Caption {index + 1}
                        </span>
                        <span className="text-xs text-gray-500">
                          {caption.text.length} characters
                        </span>
                      </div>
                      <p className="text-gray-800 leading-relaxed whitespace-pre-line">{caption.text}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => toggleSaved(caption.id)}
                        className={`p-3 rounded-xl transition-all duration-200 ${
                          caption.saved
                            ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200 shadow-md'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        <Star className={`w-5 h-5 ${caption.saved ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => copyToClipboard(caption)}
                        className={`p-3 rounded-xl transition-all duration-200 ${
                          copiedId === caption.id
                            ? 'bg-green-100 text-green-600 shadow-md'
                            : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                        }`}
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 font-medium">Rate this caption:</span>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => rateCaption(caption.id, star)}
                          className={`w-6 h-6 transition-all duration-200 hover:scale-110 ${
                            star <= caption.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300 hover:text-yellow-300'
                          }`}
                        >
                          <Star className="w-full h-full" />
                        </button>
                      ))}
                    </div>
                    
                    {copiedId === caption.id && (
                      <div className="text-sm text-green-600 font-medium animate-pulse flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Copied to clipboard!
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;