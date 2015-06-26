require 'rails_helper'

RSpec.feature "UpvoteAParagraph", type: :feature, js: true do
  before do
    @paragraph = "Lorem ipsum"
    @paragraph_hash = Digest::SHA2.hexdigest(@paragraph)
    @document = Document.make! body: @paragraph
    @password = "12345678"
    @user = User.make! password: @password
  end

  scenario "when I'm not logged in" do
    visit document_path(@document)
    page.find(".paragraph", text: @paragraph).hover
    click_link "Concordar com o parágrafo original"
    fill_in :user_email, with: @user.email
    fill_in :user_password, with: @password
    click_button "Entrar"

    expect(current_path).to be_eql(document_path(@document))
  end

  context "when I'm logged in" do
    before do
      visit new_user_session_path
      fill_in :user_email, with: @user.email
      fill_in :user_password, with: @password
      click_button "Entrar"
    end

    scenario "when I've never upvoted the paragraph" do
      visit document_path(@document)
      page.find(".paragraph", text: @paragraph).hover
      click_link "Concordar com o parágrafo original"

      expect(current_path).to be_eql(document_path(@document))
      expect(page).to have_css("span[title='Pessoas que concordam']", text: 1)
      expect(page).to have_css("div[title='Você concorda com o parágrafo original']")
    end

    scenario "when I already upvoted the paragraph" do
      ParagraphUpvote.make! document: @document, user: @user, paragraph_hash: @paragraph_hash

      visit document_path(@document)
      page.find(".paragraph", text: @paragraph).hover
      click_link "Você concorda com o parágrafo original"

      expect(current_path).to be_eql(document_path(@document))
      expect(page).to have_css("span[title='Pessoas que concordam']", text: 0)
      expect(page).to have_css("a[title='Concordar com o parágrafo original']")
    end
  end
end
