import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, Eye, Filter } from 'lucide-react';
import paystackService from '../services/paystackService';
import { formatCurrency } from '../utils/validators';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const result = await paystackService.getTransactions();
      console.log('API result:', result);
      const txns = Array.isArray(result.results) ? result.results : [];
      console.log('Loaded transactions:', txns);
      setTransactions(txns);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'failed':
        return <XCircle className="text-red-500" size={16} />;
      case 'pending':
        return <Clock className="text-yellow-500" size={16} />;
      default:
        return <AlertCircle className="text-gray-500" size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTransactions = transactions.filter(txn => {
    const filterValue = (filter || '').toLowerCase().trim();
    const statusValue = (txn.status || '').toLowerCase().trim();
    console.log('Current filter:', filterValue, 'Transaction status:', statusValue);
    if (!filterValue || filterValue === 'all') return true;
    const allowedStatuses = ['pending', 'success', 'failed'];
    if (!allowedStatuses.includes(filterValue)) return true;
    return statusValue === filterValue;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
        <div className="flex items-center space-x-2">
          <Filter size={16} className="text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value.toLowerCase().trim())}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="success">Success</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <Clock size={48} className="mx-auto" />
          </div>
          <p className="text-gray-500">No transactions found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTransactions.map(txn => (
            <div
              key={txn.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(txn.status)}
                  <div>
                    <p className="font-medium text-gray-900">
                      {formatCurrency(txn.amount, txn.currency)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {txn.email} • {txn.payment_method}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(txn.status)}`}>
                    {txn.status}
                  </span>
                  <button
                    onClick={() => setSelectedTransaction(txn)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Eye size={16} />
                  </button>
                </div>
              </div>
              
              <div className="mt-2 text-xs text-gray-500">
                {formatDate(txn.created_at)} • Ref: {txn.reference}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold">Transaction Details</h4>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={20} />
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Amount</label>
                <p className="text-lg font-semibold">
                  {formatCurrency(selectedTransaction.amount, selectedTransaction.currency)}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <div className="flex items-center space-x-2 mt-1">
                  {getStatusIcon(selectedTransaction.status)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTransaction.status)}`}>
                    {selectedTransaction.status}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Reference</label>
                <p className="font-mono text-sm">{selectedTransaction.reference}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <p>{selectedTransaction.email}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Payment Method</label>
                <p className="capitalize">{selectedTransaction.payment_method.replace('_', ' ')}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Date</label>
                <p>{formatDate(selectedTransaction.created_at)}</p>
              </div>
              
              {selectedTransaction.paid_at && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Paid At</label>
                  <p>{formatDate(selectedTransaction.paid_at)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;