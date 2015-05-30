require 'rails_helper'

RSpec.feature "SignUp", type: :feature do
  scenario "when the form is valid" do
    visit new_user_registration_path
    fill_in "user[first_name]", with: "Nícolas"
    fill_in "user[last_name]", with: "Iensen"
    fill_in "user[email]", with: "nicolas@trashmail.com"
    fill_in "user[password]", with: "12345678"
    fill_in "user[password_confirmation]", with: "12345678"
    click_button "Criar conta"

    expect(current_path).to be_eql(root_path)
    expect(page).to have_css("#current-user img[title='Nícolas Iensen']")
  end

  scenario "when the form is invalid" do
    visit new_user_registration_path
    click_button "Criar conta"

    expect(page).to have_css("#user_first_name.is-error")
    expect(page).to have_css("#user_last_name.is-error")
    expect(page).to have_css("#user_email.is-error")
    expect(page).to have_css("#user_password.is-error")
  end
end
