class OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def facebook
    auth = request.env["omniauth.auth"]
    @user = User.find_by(facebook_uid: auth["uid"])

    if @user.present?
      sign_in_and_redirect @user
      set_flash_message(:notice, :success, :kind => "Facebook") if is_navigational_format?
    else
      session["devise.facebook_data"] = auth
      redirect_to new_user_registration_url
    end
  end
end
