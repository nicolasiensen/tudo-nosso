var Paragraph = React.createClass({
  getInitialState: function() {
    return {mouseOver: false, formOpen: false};
  },

  onMouseOver: function() {
    this.setState({mouseOver: true})
  },

  openForm: function() {
    this.setState({formOpen: true})
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
          style={{display: this.state.mouseOver ? 'block' : 'none'}}
          onClick={this.openForm}>
          Nova contribuição
        </a>
        <form
          className="newContributionForm"
          style={{display: this.state.formOpen ? 'block' : 'none'}}>
          <input type="submit" value="Enviar" />
        </form>
      </div>
    );
  }
});
