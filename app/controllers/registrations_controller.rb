class RegistrationsController < Devise::RegistrationsController
  def new
    build_resource({})

    if facebook_data = session["devise.facebook_data"]
      resource.facebook_uid = facebook_data["uid"]
      resource.email = facebook_data["info"]["email"]
      resource.first_name = facebook_data["info"]["first_name"]
      resource.last_name = facebook_data["info"]["last_name"]
      resource.remote_avatar_url = facebook_data["info"]["image"]
    end

    yield resource if block_given?
    respond_with self.resource
  end
end
