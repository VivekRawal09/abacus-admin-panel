import React, { useState } from 'react';
import { XMarkIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { stringHelpers } from '../../utils/helpers';

const YouTubeSearchModal = ({
  isOpen,
  onClose,
  onImport,
  loading = false
}) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoData, setVideoData] = useState({
    category: 'tutorial',
    difficulty: 'beginner',
    courseOrder: '',
    tags: ''
  });
  const [previewData, setPreviewData] = useState(null);

  // Handle video URL input change and extract ID
  const handleVideoUrlChange = (value) => {
    setVideoUrl(value);
    
    // Extract YouTube ID and show preview
    const videoId = stringHelpers.extractYouTubeId(value);
    if (videoId) {
      setPreviewData({
        videoId,
        thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        watchUrl: `https://youtube.com/watch?v=${videoId}`
      });
    } else {
      setPreviewData(null);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const videoId = stringHelpers.extractYouTubeId(videoUrl);
    if (!videoId) {
      toast.error('Please enter a valid YouTube video URL or ID');
      return;
    }

    // Prepare data for import (matching your backend format)
    const importData = {
      youtubeVideoId: videoId,
      category: videoData.category,
      difficulty: videoData.difficulty,
      courseOrder: videoData.courseOrder ? parseInt(videoData.courseOrder) : undefined,
      tags: videoData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    onImport(importData);
  };

  // Reset modal state
  const resetModal = () => {
    setVideoUrl('');
    setVideoData({
      category: 'tutorial',
      difficulty: 'beginner',
      courseOrder: '',
      tags: ''
    });
    setPreviewData(null);
  };

  // Handle modal close
  const handleClose = () => {
    if (!loading) {
      resetModal();
      onClose();
    }
  };

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"
        onClick={(e) => e.target === e.currentTarget && handleClose()}
      >
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />

        {/* Modal */}
        <div 
          className="inline-block w-full max-w-2xl overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <CloudArrowUpIcon className="h-6 w-6 mr-2 text-blue-600" />
              Import Video from YouTube
            </h3>
            <button
              onClick={handleClose}
              disabled={loading}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="px-6 py-4 space-y-6">
              {/* Video URL Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  YouTube Video URL or ID *
                </label>
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => handleVideoUrlChange(e.target.value)}
                  placeholder="https://youtube.com/watch?v=... or just the video ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Video Preview */}
              {previewData && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Video Preview:</h4>
                  <div className="flex items-center space-x-4">
                    <img
                      src={previewData.thumbnail}
                      alt="Video thumbnail"
                      className="w-32 h-24 object-cover rounded-lg bg-gray-200"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Video ID: {previewData.videoId}</p>
                      <a
                        href={previewData.watchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-700 underline"
                      >
                        View on YouTube →
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Import Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    value={videoData.category}
                    onChange={(e) => setVideoData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="basic">Basic</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="tutorial">Tutorial</option>
                    <option value="practice">Practice</option>
                    <option value="assessment">Assessment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level *</label>
                  <select
                    value={videoData.difficulty}
                    onChange={(e) => setVideoData(prev => ({ ...prev, difficulty: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="beginner">Beginner</option>
                    <option value="elementary">Elementary</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Order</label>
                  <input
                    type="number"
                    value={videoData.courseOrder}
                    onChange={(e) => setVideoData(prev => ({ ...prev, courseOrder: e.target.value }))}
                    placeholder="e.g., 1, 2, 3..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                  <input
                    type="text"
                    value={videoData.tags}
                    onChange={(e) => setVideoData(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="math, basics, tutorial"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end px-6 py-4 space-x-3 border-t border-gray-200 bg-gray-50">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !previewData}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Importing...' : 'Import Video'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default YouTubeSearchModal;