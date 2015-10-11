require 'rails_helper'

RSpec.feature "CreateADocument", type: :feature do
  context "when there is a logged in user" do
    let(:user) { User.make! }
    before { login_as user }
    before {@category = Category.make!}

    scenario "when the form is valid" do
      visit new_document_path
      fill_in "document_title", with: "My Document"
      select @category.name, from: "document_category_id"
      fill_in "document_body", with: "My body"
      select "Estadual", from: "document_scope"
      select "Rio de Janeiro", from: "document_state"
      fill_in "document_closes_for_contribution_at", with: 1.month.from_now.to_s
      click_button "Criar consulta popular"

      expect(current_path).to be_eql(document_path(Document.last))
    end

    scenario "when the form is not valid" do
      visit new_document_path
      click_button "Criar consulta popular"

      expect(page).to have_css("#document_title.is-error")
      expect(page).to have_css("#document_body.is-error")
    end
  end
end
