class Contribution < ActiveRecord::Base
  validates :body, :user_id, :document_id, :paragraph_hash, presence: true
end
