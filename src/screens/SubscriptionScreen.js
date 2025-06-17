import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SubscriptionScreen = ({ navigation }) => {
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [referralCode, setReferralCode] = useState('');

  // Sample subscription data
  const currentSubscription = {
    plan: 'Monthly Premium',
    price: '₹299',
    period: 'month',
    status: 'active',
    nextBilling: '2025-07-15',
    daysLeft: 28,
    autoRenewal: true,
    startDate: '2024-05-15',
  };

  const subscriptionPlans = [
    {
      id: 'monthly',
      name: 'Monthly Premium',
      price: '₹299',
      period: '/month',
      originalPrice: null,
      discount: null,
      features: [
        'Access to all levels',
        'Unlimited practice sessions',
        'Progress tracking',
        'Certificate generation',
        'Priority support',
        'Offline content download',
      ],
      popular: false,
      current: true,
    },
    {
      id: 'yearly',
      name: 'Yearly Premium',
      price: '₹2,399',
      period: '/year',
      originalPrice: '₹3,588',
      discount: '33% OFF',
      features: [
        'Access to all levels',
        'Unlimited practice sessions',
        'Progress tracking',
        'Certificate generation',
        'Priority support',
        'Offline content download',
        'Advanced analytics',
        'One-on-one mentoring (2 sessions)',
      ],
      popular: true,
      current: false,
    },
    {
      id: 'lifetime',
      name: 'Lifetime Access',
      price: '₹4,999',
      period: 'one-time',
      originalPrice: '₹9,999',
      discount: '50% OFF',
      features: [
        'Lifetime access to all content',
        'All future course updates',
        'Premium support for life',
        'Advanced analytics',
        'Unlimited mentoring sessions',
        'Priority new feature access',
        'Commercial usage rights',
      ],
      popular: false,
      current: false,
    },
  ];

  const paymentHistory = [
    {
      id: 1,
      date: '2025-06-15',
      amount: '₹299',
      plan: 'Monthly Premium',
      status: 'success',
      method: 'Credit Card ****1234',
    },
    {
      id: 2,
      date: '2025-05-15',
      amount: '₹299',
      plan: 'Monthly Premium',
      status: 'success',
      method: 'UPI - Google Pay',
    },
    {
      id: 3,
      date: '2025-04-15',
      amount: '₹299',
      plan: 'Monthly Premium',
      status: 'success',
      method: 'Credit Card ****1234',
    },
  ];

  const handleUpgrade = (plan) => {
    if (plan.current) {
      Alert.alert('Current Plan', 'This is your current subscription plan.');
      return;
    }

    Alert.alert(
      'Upgrade Subscription',
      `Upgrade to ${plan.name} for ${plan.price}${plan.period}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Upgrade',
          onPress: () => {
            Alert.alert('Demo Mode', 'Subscription upgrade is not available in demo mode.');
          },
        },
      ]
    );
  };

  const handleCancelSubscription = () => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your current billing period.',
      [
        { text: 'Keep Subscription', style: 'cancel' },
        {
          text: 'Cancel',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Demo Mode', 'Subscription cancellation is not available in demo mode.');
          },
        },
      ]
    );
  };

  const handleToggleAutoRenewal = () => {
    Alert.alert('Demo Mode', 'Auto-renewal toggle is not available in demo mode.');
  };

  const handleApplyReferral = () => {
    if (!referralCode.trim()) {
      Alert.alert('Error', 'Please enter a referral code.');
      return;
    }

    setShowReferralModal(false);
    Alert.alert('Demo Mode', 'Referral code application is not available in demo mode.');
    setReferralCode('');
  };

  const renderCurrentSubscription = () => (
    <View style={styles.currentSubscriptionContainer}>
      <Text style={styles.sectionTitle}>Current Subscription</Text>
      
      <View style={styles.currentSubscriptionCard}>
        <View style={styles.subscriptionHeader}>
          <View style={styles.subscriptionInfo}>
            <Text style={styles.planName}>{currentSubscription.plan}</Text>
            <Text style={styles.planPrice}>
              {currentSubscription.price}/{currentSubscription.period}
            </Text>
          </View>
          
          <View style={[styles.statusBadge, styles.statusActive]}>
            <Text style={styles.statusText}>Active</Text>
          </View>
        </View>
        
        <View style={styles.subscriptionDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar" size={16} color="#666" />
            <Text style={styles.detailText}>
              Next billing: {new Date(currentSubscription.nextBilling).toLocaleDateString()}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="time" size={16} color="#666" />
            <Text style={styles.detailText}>
              {currentSubscription.daysLeft} days remaining
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="refresh" size={16} color="#666" />
            <Text style={styles.detailText}>
              Auto-renewal: {currentSubscription.autoRenewal ? 'On' : 'Off'}
            </Text>
          </View>
        </View>
        
        <View style={styles.subscriptionActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleToggleAutoRenewal}
          >
            <Text style={styles.actionButtonText}>
              {currentSubscription.autoRenewal ? 'Turn Off Auto-Renewal' : 'Turn On Auto-Renewal'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={handleCancelSubscription}
          >
            <Text style={[styles.actionButtonText, styles.cancelButtonText]}>
              Cancel Subscription
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderPlanCard = (plan) => (
    <View key={plan.id} style={[styles.planCard, plan.popular && styles.popularPlan]}>
      {plan.popular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularBadgeText}>Most Popular</Text>
        </View>
      )}
      
      {plan.discount && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{plan.discount}</Text>
        </View>
      )}
      
      <View style={styles.planHeader}>
        <Text style={styles.planTitle}>{plan.name}</Text>
        <View style={styles.planPricing}>
          <Text style={styles.planPriceText}>{plan.price}</Text>
          <Text style={styles.planPeriodText}>{plan.period}</Text>
        </View>
        {plan.originalPrice && (
          <Text style={styles.originalPrice}>was {plan.originalPrice}</Text>
        )}
      </View>
      
      <View style={styles.planFeatures}>
        {plan.features.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>
      
      <TouchableOpacity
        style={[
          styles.planButton,
          plan.current && styles.planButtonCurrent,
          plan.popular && styles.planButtonPopular
        ]}
        onPress={() => handleUpgrade(plan)}
      >
        <Text style={[
          styles.planButtonText,
          plan.current && styles.planButtonTextCurrent,
          plan.popular && styles.planButtonTextPopular
        ]}>
          {plan.current ? 'Current Plan' : 'Upgrade'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderPaymentHistory = () => (
    <View style={styles.paymentHistoryContainer}>
      <Text style={styles.sectionTitle}>Payment History</Text>
      
      {paymentHistory.map((payment) => (
        <View key={payment.id} style={styles.paymentCard}>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentDate}>
              {new Date(payment.date).toLocaleDateString()}
            </Text>
            <Text style={styles.paymentPlan}>{payment.plan}</Text>
            <Text style={styles.paymentMethod}>{payment.method}</Text>
          </View>
          
          <View style={styles.paymentAmount}>
            <Text style={styles.paymentAmountText}>{payment.amount}</Text>
            <View style={[styles.paymentStatus, styles.paymentStatusSuccess]}>
              <Text style={styles.paymentStatusText}>Success</Text>
            </View>
          </View>
        </View>
      ))}
      
      <TouchableOpacity style={styles.downloadButton}>
        <Ionicons name="download" size={16} color="#4CAF50" />
        <Text style={styles.downloadButtonText}>Download Invoice</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Subscription</Text>
          <Text style={styles.headerSubtitle}>Manage your subscription plan</Text>
        </View>

        {renderCurrentSubscription()}

        {/* Available Plans */}
        <View style={styles.plansContainer}>
          <Text style={styles.sectionTitle}>Upgrade Your Plan</Text>
          {subscriptionPlans.map(renderPlanCard)}
        </View>

        {renderPaymentHistory()}

        {/* Additional Options */}
        <View style={styles.additionalOptions}>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => setShowReferralModal(true)}
          >
            <Ionicons name="gift" size={20} color="#4CAF50" />
            <Text style={styles.optionButtonText}>Apply Referral Code</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.optionButton}>
            <Ionicons name="help-circle" size={20} color="#4CAF50" />
            <Text style={styles.optionButtonText}>Billing Support</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.optionButton}>
            <Ionicons name="document-text" size={20} color="#4CAF50" />
            <Text style={styles.optionButtonText}>Terms & Conditions</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Referral Code Modal */}
      <Modal
        visible={showReferralModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowReferralModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Apply Referral Code</Text>
            <Text style={styles.modalDescription}>
              Enter your referral code to get special discounts
            </Text>
            
            <View style={styles.inputContainer}>
              <Ionicons name="gift" size={20} color="#666" />
              <Text
                style={styles.input}
                placeholder="Enter referral code"
                value={referralCode}
                onChangeText={setReferralCode}
              />
            </View>
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowReferralModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.modalApplyButton}
                onPress={handleApplyReferral}
              >
                <Text style={styles.modalApplyText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  currentSubscriptionContainer: {
    backgroundColor: '#fff',
    margin: 20,
    marginBottom: 0,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  currentSubscriptionCard: {
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#F8FFF8',
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  subscriptionInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: '#4CAF50',
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  subscriptionDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  subscriptionActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#4CAF50',
    marginHorizontal: 4,
  },
  cancelButton: {
    borderColor: '#F44336',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#4CAF50',
    textAlign: 'center',
    fontWeight: '500',
  },
  cancelButtonText: {
    color: '#F44336',
  },
  plansContainer: {
    backgroundColor: '#fff',
    margin: 20,
    marginBottom: 0,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  planCard: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    position: 'relative',
  },
  popularPlan: {
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    left: 16,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularBadgeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  discountBadge: {
    position: 'absolute',
    top: -8,
    right: 16,
    backgroundColor: '#FF5722',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  planHeader: {
    marginBottom: 16,
    paddingTop: 8,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  planPricing: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  planPriceText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  planPeriodText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    marginTop: 4,
  },
  planFeatures: {
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  planButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  planButtonCurrent: {
    backgroundColor: '#E8F5E8',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  planButtonPopular: {
    backgroundColor: '#4CAF50',
  },
  planButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  planButtonTextCurrent: {
    color: '#4CAF50',
  },
  planButtonTextPopular: {
    color: '#fff',
  },
  paymentHistoryContainer: {
    backgroundColor: '#fff',
    margin: 20,
    marginBottom: 0,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paymentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  paymentInfo: {
    flex: 1,
  },
  paymentDate: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  paymentPlan: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  paymentMethod: {
    fontSize: 12,
    color: '#999',
  },
  paymentAmount: {
    alignItems: 'flex-end',
  },
  paymentAmountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  paymentStatus: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  paymentStatusSuccess: {
    backgroundColor: '#E8F5E8',
  },
  paymentStatusText: {
    fontSize: 10,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 8,
  },
  downloadButtonText: {
    fontSize: 14,
    color: '#4CAF50',
    marginLeft: 8,
    fontWeight: '500',
  },
  additionalOptions: {
    backgroundColor: '#fff',
    margin: 20,
    marginBottom: 40,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    color: '#666',
  },
  modalApplyButton: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    backgroundColor: '#4CAF50',
    borderRadius: 6,
    alignItems: 'center',
  },
  modalApplyText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SubscriptionScreen;