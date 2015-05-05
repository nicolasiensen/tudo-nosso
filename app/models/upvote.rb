class Upvote < ActiveRecord::Base
  belongs_to :user
  belongs_to :contribution
  validates :user_id, :contribution_id, presence: true
  validates :user_id, uniqueness: { scope: :contribution_id }
end
