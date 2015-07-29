var Document = React.createClass({
  getInitialState: function() {
    return {
      paragraphs: [],
      selectedParagraphIndex: null
    };
  },

  componentDidMount: function() {
    paragraphs = [];
    i = 0;
    this.props.document.body.replace(/<p>(.*?)<\/p>/g, function () {
      var shaObj = new jsSHA(arguments[1], "TEXT");
      paragraphs.push({
        body: arguments[1],
        index: i,
        hash: shaObj.getHash("SHA-256", "HEX")
      });
      i+=1;
    });
    this.setState({paragraphs: paragraphs});

    window.addEventListener("keydown", function(e){
      // ESC is pressed
      if(e.which == 27) {
        this.selectParagraph(null);
      }
    }.bind(this));

    this.getFlux().actions.loadContributions(this.props.document.id);
    this.getFlux().actions.loadParagraphUpvotes(this.props.document.id);
  },

  selectParagraph: function(index) {
    this.setState({selectedParagraphIndex: index});
  },

  componentDidUpdate: function(prevProps, prevState) {
    if(prevState.contributions.length == 0 &&
      this.state.contributions.length > 0 &&
      this.props.selectedContributionId){
        var selectedContribution = this.state.contributions.filter(function(c){
          return c.id == this.props.selectedContributionId;
        }.bind(this))[0]

        var selectedParagraph = this.state.paragraphs.filter(function(p){
          return p.hash == selectedContribution.paragraph_hash;
        })[0]

        this.selectParagraph(selectedParagraph.index)
    }
  },

  render: function() {
    paragraphNodes = this.state.paragraphs.map(function (paragraph){
      return (
        <Paragraph
          formOpen={this.state.selectedParagraphIndex == paragraph.index}
          selectParagraph={this.selectParagraph}
          selectedParagraphIndex={this.state.selectedParagraphIndex}
          selectedContributionId={this.props.selectedContributionId}
          paragraph={paragraph}
          currentUser={this.props.currentUser}
          documentId={this.props.document.id}/>
      );
    }.bind(this));

    return <div>{paragraphNodes}</div>
  },

  // Fluxxor stuff
  mixins: [Fluxxor.FluxMixin(React), Fluxxor.StoreWatchMixin("DocumentStore")],

  getStateFromFlux: function() {
    var flux = this.getFlux();
    return flux.store("DocumentStore").getState();
  },
});
