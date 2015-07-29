var Paragraph = React.createClass({
  getInitialState: function() {
    return {
      isMouseOver: false,
      isFormOpen: false,
      isListOpen: false
    };
  },

  componentWillUpdate: function(nextProps, nextState) {
    if(this.state.newContribution != null &&
      this.state.newContribution.paragraph_hash == this.props.paragraph.hash &&
      nextState.newContribution == null) {
      this.showList();
    }

    if(this.props.selectedParagraphIndex == this.props.paragraph.index &&
      nextProps.selectedParagraphIndex != this.props.paragraph.index) {
      this.setState({
        isFormOpen: false,
        isListOpen: false
      });
    }
  },

  showForm: function() {
    this.setState({
      isFormOpen: true,
      isListOpen: false
    });
    this.props.selectParagraph(this.props.paragraph.index);
  },

  hideForm: function() {
    this.setState({isFormOpen: false});
    this.props.selectParagraph(null);
  },

  toggleForm: function() {
    if(this.state.isFormOpen){
      this.hideForm();
    } else {
      this.showForm();
    }
  },

  showList: function() {
    this.setState({
      isListOpen: true,
      isFormOpen: false
    });
    this.props.selectParagraph(this.props.paragraph.index);
  },

  hideList: function() {
    this.setState({isListOpen: false});
    this.props.selectParagraph(null);
  },

  toggleList: function() {
    if(this.state.isListOpen) {
      this.hideList();
    } else {
      this.showList();
    }
  },

  getParagraphUpvotes: function(){
    return this.state.paragraphUpvotes.filter(function(u){
      return u.paragraph_hash == this.props.paragraph.hash;
    }.bind(this));
  },

  getCurrentUserParagraphUpvote: function(){
    if(this.props.currentUser == null){
      return null;
    } else {
      return this.getParagraphUpvotes().filter(function(u){
        return u.user_id == this.props.currentUser.id;
      }.bind(this))[0];
    }
  },

  getParagraphContributions: function(){
    return this.state.contributions.
      filter(function(c){return c.paragraph_hash == this.props.paragraph.hash;}.bind(this)).
      sort(function(p1, p2){return p2.upvotes.length - p1.upvotes.length;});
  },

  isParagraphNavVisible: function(){
    return this.state.isMouseOver ||
    this.props.formOpen ||
    this.getParagraphContributions().length > 0 ||
    this.getParagraphUpvotes().length > 0
  },

  render: function() {
    var paragraphContributions = this.getParagraphContributions();
    var contributionListButton;

    contributionList = paragraphContributions.map(function (c){
      return(
        <Contribution
          contribution={c}
          paragraph={this.props.paragraph}
          currentUser={this.props.currentUser}
          selectedContributionId={this.props.selectedContributionId}
        />
      );
    }.bind(this));

    addContributionButtonClass = "mb1 ml1 button button-transparent blue button-small";
    listContributionsButtonClass = addContributionButtonClass;

    if(this.state.isFormOpen) {
      addContributionButtonClass += " is-active";
    } else if (this.state.isListOpen) {
      listContributionsButtonClass += " is-active";
    }

    if(paragraphContributions.length > 0) {
      contributionListButton = <a
        className={listContributionsButtonClass}
        title="Contribuições"
        href="#"
        onClick={this.onToggleListClick}>
        <div className="md-show">
          <span className="mr1">Ver versões</span>
          <i className="fa fa-file-text-o" />
          &nbsp;
          <span>{paragraphContributions.length}</span>
        </div>
        <div className="md-hide">
          <i className="fa fa-file-text-o" />
          &nbsp;
          <span>{paragraphContributions.length}</span>
        </div>
      </a>
    } else {
      contributionListButton = <span
        className="mb1 ml1 gray bold inline-block">
        <div className="md-show">
          <span className="mr1">Versões</span>
          <i className="fa fa-file-text-o" />
          &nbsp;
          <span>{paragraphContributions.length}</span>
        </div>
        <div className="md-hide">
          <i className="fa fa-file-text-o" />
          &nbsp;
          <span>{paragraphContributions.length}</span>
        </div>
      </span>
    }

    var paragraphUpvoteButtonClass = "mb1 button button-small";
    var paragraphUpvoteButtonText = "Concordar com o parágrafo original";
    var paragraphUpvoteButtonTitle = "Concordar com o parágrafo original";
    if(this.getCurrentUserParagraphUpvote() != null){
      paragraphUpvoteButtonClass += " bg-darken-4";
      paragraphUpvoteButtonText = "Você concorda com o parágrafo original";
      paragraphUpvoteButtonTitle = "Você concorda com o parágrafo original";
    }

    var paragraphUpvoteLoaderClass = "hide";
    if(this.props.paragraphHashUpvoting == this.props.paragraph.hash) {
      paragraphUpvoteLoaderClass = "fa fa-refresh fa-spin mr1";
    }

    return (
      <div
        className="paragraph clearfix mb1"
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}
        style={{
          opacity: ((this.props.selectedParagraphIndex != null && !this.props.formOpen) && !this.state.isMouseOver) ? .3 : 1,
          transition: ".25s"
        }}>
        <p
          className="paragraphBody mb0"
          style={{
            transform: this.props.formOpen ? "scale(1.02)" : "scale(1)",
            marginBottom: this.props.formOpen ? "1em" : ".5em",
            transition: ".25s"
          }}
          dangerouslySetInnerHTML={{__html: this.props.paragraph.body}}>
        </p>
        <nav
          className="flex flex-center"
          style={{visibility: this.isParagraphNavVisible() ? 'visible' : 'hidden'}}>
          <a
            className={paragraphUpvoteButtonClass}
            title={paragraphUpvoteButtonTitle}
            href="#"
            onClick={this.onUpvoteParagraphClick}>
            <div className="md-show" title={paragraphUpvoteButtonText}>
              <i className={paragraphUpvoteLoaderClass} />
              <span className="mr1">{paragraphUpvoteButtonText}</span>
              <i className="fa fa-thumbs-o-up" />
              &nbsp;
              <span title="Pessoas que concordam">{this.getParagraphUpvotes().length}</span>
            </div>
            <div className="md-hide" title={paragraphUpvoteButtonText}>
              <i className={paragraphUpvoteLoaderClass} />
              <i className="fa fa-thumbs-o-up" />
              &nbsp;
              <span title="Pessoas que concordam">{this.getParagraphUpvotes().length}</span>
            </div>
          </a>
          <a
            className={addContributionButtonClass}
            title="Adicionar contribuição"
            href="#"
            onClick={this.onToggleFormClick}>
            <div className="md-show">
              <i className="fa fa-pencil"></i>
              &nbsp;
              <span>Reescrever</span>
            </div>
            <div className="md-hide">
              <i className="fa fa-pencil"></i>
            </div>
          </a>
          {contributionListButton}
          <div className="flex-auto mb1">
            <a
              className="gray right"
              title="Fechar"
              href="#"
              style={{visibility: this.props.formOpen ? 'visible' : 'hidden'}}
              onClick={this.onCloseClick}>
              <i className="fa fa-close"></i>
            </a>
          </div>
        </nav>
        <div
          className="contributionPanel"
          style={{display: this.props.formOpen ? 'block' : 'none'}}>
          <div style={{display: this.state.isFormOpen ? "none" : "block"}}>
            {contributionList}
          </div>
          <div style={{display: this.state.isFormOpen ? "block" : "none"}}>
            <ContributionForm
              currentUser={this.props.currentUser}
              paragraph={this.props.paragraph}
              isFormOpen={this.state.isFormOpen}
              documentId={this.props.documentId}
              paragraphHash={this.props.paragraph.hash}/>
          </div>
          </div>
      </div>
    );
  },

  // Callbacks
  onToggleFormClick: function(e) {
    this.toggleForm();
    e.preventDefault();
  },

  onToggleListClick: function(e) {
    this.toggleList();
    e.preventDefault();
  },

  onCloseClick: function(e) {
    this.hideForm();
    this.hideList();
    e.preventDefault();
  },

  onMouseOver: function() {
    this.setState({isMouseOver: true});
  },

  onMouseOut: function() {
    this.setState({isMouseOver: false});
  },

  onUpvoteParagraphClick: function(e) {
    var currentUserParagraphUpvote = this.getCurrentUserParagraphUpvote();

    if(this.props.currentUser == null) {
      window.location.href = "/users/sign_in";
    } else if(currentUserParagraphUpvote == null) {
      this.getFlux().actions.createParagraphUpvote(
        this.props.paragraph.hash,
        this.props.documentId,
        this.props.currentUser.api_token
      );
    } else if(currentUserParagraphUpvote != null) {
      this.getFlux().actions.deleteParagraphUpvote(
        currentUserParagraphUpvote,
        this.props.currentUser.api_token
      );
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
