require 'rails_helper'

RSpec.describe OmniauthCallbacksController, type: :controller do
  describe "GET facebook" do
    let(:facebook_data) do
      {
        "uid" => "123",
        "info" => {
          "email" => "nicolas@trashmail.com",
          "first_name" => "Nicolas",
          "last_name" => "Iensen"
        }
      }
    end

    before do
      controller.request.env["devise.mapping"] = Devise.mappings[:user]
      controller.request.env["omniauth.auth"] = facebook_data
    end

    context "when the user is not present" do
      it "should store Facebook data in the session" do
        get :facebook
        expect(session["devise.facebook_data"]).to be_eql(facebook_data)
      end

      it "should redirect to registrations/new" do
        get :facebook
        expect(response).to redirect_to(new_user_registration_path)
      end
    end

    context "when the user is present" do
      before { User.make! facebook_uid: "123" }

      it "should redirect to root" do
        get :facebook
        expect(response).to redirect_to(root_path)
      end

      it "should log the user in" do
        get :facebook
        expect(controller.user_signed_in?).to be_truthy
      end
    end
  end
end
