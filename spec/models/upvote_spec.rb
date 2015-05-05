require 'rails_helper'

RSpec.describe Upvote, type: :model do
  it { should validate_presence_of :user_id }
  it { should validate_presence_of :contribution_id }
  it { should validate_uniqueness_of(:user_id).scoped_to(:contribution_id) }
end
