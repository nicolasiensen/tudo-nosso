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
    before do
      visit new_user_session_path
      fill_in :user_email, with: @user.email
      fill_in :user_password, with: @password
      click_button "Log in"
    end

    scenario "when I've never upvoted the contribution" do
      visit document_path(@document)
      page.find(".paragraph", text: @paragraph).hover
      click_link("Contribuições")
      click_link("Concordar")

      expect(current_path).to be_eql(document_path(@document))
      expect(page).to have_css("span[title='Pessoas que concordaram']", text: 1)
      expect(page).to have_css("span", text: "Você concorda")
    end

    scenario "when I already upvoted the contribution" do
      Upvote.make! user: @user, contribution: @contribution
      visit document_path(@document)
      page.find(".paragraph", text: @paragraph).hover
      click_link("Contribuições")

      expect(page).to have_css("span", text: "Você concorda")
      expect(page).to have_css("span[title='Pessoas que concordaram']", text: 1)

      click_link("Você concorda")

      expect(page).to have_css("span[title='Pessoas que concordaram']", text: 0)
      expect(page).to have_css("span", text: "Concordar")
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
