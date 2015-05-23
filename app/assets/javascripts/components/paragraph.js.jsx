var Paragraph = React.createClass({
  getInitialState: function() {
    shaObj = new jsSHA(this.props.paragraph.body, "TEXT");

    return {
      paragraphHash: shaObj.getHash("SHA-256", "HEX"),
      isMouseOver: false,
      isFormOpen: false,
      isListOpen: false
    };
  },

  componentWillUpdate: function(nextProps, nextState) {
    if(this.state.newContribution != null &&
      this.state.newContribution.paragraph_hash == this.state.paragraphHash &&
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
      return u.paragraph_hash == this.state.paragraphHash;
    }.bind(this));
  },

  getCurrentUserParagraphUpvote: function(){
    return this.getParagraphUpvotes().filter(function(u){
      return u.user_id == this.props.currentUser.id;
    }.bind(this))[0];
  },

  getParagraphContributions: function(){
    return this.state.contributions.
      filter(function(c){return c.paragraph_hash == this.state.paragraphHash;}.bind(this)).
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

    contributionList = paragraphContributions.map(function (c){
      return <Contribution contribution={c} paragraph={this.props.paragraph} currentUser={this.props.currentUser} />;
    }.bind(this));

    addContributionButtonClass = "mb1 button button-transparent blue button-small";
    listContributionsButtonClass = addContributionButtonClass;

    if(paragraphContributions.length == 0) {
      listContributionsButtonClass += " hide";
    }

    if(this.state.isFormOpen) {
      addContributionButtonClass += " is-active";
    } else if (this.state.isListOpen) {
      listContributionsButtonClass += " is-active";
    }

    var paragraphUpvoteButtonClass = "mb1 mr1 button button-small";
    var paragraphUpvoteButtonText = "Concordar com paragrafo";
    var paragraphUpvoteButtonTitle = "Concordar com o paragrafo";
    if(this.getCurrentUserParagraphUpvote() != null){
      paragraphUpvoteButtonClass += " bg-darken-4";
      paragraphUpvoteButtonText = "Você concorda";
      paragraphUpvoteButtonTitle = "Você concorda com o paragrafo";
    }

    var paragraphUpvoteLoaderClass = "hide";
    if(this.state.paragraphHashUpvoting == this.state.paragraphHash) {
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
          className="inline"
          style={{visibility: this.isParagraphNavVisible() ? 'visible' : 'hidden'}}>
          <a
            className={paragraphUpvoteButtonClass}
            title={paragraphUpvoteButtonTitle}
            href="#"
            onClick={this.onUpvoteParagraphClick}>
            <i className={paragraphUpvoteLoaderClass} />
            {paragraphUpvoteButtonText}
            <i className="fa fa-thumbs-o-up ml2" />
            &nbsp;
            <span title="Pessoas que concordam">{this.getParagraphUpvotes().length}</span>
          </a>
          <a
            className={addContributionButtonClass}
            title="Adicionar contribuição"
            href="#"
            onClick={this.onToggleFormClick}>
            <i className="fa fa-plus"></i> Contribuir
          </a>
          <a
            className={listContributionsButtonClass}
            title="Contribuições"
            href="#"
            onClick={this.onToggleListClick}>
            <i className="fa fa-comment" />
            &nbsp;
            <span>{paragraphContributions.length}</span>
          </a>
          <a
            className="mb1 right gray"
            title="Fechar"
            href="#"
            style={{visibility: this.props.formOpen ? 'visible' : 'hidden'}}
            onClick={this.onCloseClick}>
            <i className="fa fa-close"></i>
          </a>
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
              paragraphHash={this.state.paragraphHash}/>
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
        this.state.paragraphHash,
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
