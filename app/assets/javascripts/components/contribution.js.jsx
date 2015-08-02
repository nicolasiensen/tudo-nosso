var Contribution = React.createClass({
  getInitialState: function() {
    return {
      currentUserUpvote: null,
      selectedTab: "body",
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

  componentDidMount: function() {
    if(this.props.selectedContributionId == this.props.contribution.id){
      var el = React.findDOMNode(this.refs.contribution);
      var rect = el.getBoundingClientRect();
      window.scroll(0, rect.top);
    }
  },

  handleShareOnTwitterClick: function() {
    const user = this.props.contribution.user;
    const document = this.props.document;
    const contribution = this.props.contribution;
    const shareUrl = window.location + "?contribution_id=" + contribution.id;
    const text = "Contribuição de " + user.name + " para a consulta " + document.title;
    const url = "https://twitter.com/intent/tweet?text=" + text + "&url=" + shareUrl + "&via=brecha";
    window.open(url, "", "width=600, height=300");
  },

  handleShareOnFacebookClick: function() {
    const contribution = this.props.contribution;
    const facebookAppId = this.props.facebookAppId;
    const shareUrl = window.location + "?contribution_id=" + contribution.id;
    const url = "https://www.facebook.com/dialog/share?display=popup&href=" + shareUrl + "&app_id=" + facebookAppId;
    window.open(url, "", "width=600, height=300");
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
      "button button-small mr1" : "bg-darken-4 button button-small mr1";
    var upvoteButtonLoader = this.props.contribution.id == this.state.contributionIdUpvoting ?
      "fa fa-refresh fa-spin mr1" : "fa fa-refresh fa-spin mr1 hide";

    var bodyClass = diffClass = justificationClass = "hide";
    var showBodyButtonClass = showDiffButtonClass = showJustificationButtonClass =
      "button button-transparent h6 p1 blue";

    var user = this.props.contribution.user;

    switch(this.state.selectedTab) {
      case "body":
        bodyClass = "show";
        showBodyButtonClass += " is-active";
        break;
      case "diff":
        diffClass = "show";
        showDiffButtonClass += " is-active";
        break;
      case "justification":
        justificationClass = "show";
        showJustificationButtonClass += " is-active";
        break;
      default:
        console.log("I don't know what to do with " + this.state.selectedTab);
    }

    return(
      <div className="mb2 p2 rounded bg-darken-1" ref="contribution">
        <div className="clearfix">
          <div className="sm-col sm-col-12 md-col-6 userName flex flex-center">
            <img className="circle mr1" width="30" height="30" src={user.thumb} />
            <div className="flex-auto h5">
              <span className="bold mr1">{user.name}</span>
              <span className="gray">há {moment(this.props.contribution.created_at).fromNow()}</span>
            </div>
          </div>
          <div className="tn-Contribution-menuTab sm-col sm-col-12 md-col-6 mt1">
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
            <a
              onClick={this.onShowJustificationClick}
              className={showJustificationButtonClass}
              href="#">
              Justificativa
            </a>
          </div>
        </div>
        <div className="p1 bg-darken-1 mb1">
          <div className={diffClass} dangerouslySetInnerHTML={{__html: this.state.bodyDiff}}></div>
          <div className={bodyClass}>{this.props.contribution.body}</div>
          <div className={justificationClass}>{this.props.contribution.justification}</div>
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
        <div className="right">
          <button
            className="button button-small bg-facebook-blue mr1"
            onClick={this.handleShareOnFacebookClick}
            title="Compartilhar a contribuição no Facebook">
            <i className="fa fa-facebook" />
          </button>
          <button
            className="button button-small bg-twitter-blue"
            onClick={this.handleShareOnTwitterClick}
            title="Compartilhar a contribuição no Twitter">
            <i className="fa fa-twitter" />
          </button>
        </div>
      </div>
    );
  },

  // Callbacks
  onShowBodyClick: function(e) {
    this.setState({selectedTab: "body"});
    e.preventDefault();
  },

  onShowDiffClick: function(e) {
    this.setState({selectedTab: "diff"});
    e.preventDefault();
  },

  onShowJustificationClick: function(e) {
    this.setState({selectedTab: "justification"});
    e.preventDefault();
  },

  // Fluxxor stuff
  mixins: [Fluxxor.FluxMixin(React), Fluxxor.StoreWatchMixin("DocumentStore")],

  getStateFromFlux: function() {
    var flux = this.getFlux();
    return flux.store("DocumentStore").getState();
  }
});
