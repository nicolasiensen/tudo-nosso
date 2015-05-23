class Api::V1::ParagraphUpvotesController < ApiController
  before_filter :authenticate, except: :index

  def create
    upvote = ParagraphUpvote.new(paragraph_upvote_params)
    upvote.user = current_user

    if upvote.save
      render json: upvote
    else
      render json: upvote.errors, status: 422
    end
  end

  def index
    render json: ParagraphUpvote.where(document_id: params[:document_id])
  end

  def destroy
    paragraph_upvote = ParagraphUpvote.find(params[:id])

    if paragraph_upvote.user_id == current_user.id
      ParagraphUpvote.destroy(params[:id])
      render status: 200, nothing: true
    else
      render status: 401, nothing: true
    end
  end

  def paragraph_upvote_params
    params.require(:paragraph_upvote).permit(:paragraph_hash, :document_id)
  end
end
