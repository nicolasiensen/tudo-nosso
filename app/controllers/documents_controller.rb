class DocumentsController < ApplicationController
  def show
    @document = Document.find(params[:id])
    @user_api_token = current_user.present? ? current_user.api_token : nil
  end
end
