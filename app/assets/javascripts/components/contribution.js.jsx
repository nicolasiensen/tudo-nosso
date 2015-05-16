var Contribution = React.createClass({
  getInitialState: function() {
    return {
      currentUserUpvote: null,
      isJustificationVisible: false,
      isDiffVisible: false,
      bodyDiff: this.getBodyDiff()
    }
  },

  getBodyDiff: function(){
    var bodyDiff = "";
    var diff = JsDiff.diffWordsWithSpace(this.props.paragraph.body, this.props.contribution.body);
    diff.forEach(function(part){
      if(part.added){
        bodyDiff = bodyDiff.concat("<span class='green'>" + part.value + "</span>");
      } else if(part.removed){
        bodyDiff = bodyDiff.concat("<del class='red'>" + part.value + "</del>");
      } else {
        bodyDiff = bodyDiff.concat(part.value);
      }
    });

    return bodyDiff;
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

    var upvoteButtonText = currentUserUpvote == null ?
      "Concordar" : "Você concorda";
    var upvoteButtonClass = currentUserUpvote == null ?
      "button button-small mt1" : "bg-darken-4 button button-small mt1";
    var upvoteButtonLoader = this.props.contribution.id == this.state.contributionIdUpvoting ?
      "fa fa-refresh fa-spin mr1" : "fa fa-refresh fa-spin mr1 hide";

    var justificationClass = this.state.isJustificationVisible ?
       "contributionJustification mb1 h5" : "hide"
    var toggleJustificationText = this.state.isJustificationVisible ?
      "Ocultar justificativa" : "Mostrar justificativa"

    var bodyClass = this.state.isDiffVisible ? "hide" : "contributionBody";
    var diffBodyClass = this.state.isDiffVisible ? "" : "hide";

    var showBodyButtonClass = this.state.isDiffVisible ?
      "p1 inline-block no-text-decoration bg-darken-1-on-over bold gray h6" : "p1 inline-block no-text-decoration bg-darken-1-on-over bold black h6 bg-darken-1"
    var showDiffButtonClass = this.state.isDiffVisible ?
      "p1 inline-block no-text-decoration bg-darken-1-on-over bold black h6 bg-darken-1" : "p1 inline-block no-text-decoration bg-darken-1-on-over bold gray h6"

    return(
      <div className="mb2 p2 rounded bg-darken-1">
        <div className="userName flex flex-center mb1">
          <img className="circle flex-none bg-gray" width="20" height="20" />
          &nbsp;
          <div className="flex-auto h5">
            <span className="bold">
              {this.props.contribution.user.first_name}
              &nbsp;
              {this.props.contribution.user.last_name}
            </span> <span className="gray">há {moment(this.props.contribution.created_at).fromNow()}</span>
          </div>
        </div>
        <a
          onClick={this.onShowBodyClick}
          className={showBodyButtonClass}
          href="#">
          Contribuição
        </a>
        <a
          onClick={this.onShowDiffClick}
          className={showDiffButtonClass}
          href="#">
          Comparação
        </a>
        <div className="p1 bg-darken-1">
          <div className={diffBodyClass} dangerouslySetInnerHTML={{__html: this.state.bodyDiff}}></div>
          <div className={bodyClass}>{this.props.contribution.body}</div>
        </div>
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
    this.setState({isJustificationVisible: !this.state.isJustificationVisible});
    e.preventDefault();
  },

  onShowBodyClick: function(e) {
    this.setState({isDiffVisible: false});
    e.preventDefault();
  },

  onShowDiffClick: function(e) {
    this.setState({isDiffVisible: true});
    e.preventDefault();
  },

  // Fluxxor stuff
  mixins: [Fluxxor.FluxMixin(React), Fluxxor.StoreWatchMixin("DocumentStore")],

  getStateFromFlux: function() {
    var flux = this.getFlux();
    return flux.store("DocumentStore").getState();
  }
});
