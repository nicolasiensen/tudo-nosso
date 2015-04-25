var Paragraph = React.createClass({
  getInitialState: function() {
    return {
      mouseOver: false,
      contributionBody: "",
      contributionJustification: "",
      contributions: [],
      isFormValid: true
    };
  },

  onMouseOver: function() {
    this.setState({mouseOver: true});
  },

  onMouseOut: function() {
    this.setState({mouseOver: false});
  },

  openForm: function() {
    if(!this.props.formOpen) {
      this.props.selectParagraph(this.props.paragraph.index);
    } else {
      this.props.selectParagraph(null);
    }
  },

  paragraphHash: function() {
    return "123"
  },

  validateForm: function() {
    if(this.state.contributionBody == "") {
      return false;
    } else {
      return true;
    }
  },

  newContributionSubmit: function() {
    if(this.validateForm()) {
      this.setState({isFormValid: true});

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
    } else {
      this.setState({isFormValid: false});
      React.findDOMNode(this.refs.contributionBody).focus();
    }

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

    textAreaClass = "block full-width field-light";
    if(!this.state.isFormValid){
      textAreaClass = textAreaClass + " is-error";
    }

    if(this.props.userApiToken != null) {
      contributionForm = <form
        className="newContributionForm clearfix"
        onSubmit={this.newContributionSubmit}>
        <textarea
          className={textAreaClass}
          name="contribution[body]"
          id="contribution_body"
          ref="contributionBody"
          value={this.state.contributionBody}
          onChange={this.contributionBodyChange}>
        </textarea>
        <textarea
          className="block full-width field-light"
          name="contribution[justification]"
          id="contribution_justification"
          placeholder="Justificativa (opcional)"
          value={this.state.contributionJustification}
          onChange={this.contributionJustificationChange}>
        </textarea>
        <input type="submit" value="Enviar" className="button right" />
      </form>
    } else {
      contributionForm = <a href="/users/sign_in">Sugira uma alteração para este parágrafo</a>
    }

    return (
      <div
        className="paragraph clearfix"
        style={{ marginBottom: "1em" }}
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}>
        <p
          className="paragraphBody"
          style={{
            opacity: ((this.props.selectedParagraphIndex != null && !this.props.formOpen) && !this.state.mouseOver) ? .3 : 1,
            transform: this.props.formOpen ? "scale(1.05)" : "scale(1)",
            transition: ".5s",
            margin: 0
          }}>
          {this.props.paragraph.body}
        </p>
        <a
          className="newContributionButton mb1 block"
          title="Contribuições"
          href="#"
          style={{visibility: (this.state.mouseOver || this.props.formOpen) ? 'visible' : 'hidden'}}
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
