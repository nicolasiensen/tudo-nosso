class Contribution < ActiveRecord::Base
  belongs_to :user
  belongs_to :document
  has_many :upvotes
  validates :body, :justification, :user_id, :document_id, :paragraph_hash, presence: true

  def as_json(options)
    options.merge!(
      include: {
        user: {
          except: [:api_token, :email],
          methods: [:name, :thumb]
        },
        upvotes: {}
      }
    )
    super(options)
  end
end
