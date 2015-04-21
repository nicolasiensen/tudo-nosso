require 'rails_helper'

RSpec.feature "ContributeToAParagraph", type: :feature do
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
    expect(page).to have_css(:p, text: "Lorem ipsum")

    page.find(:xpath, "p@text=\"Lorem ipsum\"").hover

    pending
    fail
  end

  scenario "when I'm not logged in" do
    pending
    fail
  end
end
