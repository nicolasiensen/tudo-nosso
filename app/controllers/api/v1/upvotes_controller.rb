class Api::V1::UpvotesController < ApiController
  before_filter :authenticate

  def create
    upvote = Upvote.new upvote_params
    upvote.user = current_user

    if upvote.save
      render json: upvote
    else
      render json: upvote.errors, status: 422
    end
  end

  def destroy
    Upvote.destroy(params[:id])
    render nothing: true, status: 200
  end

  def upvote_params
    params.require(:upvote).permit(:contribution_id)
  end
end
