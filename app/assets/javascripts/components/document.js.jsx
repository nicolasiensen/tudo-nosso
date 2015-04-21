var Document = React.createClass({
  getInitialState: function() {
    return {paragraphs: []};
  },

  componentDidMount: function() {
    paragraphs = [];
    this.props.body.replace(/<p>(.*?)<\/p>/g, function () {
      paragraphs.push(arguments[1]);
    });
    this.setState({paragraphs: paragraphs});
  },

  render: function() {
    paragraphNodes = this.state.paragraphs.map(function (paragraph){
      return (
        <Paragraph paragraphBody={paragraph} />
      );
    });

    return <div>{paragraphNodes}</div>
  }
});
