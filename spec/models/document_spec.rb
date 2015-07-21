require 'rails_helper'

RSpec.describe Document, type: :model do
  it { should validate_presence_of(:body) }
  it { should validate_presence_of(:title) }
  it { should validate_presence_of(:closes_for_contribution_at) }
  it { should validate_presence_of(:category_id) }
  it { should validate_presence_of(:scope) }

  it "should validate presence of city and state when the scope is 'Municipal'" do
    subject.scope = "Municipal"
    subject.save
    expect(subject.errors[:city].length).to be_eql(1)
    expect(subject.errors[:state].length).to be_eql(1)
  end

  it "should validate presence of state when the scope is 'Estadual'" do
    subject.scope = "Estadual"
    subject.save
    expect(subject.errors[:state].length).to be_eql(1)
  end

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
