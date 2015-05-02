require 'rails_helper'

RSpec.feature "Upvote a contribution", type: :feature, js: true do
  before do
    @password = "12345678"
    @user = User.make! password: @password
    @paragraph = "Lorem ipsum"
    @document = Document.make! body: "<p>#{@paragraph}</p>"
    @contribution = Contribution.make!(
      document: @document,
      paragraph_hash: Digest::SHA2.hexdigest(@paragraph)
    )
  end

  context "when I'm logged in" do
    scenario "when I've never upvoted the contribution" do
    end

    scenario "when I already upvoted the contribution" do
    end
  end

  scenario "when I'm not logged in" do
    visit document_path(@document)
    page.find(".paragraph", text: @paragraph).hover
    click_link("Contribuições")
    click_link("Concordar")
    fill_in :user_email, with: @user.email
    fill_in :user_password, with: @password
    click_button "Log in"

    expect(current_path).to be_eql(document_path(@document))
  end
end
