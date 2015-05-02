require 'rails_helper'

RSpec.describe Api::V1::ContributionsController, type: :controller do
  describe "POST create" do
    it "should return a 401 status when there is no authentication token" do
      post :create, valid_contribution_params
      expect(response.status).to be_eql(401)
    end

    context "when the authentication token is valid" do
      let(:user) { User.make! }

      before do
        request.env['HTTP_AUTHORIZATION'] = ActionController::HttpAuthentication::Token.encode_credentials(user.api_token)
      end

      it "should return a new contribution when the params are valid" do
        post :create, valid_contribution_params

        json = JSON.parse(response.body)

        expect(json["body"]).to be_eql("My contribution")
        expect(json["justification"]).to be_eql("My justification")
        expect(json["user_id"]).to be_eql(user.id)
        expect(json["document_id"]).to be_eql(1)
        expect(json["paragraph_hash"]).to be_eql("123")
      end

      it "should return an error when the params are not valid" do
        post :create, invalid_contribution_params
        expect(response.status).to be_eql(422)
      end
    end
  end

  describe "GET index" do
    let(:contribution) { Contribution.make! }

    it "should return contribution for the given document id" do
      get :index, document_id: contribution.document.id
      contribution_ids = JSON.parse(response.body).map {|c| c["id"]}

      expect(contribution_ids).to include(contribution.id)
    end

    it "should not return contributions for other documents" do
      other_contribution = Contribution.make!
      get :index, document_id: contribution.document.id
      contribution_ids = JSON.parse(response.body).map {|c| c["id"]}
      
      expect(contribution_ids).to_not include(other_contribution.id)
    end
  end

  let(:valid_contribution_params) {
    {
      contribution: {
        body: "My contribution",
        justification: "My justification",
        document_id: 1,
        paragraph_hash: "123"
      }
    }
  }

  let(:invalid_contribution_params) {
    {
      contribution: {
        body: "My contribution"
      }
    }
  }
end
