var Paragraph = React.createClass({
  getInitialState: function() {
    return {mouseOver: false};
  },

  onMouseOver: function() {
    this.setState({mouseOver: true})
  },

  render: function() {
    return (
      <div
        className="paragraph"
        onMouseOver={this.onMouseOver}>
        {this.props.paragraphBody}
        <a
          className="newContributionButton"
          href="#"
          style={{display: this.state.mouseOver ? 'block' : 'none'}}>
          Nova contribuição
        </a>
      </div>
    );
  }
});
