require 'rails_helper'

RSpec.feature "ViewDocumentPage", type: :feature do
  scenario "when there is a document" do
    document = Document.make!
    visit document_path(document)

    expect(page).to have_css(:h1, document.title)
    expect(page).to have_content(document.user.name)
    expect(page).to have_content("10 dias para finalizar")
    expect(page).to have_content("Nenhuma contribuição")
  end

  scenario "when the document is closed for contribution" do
    document = Document.make! closes_for_contribution_at: Time.now
    visit document_path(document)
    expect(page).to have_content("Contribuições encerradas")
  end

  scenario "when the document have contribuitions" do
    document = Document.make!
    5.times { Contribution.make! document: document }
    visit document_path(document)
    expect(page).to have_content("5 contribuições")
  end

  scenario "when the document have paragraph upvotes" do
    document = Document.make!
    5.times { ParagraphUpvote.make! document: document }
    visit document_path(document)
    expect(page).to have_content("5 concordos")
  end
end
