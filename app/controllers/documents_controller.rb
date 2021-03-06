class DocumentsController < ApplicationController
  load_and_authorize_resource

  def show
    @document = Document.find(params[:id])
    @contribution = Contribution.find_by id: params[:contribution_id]
  end

  def index
    @documents = Document.
      where("closes_for_contribution_at > ?", Time.now).
      order(:closes_for_contribution_at)
  end

  def new
    @document = Document.new closes_for_contribution_at: Date.today + 7.days
    @categories = Category.order(:name)
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

  def edit
    @document = Document.find(params[:id])
    @categories = Category.order(:id)
  end

  def update
    @document = Document.find(params[:id])
    if @document.update_attributes(document_params)
      redirect_to @document
    else
      @categories = Category.order(:id)
      render :edit
    end
  end

  def document_params
    params.require(:document).permit(:title, :body, :closes_for_contribution_at, :category_id, :scope, :city,
    :state)
  end
end
