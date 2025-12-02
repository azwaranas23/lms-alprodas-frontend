import { useState, useEffect } from 'react';
import { X, Search, SearchX, Tag } from 'lucide-react';
import { topicsService, type Topic } from '~/services/topics.service';
import { BASE_URL } from '~/constants/api';

interface TopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTopic: (topic: Topic) => void;
  selectedTopicId?: string;
}

export function TopicModal({ isOpen, onClose, onSelectTopic }: TopicModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch topics from API
  useEffect(() => {
    const fetchTopics = async () => {
      if (!isOpen) return;

      setLoading(true);
      setError(null);

      try {
        const response = await topicsService.getTopics({ limit: 100 }); // Get all topics
        setTopics(response.data.items);
        setFilteredTopics(response.data.items);
      } catch (err: any) {
        console.error('Error fetching topics:', err);
        setError('Failed to load topics');
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, [isOpen]);

  // Filter topics based on search term
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredTopics(topics);
    } else {
      const filtered = topics.filter(topic =>
        topic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (topic.description && topic.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredTopics(filtered);
    }
  }, [searchTerm, topics]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setSearchTerm('');
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getImageUrl = (image: string | null | undefined) => {
    if (!image) return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'; // Default image
    return `${BASE_URL}${image}`;
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-[20px] border border-[#DCDEDD] w-full max-w-4xl mx-4 max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-[#DCDEDD]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-50 rounded-[12px] flex items-center justify-center">
                <Tag className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-brand-dark text-xl font-bold">Select Topic</h3>
                <p className="text-brand-light text-sm font-normal">Choose which topic this subject belongs to</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-full border border-[#DCDEDD] flex items-center justify-center hover:border-[#0C51D9] hover:border-2 transition-all duration-200"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-6 border-b border-[#DCDEDD]">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-[#DCDEDD] rounded-[16px] hover:border-[#0C51D9] hover:border-2 focus:border-[#0C51D9] focus:border-2 focus:bg-white transition-all duration-300 font-semibold"
              placeholder="Search topics..."
              disabled={loading}
            />
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-96">
          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-brand-light text-sm">Loading topics...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <X className="w-12 h-12 text-red-400 mx-auto mb-3" />
              <h4 className="text-brand-dark text-base font-semibold mb-1">Error loading topics</h4>
              <p className="text-brand-light text-sm">{error}</p>
            </div>
          ) : filteredTopics.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="topic-card border border-[#DCDEDD] rounded-[16px] hover:border-[#0C51D9] hover:border-2 hover:shadow-lg transition-all duration-300 p-4 cursor-pointer"
                  onClick={() => {
                    onSelectTopic(topic);
                    onClose();
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-28 h-16 relative overflow-hidden rounded-[12px]">
                      <img
                        src={getImageUrl(topic.image)}
                        alt={topic.name}
                        className="w-28 h-16 rounded-[12px] object-cover"
                        onError={(e) => {
                          // Fallback to default image if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3';
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-brand-dark text-base font-bold">{topic.name}</h4>
                      <p className="text-brand-light text-sm font-normal">
                        {topic.description || 'No description available'}
                      </p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs text-gray-500">{topic.subject_count} subjects</span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">{topic.course_count} courses</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <SearchX className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h4 className="text-brand-dark text-base font-semibold mb-1">No topics found</h4>
              <p className="text-brand-light text-sm">
                {searchTerm ? 'Try adjusting your search terms' : 'No topics available'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}