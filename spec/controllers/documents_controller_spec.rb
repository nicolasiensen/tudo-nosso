require 'rails_helper'

RSpec.describe DocumentsController, type: :controller do
  describe "GET show" do
    let(:document) { Document.make! }

    it "should assign the right document" do
      get :show, id: document.id
      expect(assigns(:document)).to be_eql(document)
    end
  end

  describe "GET new" do
    it "should declare a new document" do
      get :new
      expect(assigns(:document)).to be_a(Document)
    end
  end

  describe "POST create" do
    context "when there is a logged in user" do
      let(:user) { User.make! }
      before { sign_in user }

      it "should set the current user as the new document owner" do
        post :create, valid_document_params
        expect(user.documents.where(title: "My Document")).to_not be_empty
      end

      it "should redirect to the document page" do
        post :create, valid_document_params
        expect(response).to redirect_to(document_path(Document.last))
      end

      it "should render the form when the form is invalid" do
        post :create, invalid_document_params
        expect(response).to render_template(:new)
      end
    end
  end

  let(:valid_document_params) {
    {
      document: {
        title: "My Document",
        body: "Document body",
        closes_for_contribution_at: 1.month.from_now
      }
    }
  }

  let(:invalid_document_params) {
    {
      document: {
        title: nil,
        body: nil,
        closes_for_contribution_at: nil
      }
    }
  }
end
