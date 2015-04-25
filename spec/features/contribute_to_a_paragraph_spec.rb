require 'rails_helper'

RSpec.feature "ContributeToAParagraph", type: :feature, js: true do
  let(:document) { Document.make! body: "<p>Lorem ipsum</p>" }
  let(:password) { "12345678" }

  before do
    @user = User.make! email: "contributor@trashmail.com", password: password
  end

  scenario "when I'm logged in" do
    visit new_user_session_path
    fill_in :user_email, with: @user.email
    fill_in :user_password, with: password
    click_button "Log in"

    visit document_path(document)
    expect(page).to have_css(".paragraph", text: "Lorem ipsum")

    page.find(".paragraph", text: "Lorem ipsum").hover
    expect(page).to have_css(".newContributionButton", visible: true)

    click_link("Contribuições")
    expect(page).to have_css(".newContributionForm", visible: true)

    fill_in("contribution[body]", with: "Lorem ipsum dolor sit amet")
    fill_in("contribution[justification]", with: "It is very important to mention: dolor sit amet")
    click_button("Enviar")

    expect(page).to have_css("#contribution_body", text: nil)
    expect(page).to have_css("#contribution_justification", text: nil)
    expect(page).to have_css(".contribution .contributionBody", text: "Lorem ipsum dolor sit amet")
    expect(page).to have_css(".contribution .contributionJustification", text: "It is very important to mention: dolor sit amet")
    expect(page).to have_css(".contribution .userName", text: @user.first_name)
  end

  scenario "when I'm not logged in" do
    visit document_path(document)
    page.find(".paragraph", text: "Lorem ipsum").hover
    click_link("Contribuições")
    click_link("Sugira uma alteração para este parágrafo")

    expect(current_path).to be_eql(new_user_session_path)

    fill_in :user_email, with: @user.email
    fill_in :user_password, with: password
    click_button "Log in"

    expect(current_path).to be_eql(document_path(document))
  end
end
