require 'rails_helper'

RSpec.feature "ViewContributionsForAParagraphs", type: :feature, js: true  do
  let(:paragraph) { "Lorem ipsum" }
  let(:document) { Document.make! body: paragraph }

  scenario "when there is no contribution" do
    visit document_path(document)
    page.find(".paragraph", text: "Lorem ipsum").hover

    expect(page).to_not have_css("a[title='Contribuições']")
  end

  scenario "when there is more than one contribution" do
    contribution1 = Contribution.make!(
      document: document,
      paragraph_hash: Digest::SHA2.hexdigest(paragraph),
      body: "Just another contribution"
    )

    contribution2 = Contribution.make!(
      document: document,
      paragraph_hash: Digest::SHA2.hexdigest(paragraph),
      body: "Upvoted contribution"
    )

    Upvote.make! contribution: contribution2
    visit document_path(document)
    page.find(".paragraph", text: "Lorem ipsum").hover
    click_link "Contribuições"

    expect(page.body.index contribution2.body).to be <(page.body.index contribution1.body)
  end
end
