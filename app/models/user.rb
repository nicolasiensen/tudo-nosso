class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :confirmable

  before_validation :generate_api_token

  validates :first_name, :last_name, presence: true
  validates :api_token, presence: true, uniqueness: true

  mount_uploader :avatar, AvatarUploader

  def name
    [self.first_name, self.last_name].join(" ")
  end

  def as_json(options)
    options.merge!(methods: [:name])
    super(options)
  end

  protected

  def confirmation_required?
    false
  end

  private

  def generate_api_token
    self.api_token = SecureRandom.hex if self.api_token.blank?
  end
end
