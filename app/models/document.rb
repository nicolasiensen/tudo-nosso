class Document < ActiveRecord::Base
  validates :body, presence: true
  belongs_to :user
  has_many :contributions

  def closed_for_contribution?
    Time.now >= self.closes_for_contribution_at
  end
end
