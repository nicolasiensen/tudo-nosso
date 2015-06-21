require 'rails_helper'

RSpec.feature "CreateADocument", type: :feature do
  context "when there is a logged in user" do
    let(:user) { User.make! }
    before { login_as user }

    it "should create a new document when the form is valid" do
      visit new_document_path
      fill_in "document_title", with: "My Document"
      fill_in "document_body", with: "My body"
      fill_in "document_closes_for_contribution_at", with: 1.month.from_now.to_s
      click_button "Criar documento"

      expect(current_path).to be_eql(document_path(Document.last))
    end
  end
end
