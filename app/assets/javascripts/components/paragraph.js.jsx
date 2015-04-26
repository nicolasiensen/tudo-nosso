var Paragraph = React.createClass({
  getInitialState: function() {
    return {
      mouseOver: false,
      contributionBody: "",
      contributionJustification: "",
      contributions: [],
      isFormValid: true,
      isJustificationFieldVisible: false,
      focusOn: null,
      isWaitingFormResponse: false
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
      this.setState({focusOn: "contributionBody"});
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
        beforeSend: function() {
          this.setState({isWaitingFormResponse: true});
        }.bind(this),
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
        }.bind(this),
        complete: function() {
          this.setState({isWaitingFormResponse: false});
        }.bind(this)
      });
    } else {
      this.setState({
        isFormValid: false,
        focusOn: "contributionBody"
      });
    }

    return false;
  },

  contributionBodyChange: function(e) {
    this.setState({contributionBody: e.target.value});
  },

  contributionJustificationChange: function(e) {
    this.setState({contributionJustification: e.target.value});
  },

  toggleJustificationField: function(e) {
    this.setState({isJustificationFieldVisible: !this.state.isJustificationFieldVisible});
    this.setState({focusOn: "contributionJustification"});
  },

  componentDidUpdate: function() {
    if(this.props.formOpen) {
      if(this.state.focusOn == "contributionBody") {
        React.findDOMNode(this.refs.contributionBody).focus();
        this.setState({focusOn: null});
      } else if (this.state.focusOn == "contributionJustification") {
        React.findDOMNode(this.refs.contributionJustification).focus();
        this.setState({focusOn: null});
      }
    }
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

    textAreaClass = "block full-width field-light mb1";
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
          onChange={this.contributionBodyChange}
          style={{resize: "none"}}>
        </textarea>
        <a
          href="#"
          style={{display: this.state.isJustificationFieldVisible ? "none" : "inline"}}
          onClick={this.toggleJustificationField}>
          <i className="fa fa-plus-square-o mr1"></i>Adicionar justificativa
        </a>
        <textarea
          className="block full-width field-light mb1"
          name="contribution[justification]"
          id="contribution_justification"
          ref="contributionJustification"
          placeholder="Justificativa (opcional)"
          value={this.state.contributionJustification}
          onChange={this.contributionJustificationChange}
          style={{
            display: this.state.isJustificationFieldVisible ? "block" : "none",
            resize: "none"
          }}>
        </textarea>
        <button className="button right" disabled={this.state.isWaitingFormResponse}>
          <i
            className="fa fa-refresh fa-spin mr1"
            style={{
              opacity: ".5",
              display: this.state.isWaitingFormResponse ? "inline" : "none"}}/>
          Enviar
        </button>
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
            transition: ".25s",
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
