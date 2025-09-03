import React, { useState } from 'react';
import { Star, MessageSquare, ThumbsUp, ThumbsDown, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface RatingSystemProps {
  type: 'customer' | 'provider';
  targetName: string;
  onSubmitRating: (rating: number, review: string) => void;
  onSkip: () => void;
  isVisible: boolean;
}

const RatingSystem: React.FC<RatingSystemProps> = ({
  type,
  targetName,
  onSubmitRating,
  onSkip,
  isVisible
}) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState('');
  const [showReviewInput, setShowReviewInput] = useState(false);

  if (!isVisible) return null;

  const handleStarClick = (value: number) => {
    setRating(value);
    if (value >= 4) {
      setShowReviewInput(true);
    }
  };

  const handleSubmit = () => {
    onSubmitRating(rating, review);
  };

  const quickReviews = type === 'customer' ? [
    "Fast and professional",
    "Great communication",
    "Solved my problem quickly",
    "Very courteous and helpful"
  ] : [
    "Easy to work with",
    "Clear communication",
    "Payment was prompt",
    "Respectful and understanding"
  ];

  return (
    <div className="fixed inset-0 bg-midnight-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-yellow-400" />
          </div>
          <h2 className="font-guardian text-2xl text-foreground mb-2">
            Rate Your Experience
          </h2>
          <p className="text-muted-foreground">
            {type === 'customer' 
              ? `How was your service with ${targetName}?`
              : `How was working with ${targetName}?`
            }
          </p>
        </div>

        {/* Star Rating */}
        <div className="flex justify-center mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleStarClick(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="p-2 transition-transform duration-150 hover:scale-110"
            >
              <Star
                className={`w-8 h-8 transition-colors duration-150 ${
                  star <= (hoveredRating || rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-muted-foreground'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Rating Feedback */}
        {rating > 0 && (
          <div className="text-center mb-4 animate-fade-in">
            <p className="text-foreground font-tech">
              {rating === 5 && "Excellent! ⭐"}
              {rating === 4 && "Great experience! 👍"}
              {rating === 3 && "Good service"}
              {rating === 2 && "Could be better"}
              {rating === 1 && "We'll do better"}
            </p>
          </div>
        )}

        {/* Quick Review Options */}
        {rating >= 4 && !showReviewInput && (
          <div className="mb-6 animate-fade-in">
            <h3 className="font-tech text-foreground mb-3 text-center">
              What made it great?
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {quickReviews.map((quickReview, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => setReview(quickReview)}
                  className={`text-sm h-auto py-2 px-3 ${
                    review === quickReview
                      ? 'border-neon-green text-neon-green bg-neon-green/10'
                      : 'border-border hover:border-electric-blue/50'
                  }`}
                >
                  {quickReview}
                </Button>
              ))}
            </div>
            
            <Button
              variant="ghost"
              onClick={() => setShowReviewInput(true)}
              className="w-full mt-3 text-muted-foreground hover:text-foreground"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Write custom review
            </Button>
          </div>
        )}

        {/* Custom Review Input */}
        {showReviewInput && (
          <div className="mb-6 animate-fade-in">
            <label className="block font-tech text-foreground mb-2">
              Share your experience (optional)
            </label>
            <Textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder={
                type === 'customer'
                  ? "Tell us about your service experience..."
                  : "Share your thoughts about this customer..."
              }
              className="min-h-[80px] bg-asphalt-gray/50 border-border focus:border-electric-blue"
            />
          </div>
        )}

        {/* Thumbs Up/Down for Low Ratings */}
        {rating > 0 && rating <= 2 && (
          <div className="mb-6 animate-fade-in">
            <h3 className="font-tech text-foreground mb-3 text-center">
              Help us improve
            </h3>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-emergency-red/30 text-emergency-red hover:bg-emergency-red/10"
              >
                <ThumbsDown className="w-4 h-4 mr-2" />
                Report Issue
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-electric-blue/30 text-electric-blue hover:bg-electric-blue/10"
              >
                <ThumbsUp className="w-4 h-4 mr-2" />
                Give Feedback
              </Button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {rating > 0 ? (
            <Button
              onClick={handleSubmit}
              className="flex-1 emergency-cta font-guardian"
            >
              <Send className="w-4 h-4 mr-2" />
              Submit Rating
            </Button>
          ) : (
            <Button
              disabled
              className="flex-1 bg-muted text-muted-foreground cursor-not-allowed"
            >
              Select a rating
            </Button>
          )}
          
          <Button
            onClick={onSkip}
            variant="outline"
            className="border-border hover:border-muted-foreground/50"
          >
            Skip
          </Button>
        </div>

        {/* Privacy Note */}
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            Your rating helps maintain our quality standards
          </p>
        </div>
      </div>
    </div>
  );
};

export default RatingSystem;