class DocumentsController < ApplicationController
  def show
    @document = Document.find(params[:id])
  end

  def index
  end

  def new
    @document = Document.new
  end

  def create
    document = Document.new(document_params)
    document.user = current_user
    document.save
    redirect_to document
  end

  def document_params
    params.require(:document).permit(:title, :body, :closes_for_contribution_at)
  end
end
