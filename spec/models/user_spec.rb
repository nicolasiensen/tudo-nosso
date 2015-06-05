require 'rails_helper'

RSpec.describe User, type: :model do
  before { User.make! }
  it { should validate_presence_of :first_name }
  it { should validate_presence_of :last_name }
  it { should validate_presence_of :email }
  it { should validate_uniqueness_of :api_token }
  it { should validate_uniqueness_of :email }

  describe "#name" do
    it "should be the first and last names" do
      subject.first_name = "Nicolas"
      subject.last_name = "Iensen"
      expect(subject.name).to be_eql("Nicolas Iensen")
    end
  end
end
