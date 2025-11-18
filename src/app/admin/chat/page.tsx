"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card"
import { Send, MessageCircle, Search, Phone, MoreVertical, Smile, Paperclip } from "lucide-react"

interface Message {
  id: number
  text: string
  sender: "user" | "support"
  timestamp: string
}

interface Conversation {
  id: number
  name: string
  lastMessage: string
  time: string
  avatar: string
  isActive: boolean
  messages: Message[]
}

const initialConversations: Conversation[] = [
  {
    id: 1,
    name: "John Doe",
    lastMessage: "Hi, I have a question",
    time: "2m ago",
    avatar: "JD",
    isActive: true,
    messages: [
      { id: 1, text: "Hi, I have a question about your products", sender: "support", timestamp: "10:30 AM" },
      { id: 2, text: "How can I help you?", sender: "user", timestamp: "10:31 AM" },
      { id: 3, text: "Do you have this in a different size?", sender: "support", timestamp: "10:32 AM" },
    ],
  },
  {
    id: 2,
    name: "Jane Smith",
    lastMessage: "Product inquiry",
    time: "1h ago",
    avatar: "JS",
    isActive: false,
    messages: [
      { id: 1, text: "Hello, I'm interested in your services", sender: "support", timestamp: "09:15 AM" },
      { id: 2, text: "Great! I'd love to help", sender: "user", timestamp: "09:16 AM" },
    ],
  },
  {
    id: 3,
    name: "Mike Johnson",
    lastMessage: "Thank you for your help",
    time: "3h ago",
    avatar: "MJ",
    isActive: false,
    messages: [
      { id: 1, text: "I received my order", sender: "support", timestamp: "08:00 AM" },
      { id: 2, text: "That's wonderful! Thank you for shopping with us", sender: "user", timestamp: "08:02 AM" },
    ],
  },
]

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations)
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null)
  const [messageInput, setMessageInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const selectedChat = conversations.find((c) => c.id === selectedChatId)
  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChatId) return

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === selectedChatId) {
          return {
            ...conv,
            messages: [
              ...conv.messages,
              {
                id: conv.messages.length + 1,
                text: messageInput,
                sender: "user",
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              },
            ],
            lastMessage: messageInput,
            time: "now",
          }
        }
        return conv
      })
    )
    setMessageInput("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 md:pt-32 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <MessageCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            Chat & Support
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage customer conversations and provide support</p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {/* Conversations List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full flex flex-col">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <CardTitle className="text-lg text-gray-900 dark:text-white">Conversations</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden flex flex-col pt-4">
                {/* Search */}
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Conversations */}
                <div className="space-y-2 overflow-y-auto flex-1">
                  {filteredConversations.map((conv, idx) => (
                    <motion.button
                      key={conv.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + idx * 0.05 }}
                      onClick={() => setSelectedChatId(conv.id)}
                      whileHover={{ x: 4 }}
                      className={`w-full p-3 cursor-pointer rounded-lg text-left transition-all ${
                        selectedChatId === conv.id
                          ? "bg-blue-600 dark:bg-blue-500 text-white"
                          : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                            selectedChatId === conv.id
                              ? "bg-white text-blue-600"
                              : "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                          }`}
                        >
                          {conv.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm">{conv.name}</p>
                          <p className={`text-xs truncate ${selectedChatId === conv.id ? "opacity-90" : "opacity-70"}`}>
                            {conv.lastMessage}
                          </p>
                        </div>
                        {conv.isActive && (
                          <div className="w-2.5 h-2.5 bg-green-500 rounded-full shrink-0 mt-1" />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Chat Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <Card className="h-full flex flex-col">
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-sm">
                          {selectedChat.avatar}
                        </div>
                        <div>
                          <CardTitle className="text-gray-900 dark:text-white">{selectedChat.name}</CardTitle>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {selectedChat.isActive ? "Active now" : "Offline"}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                        >
                          <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </motion.button>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Messages */}
                  <CardContent className="flex-1 overflow-y-auto py-4 space-y-4">
                    {selectedChat.messages.map((msg, idx) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div className="flex items-end gap-2 max-w-xs">
                          {msg.sender === "support" && (
                            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full shrink-0" />
                          )}
                          <div
                            className={`p-3 rounded-lg ${
                              msg.sender === "user"
                                ? "bg-blue-600 dark:bg-blue-500 text-white rounded-br-none"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none"
                            }`}
                          >
                            <p className="text-sm">{msg.text}</p>
                            <p className={`text-xs mt-1 ${msg.sender === "user" ? "opacity-70" : "opacity-60"}`}>
                              {msg.timestamp}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>

                  {/* Message Input */}
                  <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex gap-3 items-end">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                      >
                        <Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </motion.button>
                      <input
                        type="text"
                        placeholder="Type a message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                      >
                        <Smile className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim()}
                        className="p-2 cursor-pointer bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </>
              ) : (
                <CardContent className="flex items-center justify-center h-full">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                  >
                    <MessageCircle className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
                      Select a conversation to start chatting
                    </p>
                    <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                      Choose a conversation from the list on the left
                    </p>
                  </motion.div>
                </CardContent>
              )}
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}