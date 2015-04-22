var Paragraph = React.createClass({
  getInitialState: function() {
    return {
      mouseOver: false,
      formOpen: false,
      contributionBody: "",
      contributionJustification: "",
      contributions: []
    };
  },

  onMouseOver: function() {
    this.setState({mouseOver: true});
  },

  openForm: function() {
    this.setState({formOpen: true});
    return false;
  },

  paragraphHash: function() {
    return "123"
  },

  newContributionSubmit: function() {
    url = "/api/v1/contributions"

    $.ajax({
      url: url,
      headers: { 'Authorization': 'Token token="' + this.props.userApiToken + '"' },
      data: {
        contribution: {
          body: this.state.contributionBody,
          justification: this.state.contributionJustification,
          document_id: this.props.documentId,
          paragraph_hash: this.paragraphHash
        }
      },
      method: 'post',
      dataType: 'json',
      success: function(data) {
        contributions = this.state.contributions;
        contributions.unshift(data);
        this.setState({
          contributions: contributions,
          contributionBody: "",
          contributionJustification: ""
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(url, status, err.toString());
      }.bind(this)
    });

    return false;
  },

  contributionBodyChange: function(e) {
    this.setState({contributionBody: e.target.value});
  },

  contributionJustificationChange: function(e) {
    this.setState({contributionJustification: e.target.value});
  },

  render: function() {
    contributionList = this.state.contributions.map(function (contribution){
      return (
        <div className="contribution">
          <div className="userName">{contribution.user.first_name} {contribution.user.last_name}</div>
          <div className="contributionBody">{contribution.body}</div>
          <div className="contributionJustification">{contribution.justification}</div>
        </div>
      );
    });

    console.log("Render init");

    return (
      <div
        className="paragraph"
        onMouseOver={this.onMouseOver}>
        <p>{this.props.paragraphBody}</p>
        <a
          className="newContributionButton"
          href="#"
          style={{display: this.state.mouseOver ? 'block' : 'none'}}
          onClick={this.openForm}>
          Nova contribuição
        </a>
        <form
          className="newContributionForm"
          style={{display: this.state.formOpen ? 'block' : 'none'}}
          onSubmit={this.newContributionSubmit}>
          <textarea
            name="contribution[body]"
            id="contribution_body"
            value={this.state.contributionBody}
            onChange={this.contributionBodyChange}>
          </textarea>
          <textarea
            name="contribution[justification]"
            id="contribution_justification"
            value={this.state.contributionJustification}
            onChange={this.contributionJustificationChange}>
          </textarea>
          <input type="submit" value="Enviar" />
        </form>
        <div className="contributionList">
          {contributionList}
        </div>
      </div>
    );

    console.log("Render finished");
  }
});
