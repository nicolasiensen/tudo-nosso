require 'rails_helper'

RSpec.feature "EditADocument", type: :feature do
  let(:user) { User.make! }
  before { login_as user }

  context "when the user is the owner of the document" do
    before do
      @document = Document.make! user: user
      visit document_path(@document)
      click_link "Editar documento"
    end

    scenario "when the form is valid" do
      fill_in "document_title", with: "My Edited Document"
      click_button "Atualizar documento"

      expect(current_path).to be_eql(document_path(@document))
      expect(page).to have_css(:h1, "My Edited Document")
    end

    scenario "when the form is not valid" do
      fill_in "document_title", with: nil
      click_button "Atualizar documento"

      expect(page).to have_css("#document_title.is-error")
    end
  end

  scenario "when the user is not the owner of the document" do
    @document = Document.make!
    visit document_path(@document)

    expect(page).to_not have_link("Editar documento")
  end
end
