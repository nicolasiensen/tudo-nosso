require 'rails_helper'

RSpec.describe ParagraphUpvote, type: :model do
  it { should validate_presence_of(:user_id) }
  it { should validate_presence_of(:document_id) }
  it { should validate_presence_of(:paragraph_hash) }
  it { should validate_uniqueness_of(:user_id).scoped_to(:paragraph_hash, :document_id) }
  it { should belong_to :user }
  it { should belong_to :document }
end
