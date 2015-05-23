class ParagraphUpvote < ActiveRecord::Base
  validates :user_id, uniqueness: { scope: [:paragraph_hash, :document_id] }
  validates :user_id, :paragraph_hash, :document_id, presence: true

  belongs_to :user
  belongs_to :document
end
