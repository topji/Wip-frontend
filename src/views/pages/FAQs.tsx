import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle, Shield, FileText, Users, Zap, Globe, Lock } from "lucide-react";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  icon: React.ReactNode;
}

const FAQs = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const faqData: FAQItem[] = [
    {
      id: 1,
      question: "What is WorldIP and how does it work?",
      answer: "WorldIP is a blockchain-based intellectual property management platform that allows creators to register, protect, and manage their digital assets. We use cryptographic hashing to create unique digital fingerprints of your work, which are then stored on the blockchain for permanent verification and ownership proof.",
      category: "general",
      icon: <Globe className="w-5 h-5" />
    },
    {
      id: 2,
      question: "How do I create a hash for my intellectual property?",
      answer: "Creating a hash is simple: 1) Upload your file or enter text content, 2) Add a description of your work, 3) Set ownership percentages if multiple owners, 4) Submit to generate a unique cryptographic hash. The hash serves as your digital certificate of ownership and is permanently recorded on the blockchain.",
      category: "general",
      icon: <Zap className="w-5 h-5" />
    },
    {
      id: 3,
      question: "What types of files can I register?",
      answer: "You can register virtually any digital content including documents (PDF, Word), images (PNG, JPG, SVG), audio files (MP3, WAV), videos (MP4, AVI), code files, designs, and even plain text. Our platform supports all common file formats and automatically generates unique hashes for each type of content.",
      category: "technical",
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: 4,
      question: "How secure is my intellectual property on WorldIP?",
      answer: "Your IP is extremely secure. We use industry-standard cryptographic hashing (SHA-256) to create unique fingerprints of your work. These hashes are stored on the blockchain, making them tamper-proof and permanent. Even if someone has access to your original file, they cannot recreate the exact same hash without the original content.",
      category: "security",
      icon: <Shield className="w-5 h-5" />
    },
    {
      id: 5,
      question: "Can I update or modify my registered intellectual property?",
      answer: "Yes, you can update your registered IP through our update system. Each update creates a new version while maintaining the history of all previous versions. This allows you to track changes over time while preserving the integrity of your original registration. All updates are also recorded on the blockchain.",
      category: "technical",
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: 6,
      question: "How do I verify the authenticity of a registered work?",
      answer: "Use our verification tool to check if a file matches a registered hash. Simply upload the file you want to verify, and our system will compare it against the blockchain records. If it matches, you'll receive confirmation of authenticity along with ownership details and registration timestamp.",
      category: "technical",
      icon: <Lock className="w-5 h-5" />
    },
    {
      id: 7,
      question: "Can multiple people own the same intellectual property?",
      answer: "Yes, WorldIP supports shared ownership. When registering your IP, you can specify multiple owners and their respective ownership percentages. This is particularly useful for collaborative projects, partnerships, or when transferring partial ownership rights.",
      category: "ownership",
      icon: <Users className="w-5 h-5" />
    },
    {
      id: 8,
      question: "What happens if I lose my original file?",
      answer: "While we can't recover your original file, your hash and ownership record remain permanently on the blockchain. This proves you were the original creator at the time of registration. However, we recommend keeping secure backups of your important files as the hash alone cannot recreate the original content.",
      category: "technical",
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: 9,
      question: "Is there a cost to use WorldIP?",
      answer: "WorldIP offers both free and premium tiers. Basic registration and verification are free, while advanced features like bulk uploads, detailed analytics, and priority support are available in our premium plans. Blockchain transaction fees may apply for certain operations.",
      category: "general",
      icon: <Globe className="w-5 h-5" />
    },
    {
      id: 10,
      question: "How does WorldIP protect against copyright infringement?",
      answer: "WorldIP provides timestamped proof of creation, which is crucial in copyright disputes. Your hash serves as immutable evidence that you created the work at a specific time. While we don't provide legal advice, our blockchain records can be used as evidence in legal proceedings to establish prior creation.",
      category: "legal",
      icon: <Shield className="w-5 h-5" />
    },
    {
      id: 11,
      question: "Can I transfer ownership of my registered IP?",
      answer: "Yes, you can transfer ownership through our platform. This creates a new transaction on the blockchain showing the ownership change, maintaining a complete audit trail. Both parties must confirm the transfer, and you can specify the new ownership percentages.",
      category: "ownership",
      icon: <Users className="w-5 h-5" />
    },
    {
      id: 12,
      question: "What blockchain does WorldIP use?",
      answer: "WorldIP is built on Ethereum, leveraging its security and decentralization. We use smart contracts to manage registrations, updates, and transfers, ensuring all transactions are transparent, immutable, and verifiable by anyone on the network.",
      category: "technical",
      icon: <Zap className="w-5 h-5" />
    }
  ];

  const categories = [
    { id: "all", name: "All Questions", icon: <HelpCircle className="w-4 h-4" /> },
    { id: "general", name: "General", icon: <Globe className="w-4 h-4" /> },
    { id: "technical", name: "Technical", icon: <Zap className="w-4 h-4" /> },
    { id: "security", name: "Security", icon: <Shield className="w-4 h-4" /> },
    { id: "ownership", name: "Ownership", icon: <Users className="w-4 h-4" /> },
    { id: "legal", name: "Legal", icon: <FileText className="w-4 h-4" /> }
  ];

  const filteredFAQs = selectedCategory === "all" 
    ? faqData 
    : faqData.filter(faq => faq.category === selectedCategory);

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#5865F2] to-[#FF9519] rounded-full mb-6">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How can we help you?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about WorldIP, intellectual property protection, and blockchain technology.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-[#5865F2] text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {category.icon}
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <button
                onClick={() => toggleItem(faq.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 text-[#5865F2]">
                    {faq.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                </div>
                <div className="flex-shrink-0 text-gray-400">
                  {openItems.includes(faq.id) ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </button>
              
              {openItems.includes(faq.id) && (
                <div className="px-6 pb-4">
                  <div className="pl-10 border-l-2 border-[#5865F2]/20">
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-gradient-to-r from-[#5865F2] to-[#FF9519] rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
          <p className="text-lg mb-6 opacity-90">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@worldip.ai"
              className="bg-white text-[#5865F2] px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              Contact Support
            </a>
            <a
              href="https://docs.worldip.ai"
              className="border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-[#5865F2] transition-all duration-200"
            >
              View Documentation
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQs; 