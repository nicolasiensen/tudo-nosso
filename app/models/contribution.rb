class Contribution < ActiveRecord::Base
  belongs_to :user
  validates :body, :user_id, :document_id, :paragraph_hash, presence: true

  def to_json options={}
    super(include: { user: {except: [:api_token, :email]}})
  end
end
