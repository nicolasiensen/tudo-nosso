class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :confirmable

  before_validation :generate_api_token

  validates :first_name, :last_name, presence: true
  validates :api_token, presence: true, uniqueness: true

  private

  def generate_api_token
    self.api_token = SecureRandom.hex if self.api_token.blank?
  end
end
