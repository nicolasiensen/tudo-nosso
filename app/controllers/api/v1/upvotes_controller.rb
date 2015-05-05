class Api::V1::UpvotesController < ApiController
  before_filter :authenticate

  def create
    upvote = Upvote.new upvote_params

    if upvote.save
      render json: upvote
    else
      render json: upvote.errors, status: 422
    end
  end

  def upvote_params
    params.require(:upvote).permit(:user_id, :contribution_id)
  end
end
