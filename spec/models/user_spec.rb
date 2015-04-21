require 'rails_helper'

RSpec.describe User, type: :model do
  it { should validate_presence_of :api_token }
  it { should validate_presence_of :first_name }
  it { should validate_presence_of :last_name }
  it { should validate_presence_of :email }
  it { should validate_uniqueness_of :api_token }
  it { should validate_uniqueness_of :email }
end
