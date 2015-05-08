var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Contribution = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin("DocumentStore")],

  getStateFromFlux: function() {
    var flux = this.getFlux();
    return flux.store("DocumentStore").getState();
  },

  getInitialState: function() {
    return {currentUserUpvote: null}
  },

  toggleUpvote: function(e){
    e.preventDefault();

    // TODO: wrap it in a method
    currentUserUpvote = null
    if(this.props.currentUser) {
      currentUserUpvote = this.props.contribution.upvotes.filter(function(u){
        return u.user_id == this.props.currentUser.id;
      }.bind(this))[0];
    }

    if(this.props.currentUser && currentUserUpvote == null) {
      this.getFlux().actions.createUpvote(this.props.contribution.id, this.props.currentUser.api_token);
    } else if(this.props.currentUser && currentUserUpvote != null) {
      this.getFlux().actions.deleteUpvote(currentUserUpvote, this.props.currentUser.api_token);
    } else {
      window.location = "/users/sign_in";
    }
  },

  render: function(){
    currentUserUpvote = null
    if(this.props.currentUser) {
      currentUserUpvote = this.props.contribution.upvotes.filter(function(u){
        return u.user_id == this.props.currentUser.id;
      }.bind(this))[0];
    }

    upvoteButtonText = currentUserUpvote == null ? "Concordar" : "Você concorda";
    upvoteButtonClass = currentUserUpvote == null ?
      "button button-small mb1" : "bg-darken-4 button button-small mb1";

    return(
      <div className="mb2 border-bottom">
        <div className="userName">
          {this.props.contribution.user.first_name} {this.props.contribution.user.last_name}
        </div>
        <div className="contributionBody">{this.props.contribution.body}</div>
        <div className="contributionJustification">{this.props.contribution.justification}</div>
        <a
          className={upvoteButtonClass}
          href="#"
          onClick={this.toggleUpvote}
          title={upvoteButtonText}>
          <span>{upvoteButtonText}</span>
          <span className="px1">
            <i className="fa fa-thumbs-o-up mr1" />
            <span title="Pessoas que concordaram">{this.props.contribution.upvotes.length}</span>
          </span>
        </a>
      </div>
    );
  }
});
