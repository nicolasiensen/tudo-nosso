require 'rails_helper'

RSpec.describe Document, type: :model do
  it { should validate_presence_of(:body) }

  describe "#closed_for_contribution?" do
    it "should be true when now is greater than closes_for_contribution_at" do
      subject.closes_for_contribution_at = Time.now
      expect(subject.closed_for_contribution?).to be_truthy
    end

    it "should be false when now is lesser than closes_for_contribution_at" do
      subject.closes_for_contribution_at = Time.now + 10.days
      expect(subject.closed_for_contribution?).to be_falsey
    end
  end
end
