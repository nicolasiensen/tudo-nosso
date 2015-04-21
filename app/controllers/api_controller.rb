class ApiController < ActionController::Base
  def authenticate
    authenticate_or_request_with_http_token do |token, options|
      User.where(api_token: token).any?
    end
  end

  def current_user
    User.where(api_token: current_api_token).first
  end

  def current_api_token
    /(.*)=\"(.*)\"/.match(request.headers["Authorization"])[2]
  end
end
