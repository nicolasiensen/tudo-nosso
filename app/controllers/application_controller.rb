class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  check_authorization unless: :devise_controller?

  after_filter :store_location
  before_action :configure_permitted_parameters, if: :devise_controller?

  def store_location
    session[:previous_url] = request.fullpath unless request.fullpath =~ /\/users/
  end

  def after_sign_in_path_for(resource)
    session[:previous_url] || root_path
  end

  rescue_from CanCan::AccessDenied do |exception|
    render nothing: true, status: :unauthorized
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.for(:sign_up) << [:first_name, :last_name, :avatar, :remote_avatar_url,
      :facebook_uid]
    devise_parameter_sanitizer.for(:account_update) << [:first_name, :last_name, :avatar]
  end
end
