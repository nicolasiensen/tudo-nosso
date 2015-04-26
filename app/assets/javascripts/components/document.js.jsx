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
    this.props.body.replace(/<p>(.*?)<\/p>/g, function () {
      paragraphs.push({body: arguments[1], index: i});
      i+=1;
    });
    this.setState({paragraphs: paragraphs});

    window.addEventListener("keydown", function(e){
      // ESC is pressed
      if(e.which == 27) {
        this.selectParagraph(null);
      }
    }.bind(this));
  },

  selectParagraph: function(index) {
    this.setState({selectedParagraphIndex: index});
  },

  render: function() {
    paragraphNodes = this.state.paragraphs.map(function (paragraph){
      return (
        <Paragraph
          formOpen={this.state.selectedParagraphIndex == paragraph.index}
          selectParagraph={this.selectParagraph}
          selectedParagraphIndex={this.state.selectedParagraphIndex}
          paragraph={paragraph}
          userApiToken={this.props.userApiToken}
          documentId={this.props.documentId}/>
      );
    }.bind(this));

    return <div>{paragraphNodes}</div>
  }
});
