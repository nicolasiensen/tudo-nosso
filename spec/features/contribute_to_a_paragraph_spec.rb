require 'rails_helper'

RSpec.feature "ContributeToAParagraph", type: :feature, js: true do
  let(:document) { Document.make! body: "<p>Lorem ipsum</p>" }
  let(:password) { "12345678" }

  before do
    @user = User.make! email: "contributor@trashmail.com", password: password
  end

  context "when I'm logged in" do
    before do
      visit new_user_session_path
      fill_in :user_email, with: @user.email
      fill_in :user_password, with: password
      click_button "Entrar"
      visit document_path(document)
      page.find(".paragraph", text: "Lorem ipsum").hover
      click_link("Adicionar contribuição")
    end

    scenario "when the form is valid" do
      fill_in("contribution[body]", with: "Lorem ipsum dolor sit amet")
      fill_in("contribution[justification]", with: "My justification")
      click_button("Enviar")

      expect(page).to have_css(".p1.bg-darken-1", text: "Lorem ipsum dolor sit amet")
      expect(page).to have_css(".userName", text: @user.first_name)

      click_link("Justificativa")

      expect(page).to have_css(".p1.bg-darken-1", text: "My justification")
    end

    scenario "when the form is not valid" do
      click_button("Enviar")
      expect(page).to have_css("textarea[name=\"contribution[justification]\"].is-error")
    end
  end

  scenario "when I'm not logged in" do
    visit document_path(document)
    page.find(".paragraph", text: "Lorem ipsum").hover
    click_link("Adicionar contribuição")
    click_link("Registre-se ou faça login para colaborar com esse edital")
    fill_in :user_email, with: @user.email
    fill_in :user_password, with: password
    click_button "Entrar"

    expect(current_path).to be_eql(document_path(document))
  end
end
