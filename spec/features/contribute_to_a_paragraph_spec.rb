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

    pending
    fail
  end

  scenario "when I'm not logged in" do
    pending
    fail
  end
end
