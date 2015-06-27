class DocumentsController < ApplicationController
  authorize_resource

  def show
    @document = Document.find(params[:id])
  end

  def index
  end

  def new
    @document = Document.new closes_for_contribution_at: Time.now + 5.days
  end

  def create
    @document = Document.new(document_params)
    @document.user = current_user
    if @document.save
      redirect_to @document
    else
      render :new
    end
  end

  def document_params
    params.require(:document).permit(:title, :body, :closes_for_contribution_at)
  end
end
