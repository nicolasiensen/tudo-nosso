var Paragraph = React.createClass({
  getInitialState: function() {
    return {
      mouseOver: false,
      contributionBody: "",
      contributionJustification: "",
      contributions: []
    };
  },

  onMouseOver: function() {
    this.setState({mouseOver: true});
  },

  onMouseOut: function() {
    this.setState({mouseOver: false});
  },

  openForm: function() {
    this.props.selectParagraph(this.props.paragraph.index);
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

    if(this.props.userApiToken != null) {
      contributionForm = <form
        className="newContributionForm"
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
    } else {
      contributionForm = <a href="/users/sign_in">Contribua para este parágrafo</a>
    }


    return (
      <div
        className="paragraph clearfix"
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}>
        <p>{this.props.paragraph.body}</p>
        <a
          className="newContributionButton"
          title="Contribuições"
          href="#"
          style={{display: (this.state.mouseOver || this.props.formOpen) ? 'block' : 'none'}}
          onClick={this.openForm}>
          <i className="fa fa-comment"></i>
        </a>
        <div
          className="contributionPanel"
          style={{display: this.props.formOpen ? 'block' : 'none'}}>
          {contributionForm}
          <div className="contributionList">
            {contributionList}
          </div>
        </div>
      </div>
    );
  }
});
