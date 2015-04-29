require 'rails_helper'

RSpec.describe Contribution, type: :model do
  it { should validate_presence_of :body }
  it { should validate_presence_of :justification }
  it { should validate_presence_of :user_id }
  it { should validate_presence_of :document_id }
  it { should validate_presence_of :paragraph_hash }
end
