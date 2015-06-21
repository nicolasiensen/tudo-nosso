class User < ActiveRecord::Base
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :trackable, :validatable,
    :confirmable, :omniauthable, :omniauth_providers => [:facebook]

  include CloudinaryHelper

  has_many :documents

  before_validation :generate_api_token
  after_create { self.delay.send_confirmation_instructions }

  validates :first_name, :last_name, presence: true
  validates :api_token, presence: true, uniqueness: true

  mount_uploader :avatar, AvatarUploader

  def name
    [self.first_name, self.last_name].join(" ")
  end

  def as_json(options)
    options.merge!(methods: [:name, :thumb])
    super(options)
  end

  def thumb
    if self.avatar.present?
      cloudinary_url(
        self.avatar.file.filename,
        width: 100,
        height: 100,
        crop: :thumb,
        gravity: :face
      )
    else
      AvatarUploader.new.default_url
    end
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
