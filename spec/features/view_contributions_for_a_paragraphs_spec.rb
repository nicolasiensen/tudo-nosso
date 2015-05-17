require 'rails_helper'

RSpec.feature "ViewContributionsForAParagraphs", type: :feature, js: true  do
  let(:document) { Document.make! body: "<p>Lorem ipsum</p>" }

  scenario "when there is no contribution" do
    visit document_path(document)
    page.find(".paragraph", text: "Lorem ipsum").hover

    expect(page).to have_css("a[title='Contribuições'].hide")
  end
end
