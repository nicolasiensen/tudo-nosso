class DocumentsController < ApplicationController
  authorize_resource

  def show
    @document = Document.find(params[:id])
  end

  def index
  end

  def new
    @document = Document.new closes_for_contribution_at: Time.now + 5.days
    @categories = Category.order(:id)
  end

  def create
    @document = Document.new(document_params)
    @document.user = current_user
    if @document.save
      redirect_to @document
    else
      @categories = Category.order(:id)
      render :new
    end
  end

  def document_params
    params.require(:document).permit(:title, :body, :closes_for_contribution_at, :category_id)
  end
end
