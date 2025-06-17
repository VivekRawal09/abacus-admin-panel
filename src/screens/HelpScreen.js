import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
  FlatList,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HelpScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('faq'); // 'faq', 'chat', 'contact'
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm here to help you with any questions about the Abacus Learning App. How can I assist you today?",
      sender: 'support',
      timestamp: new Date(Date.now() - 300000),
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef(null);

  const faqData = [
    {
      id: 1,
      category: 'Getting Started',
      questions: [
        {
          question: 'How do I start learning abacus?',
          answer: 'Begin with Level 1: Basic Numbers from the Courses section. This introduces you to abacus structure and basic bead movements. Complete each lesson in order to unlock the next level.'
        },
        {
          question: 'What age group is this app suitable for?',
          answer: 'The app is designed for children aged 8-18, but adults can also benefit from learning abacus techniques. The content is structured to accommodate different learning paces.'
        },
        {
          question: 'Do I need a physical abacus to use this app?',
          answer: 'No, the app includes a virtual abacus that you can use for practice. However, having a physical abacus can complement your learning experience.'
        }
      ]
    },
    {
      id: 2,
      category: 'Using the Virtual Abacus',
      questions: [
        {
          question: 'How do I use the virtual abacus?',
          answer: 'Tap the beads to move them. Heaven beads (top) represent 5, and earth beads (bottom) represent 1 each. The app automatically calculates the total value as you move beads.'
        },
        {
          question: 'Why does the abacus only work in landscape mode?',
          answer: 'Landscape mode provides more space for the abacus columns and beads, making it easier to practice and see all the place values clearly.'
        },
        {
          question: 'Can I change the abacus appearance?',
          answer: 'Yes! Go to Settings > Abacus Settings to customize the size and bead colors according to your preference.'
        }
      ]
    },
    {
      id: 3,
      category: 'Courses and Progress',
      questions: [
        {
          question: 'How are the courses structured?',
          answer: 'Courses are divided into 5 levels, each focusing on specific skills: Basic Numbers, Simple Addition, Advanced Addition, Subtraction, and Multiplication. Each level contains multiple video lessons and practice exercises.'
        },
        {
          question: 'Can I skip levels?',
          answer: 'No, levels must be completed in order. This ensures you build a strong foundation before moving to advanced concepts.'
        },
        {
          question: 'How is my progress tracked?',
          answer: 'The app tracks your lesson completion, time spent, practice sessions, and achievements. You can view detailed progress in the My Progress section.'
        }
      ]
    },
    {
      id: 4,
      category: 'Technical Issues',
      questions: [
        {
          question: 'The app is running slowly. What should I do?',
          answer: 'Try closing other apps, restart the app, or clear the cache from Settings > Advanced > Clear Cache. Ensure you have sufficient storage space on your device.'
        },
        {
          question: 'Videos are not loading properly.',
          answer: 'Check your internet connection. For offline access, download videos when connected to WiFi. You can enable "Download Over WiFi Only" in Settings.'
        },
        {
          question: 'I lost my progress after updating the app.',
          answer: 'Progress is automatically saved to your account. Try logging out and logging back in. If the issue persists, contact our support team.'
        }
      ]
    },
    {
      id: 5,
      category: 'Subscription and Billing',
      questions: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept credit/debit cards, UPI, net banking, and digital wallets. All payments are processed securely through our payment partners.'
        },
        {
          question: 'Can I cancel my subscription anytime?',
          answer: 'Yes, you can cancel your subscription from the Subscription section. You will retain access until the end of your current billing period.'
        },
        {
          question: 'Do you offer refunds?',
          answer: 'We offer a 7-day money-back guarantee for first-time subscribers. For other refund requests, please contact our support team.'
        }
      ]
    }
  ];

  const quickActions = [
    {
      id: 1,
      title: 'Video Tutorials',
      description: 'Watch how-to videos',
      icon: 'play-circle',
      color: '#4CAF50',
      onPress: () => Alert.alert('Demo Mode', 'Video tutorials are not available in demo mode.')
    },
    {
      id: 2,
      title: 'User Guide',
      description: 'Complete app guide',
      icon: 'book',
      color: '#2196F3',
      onPress: () => Alert.alert('Demo Mode', 'User guide is not available in demo mode.')
    },
    {
      id: 3,
      title: 'Report Bug',
      description: 'Report technical issues',
      icon: 'bug',
      color: '#FF9800',
      onPress: () => Alert.alert('Demo Mode', 'Bug reporting is not available in demo mode.')
    },
    {
      id: 4,
      title: 'Feature Request',
      description: 'Suggest new features',
      icon: 'bulb',
      color: '#9C27B0',
      onPress: () => Alert.alert('Demo Mode', 'Feature requests are not available in demo mode.')
    }
  ];

  const contactInfo = {
    email: 'support@abacuslearning.com',
    phone: '+91-9876543210',
    whatsapp: '+91-9876543210',
    address: 'Abacus Learning Inc.\n123 Education Street\nLearning City, India 400001',
    businessHours: 'Monday - Friday: 9:00 AM - 6:00 PM IST\nSaturday: 10:00 AM - 4:00 PM IST\nSunday: Closed'
  };

  useEffect(() => {
    if (activeTab === 'chat' && flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [chatMessages, activeTab]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Simulate auto-response
    setTimeout(() => {
      const autoResponse = {
        id: Date.now() + 1,
        text: "Thank you for your message! This is a demo version, so I can't provide real support right now. In the actual app, our support team would respond within 24 hours.",
        sender: 'support',
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, autoResponse]);
    }, 2000);
  };

  const renderChatMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'user' ? styles.userMessage : styles.supportMessage
    ]}>
      <Text style={[
        styles.messageText,
        item.sender === 'user' ? styles.userMessageText : styles.supportMessageText
      ]}>
        {item.text}
      </Text>
      <Text style={styles.messageTime}>
        {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );

  const renderFAQItem = (question, index, categoryIndex) => {
    const [expanded, setExpanded] = useState(false);
    
    return (
      <View key={index} style={styles.faqItem}>
        <TouchableOpacity
          style={styles.faqQuestion}
          onPress={() => setExpanded(!expanded)}
        >
          <Text style={styles.faqQuestionText}>{question.question}</Text>
          <Ionicons 
            name={expanded ? "chevron-up" : "chevron-down"} 
            size={20} 
            color="#666" 
          />
        </TouchableOpacity>
        {expanded && (
          <View style={styles.faqAnswer}>
            <Text style={styles.faqAnswerText}>{question.answer}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderFAQTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickActionCard}
              onPress={action.onPress}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: action.color + '20' }]}>
                <Ionicons name={action.icon} size={24} color={action.color} />
              </View>
              <Text style={styles.quickActionTitle}>{action.title}</Text>
              <Text style={styles.quickActionDescription}>{action.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* FAQ Categories */}
      {faqData.map((category, categoryIndex) => (
        <View key={category.id} style={styles.faqCategory}>
          <Text style={styles.categoryTitle}>{category.category}</Text>
          {category.questions.map((question, questionIndex) => 
            renderFAQItem(question, questionIndex, categoryIndex)
          )}
        </View>
      ))}
    </ScrollView>
  );

  const renderChatTab = () => (
    <View style={styles.chatContainer}>
      <FlatList
        ref={flatListRef}
        data={chatMessages}
        renderItem={renderChatMessage}
        keyExtractor={(item) => item.id.toString()}
        style={styles.chatMessages}
        contentContainerStyle={styles.chatMessagesContent}
      />
      
      <View style={styles.chatInputContainer}>
        <TextInput
          style={styles.chatInput}
          placeholder="Type your message..."
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!newMessage.trim()}
        >
          <Ionicons name="send" size={20} color={!newMessage.trim() ? "#ccc" : "#4CAF50"} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderContactTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.contactContainer}>
        <Text style={styles.sectionTitle}>Get in Touch</Text>
        
        <View style={styles.contactCard}>
          <View style={styles.contactItem}>
            <Ionicons name="mail" size={20} color="#4CAF50" />
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Email</Text>
              <TouchableOpacity onPress={() => Linking.openURL(`mailto:${contactInfo.email}`)}>
                <Text style={styles.contactValue}>{contactInfo.email}</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.contactItem}>
            <Ionicons name="call" size={20} color="#4CAF50" />
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Phone</Text>
              <TouchableOpacity onPress={() => Linking.openURL(`tel:${contactInfo.phone}`)}>
                <Text style={styles.contactValue}>{contactInfo.phone}</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.contactItem}>
            <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>WhatsApp</Text>
              <TouchableOpacity onPress={() => Linking.openURL(`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`)}>
                <Text style={styles.contactValue}>{contactInfo.whatsapp}</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.contactItem}>
            <Ionicons name="location" size={20} color="#4CAF50" />
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Address</Text>
              <Text style={styles.contactValue}>{contactInfo.address}</Text>
            </View>
          </View>
          
          <View style={styles.contactItem}>
            <Ionicons name="time" size={20} color="#4CAF50" />
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Business Hours</Text>
              <Text style={styles.contactValue}>{contactInfo.businessHours}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.socialMedia}>
          <Text style={styles.sectionTitle}>Follow Us</Text>
          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-facebook" size={24} color="#1877f2" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-twitter" size={24} color="#1da1f2" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-instagram" size={24} color="#e4405f" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-youtube" size={24} color="#ff0000" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <Text style={styles.headerSubtitle}>We're here to help you succeed</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabNavigation}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'faq' && styles.activeTab]}
          onPress={() => setActiveTab('faq')}
        >
          <Ionicons 
            name="help-circle" 
            size={20} 
            color={activeTab === 'faq' ? '#4CAF50' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'faq' && styles.activeTabText]}>
            FAQ
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'chat' && styles.activeTab]}
          onPress={() => setActiveTab('chat')}
        >
          <Ionicons 
            name="chatbubbles" 
            size={20} 
            color={activeTab === 'chat' ? '#4CAF50' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'chat' && styles.activeTabText]}>
            Chat
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'contact' && styles.activeTab]}
          onPress={() => setActiveTab('contact')}
        >
          <Ionicons 
            name="call" 
            size={20} 
            color={activeTab === 'contact' ? '#4CAF50' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'contact' && styles.activeTabText]}>
            Contact
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === 'faq' && renderFAQTab()}
      {activeTab === 'chat' && renderChatTab()}
      {activeTab === 'contact' && renderContactTab()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  tabNavigation: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#4CAF50',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#4CAF50',
  },
  tabContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  quickActionsContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 8,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  quickActionDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  faqCategory: {
    backgroundColor: '#fff',
    marginBottom: 8,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 12,
  },
  faqItem: {
    marginBottom: 8,
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  faqQuestionText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  faqAnswer: {
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  faqAnswerText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatMessages: {
    flex: 1,
  },
  chatMessagesContent: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 12,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#4CAF50',
    borderRadius: 16,
    padding: 12,
  },
  supportMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    padding: 12,
  },
  messageText: {
    fontSize: 16,
    marginBottom: 4,
  },
  userMessageText: {
    color: '#fff',
  },
  supportMessageText: {
    color: '#333',
  },
  messageTime: {
    fontSize: 12,
    color: '#999',
    alignSelf: 'flex-end',
  },
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  chatInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  contactContainer: {
    padding: 20,
  },
  contactCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  contactInfo: {
    flex: 1,
    marginLeft: 12,
  },
  contactLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  socialMedia: {
    alignItems: 'center',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default HelpScreen;