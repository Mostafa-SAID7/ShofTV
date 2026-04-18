import { motion } from "framer-motion";
import { HelpCircle, MessageCircle, Mail, Phone, Clock, Search, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const faqs = [
  {
    question: "How do I book a movie ticket?",
    answer: "Simply browse our movie collection, select a movie, choose your preferred showtime, select your seats, and complete the payment process."
  },
  {
    question: "Can I cancel or refund my ticket?",
    answer: "Yes, you can cancel your ticket up to 2 hours before the showtime for a full refund. Cancellations can be made through your profile page."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and digital wallets like Apple Pay and Google Pay."
  },
  {
    question: "How do I access my digital tickets?",
    answer: "Your digital tickets are available in the 'My Tickets' section of your profile. You can also receive them via email after booking."
  },
  {
    question: "What if I arrive late to the movie?",
    answer: "We recommend arriving 15 minutes before showtime. Late arrivals may not be admitted during certain scenes to avoid disrupting other guests."
  },
  {
    question: "Do you offer group discounts?",
    answer: "Yes! We offer special rates for groups of 10 or more. Contact our support team for group booking assistance."
  }
];

const contactMethods = [
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Get instant help from our support team",
    action: "Start Chat",
    available: "24/7"
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "Send us a detailed message",
    action: "Send Email",
    available: "Response within 2 hours"
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "Speak directly with our team",
    action: "Call Now",
    available: "Mon-Sun 9AM-11PM"
  }
];

export default function Support() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen px-4 md:px-8 lg:px-12 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6"
          >
            <HelpCircle className="w-10 h-10 text-primary" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4">
            How can we help?
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions or get in touch with our support team
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-12">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-xl bg-secondary border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
          />
        </div>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {contactMethods.map((method, index) => (
            <motion.div
              key={method.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6 rounded-xl text-center hover-lift cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <method.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{method.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{method.description}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                <Clock className="w-3 h-3" />
                <span>{method.available}</span>
              </div>
              <button className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                {method.action}
              </button>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/30 transition-colors"
                >
                  <span className="font-semibold text-foreground pr-4">{faq.question}</span>
                  <ChevronRight 
                    className={`w-5 h-5 text-muted-foreground transition-transform ${
                      expandedFaq === index ? 'rotate-90' : ''
                    }`} 
                  />
                </button>
                {expandedFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-6"
                  >
                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-2 text-primary hover:underline"
              >
                Clear search
              </button>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="glass-card p-6 rounded-xl">
          <h3 className="text-lg font-bold text-foreground mb-4">Quick Links</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <Link
              to="/tickets"
              className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-muted transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-primary" />
              </div>
              <span className="font-medium text-foreground">My Tickets</span>
            </Link>
            <Link
              to="/profile"
              className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-muted transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-primary" />
              </div>
              <span className="font-medium text-foreground">Account Settings</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}