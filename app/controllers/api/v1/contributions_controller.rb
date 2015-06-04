class Api::V1::ContributionsController < ApiController
  before_filter :authenticate, except: :index

  def create
    contribution = Contribution.new(contribution_params)
    contribution.user_id = current_user.id

    if contribution.save
      render json: contribution
    else
      render json: contribution.errors, status: 422
    end
  end

  def index
    render json: Contribution.where(document_id: params[:document_id])
  end

  def contribution_params
    params.require(:contribution).permit(:body, :justification, :document_id, :paragraph_hash)
  end
end
