class DocumentsController < ApplicationController
  def show
    @document = Document.find(params[:id])
  end

  def index
  end
end
