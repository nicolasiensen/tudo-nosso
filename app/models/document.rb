class Document < ActiveRecord::Base
  validates :body, :title, :closes_for_contribution_at, :category_id, presence: true
  belongs_to :user
  belongs_to :category
  has_many :contributions
  has_many :paragraph_upvotes

  def closed_for_contribution?
    Time.now >= self.closes_for_contribution_at
  end
end
