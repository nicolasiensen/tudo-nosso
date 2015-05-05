require 'rails_helper'

RSpec.describe Api::V1::UpvotesController, type: :controller do
  describe "POST create" do
    it "should return a 401 status when there is no authentication token" do
      post :create, upvote_params
      expect(response.status).to be_eql(401)
    end

    context "when the authentication token is valid" do
      let(:user) { User.make! }

      before do
        request.env['HTTP_AUTHORIZATION'] = ActionController::HttpAuthentication::Token.
          encode_credentials(user.api_token)
      end

      it "should return the new upvote when params are valid" do
        post :create, upvote_params
        json = JSON.parse(response.body)

        expect(json["user_id"]).to be_eql(1)
        expect(json["contribution_id"]).to be_eql(1)
      end

      it "should return 422 status when params are invalid" do
        Upvote.create contribution_id: 1, user_id: user.id
        post :create, upvote_params
        expect(response.status).to be_eql(422)
      end
    end
  end

  let(:upvote_params) { {upvote: { contribution_id: 1 }} }
end
