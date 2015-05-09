var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Paragraph = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin("DocumentStore")],

  getInitialState: function() {
    return {
      paragraphHash: null,
      isMouseOver: false
    };
  },

  getStateFromFlux: function() {
    var flux = this.getFlux();
    return flux.store("DocumentStore").getState();
  },

  componentDidMount: function() {
    shaObj = new jsSHA(this.props.paragraph.body, "TEXT");
    this.setState({ paragraphHash: shaObj.getHash("SHA-256", "HEX") });
  },

  onMouseOver: function() {
    this.setState({isMouseOver: true});
  },

  onMouseOut: function() {
    this.setState({isMouseOver: false});
  },

  toggleContributionPanel: function(e) {
    if(!this.props.formOpen) {
      this.props.selectParagraph(this.props.paragraph.index);
    } else {
      this.props.selectParagraph(null);
    }

    e.preventDefault();
  },

  render: function() {
    paragraphContributions = this.state.contributions.filter(function(c){
      return c.paragraph_hash == this.state.paragraphHash;
    }.bind(this));

    contributionList = paragraphContributions.map(function (c){
      return <Contribution contribution={c} currentUser={this.props.currentUser} />;
    }.bind(this));

    return (
      <div
        className="paragraph clearfix mb1"
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}>
        <p
          className="paragraphBody mb0"
          style={{
            opacity: ((this.props.selectedParagraphIndex != null && !this.props.formOpen) && !this.state.isMouseOver) ? .3 : 1,
            transform: this.props.formOpen ? "scale(1.05)" : "scale(1)",
            transition: ".25s"
          }}
          dangerouslySetInnerHTML={{__html: this.props.paragraph.body}}>
        </p>
        <a
          className="newContributionButton mb1 button button-transparent blue button-small"
          title="Contribuições"
          href="#"
          style={{visibility: (this.state.isMouseOver || this.props.formOpen || paragraphContributions.length > 0) ? 'visible' : 'hidden'}}
          onClick={this.toggleContributionPanel}>
          <i className="fa fa-comment mr1"></i>
          <span>{paragraphContributions.length}</span>
        </a>
        <a
          className="mb1 right gray"
          title="Fechar"
          href="#"
          style={{visibility: this.props.formOpen ? 'visible' : 'hidden'}}
          onClick={this.toggleContributionPanel}>
          <i className="fa fa-close"></i>
        </a>
        <div
          className="contributionPanel p2 bg-darken-1 rounded border border-darken-2"
          style={{display: this.props.formOpen ? 'block' : 'none'}}>
          <div className="contributionList">
            {contributionList}
          </div>
          <ContributionForm
            currentUser={this.props.currentUser}
            paragraph={this.props.paragraph}
            formOpen={this.props.formOpen}
            documentId={this.props.documentId}
            paragraphHash={this.state.paragraphHash}/>
        </div>
      </div>
    );
  }
});
