require 'rails_helper'

RSpec.describe Api::V1::ParagraphUpvotesController, type: :controller do
  describe "POST create" do
    it "should return a 401 status when there is no authentication token" do
      post :create
      expect(response.status).to be_eql(401)
    end

    context "when the authentication token is valid" do
      before do
        request.env['HTTP_AUTHORIZATION'] = ActionController::HttpAuthentication::Token.
          encode_credentials(user.api_token)
      end

      it "should return the new paragraph upvote when params are valid" do
        post :create, paragraph_upvote_params
        json = JSON.parse(response.body)

        expect(json["user_id"]).to be_eql(user.id)
        expect(json["paragraph_hash"]).to be_eql("123")
      end

      it "should return 422 status when params are invalid" do
        ParagraphUpvote.create paragraph_hash: "123", user_id: user.id, document_id: 1
        post :create, paragraph_upvote_params
        expect(response.status).to be_eql(422)
      end
    end
  end

  describe "GET index" do
    let(:paragraph_upvote) { ParagraphUpvote.make! }

    it "should return paragraph upvotes for the given document id" do
      get :index, document_id: paragraph_upvote.document.id
      paragraph_upvote_ids = JSON.parse(response.body).map {|u| u["id"]}

      expect(paragraph_upvote_ids).to include(paragraph_upvote.id)
    end

    it "should not return paragraph upvotes for other documents" do
      other_paragraph_upvote = ParagraphUpvote.make!
      get :index, document_id: paragraph_upvote.document.id
      paragraph_upvote_ids = JSON.parse(response.body).map {|u| u["id"]}

      expect(paragraph_upvote_ids).to_not include(other_paragraph_upvote.id)
    end
  end

  describe "DELETE destroy" do
    before { @paragraph_upvote = ParagraphUpvote.make! user: user }

    it "should return a 401 status when there is no authentication token" do
      delete :destroy, id: @paragraph_upvote.id
      expect(response.status).to be_eql(401)
    end

    context "when there is a valid authentication token" do
      before do
        request.env['HTTP_AUTHORIZATION'] = ActionController::HttpAuthentication::Token.
          encode_credentials(user.api_token)
      end

      it "should delete the paragraph upvote" do
        expect {
          delete :destroy, id: @paragraph_upvote.id
        }.to change{ParagraphUpvote.count}.by(-1)
      end

      it "should return a 401 status when the user destroy a paragraph upvote of somebody else" do
        other_paragraph_upvote = ParagraphUpvote.make!
        delete :destroy, id: other_paragraph_upvote.id
        expect(response.status).to be_eql(401)
      end
    end
  end

  let(:user) { User.make! }
  let(:paragraph_upvote_params) do
    {
      paragraph_upvote: {
        paragraph_hash: "123",
        document_id: 1
      }
    }
  end
end
