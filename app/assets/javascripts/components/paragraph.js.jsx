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
      this.hideForm();
      this.hideList();
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

  render: function() {
    paragraphContributions = this.state.contributions.filter(function(c){
      return c.paragraph_hash == this.state.paragraphHash;
    }.bind(this));

    contributionList = paragraphContributions.map(function (c){
      return <Contribution contribution={c} currentUser={this.props.currentUser} />;
    }.bind(this));

    addContributionButtonClass = "mb1 button button-transparent blue button-small";
    listContributionsButtonClass = addContributionButtonClass;

    if(this.state.isFormOpen) {
      addContributionButtonClass += " is-active";
    } else if (this.state.isListOpen) {
      listContributionsButtonClass += " is-active";
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
            transition: ".25s"
          }}
          dangerouslySetInnerHTML={{__html: this.props.paragraph.body}}>
        </p>
        <nav
          className="inline"
          style={{visibility: (this.state.isMouseOver || this.props.formOpen || paragraphContributions.length > 0) ? 'visible' : 'hidden'}}>
          <a
            className={addContributionButtonClass}
            title="Adicionar contribuição"
            href="#"
            onClick={this.onToggleFormClick}>
            <i className="fa fa-plus"></i>
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
          className="contributionPanel p2 bg-darken-1 rounded border border-darken-2"
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

  onCloseClick: function() {
    this.hideForm();
    this.hideList();
  },

  onMouseOver: function() {
    this.setState({isMouseOver: true});
  },

  onMouseOut: function() {
    this.setState({isMouseOver: false});
  },

  // Fluxxor stuff
  mixins: [Fluxxor.FluxMixin(React), Fluxxor.StoreWatchMixin("DocumentStore")],

  getStateFromFlux: function() {
    var flux = this.getFlux();
    return flux.store("DocumentStore").getState();
  }
});
