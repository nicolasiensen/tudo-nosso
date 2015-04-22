require 'rails_helper'

RSpec.feature "ContributeToAParagraph", type: :feature, js: true do
  scenario "when I'm logged in" do
    email = "contributor@trashmail.com"
    password = "12345678"
    user = User.make! email: email, password: password

    visit new_user_session_path
    fill_in :user_email, with: email
    fill_in :user_password, with: password
    click_button "Log in"

    body = "<p>Lorem ipsum</p>"
    document = Document.make! body: body

    visit document_path(document)
    expect(page).to have_css(".paragraph", text: "Lorem ipsum")

    page.find(".paragraph", text: "Lorem ipsum").hover
    expect(page).to have_css(".newContributionButton", visible: true)

    click_link("Nova contribuição")
    expect(page).to have_css(".newContributionForm", visible: true)

    fill_in("contribution[body]", with: "Lorem ipsum dolor sit amet")
    fill_in("contribution[justification]", with: "It is very important to mention: dolor sit amet")
    click_button("Enviar")

    expect(page).to have_css("#contribution_body", text: nil)
    expect(page).to have_css("#contribution_justification", text: nil)
    expect(page).to have_css(".contribution .contributionBody", text: "Lorem ipsum dolor sit amet")
    expect(page).to have_css(".contribution .contributionJustification", text: "It is very important to mention: dolor sit amet")
    expect(page).to have_css(".contribution .userName", text: user.first_name)

    pending
    fail
  end

  scenario "when I'm not logged in" do
    pending
    fail
  end
end
