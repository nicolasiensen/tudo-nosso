var Contribution = React.createClass({
  getInitialState: function() {
    return {
      currentUserUpvote: null,
      isJustificationVisible: false
    }
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

    upvoteButtonText = currentUserUpvote == null ?
      "Concordar" : "Você concorda";
    upvoteButtonClass = currentUserUpvote == null ?
      "button button-small mt1" : "bg-darken-4 button button-small mt1";
    upvoteButtonLoader = this.props.contribution.id == this.state.contributionIdUpvoting ?
      "fa fa-refresh fa-spin mr1" : "fa fa-refresh fa-spin mr1 hide";

    justificationClass = this.state.isJustificationVisible ?
       "contributionJustification mb1 h5" : "hide"
    toggleJustificationText = this.state.isJustificationVisible ?
      "Ocultar justificativa" : "Mostrar justificativa"

    return(
      <div className="mb2 p2 rounded bg-darken-1">
        <div className="userName flex flex-center mb1">
          <img className="circle flex-none bg-gray" width="20" height="20" />
          &nbsp;
          <div className="flex-auto h5">
            {this.props.contribution.user.first_name} {this.props.contribution.user.last_name}
          </div>
        </div>
        <div className="contributionBody">{this.props.contribution.body}</div>
        <div>
          <a
            onClick={this.onToggleJustificationClick}
            className="h6"
            href="#">
            {toggleJustificationText}
          </a>
        </div>
        <div className={justificationClass}>
          {this.props.contribution.justification}
        </div>
        <a
          className={upvoteButtonClass}
          href="#"
          onClick={this.toggleUpvote}
          title={upvoteButtonText}>
          <i className={upvoteButtonLoader}></i>
          <span>{upvoteButtonText}</span>
          <span>
            <i className="fa fa-thumbs-o-up ml2" />
            &nbsp;
            <span title="Pessoas que concordaram">{this.props.contribution.upvotes.length}</span>
          </span>
        </a>
      </div>
    );
  },

  // Callbacks
  onToggleJustificationClick: function(e) {
    if(this.state.isJustificationVisible) {
      this.setState({isJustificationVisible: false});
    } else {
      this.setState({isJustificationVisible: true});
    }

    e.preventDefault();
  },

  // Fluxxor stuff
  mixins: [Fluxxor.FluxMixin(React), Fluxxor.StoreWatchMixin("DocumentStore")],

  getStateFromFlux: function() {
    var flux = this.getFlux();
    return flux.store("DocumentStore").getState();
  }
});
