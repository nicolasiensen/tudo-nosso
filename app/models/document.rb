class Document < ActiveRecord::Base
  validates :body, :title, :closes_for_contribution_at, :category_id, :scope, presence: true
  validates :city, :state, presence: true, if: :city_scope?
  validates :state, presence: true, if: :state_scope?
  belongs_to :user
  belongs_to :category
  has_many :contributions
  has_many :paragraph_upvotes

  def closed_for_contribution?
    Time.now >= self.closes_for_contribution_at
  end

  def city_scope?
    self.scope == "Municipal"
  end

  def state_scope?
    self.scope == "Estadual"
  end

  def scope_and_location
    if self.scope == "Federal"
      "Federal"
    else
      "#{self.scope} - #{self.city.present? ? self.city : self.state}"
    end
  end
end
